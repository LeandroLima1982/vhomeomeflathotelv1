import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = 'https://vhomeflathotel.facilityhotel.com.br/integracao/hotelDoForte/retornadisponibilidade';

serve(async (req) => {
  // Handle CORS preflight requests
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
      console.error('Secret API_RESERVAS_TOKEN não encontrado.');
      return new Response(JSON.stringify({ error: 'Erro de configuração do servidor: Token da API não encontrado.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
    });

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