import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Headers CORS para permitir requisições do navegador
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AVAILABILITY_API_URL = 'https://vhomeflathotel.facilityhotel.com.br/integracao/hotelDoForte/retornadisponibilidade';
const RESERVATION_API_URL = 'https://vhomeflathotel.facilityhotel.com.br/integracao/hotelDoForte/lancarReserva';

// Função auxiliar para converter a string de data 'yyyyMMdd' para o formato de objeto esperado pela API
const parseDate = (dateString: string) => {
  if (!/^\d{8}$/.test(dateString)) {
    throw new Error(`Formato de data inválido: ${dateString}. Use 'yyyyMMdd'.`);
  }
  return {
    ano: dateString.substring(0, 4),
    mes: dateString.substring(4, 6),
    dia: dateString.substring(6, 8),
  };
};

// Função auxiliar para formatar CPF
const formatCpf = (cpf: string) => {
  const cleanedCpf = cpf.replace(/\D/g, '');
  if (cleanedCpf.length !== 11) {
    throw new Error(`CPF inválido: ${cpf}. Deve conter 11 dígitos.`);
  }
  return cleanedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Função auxiliar para formatar telefone
const formatPhone = (phone: string) => {
  const cleanedPhone = phone.replace(/\D/g, '');
  if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
    throw new Error(`Telefone inválido: ${phone}. Deve conter 10 ou 11 dígitos (DDD + número).`);
  }
  if (cleanedPhone.length === 11) {
    return `(${cleanedPhone.substring(0, 2)}) ${cleanedPhone.substring(2, 7)}-${cleanedPhone.substring(7, 11)}`;
  }
  return `(${cleanedPhone.substring(0, 2)}) ${cleanedPhone.substring(2, 6)}-${cleanedPhone.substring(6, 10)}`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      checkin, checkout, adults, idQuarto, valorTotal,
      nome, sobrenome, email, cpf, telefone
    } = await req.json();

    const requiredFields = { checkin, checkout, adults, idQuarto, valorTotal, nome, sobrenome, email, cpf, telefone };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        return new Response(JSON.stringify({ error: `Parâmetro ausente: '${field}' é obrigatório.` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const apiToken = Deno.env.get('API_RESERVAS_TOKEN');
    if (!apiToken) {
      throw new Error('O segredo API_RESERVAS_TOKEN não foi configurado na Supabase.');
    }

    // --- PASSO 1: RE-VERIFICAR DISPONIBILIDADE EM TEMPO REAL ---
    const availabilityRequestBody = {
      inicio: parseDate(checkin),
      fim: parseDate(checkout),
      numeroAdultos: adults,
    };

    const availabilityResponse = await fetch(AVAILABILITY_API_URL, {
      method: 'POST',
      headers: { 'token': apiToken, 'Content-Type': 'application/json' },
      body: JSON.stringify(availabilityRequestBody),
    });

    if (!availabilityResponse.ok) {
      throw new Error('Não foi possível verificar a disponibilidade antes de confirmar a reserva.');
    }

    const availabilityData = await availabilityResponse.json();
    const roomAvailability = availabilityData.categorias?.find((cat: any) => cat.id === idQuarto);

    if (!roomAvailability || roomAvailability.disponibilidade <= 0) {
      throw new Error('Desculpe, a acomodação selecionada não está mais disponível para estas datas. Por favor, tente novamente.');
    }
    
    const currentPrice = roomAvailability.tarifas?.[0]?.valorTotalReserva;
    if (currentPrice && Math.abs(currentPrice - valorTotal) > 0.01) {
        throw new Error(`O preço da acomodação mudou. O valor atual é R$ ${currentPrice.toFixed(2)}. Por favor, revise sua reserva.`);
    }

    // --- PASSO 2: CRIAR A RESERVA (SE A DISPONIBILIDADE FOR CONFIRMADA) ---
    const identificadorReserva = crypto.randomUUID();
    
    // **CORREÇÃO DEFINITIVA:** A API externa soma o 'responsavel' (1) com a lista de 'integrantes'.
    // Para a contagem ser correta, a lista de 'integrantes' deve conter apenas os acompanhantes adicionais.
    const integrantes = Array.from({ length: Math.max(0, adults - 1) }, (_, i) => ({
      nomeCompleto: `Acompanhante ${i + 1}`,
      categoriaPessoa: "ADULTO",
    }));

    const reservationRequestBody = {
      identificador: identificadorReserva,
      inicio: parseDate(checkin),
      fim: parseDate(checkout),
      acomodacoes: [
        {
          idtarifa: idQuarto,
          valorTotal: valorTotal,
          numeroAdultos: adults,
          confirmada: "true",
          responsavel: {
            nomeCompleto: `${nome} ${sobrenome}`,
            cpf: formatCpf(cpf),
            telefone: formatPhone(telefone),
            email: email,
          },
          integrantes: integrantes,
          pagamentos: [
            {
              id: `pagamento-${identificadorReserva}`,
              valor: valorTotal,
              codigoFormaPagamento: 1,
              liquidado: "false",
              vencimento: parseDate(checkin),
            }
          ]
        }
      ]
    };

    const reservationApiResponse = await fetch(RESERVATION_API_URL, {
      method: 'POST',
      headers: { 'token': apiToken, 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationRequestBody),
    });

    const contentType = reservationApiResponse.headers.get("content-type");
    if (!reservationApiResponse.ok || !contentType || !contentType.includes("application/json")) {
      const errorBody = await reservationApiResponse.text();
      const titleMatch = errorBody.match(/<title>(.*?)<\/title>/i);
      const errorHint = titleMatch ? titleMatch[1] : 'A resposta não era um JSON válido.';
      throw new Error(`O sistema de reservas retornou um erro: "${errorHint}".`);
    }

    const data = await reservationApiResponse.json();
    if (data.codigoRetorno && data.codigoRetorno !== 0) {
        throw new Error(data.mensagem || "O sistema de reservas retornou um erro desconhecido ao tentar criar a reserva.");
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Erro detalhado na Edge Function create-reservation:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});