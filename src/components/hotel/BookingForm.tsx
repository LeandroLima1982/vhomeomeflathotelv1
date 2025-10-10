"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, User, Users, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export function BookingForm() {
  const [date, setDate] = useState<Date>();
  const [dateOut, setDateOut] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const guestText = `${adults} adulto${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} criança${children > 1 ? 's' : ''}` : ''}`;

  return (
    <div className="relative z-10 -mt-12 md:-mt-20">
      <div className="container mx-auto px-4">
        <div className={`bg-white/30 backdrop-blur-lg border border-white/50 p-4 md:p-6 rounded-xl shadow-xl transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <form className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-4 md:items-end">
            <div className="space-y-2 text-left">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <CalendarIcon className="h-4 w-4" /> Check-in
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/80",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
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
            <div className="space-y-2 text-left">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <CalendarIcon className="h-4 w-4" /> Check-out
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/80",
                      !dateOut && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateOut ? format(dateOut, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateOut}
                    onSelect={setDateOut}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 text-left">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <Users className="h-4 w-4" /> Hóspedes
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/80",
                    )}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{guestText}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Adultos</p>
                        <p className="text-sm text-gray-500">A partir de 13 anos</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setAdults(prev => Math.max(1, prev - 1))} disabled={adults <= 1}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-4 text-center">{adults}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setAdults(prev => prev + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Crianças</p>
                        <p className="text-sm text-gray-500">De 2 a 12 anos</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setChildren(prev => Math.max(0, prev - 1))} disabled={children <= 0}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-4 text-center">{children}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setChildren(prev => prev + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Button className="w-full h-10 bg-blue-800 hover:bg-blue-900 text-base font-semibold">
              Verificar Disponibilidade
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}