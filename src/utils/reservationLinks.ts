"use client";

// Mapeamento dos links externos por categoria de quarto (baseado no idQuarto do Supabase)
const RESERVATION_LINKS: Record<number, string> = {
  1: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Queen Deluxe com 2 camas Queen Size
  2: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Queen Executivo com 2 camas Queen Size
  3: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto com cama de casal ou 2 de solteiro
  4: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Deluxe com cama de casal ou 2 de solteiro
  5: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto com cama Queen size e vista mar (Supabase ID 5)
  6: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto com Cama Queen size (Supabase ID 6)
  7: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Standard com cama Queen size
  8: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Quádruplo com varanda (Supabase ID 8)
  9: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto duplo deluxe c/varanda (Supabase ID 9)
  10: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto 6 (Supabase ID 10)
};

// Mapeamento de IDs do Supabase para IDs da API externa para a URL
const EXTERNAL_API_ID_FOR_URL_MAPPING: Record<number, number> = {
  5: 8,  // Quando o ID do Supabase é 5, usar 8 na URL externa
  6: 10, // Quando o ID do Supabase é 6, usar 10 na URL externa
};

// Link geral como fallback
const GENERAL_RESERVATION_LINK = 'https://vhomeflathotel.motordereservas.com.br/novareserva';

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

/**
 * Gera o link externo de reserva baseado no idQuartoCategoria (ID do Supabase) e parâmetros de busca.
 * Inclui inicio, fim, adultos e idquartoCategoria para pré-preencher o formulário externo.
 * Utiliza um mapeamento específico para ajustar o idquartoCategoria na URL para certos quartos.
 */
export function generateReservationLink(idQuartoCategoria: number | undefined, searchParams: SearchParams): string {
  if (idQuartoCategoria === undefined) {
    return GENERAL_RESERVATION_LINK; // Retorna o link geral se o ID for indefinido
  }

  const baseLink = RESERVATION_LINKS[idQuartoCategoria] || GENERAL_RESERVATION_LINK;
  
  // Aplica o mapeamento para obter o ID correto para a URL externa
  const finalIdQuartoCategoriaForUrl = EXTERNAL_API_ID_FOR_URL_MAPPING[idQuartoCategoria] || idQuartoCategoria;

  const params = new URLSearchParams({
    inicio: searchParams.checkin,
    fim: searchParams.checkout,
    adultos: searchParams.adults.toString(),
    idquartoCategoria: finalIdQuartoCategoriaForUrl.toString(),
  });
  
  return `${baseLink}?${params.toString()}`;
}