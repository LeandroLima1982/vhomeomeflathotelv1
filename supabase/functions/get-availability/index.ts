import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Headers CORS para permitir requisições do navegador
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = 'https://vhomeflathotel.facilityhotel.com.br/integracao/hotelDoForte/retornadisponibilidade';

const parseDate = (dateString: string) => {
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
    const { checkin, checkout, adults } = await req.json();

    if (!checkin || !checkout || !adults) {
      return new Response(JSON.stringify({ error: 'Parâmetros ausentes: checkin, checkout e adults são obrigatórios.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiToken = Deno.env.get('API_RESERVAS_TOKEN');
    if (!apiToken) {
      throw new Error('O segredo API_RESERVAS_TOKEN não foi configurado na Supabase.');
    }

    const requestBody = {
      inicio: parseDate(checkin),
      fim: parseDate(checkout),
      numeroAdultos: adults,
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
      const errorHint = titleMatch ? titleHint[1] : 'A resposta não era um JSON válido.';

      throw new Error(`O sistema de reservas retornou um erro: "${errorHint}". Verifique se o token da API está correto.`);
    }

    const data = await response.json();

    if (data.codigoRetorno && data.codigoRetorno !== 0) {
        throw new Error(data.mensagem || "O sistema de reservas retornou um erro desconhecido.");
    }

    const results = (data.categorias || []).map((categoria: any) => ({
      idQuarto: categoria.idQuartoCategoria, // Usando idQuartoCategoria conforme sua sugestão
      nomeQuarto: categoria.nome,
      disponibilidade: categoria.disponibilidade,
      valorTotal: categoria.tarifas?.[0]?.valorTotalReserva || 0,
    }));

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Erro detalhado na Edge Function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});