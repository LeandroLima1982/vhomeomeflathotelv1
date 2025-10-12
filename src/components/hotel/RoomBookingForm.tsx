"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users, ArrowLeft } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RoomBookingFormProps {
  roomId: number;
  onCancel: () => void;
}

export function RoomBookingForm({ roomId, onCancel }: RoomBookingFormProps) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);

  const handleConsult = () => {
    if (!date?.from || !date?.to) {
      return;
    }

    const checkIn = format(date.from, "yyyyMMdd");
    const checkOut = format(date.to, "yyyyMMdd");
    const baseUrl = "https://vhomeflathotel.motordereservas.com.br/novareserva";
    const url = `${baseUrl}?inicio=${checkIn}&fim=${checkOut}&adultos=${guests}&idquartoCategoria=${roomId}`;

    window.open(url, "_blank", "noopener,noreferrer");
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
            <Label>Check-in / Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Selecione as datas</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
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
          disabled={!date?.from || !date?.to}
          className="w-full bg-blue-800 hover:bg-blue-900"
        >
          Consultar Disponibilidade
        </Button>
      </div>
    </div>
  );
}