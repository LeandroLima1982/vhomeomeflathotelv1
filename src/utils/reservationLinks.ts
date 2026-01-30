"use client";

// Mapeamento dos links externos por categoria de quarto (baseado no idQuarto do Supabase)
// Agora usando apenas a URL base, sem parâmetros
const RESERVATION_LINKS: Record<number, string> = {
  1: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  2: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  3: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  4: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  5: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  6: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  7: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  8: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  9: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
};

// Mapeamento especial para idquartoCategoria na URL (para casos específicos)
// Atualizado para mapear tanto o ID do Supabase (3) quanto o ID da API (6) para 10
const ID_MAPPING: Record<number, number> = {
  3: 10, // Para quarto 3 (Supabase ID), usar idquartoCategoria=10 na URL
  6: 10, // Para quarto 6 (Supabase ID), usar idquartoCategoria=10 na URL
};

// Link geral como fallback
const GENERAL_RESERVATION_LINK = 'https://vhomeflathotel.motordereservas.com.br/novareserva';

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

/**
 * Gera o link externo de reserva baseado no idQuartoCategoria (ID do Supabase ou API) e parâmetros de busca.
 * Inclui inicio, fim, adultos e idquartoCategoria para pré-preencher o formulário externo.
 * Se o idQuartoCategoria não for válido (1-9), usa o link geral sem parâmetros.
 */
export function generateReservationLink(idQuartoCategoria: number | undefined, searchParams: SearchParams): string {
  const baseLink = RESERVATION_LINKS[idQuartoCategoria!] || GENERAL_RESERVATION_LINK;
  let finalUrl = baseLink;
  
  // Adiciona parâmetros apenas se o link for específico (não o geral)
  if (RESERVATION_LINKS[idQuartoCategoria!]) {
    // Usa o mapeamento especial se existir, senão o ID original
    const urlId = ID_MAPPING[idQuartoCategoria!] || idQuartoCategoria!;
    const params = new URLSearchParams({
      inicio: searchParams.checkin,
      fim: searchParams.checkout,
      adultos: searchParams.adults.toString(),
      idquartoCategoria: urlId.toString(),
    });
    finalUrl = `${baseLink}?${params.toString()}`;
  }
  
  console.log("[generateReservationLink] URL externa gerada:", finalUrl); // Log para depuração
  return finalUrl;
}