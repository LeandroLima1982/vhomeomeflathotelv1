"use client";

const WHATSAPP_NUMBER = "5522998990430";

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

/**
 * Gera um link do WhatsApp com uma mensagem pré-definida.
 */
export function generateWhatsAppLink(roomName?: string, searchParams?: SearchParams): string {
  let message = "Olá! Gostaria de solicitar uma reserva no V-Home Flat Hotel.";
  
  if (roomName) {
    message += `\n\nAcomodação: ${roomName}`;
  }
  
  if (searchParams) {
    // Formata as datas de yyyyMMdd para dd/MM/yyyy para a mensagem
    const formatDate = (dateStr: string) => {
      if (dateStr.length !== 8) return dateStr;
      return `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}/${dateStr.substring(0, 4)}`;
    };

    message += `\nCheck-in: ${formatDate(searchParams.checkin)}`;
    message += `\nCheck-out: ${formatDate(searchParams.checkout)}`;
    message += `\nHóspedes: ${searchParams.adults}`;
  }
  
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Mantendo as funções antigas como fallbacks que agora apontam para o WhatsApp
export function generateReservationLink(apiRoomId: number | undefined, searchParams: SearchParams): string {
  return generateWhatsAppLink(undefined, searchParams);
}

export function buildLinkFromDbUrl(dbUrl: string, searchParams: SearchParams): string {
  return generateWhatsAppLink(undefined, searchParams);
}