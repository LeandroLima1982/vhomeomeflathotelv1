"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Users, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function BookingForm() {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative z-10 -mt-20">
      <div className="container mx-auto px-4">
        <div className={`bg-white/30 backdrop-blur-lg border border-white/50 p-4 md:p-6 rounded-xl shadow-xl transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:items-end">
            <div className="space-y-2 text-left">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <CalendarIcon className="h-4 w-4" /> Check-in
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-white border-gray-300 text-gray-700 placeholder:text-gray-400 hover:bg-gray-50">
                    {checkInDate ? format(checkInDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 text-left">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <CalendarIcon className="h-4 w-4" /> Check-out
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-white border-gray-300 text-gray-700 placeholder:text-gray-400 hover:bg-gray-50">
                    {checkOutDate ? format(checkOutDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 text-left">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <Users className="h-4 w-4" /> Hóspedes
              </label>
              <Select defaultValue="2">
                <SelectTrigger className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Hóspede</SelectItem>
                  <SelectItem value="2">2 Hóspedes</SelectItem>
                  <SelectItem value="3">3 Hóspedes</SelectItem>
                  <SelectItem value="4">4 Hóspedes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="lg" className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white">
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}