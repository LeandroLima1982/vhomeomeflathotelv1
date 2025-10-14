import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Headers CORS para permitir requisições do navegador
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = 'https://vhomeflathotel.facilityhotel.com.br/integracao/hotelDoForte/gravareserva';

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
      if (value === undefined || value === null) {
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

    // Monta o corpo da requisição para a API externa
    const requestBody = {
      reserva: {
        inicio: parseDate(checkin),
        fim: parseDate(checkout),
        numeroAdultos: adults,
        idQuartoCategoria: idQuarto,
        valorTotalReserva: valorTotal,
      },
      hospede: {
        nome,
        sobrenome,
        email,
        cpf,
        telefone,
      }
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