"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateWhatsAppLink } from "@/utils/reservationLinks";

export function BookingForm() {
  const today = new Date();
  const defaultCheckin = today;
  const defaultCheckout = addDays(today, 1);

  const [checkinDate, setCheckinDate] = useState<Date | undefined>(defaultCheckin);
  const [checkoutDate, setCheckoutDate] = useState<Date | undefined>(defaultCheckout);
  const [guests, setGuests] = useState(2);
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
      alert("Por favor, selecione as datas de check-in e check-out.");
      return;
    }

    const checkin = format(checkinDate, "yyyyMMdd");
    const checkout = format(checkoutDate, "yyyyMMdd");
    
    const whatsappLink = generateWhatsAppLink(undefined, { checkin, checkout, adults: guests });
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="relative -mt-12 md:-mt-16 z-10">
      <div className="px-4">
        <div className={`max-w-lg md:max-w-3xl mx-auto bg-white border border-white/50 p-4 md:p-6 rounded-xl shadow-xl transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-4 md:items-end">
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
              />
            </div>

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
              />
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="guests" className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <Users className="h-4 w-4" />
                Hóspedes
              </label>
              <Select onValueChange={(value) => setGuests(Number(value))} defaultValue={String(guests)}>
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

            <div>
              <Button type="submit" className="w-full font-bold bg-blue-700 hover:bg-blue-750 text-white">
                Reservar via WhatsApp
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}