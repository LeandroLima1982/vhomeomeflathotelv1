"use client";

// Mapeamento dos links externos por categoria de quarto (baseado no idQuarto do Supabase, que é 1-9)
// Agora usando apenas a URL base, sem parâmetros
const RESERVATION_LINKS: Record<number, string> = {
  1: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Queen Deluxe com 2 camas Queen Size
  2: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Queen Executivo com 2 camas Queen Size
  3: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto com cama de casal ou 2 de solteiro
  4: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Deluxe com cama de casal ou 2 de solteiro
  5: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto com cama Queen size e vista mar
  6: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto com Cama Queen size
  7: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Standard com cama Queen size
  8: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto Quádruplo com varanda (ID Supabase 8)
  9: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Quarto duplo deluxe c/varanda (ID Supabase 9)
  10: 'https://vhomeflathotel.motordereservas.com.br/novareserva', // Novo: Quarto 6 (ID Supabase 10)
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
 */
export function generateReservationLink(idQuartoCategoria: number | undefined, searchParams: SearchParams): string {
  const baseLink = RESERVATION_LINKS[idQuartoCategoria!] || GENERAL_RESERVATION_LINK;
  
  const params = new URLSearchParams({
    inicio: searchParams.checkin,
    fim: searchParams.checkout,
    adultos: searchParams.adults.toString(),
    idquartoCategoria: idQuartoCategoria!.toString(),
  });
  
  return `${baseLink}?${params.toString()}`;
}