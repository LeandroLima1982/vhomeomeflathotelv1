"use client";

// Mapeamento dos links externos por categoria de quarto (baseado no idquartoCategoria, que é o apiRoomId)
// Usando a URL base para todos os quartos
const RESERVATION_LINKS: Record<number, string> = {
  1: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Queen Deluxe com 2 camas Queen Size
  2: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Queen Executivo com 2 camas Queen Size
  3: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto com cama de casal ou 2 de solteiro
  4: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Deluxe com cama de casal ou 2 de solteiro
  5: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto com cama Queen size e vista mar
  6: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto com Cama Queen size
  7: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Standard com cama Queen size
  8: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Quádruplo com varanda
  9: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto duplo deluxe c/varanda
};

// Link geral como fallback
const GENERAL_RESERVATION_LINK = 'https://vhomeflathotel.motordereservas.com.br/novareserva';

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

/**
 * Gera o link externo de reserva baseado no apiRoomId e parâmetros de busca.
 * Inclui inicio, fim, adultos e idquartoCategoria para pré-preencher o formulário externo.
 * Mapeia o apiRoomId para o idquartoCategoria correto baseado nos nomes dos quartos.
 */
export function generateReservationLink(apiRoomId: number | undefined, searchParams: SearchParams): string {
  if (!apiRoomId) return GENERAL_RESERVATION_LINK;

  // Mapeamento especial para quartos com IDs da API 12 e 13
  const apiToCategoryMapping: Record<number, number> = {
    12: 8, // Quarto Quádruplo com varanda
    13: 9, // Quarto duplo deluxe c/varanda
  };

  // Calcula o idquartoCategoria: para 12 e 13 usa o mapeamento, para outros subtrai 3
  const idquartoCategoria = apiToCategoryMapping[apiRoomId] || (apiRoomId - 3);

  const baseLink = RESERVATION_LINKS[idquartoCategoria] || GENERAL_RESERVATION_LINK;
  
  // Adiciona parâmetros apenas se o link for específico (não o geral)
  if (RESERVATION_LINKS[idquartoCategoria]) {
    const params = new URLSearchParams({
      inicio: searchParams.checkin,
      fim: searchParams.checkout,
      adultos: searchParams.adults.toString(),
      idquartoCategoria: idquartoCategoria.toString(),
    });
    return `${baseLink}?${params.toString()}`;
  }
  
  return baseLink;
}