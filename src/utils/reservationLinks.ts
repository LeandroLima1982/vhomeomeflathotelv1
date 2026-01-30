"use client";

// Mapeamento dos links externos por ID da CATEGORIA DE QUARTO DA API EXTERNA
// Estes IDs são os que a API externa espera para pré-preencher o formulário.
// Agora, este objeto pode ser simplificado ou removido se todos os links forem iguais.
// Mantido para compatibilidade, mas os IDs devem ser os api_category_id.
const RESERVATION_LINKS: Record<number, string> = {
  4: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  5: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  6: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  7: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  8: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  9: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  10: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  12: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
  13: 'https://vhomeflathotel.motordereservas.com.br/novareserva',
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
  // Se apiRoomId for undefined ou null, usa o link geral
  if (apiRoomId === undefined || apiRoomId === null) {
    return GENERAL_RESERVATION_LINK;
  }

  const baseLink = RESERVATION_LINKS[apiRoomId] || GENERAL_RESERVATION_LINK;
  
  // Adiciona parâmetros apenas se o link for específico (não o geral)
  // E se o apiRoomId for um número válido
  if (baseLink === RESERVATION_LINKS[apiRoomId]) {
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