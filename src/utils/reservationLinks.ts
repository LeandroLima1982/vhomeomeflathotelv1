"use client";

// Mapeamento dos links externos por categoria de quarto (baseado no idquartoCategoria, que é o apiRoomId)
const RESERVATION_LINKS: Record<number, string> = {
  1: 'https://vhomeflathotel.motordereservas.com.br/novareserva?idquartoCategoria=1', // Quarto Queen Deluxe com 2 camas Queen Size
  2: 'https://vhomeflathotel.motordereservas.com.br/novareserva?idquartoCategoria=2', // Quarto Queen Executivo com 2 camas Queen Size
  3: 'https://vhomeflathotel.motordereservas.com.br/novareserva?idquartoCategoria=3', // Quarto com cama de casal ou 2 de solteiro
  4: 'https://vhomeflathotel.motordereservas.com.br/novareserva?idquartoCategoria=4', // Quarto Deluxe com cama de casal ou 2 de solteiro
  5: 'https://vhomeflathotel.motordereservas.com.br/novareserva?idquartoCategoria=5', // Quarto com cama Queen size e vista mar
  6: 'https://vhomeflathotel.motordereservas.com.br/novareserva?idquartoCategoria=6', // Quarto com Cama Queen size
  7: 'https://vhomeflathotel.motordereservas.com.br/novareserva?idquartoCategoria=7', // Quarto Standard com cama Queen size
  8: 'https://vhomeflathotel.motordereservas.com.br/novareserva?idquartoCategoria=8', // Quarto Quádruplo com varanda
  9: 'https://vhomeflathotel.motordereservas.com.br/novareserva?idquartoCategoria=9', // Quarto duplo deluxe c/varanda
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
 * Inclui inicio, fim e idquartoCategoria para pré-preencher o formulário externo.
 * Se o apiRoomId não for válido (1-9), usa o link geral sem parâmetros.
 */
export function generateReservationLink(apiRoomId: number | undefined, searchParams: SearchParams): string {
  const baseLink = RESERVATION_LINKS[apiRoomId!] || GENERAL_RESERVATION_LINK;
  
  // Adiciona parâmetros apenas se o link for específico (não o geral)
  if (RESERVATION_LINKS[apiRoomId!]) {
    const params = new URLSearchParams({
      inicio: searchParams.checkin,
      fim: searchParams.checkout,
      idquartoCategoria: apiRoomId!.toString(),
    });
    return `${baseLink}&${params.toString()}`;
  }
  
  return baseLink;
}