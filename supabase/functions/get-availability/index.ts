import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = 'https://vhomeflathotel.facilityhotel.com.br/integracao/vhomeflathotel/retornadisponibilidade';

// Função para converter a data de yyyyMMdd para o formato { dia, mes, ano }
const parseDate = (dateString: string) => {
  return {
    ano: dateString.substring(0, 4),
    mes: dateString.substring(4, 6),
    dia: dateString.substring(6, 8),
  };
};

serve(async (req) => {
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

    // Token de autorização mantido diretamente no código para teste
    const apiToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbnRlZ3Jhw6fDo28iLCJyb2xlcyI6WyJJTlRFR1JBVElPTiJdLCJpc3MiOiJodHRwczovL3d3dy5hcGkubW90b3JkZXJlc2VydmFzLmNvbS5iciIsImNyZWF0ZSI6MTc1OTgzOTMxN30.3K_d_-hFLBPs0jrOluAN0axwC62CBoZB8XLsZSXt8DU';

    // Construindo o corpo da requisição conforme a documentação
    const requestBody = {
      inicio: parseDate(checkin),
      fim: parseDate(checkout),
      numeroAdultos: adults,
    };

    // Realizando a chamada com POST e corpo JSON
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'token': apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Erro da API externa (${response.status}):`, errorBody);
      // Tenta analisar o erro como JSON, se falhar, usa o texto bruto
      try {
        const errorJson = JSON.parse(errorBody);
        throw new Error(errorJson.mensagem || `Falha ao comunicar com o sistema de reservas.`);
      } catch {
        throw new Error(`Falha ao comunicar com o sistema de reservas. Detalhe: ${errorBody}`);
      }
    }

    const data = await response.json();

    // A API de resposta parece aninhar os resultados em 'categorias'
    const results = data.categorias.map((categoria: any) => ({
      idQuarto: categoria.id,
      nomeQuarto: categoria.nome,
      disponibilidade: categoria.disponibilidade,
      // Assumindo que queremos o valor da primeira tarifa disponível
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