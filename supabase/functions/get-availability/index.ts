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

// Função auxiliar para fazer fetch com timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs: number = 30000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
};

serve(async (req) => {
  // Responde a requisições OPTIONS para o pre-flight do CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[get-availability] Function started");

    const { checkin, checkout, adults } = await req.json();
    console.log("[get-availability] Received params:", { checkin, checkout, adults });

    if (!checkin || !checkout || !adults) {
      console.log("[get-availability] Missing required parameters");
      return new Response(JSON.stringify({ error: 'Parâmetros ausentes: checkin, checkout e adults são obrigatórios.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiToken = Deno.env.get('API_RESERVAS_TOKEN');
    console.log("[get-availability] API token exists:", !!apiToken);

    if (!apiToken) {
      console.log("[get-availability] API token not configured");
      throw new Error('O segredo API_RESERVAS_TOKEN não foi configurado na Supabase.');
    }

    const requestBody = {
      inicio: parseDate(checkin),
      fim: parseDate(checkout),
      numeroAdultos: adults,
    };

    console.log("[get-availability] Request body:", requestBody);
    console.log("[get-availability] Making request to external API:", API_BASE_URL);

    // Usar fetch com timeout de 25 segundos (menor que o limite do Supabase)
    const response = await fetchWithTimeout(API_BASE_URL, {
      method: 'POST',
      headers: {
        'token': apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }, 25000);

    console.log("[get-availability] External API response status:", response.status);
    console.log("[get-availability] External API response headers:", Object.fromEntries(response.headers.entries()));

    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      const errorBody = await response.text();
      console.error("[get-availability] External API error response:", errorBody.substring(0, 500));

      const titleMatch = errorBody.match(/<title>(.*?)<\/title>/i);
      const errorHint = titleMatch ? titleMatch[1] : 'A resposta não era um JSON válido.';

      throw new Error(`O sistema de reservas retornou um erro: "${errorHint}". Verifique se o token da API está correto.`);
    }

    const data = await response.json();
    console.log("[get-availability] External API response data:", data);

    if (data.codigoRetorno && data.codigoRetorno !== 0) {
      console.log("[get-availability] External API returned error code:", data.codigoRetorno, "message:", data.mensagem);
      throw new Error(data.mensagem || "O sistema de reservas retornou um erro desconhecido.");
    }

    // Aprimorado: Percorre todas as categorias e busca a TARIFA MAIS BARATA disponível
    // Aprimorado: Busca a TARIFA MAIS BARATA com lógica resiliente (suporta números e strings)
    const results = (data.categorias || []).reduce((acc: any[], categoria: any) => {
      console.log(`[get-availability] --- Analisando Categoria: ${categoria.nome} (ID: ${categoria.id}) ---`);

      const tariffs = categoria.tarifas || [];
      const analyzedTariffs = tariffs.map((t: any) => {
        // Tenta extrair o valor da reserva de campos conhecidos
        const rawValue = t.valorTotalReserva ?? t.valorTarifa ?? t.valorVenda ?? 0;

        // Converte para número se for string (ex: "450,00" -> 450)
        let price = 0;
        if (typeof rawValue === 'number') {
          price = rawValue;
        } else if (typeof rawValue === 'string') {
          price = parseFloat(rawValue.replace(',', '.'));
        }

        console.log(`   - Tarifa: "${t.nomeTarifa}" | Valor Detectado: R$ ${price} (Bruto: ${rawValue})`);
        return { ...t, extractedPrice: price };
      }).filter((t: any) => t.extractedPrice > 0);

      if (analyzedTariffs.length > 0 && categoria.disponibilidade > 0) {
        // Seleciona a menor tarifa disponível
        const cheaper = analyzedTariffs.reduce((prev: any, curr: any) =>
          prev.extractedPrice < curr.extractedPrice ? prev : curr
        );

        console.log(`   => VENCEDORA: R$ ${cheaper.extractedPrice} (${cheaper.nomeTarifa})`);

        acc.push({
          idQuarto: categoria.id,
          nomeQuarto: categoria.nome,
          disponibilidade: categoria.disponibilidade,
          valorTotal: cheaper.extractedPrice,
          tarifaNome: cheaper.nomeTarifa
        });
      } else {
        console.log(`   x Sem disponibilidade ou tarifas válidas.`);
      }
      return acc;
    }, []);

    console.log("[get-availability] Filtered results:", results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[get-availability] Detailed error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});