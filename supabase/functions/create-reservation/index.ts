import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Headers CORS para permitir requisições do navegador
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = 'https://vhomeflathotel.facilityhotel.com.br/integracao/hotelDoForte/lancarReserva';

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
  // Remove tudo que não for dígito e aplica a máscara
  const cleanedCpf = cpf.replace(/\D/g, '');
  if (cleanedCpf.length !== 11) {
    throw new Error(`CPF inválido: ${cpf}. Deve conter 11 dígitos.`);
  }
  return cleanedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Função auxiliar para formatar telefone
const formatPhone = (phone: string) => {
  // Remove tudo que não for dígito
  const cleanedPhone = phone.replace(/\D/g, '');
  if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
    throw new Error(`Telefone inválido: ${phone}. Deve conter 10 ou 11 dígitos (DDD + número).`);
  }
  // Formato (DD) 9XXXX-XXXX ou (DD) XXXX-XXXX
  if (cleanedPhone.length === 11) {
    return `(${cleanedPhone.substring(0, 2)}) ${cleanedPhone.substring(2, 7)}-${cleanedPhone.substring(7, 11)}`;
  }
  return `(${cleanedPhone.substring(0, 2)}) ${cleanedPhone.substring(2, 6)}-${cleanedPhone.substring(6, 10)}`;
};


serve(async (req) => {
  // Responde a requisições OPTIONS para o pre-flight do CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      checkin, 
      checkout, 
      adults, 
      idQuarto, 
      valorTotal,
      nome,
      sobrenome,
      email,
      cpf,
      telefone
    } = await req.json();

    // Validação dos campos obrigatórios
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

    // Gerar um identificador único para a reserva usando a API nativa
    const identificadorReserva = crypto.randomUUID();

    // Criar array de integrantes com base no número de adultos
    const integrantes = Array.from({ length: adults }, (_, i) => ({
      nomeCompleto: `Hóspede ${i + 1}`, // Nome genérico para integrantes
      categoriaPessoa: "ADULTO",
    }));

    // Monta o corpo da requisição para a API externa, seguindo a documentação
    const requestBody = {
      identificador: identificadorReserva,
      inicio: parseDate(checkin),
      fim: parseDate(checkout),
      acomodacoes: [
        {
          idtarifa: idQuarto, // idQuarto da sua aplicação mapeia para idtarifa da API externa
          valorTotal: valorTotal,
          confirmada: "true", // Definir como "true" para confirmar a reserva
          responsavel: {
            nomeCompleto: `${nome} ${sobrenome}`, // Concatenar nome e sobrenome
            cpf: formatCpf(cpf), // Formatar CPF
            telefone: formatPhone(telefone), // Formatar telefone
            email: email,
          },
          integrantes: integrantes, // Incluir todos os hóspedes
          pagamentos: [
            {
              id: `pagamento-${identificadorReserva}`, // ID único para o pagamento
              valor: valorTotal,
              codigoFormaPagamento: 1, // ATENÇÃO: Este código deve ser confirmado com a equipe Facility Hotel para "pagamento na chegada" ou similar.
              liquidado: "false", // Definir como "false" se o pagamento não for processado imediatamente
              vencimento: parseDate(checkin), // Data de vencimento pode ser o check-in ou outra data acordada
            }
          ]
        }
      ]
    };

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'token': apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`API externa retornou uma resposta inesperada (status: ${response.status}, tipo: ${contentType}):`, errorBody.substring(0, 500));
      
      const titleMatch = errorBody.match(/<title>(.*?)<\/title>/i);
      const errorHint = titleMatch ? titleMatch[1] : 'A resposta não era um JSON válido.';

      throw new Error(`O sistema de reservas retornou um erro: "${errorHint}".`);
    }

    const data = await response.json();

    // A documentação indica que codigoRetorno 0 é sucesso.
    // Se a API retornar um código diferente de 0, consideramos um erro.
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