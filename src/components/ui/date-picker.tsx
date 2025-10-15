"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?: React.ComponentProps<typeof Calendar>['disabled'];
  triggerDisabled?: boolean;
  placeholder?: string;
}

export function DatePicker({ date, setDate, disabled, triggerDisabled, placeholder = "Selecione a data" }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsOpen(false); // Fecha o popover ao selecionar a data
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={triggerDisabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd 'de' LLL", { locale: ptBR }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}