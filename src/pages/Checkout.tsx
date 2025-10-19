"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, CreditCard } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useState } from 'react';

// Assumindo que você tem acesso aos dados do quarto via props ou contexto (ex: room.details.images)
const Checkout = ({ room }) => {
  // Exemplo de dados do quarto (substitua pela lógica real)
  const roomImages = room?.details?.images || []; // Array de URLs de imagens

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo da Reserva */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Slider de Fotos do Quarto */}
            {roomImages.length > 0 && (
              <div className="mb-4">
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {roomImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <img
                          src={image}
                          alt={`Foto do quarto ${index + 1}`}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Check-in: 15 de outubro de 2023</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Check-out: 17 de outubro de 2023</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">2 Hóspedes</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{room?.name || 'Nome do Quarto'}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="text-2xl font-bold">R$ 400,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Formulário de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Campos de pagamento aqui */}
            <Button className="w-full" size="lg">
              <CreditCard className="mr-2 h-4 w-4" />
              Confirmar Reserva
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;