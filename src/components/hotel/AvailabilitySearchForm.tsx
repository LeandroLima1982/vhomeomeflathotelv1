"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Users, Loader2 } from "lucide-react";
import { format, addDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AvailabilitySearchFormProps {
  onSearch: (params: { checkin: string; checkout: string; adults: number }) => void;
  isLoading: boolean;
  initialSearchParams?: { checkin: string; checkout: string; adults: number }; // Nova prop
}

export function AvailabilitySearchForm({ onSearch, isLoading, initialSearchParams }: AvailabilitySearchFormProps) {
  const [checkinDate, setCheckinDate] = useState<Date | undefined>();
  const [checkoutDate, setCheckoutDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(2);
  const [isMounted, setIsMounted] = useState(false);
  const [showDateError, setShowDateError] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (initialSearchParams) {
      // Se houver parâmetros iniciais da URL, use-os
      setCheckinDate(parseISO(initialSearchParams.checkin));
      setCheckoutDate(parseISO(initialSearchParams.checkout));
      setGuests(Number(initialSearchParams.adults));
    } else {
      // Tenta carregar os últimos valores pesquisados do localStorage
      const savedCheckin = localStorage.getItem('lastCheckinDate');
      const savedCheckout = localStorage.getItem('lastCheckoutDate');
      const savedGuests = localStorage.getItem('lastGuests');

      if (savedCheckin && savedCheckout && savedGuests) {
        setCheckinDate(parseISO(savedCheckin));
        setCheckoutDate(parseISO(savedCheckout));
        setGuests(Number(savedGuests));
      } else {
        // Define valores padrão: check-in na data atual, check-out no dia seguinte, 2 hóspedes
        const today = new Date();
        const defaultCheckin = today;
        const defaultCheckout = addDays(today, 1); // Dia seguinte
        setCheckinDate(defaultCheckin);
        setCheckoutDate(defaultCheckout);
        setGuests(2);
      }
    }
  }, [initialSearchParams]); // Adicionado initialSearchParams como dependência

  // Reseta a data de checkout se for anterior ou igual à de check-in
  useEffect(() => {
    if (checkinDate && checkoutDate && checkoutDate <= checkinDate) {
      setCheckoutDate(undefined);
    }
    // Limpa o erro de validação se as datas estiverem preenchidas
    if (checkinDate && checkoutDate) {
      setShowDateError(false);
    }
  }, [checkinDate, checkoutDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkinDate || !checkoutDate) {
      setShowDateError(true); // Ativa o erro visual
      return;
    }

    // Salva os parâmetros da busca no localStorage
    localStorage.setItem('lastCheckinDate', checkinDate.toISOString());
    localStorage.setItem('lastCheckoutDate', checkoutDate.toISOString());
    localStorage.setItem('lastGuests', String(guests));

    const checkin = format(checkinDate, "yyyyMMdd");
    const checkout = format(checkoutDate, "yyyyMMdd");
    
    onSearch({ checkin, checkout, adults: guests });
  };

  return (
    <div className="relative z-10">
      <div className="px-4">
        <div className={`max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 p-6 md:p-8 rounded-xl shadow-xl border border-gray-100 transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end">
            {/* Check-in */}
            <div className="space-y-2 text-left">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <CalendarIcon className="h-4 w-4" />
                Check-in
              </label>
              <DatePicker
                date={checkinDate}
                setDate={(date) => { setCheckinDate(date); if (date) setShowDateError(false); }}
                disabled={{ before: new Date() }}
                placeholder="Selecione a data"
                className={cn("bg-white", { "border-red-500 ring-red-500": showDateError && !checkinDate })}
              />
            </div>

            {/* Check-out */}
            <div className="space-y-2 text-left">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <CalendarIcon className="h-4 w-4" />
                Check-out
              </label>
              <DatePicker
                date={checkoutDate}
                setDate={(date) => { setCheckoutDate(date); if (date) setShowDateError(false); }}
                triggerDisabled={!checkinDate}
                disabled={(date) => !checkinDate || date <= checkinDate}
                placeholder="Selecione a data"
                className={cn("bg-white", { "border-red-500 ring-red-500": showDateError && !checkoutDate })}
              />
            </div>

            {/* Guests */}
            <div className="space-y-2 text-left">
              <label htmlFor="guests" className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <Users className="h-4 w-4" />
                Hóspedes
              </label>
              <Select onValueChange={(value) => setGuests(Number(value))} value={String(guests)}>
                <SelectTrigger id="guests" className="w-full bg-white">
                  <SelectValue placeholder="Número de hóspedes" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(8)].map((_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {i + 1} Hóspede{i > 0 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" className="w-full font-bold bg-blue-700 hover:bg-blue-800 text-white" disabled={isLoading || !checkinDate || !checkoutDate}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Buscando...' : 'Verificar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}