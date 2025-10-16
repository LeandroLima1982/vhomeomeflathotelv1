"use client";

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';

interface RoomDetails {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  description: string | null;
  custom_description: string | null;
  additional_features: any;
  details_order: any;
}

interface BookingData {
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const supabase = createClient();
  const { roomId, checkInDate, checkOutDate, guests } = (location.state as BookingData) || {};

  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState<Date | undefined>(checkInDate);

  useEffect(() => {
    if (!roomId || !checkInDate || !checkOutDate || !guests) {
      toast.error("Detalhes da reserva incompletos. Por favor, volte e selecione novamente.");
      navigate('/');
      return;
    }

    const fetchRoomDetails = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (error) {
        console.error('Error fetching room details:', error);
        toast.error("Erro ao carregar detalhes do quarto.");
        navigate('/');
      } else {
        setRoom(data);
      }
    };

    fetchRoomDetails();
  }, [roomId, checkInDate, checkOutDate, guests, navigate, supabase]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!room || !date || !checkOutDate) {
      toast.error("Por favor, preencha todos os detalhes da reserva.");
      return;
    }

    // Here you would typically send the booking data to your backend
    // For this example, we'll just show a success message
    toast.success("Reserva confirmada com sucesso!");
    console.log({
      room: room.name,
      firstName,
      lastName,
      email,
      phone,
      checkIn: format(date, 'PPP'),
      checkOut: format(checkOutDate, 'PPP'),
      guests,
    });
    navigate('/confirmation'); // Redirect to a confirmation page
  };

  if (!room) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando detalhes do quarto...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto mt-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">Finalizar Reserva</h1>
          <p className="text-gray-600 text-center mb-12">
            Confira os detalhes e preencha suas informações para confirmar a estadia.
          </p>

          <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">Suas Informações</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Seu nome"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Seu sobrenome"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(XX) XXXXX-XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">Detalhes da Estadia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="roomName">Quarto</Label>
                    <Input id="roomName" type="text" value={room.name} readOnly className="bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="checkIn">Check-in</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="checkOut">Check-out</Label>
                      <Input
                        id="checkOut"
                        type="text"
                        value={checkOutDate ? format(checkOutDate, 'PPP') : ''}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="guests">Hóspedes</Label>
                    <Input id="guests" type="number" value={guests} readOnly className="bg-gray-100" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">Resumo da Reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quarto:</span>
                    <span className="font-medium text-gray-800">{room.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium text-gray-800">{date ? format(date, 'PPP') : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium text-gray-800">{checkOutDate ? format(checkOutDate, 'PPP') : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hóspedes:</span>
                    <span className="font-medium text-gray-800">{guests}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">R$ 0,00</span> {/* Placeholder for total price */}
                  </div>
                  <Button type="submit" className="w-full py-3 text-lg">Confirmar Reserva</Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}