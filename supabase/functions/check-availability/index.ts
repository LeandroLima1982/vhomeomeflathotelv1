import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

// URL da API do FacilityHotel
const FACILITY_API_URL = 'https://vhomeflathotel.facilityhotel.com.br/integracao/vhomeflathotel/retornadisponibilidade';

// Token de autorização
const FACILITY_API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbnRlZ3Jhw6fDo28iLCJyb2xlcyI6WyJJTlRFR1JBVElPTiJdLCJpc3MiOiJodHRwczovL3d3dy5hcGkubW90b3JkZXJlc2VydmFzLmNvbS5iciIsImNyZWF0ZSI6MTc1OTgzOTMxN30.3K_d_-hFLBPs0jrOluAN0axwC62CBoZB8XLsZSXt8DU';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Lida com a requisição CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // O corpo da requisição vem do nosso frontend
    const body = await req.json();

    // Construímos os parâmetros para a URL da API externa
    const params = new URLSearchParams({
      diaInicio: body.inicio.dia,
      mesInicio: body.inicio.mes,
      anoInicio: body.inicio.ano,
      diaFim: body.fim.dia,
      mesFim: body.fim.mes,
      anoFim: body.fim.ano,
      numeroAdultos: body.numeroAdultos.toString(),
      numeroCriancas1: body.numeroCriancas1.toString(),
      numeroCriancas2: body.numeroCriancas2.toString(),
    });

    const urlWithParams = `${FACILITY_API_URL}?${params.toString()}`;

    // Faz a chamada para a API do FacilityHotel usando GET
    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${FACILITY_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`FacilityHotel API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Erro na API externa: ${response.statusText}`);
    }

    const data = await response.json();

    // Retorna a resposta da API para o frontend
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in Edge Function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})