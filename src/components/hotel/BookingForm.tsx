"use client";

import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError } from '@/utils/toast'; // Importando showError do utilitário

interface BookingFormProps {
  roomName?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ roomName }) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState<string>('1');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date?.from || !date?.to) {
      showError('Por favor, selecione as datas de check-in e check-out.'); // Usando showError
      return;
    }

    const checkInDate = format(date.from, 'dd/MM/yyyy', { locale: ptBR });
    const checkOutDate = format(date.to, 'dd/MM/yyyy', { locale: ptBR });

    const message = `Olá! Gostaria de fazer uma reserva para ${roomName ? `o quarto ${roomName}` : 'um quarto'} de ${checkInDate} a ${checkOutDate} para ${guests} pessoa(s).`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`; // Substitua pelo seu número de WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="relative z-10 -mt-20 md:-mt-24 lg:-mt-28">
      <div className="px-4">
        <div className={`max-w-md md:max-w-3xl mx-auto bg-white border border-white/50 p-4 md:p-6 rounded-xl shadow-xl transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-4 md:items-end">
            {/* Check-in */}
            <div className="space-y-2 text-left">
              <Label htmlFor="check-in-date">Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="check-in-date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? format(date.from, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date?.from}
                    onSelect={(selectedDate) => setDate(prev => ({ ...prev, from: selectedDate }))}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out */}
            <div className="space-y-2 text-left">
              <Label htmlFor="check-out-date">Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="check-out-date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date?.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.to ? format(date.to, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date?.to}
                    onSelect={(selectedDate) => setDate(prev => ({ ...prev, to: selectedDate }))}
                    initialFocus
                    locale={ptBR}
                    fromDate={date?.from} // Ensure check-out is after check-in
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Hóspedes */}
            <div className="space-y-2 text-left">
              <Label htmlFor="guests">Hóspedes</Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger id="guests" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="1 Hóspede" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num} Hóspede{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botão de Enviar */}
            <Button type="submit" className="w-full md:col-span-1">
              Verificar Disponibilidade
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;