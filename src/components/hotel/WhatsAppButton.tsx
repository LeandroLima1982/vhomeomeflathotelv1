"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react'; // Alterado para MessageCircle

export function WhatsAppButton() {
  const phoneNumber = "5522998990430"; // Número do WhatsApp sem o '+'
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <Button
      asChild
      className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all duration-300 flex items-center justify-center group"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" />
      </a>
    </Button>
  );
}