import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

// URL da API do FacilityHotel
const FACILITY_API_URL = 'https://vhomeflathotel.facilityhotel.com.br/integracao/vhomeflathotel/retornadisponibilidade';

// Token de autorização
const FACILITY_API_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbnRlZ3Jhw6fDo28iLCJyb2xlcyI6WyJJTlRFR1JBVElPTiJdLCJpc3MiOiJodHRwczovL3d3dy5hcGkubW9otb3JkZXJlc2VydmFzLmNvbS5iciIsImNyZWF0ZSI6MTc1OTgzOTMxN30.3K_d_-hFLBPs0jrOluAN0axwC62CBoZB8XLsZSXt8DU';

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

    const response = await fetch(FACILITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FACILITY_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`FacilityHotel API Error: Status ${response.status}`, errorBody);
      // Retorna um erro estruturado para o cliente para que possamos ver a mensagem exata
      return new Response(
        JSON.stringify({ 
          error: `A API externa retornou um erro (status ${response.status}).`,
          details: errorBody 
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

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