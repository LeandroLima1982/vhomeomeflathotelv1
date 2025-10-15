"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
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
import { Loader2 } from "lucide-react";

interface AvailabilitySearchFormProps {
  onSearch: (params: { checkin: string; checkout: string; adults: number }) => void;
  isLoading: boolean;
}

export function AvailabilitySearchForm({ onSearch, isLoading }: AvailabilitySearchFormProps) {
  const [checkinDate, setCheckinDate] = useState<Date | undefined>();
  const [checkoutDate, setCheckoutDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (checkinDate && checkoutDate && checkoutDate <= checkinDate) {
      setCheckoutDate(undefined);
    }
  }, [checkinDate, checkoutDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkinDate || !checkoutDate) {
      return;
    }

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
                setDate={setCheckinDate}
                disabled={{ before: new Date() }}
                placeholder="Selecione a data"
                className="bg-white"
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
                setDate={setCheckoutDate}
                triggerDisabled={!checkinDate}
                disabled={(date) => !checkinDate || date <= checkinDate}
                placeholder="Selecione a data"
                className="bg-white"
              />
            </div>

            {/* Guests */}
            <div className="space-y-2 text-left">
              <label htmlFor="guests" className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <Users className="h-4 w-4" />
                Hóspedes
              </label>
              <Select onValueChange={(value) => setGuests(Number(value))} defaultValue="1">
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