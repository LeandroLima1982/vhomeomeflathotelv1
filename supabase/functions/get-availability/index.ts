import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = 'https://vhomeflathotel.facilityhotel.com.br/integracao/vhomeflathotel/retornadisponibilidade';

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

    // Usando o token fornecido diretamente para teste
    const apiToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbnRlZ3Jhw6fDo28iLCJyb2xlcyI6WyJJTlRFR1JBVElPTiJdLCJpc3MiOiJodHRwczovL3d3dy5hcGkubW90b3JkZXJlc2VydmFzLmNvbS5iciIsImNyZWF0ZSI6MTc1OTgzOTMxN30.3K_d_-hFLBPs0jrOluAN0axwC62CBoZB8XLsZSXt8DU';

    const url = new URL(API_BASE_URL);
    url.searchParams.append('inicio', checkin);
    url.searchParams.append('fim', checkout);
    url.searchParams.append('adultos', String(adults));
    url.searchParams.append('idHotel', '1'); 

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
      redirect: 'manual', // Impede o Deno de seguir redirecionamentos automaticamente
    });

    // Verifica se a resposta é um redirecionamento
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location');
      const errorMessage = `O sistema de reservas está causando um loop de redirecionamento. Destino: ${location || 'desconhecido'}`;
      console.error(errorMessage);
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Erro da API externa (${response.status}):`, errorBody);
      return new Response(JSON.stringify({ error: `Falha ao comunicar com o sistema de reservas. Detalhe: ${errorBody}` }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
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