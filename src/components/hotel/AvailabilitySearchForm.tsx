"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [isCheckinCalendarOpen, setIsCheckinCalendarOpen] = useState(false);
  const [isCheckoutCalendarOpen, setIsCheckoutCalendarOpen] = useState(false);

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

  const handleCheckinSelect = (date: Date | undefined) => {
    setCheckinDate(date);
    setIsCheckinCalendarOpen(false);
  };

  const handleCheckoutSelect = (date: Date | undefined) => {
    setCheckoutDate(date);
    setIsCheckoutCalendarOpen(false);
  };

  return (
    <div className="relative z-10">
      <div className="px-4">
        <div className={`max-w-4xl mx-auto bg-white/30 backdrop-blur-lg border border-white/50 p-4 md:p-6 rounded-xl shadow-xl transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-4 md:items-end">
            {/* Check-in */}
            <div className="space-y-2 text-left">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <CalendarIcon className="h-4 w-4" />
                Check-in
              </label>
              <Popover open={isCheckinCalendarOpen} onOpenChange={setIsCheckinCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/80 hover:bg-white",
                      !checkinDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkinDate ? (
                      format(checkinDate, "dd 'de' LLL", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkinDate}
                    onSelect={handleCheckinSelect}
                    disabled={{ before: new Date() }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out */}
            <div className="space-y-2 text-left">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <CalendarIcon className="h-4 w-4" />
                Check-out
              </label>
              <Popover open={isCheckoutCalendarOpen} onOpenChange={setIsCheckoutCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/80 hover:bg-white",
                      !checkoutDate && "text-muted-foreground"
                    )}
                    disabled={!checkinDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkoutDate ? (
                      format(checkoutDate, "dd 'de' LLL", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkoutDate}
                    onSelect={handleCheckoutSelect}
                    disabled={(date) =>
                      !checkinDate || date <= checkinDate
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests */}
            <div className="space-y-2 text-left">
              <label htmlFor="guests" className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <Users className="h-4 w-4" />
                Hóspedes
              </label>
              <Select onValueChange={(value) => setGuests(Number(value))} defaultValue="1">
                <SelectTrigger id="guests" className="w-full bg-white/80 hover:bg-white">
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