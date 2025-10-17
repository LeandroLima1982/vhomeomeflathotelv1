"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RoomBookingFormProps {
  roomId: number;
  onCancel: () => void;
  onConsult: (checkin: string, checkout: string, adults: number) => void; // Novo callback
  isLoading: boolean; // Novo estado de carregamento
  initialCheckin?: Date; // Para preencher o formulário se já houver dados
  initialCheckout?: Date; // Para preencher o formulário se já houver dados
  initialGuests?: number; // Para preencher o formulário se já houver dados
}

export function RoomBookingForm({ 
  roomId, 
  onCancel, 
  onConsult, 
  isLoading,
  initialCheckin,
  initialCheckout,
  initialGuests
}: RoomBookingFormProps) {
  const [checkinDate, setCheckinDate] = useState<Date | undefined>(initialCheckin);
  const [checkoutDate, setCheckoutDate] = useState<Date | undefined>(initialCheckout);
  const [guests, setGuests] = useState(initialGuests || 2);

  useEffect(() => {
    if (checkinDate && checkoutDate && checkoutDate <= checkinDate) {
      setCheckoutDate(undefined);
    }
  }, [checkinDate, checkoutDate]);

  const handleConsult = () => {
    if (!checkinDate || !checkoutDate) {
      // Poderíamos adicionar um toast de erro aqui, mas por enquanto, apenas retornamos.
      return;
    }

    const checkIn = format(checkinDate, "yyyyMMdd");
    const checkOut = format(checkoutDate, "yyyyMMdd");
    
    onConsult(checkIn, checkOut, guests); // Chama o callback passado pelo pai
  };

  return (
    <div className="p-6 flex flex-col justify-between h-full bg-white rounded-lg">
      <div>
        <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" onClick={onCancel} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold text-gray-800">Selecione as Datas</h3>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Check-in</Label>
            <DatePicker
              date={checkinDate}
              setDate={setCheckinDate}
              disabled={{ before: new Date() }}
              placeholder="Selecione a data"
            />
          </div>
          <div className="grid gap-2">
            <Label>Check-out</Label>
            <DatePicker
              date={checkoutDate}
              setDate={setCheckoutDate}
              triggerDisabled={!checkinDate}
              disabled={(date) => !checkinDate || date <= checkinDate}
              placeholder="Selecione a data"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="guests">Hóspedes</Label>
            <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                    id="guests"
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="pl-10"
                />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Button
          onClick={handleConsult}
          disabled={isLoading || !checkinDate || !checkoutDate}
          className="w-full bg-blue-800 hover:bg-blue-900"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Consultando...' : 'Consultar Disponibilidade'}
        </Button>
      </div>
    </div>
  );
}