"use client";

// Mapeamento dos links externos por ID da CATEGORIA DE QUARTO DA API EXTERNA
// Estes IDs são os que a API externa espera para pré-preencher o formulário.
const RESERVATION_LINKS: Record<number, string> = {
  4: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Corresponde ao Supabase ID 1
  5: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Corresponde ao Supabase ID 2
  6: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Corresponde ao Supabase ID 3
  7: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Corresponde ao Supabase ID 4
  8: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Corresponde ao Supabase ID 5
  9: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Corresponde ao Supabase ID 6
  10: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Corresponde ao Supabase ID 7
  12: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Corresponde ao Supabase ID 8
  13: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Corresponde ao Supabase ID 9
};

// Link geral como fallback
const GENERAL_RESERVATION_LINK = 'https://vhomeflathotel.motordereservas.com.br/novareserva';

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

/**
 * Gera o link externo de reserva baseado no apiRoomId (ID da API externa) e parâmetros de busca.
 * Inclui inicio, fim, adultos e idquartoCategoria para pré-preencher o formulário externo.
 * Se o apiRoomId não for válido (um dos IDs da API externa mapeados), usa o link geral sem parâmetros.
 */
export function generateReservationLink(apiRoomId: number | undefined, searchParams: SearchParams): string {
  const baseLink = RESERVATION_LINKS[apiRoomId!] || GENERAL_RESERVATION_LINK;
  
  // Adiciona parâmetros apenas se o link for específico (não o geral)
  if (apiRoomId && RESERVATION_LINKS[apiRoomId]) {
    const params = new URLSearchParams({
      inicio: searchParams.checkin,
      fim: searchParams.checkout,
      adultos: searchParams.adults.toString(),
      idquartoCategoria: apiRoomId.toString(), // Usar o apiRoomId aqui
    });
    return `${baseLink}?${params.toString()}`;
  }
  
  return baseLink;
}