"use client";

import React, { useState, useEffect } from 'react';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { toast } from 'sonner';

interface BookingFormProps {
  roomName: string;
  bookingUrl: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ roomName, bookingUrl }) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 2),
  });
  const [guests, setGuests] = useState<number>(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to || guests < 1) {
      toast.error("Por favor, preencha todos os campos de reserva.");
      return;
    }

    const checkInDate = date.from.toLocaleDateString('pt-BR');
    const checkOutDate = date.to.toLocaleDateString('pt-BR');

    const message = `Reserva para o quarto: ${roomName}\nCheck-in: ${checkInDate}\nCheck-out: ${checkOutDate}\nHóspedes: ${guests}`;

    // In a real application, you would send this data to a backend or booking service.
    // For this example, we'll just log it and show a toast.
    console.log(message);
    toast.success("Sua solicitação de reserva foi enviada!");

    // Optionally, redirect to the booking URL
    // window.open(bookingUrl, '_blank');
  };

  return (
    <div className="px-4">
      <div className={`max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-2xl transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-4 md:items-end">
            {/* Check-in */}
            <div className="space-y-2 text-left">
              <Label htmlFor="check-in-date">Check-in & Check-out</Label>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>

            {/* Guests */}
            <div className="space-y-2 text-left">
              <Label htmlFor="guests">Hóspedes</Label>
              <Select value={String(guests)} onValueChange={(value) => setGuests(Number(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Número de hóspedes" />
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

            {/* Room Name (Display only) */}
            <div className="space-y-2 text-left md:col-span-1">
              <Label htmlFor="room-name">Quarto</Label>
              <Input id="room-name" type="text" value={roomName} readOnly className="bg-gray-100 cursor-not-allowed" />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full md:col-span-1">
              Reservar Agora
            </Button>
          </form>
        </div>
      </div>
  );
};

export default BookingForm;