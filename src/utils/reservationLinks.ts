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
 * Se o apiRoomId não for válido (1-9), usa o link geral sem parâmetros.
 */
export function generateReservationLink(apiRoomId: number | undefined, searchParams: SearchParams): string {
  const baseLink = RESERVATION_LINKS[apiRoomId!] || GENERAL_RESERVATION_LINK;
  
  // Adiciona parâmetros apenas se o link for específico (não o geral)
  if (RESERVATION_LINKS[apiRoomId!]) {
    const params = new URLSearchParams({
      inicio: searchParams.checkin,
      fim: searchParams.checkout,
      adultos: searchParams.adults.toString(),
      idquartoCategoria: apiRoomId!.toString(),
    });
    return `${baseLink}?${params.toString()}`;
  }
  
  return baseLink;
}