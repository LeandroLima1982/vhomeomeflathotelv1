import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

// URL da API do FacilityHotel
const FACILITY_API_URL = 'https://vhomeflathotel.facilityhotel.com.br/integracao/vhomeflathotel/retornadisponibilidade';

// Token de autorização
const FACILITY_API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIJIUzI1NiJ9.eyJzdWIiOiJpbnRlZ3Jhw6fDo28iLCJyb2xlcyI6WyJJTlRFR1JBVElPTiJdLCJpc3MiOiJodHRwczovL3d3dy5hcGkubW9otb3JkZXJlc2VydmFzLmNvbS5iciIsImNyZWF0ZSI6MTc1OTgzOTMxN30.3K_d_-hFLBPs0jrOluAN0axwC62CBoZB8XLsZSXt8DU';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload = await req.json();

    // Constrói os parâmetros da URL para a requisição GET
    const params = new URLSearchParams();
    params.append('inicio[dia]', payload.inicio.dia);
    params.append('inicio[mes]', payload.inicio.mes);
    params.append('inicio[ano]', payload.inicio.ano);
    params.append('fim[dia]', payload.fim.dia);
    params.append('fim[mes]', payload.fim.mes);
    params.append('fim[ano]', payload.fim.ano);
    params.append('numeroAdultos', payload.numeroAdultos.toString());
    params.append('numeroCriancas1', payload.numeroCriancas1.toString());
    params.append('numeroCriancas2', payload.numeroCriancas2.toString());

    const requestUrl = `${FACILITY_API_URL}?${params.toString()}`;

    const response = await fetch(requestUrl, {
      method: 'GET', // CORRIGIDO: Usando GET conforme a documentação
      headers: {
        'Authorization': `Bearer ${FACILITY_API_TOKEN}`,
      },
      // REMOVIDO: GET não tem corpo (body)
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      throw new Error(`A API externa respondeu com um formato inesperado (HTML/texto em vez de JSON). Status: ${response.status}. Início da resposta: ${responseText.substring(0, 200)}...`);
    }

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Erro da API (${response.status}): ${JSON.stringify(errorBody)}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ success: true, data: data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in Edge Function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})