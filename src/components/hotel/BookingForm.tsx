"use client";

import React, { useState, useEffect } from 'react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Minus, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils'; // Correção: '=>' substituído por 'from'
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

const BookingForm = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsMounted(true);
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const { data, error } = await supabase.from('rooms').select('*');
    if (error) {
      showError('Erro ao carregar quartos.');
      console.error('Error fetching rooms:', error);
    } else {
      setAvailableRooms(data);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to || !selectedRoom) {
      showError('Por favor, preencha todos os campos.');
      return;
    }
    showSuccess('Reserva simulada com sucesso!');
    console.log({ date, adults, children, rooms, selectedRoom });
  };

  return (
    <section className="relative py-12 md:py-24 bg-cover bg-center" style={{ backgroundImage: "url('/placeholder.svg')" }}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container mx-auto text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Encontre o Quarto Perfeito</h1>
        <p className="text-lg md:text-xl mb-8">Reserve sua estadia ideal conosco.</p>
      </div>
      <div className="px-4">
        <div className={`max-w-4xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-xl transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-4 md:items-end">
            {/* Check-in */}
            <div className="space-y-2 text-left">
              <Label htmlFor="check-in">Check-in & Check-out</Label>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>

            {/* Hóspedes */}
            <div className="space-y-2 text-left">
              <Label htmlFor="guests">Hóspedes</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !adults && "text-muted-foreground"
                    )}
                  >
                    {adults} Adultos, {children} Crianças, {rooms} Quartos
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <span>Adultos</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setAdults(Math.max(1, adults - 1))}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{adults}</span>
                        <Button variant="outline" size="icon" onClick={() => setAdults(adults + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Crianças</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setChildren(Math.max(0, children - 1))}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{children}</span>
                        <Button variant="outline" size="icon" onClick={() => setChildren(children + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Quartos</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setRooms(Math.max(1, rooms - 1))}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{rooms}</span>
                        <Button variant="outline" size="icon" onClick={() => setRooms(rooms + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Tipo de Quarto */}
            <div className="space-y-2 text-left">
              <Label htmlFor="room-type">Tipo de Quarto</Label>
              <Select onValueChange={setSelectedRoom} value={selectedRoom}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um quarto" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botão de Busca */}
            <Button type="submit" className="w-full md:col-span-1">
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;