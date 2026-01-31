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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[test-api-connection] Testing API connection");

    const apiToken = Deno.env.get('API_RESERVAS_TOKEN');
    console.log("[test-api-connection] API token exists:", !!apiToken);

    if (!apiToken) {
      return new Response(JSON.stringify({
        success: false,
        error: 'API_RESERVAS_TOKEN não está configurado'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Test with a simple request
    const testBody = {
      inicio: parseDate('20250101'), // Tomorrow
      fim: parseDate('20250102'),    // Day after
      numeroAdultos: 2,
    };

    console.log("[test-api-connection] Test request body:", testBody);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for test

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'token': apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("[test-api-connection] Response status:", response.status);
    console.log("[test-api-connection] Response headers:", Object.fromEntries(response.headers.entries()));

    const contentType = response.headers.get("content-type");
    console.log("[test-api-connection] Content-Type:", contentType);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("[test-api-connection] Error response:", errorText);

      return new Response(JSON.stringify({
        success: false,
        error: `API retornou status ${response.status}`,
        details: errorText.substring(0, 200)
      }), {
        status: 200, // Return 200 so we can see the error details
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.log("[test-api-connection] Non-JSON response:", textResponse.substring(0, 200));

      return new Response(JSON.stringify({
        success: false,
        error: 'API não retornou JSON válido',
        details: textResponse.substring(0, 200)
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log("[test-api-connection] Success! API response:", data);

    return new Response(JSON.stringify({
      success: true,
      message: 'Conexão com API estabelecida com sucesso',
      data: data
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[test-api-connection] Error:', error.message);

    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 200, // Return 200 so we can see the error details
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});