"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface AvailabilityResult {
  category: string;
  price: number;
  // Esta interface pode ser ajustada conforme a resposta exata da API
}

export function BookingForm() {
  const [isMounted, setIsMounted] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityResult[] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAvailability(null);

    if (!date?.from || !date?.to) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione as datas de check-in e check-out.",
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      inicio: {
        dia: format(date.from, "dd"),
        mes: format(date.from, "MM"),
        ano: format(date.from, "yyyy"),
      },
      fim: {
        dia: format(date.to, "dd"),
        mes: format(date.to, "MM"),
        ano: format(date.to, "yyyy"),
      },
      numeroAdultos: adults,
      numeroCriancas1: children,
      numeroCriancas2: 0,
    };

    try {
      const response = await fetch("https://vhomeflathotel.facilityhotel.com.br/integracao/vhomeflathotel/retornadisponibilidade", {
        method: "POST",
        headers: {
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbnRlZ3Jhw6fDo28iLCJyb2xlcyI6WyJJTlRFR1JBVElPTiJdLCJpc3MiOiJodHRwczovL3d3dy5hcGkubW90b3JkZXJlc2VydmFzLmNvbS5iciIsImNyZWF0ZSI6MTc1OTgzOTMxN30.3K_d_-hFLBPs0jrOluAN0axwC62CBoZB8XLsZSXt8DU",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("A resposta da API não foi bem-sucedida.");
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setAvailability(data);
        toast({
          title: "Disponibilidade encontrada!",
          description: "Veja as opções abaixo e prossiga com a sua reserva.",
        });
      } else {
        setAvailability([]);
        toast({
          variant: "default",
          title: "Sem disponibilidade",
          description: "Não há disponibilidade para os parâmetros informados. Tente outras datas ou acomodações.",
        });
      }
    } catch (error) {
      console.error("Falha ao buscar disponibilidade:", error);
      setAvailability([]);
      toast({
        variant: "destructive",
        title: "Erro de comunicação",
        description: "Não foi possível verificar a disponibilidade. Por favor, tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 -mt-12 md:-mt-16 lg:-mt-20 relative z-10">
      <div className="px-4">
        <div className={`max-w-4xl mx-auto bg-white/30 backdrop-blur-lg border border-white/50 p-4 md:p-6 rounded-xl shadow-xl transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <form onSubmit={handleCheckAvailability} className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-4 md:items-end">
            <div className="space-y-2 text-left md:col-span-2">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <CalendarIcon className="h-4 w-4" />
                Check-in / Check-out
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "dd/MM/yy", { locale: ptBR })} -{" "}
                          {format(date.to, "dd/MM/yy", { locale: ptBR })}
                        </>
                      ) : (
                        format(date.from, "dd/MM/yyyy", { locale: ptBR })
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
                    numberOfMonths={2}
                    locale={ptBR}
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 text-left">
              <label className="font-medium text-gray-800 flex items-center gap-2 text-sm pl-1">
                <Users className="h-4 w-4" />
                Hóspedes
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal bg-white">
                    {adults} Adulto(s), {children} Criança(s)
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Hóspedes</h4>
                      <p className="text-sm text-muted-foreground">
                        Selecione o número de hóspedes.
                      </p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Label htmlFor="adults">Adultos</Label>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setAdults(prev => Math.max(1, prev - 1))}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold w-4 text-center">{adults}</span>
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setAdults(prev => prev + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="children">Crianças</Label>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setChildren(prev => Math.max(0, prev - 1))}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold w-4 text-center">{children}</span>
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => setChildren(prev => prev + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-10 bg-vhome-blue hover:bg-vhome-blue/90 text-white font-bold text-base">
              {isLoading ? "Verificando..." : "Verificar Disponibilidade"}
            </Button>
          </form>
        </div>
      </div>
      
      {availability && availability.length > 0 && (
        <div className="px-4 mt-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Acomodações Disponíveis</h2>
            <div className="grid gap-4">
              {availability.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-900">{item.category || `Acomodação ${index + 1}`}</h3>
                    <p className="text-green-600 font-semibold">Disponível para as datas selecionadas</p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-xl font-bold text-gray-900">R$ {item.price?.toFixed(2).replace('.', ',')}</p>
                    <p className="text-sm text-muted-foreground">valor da diária</p>
                    <Button className="mt-2 w-full sm:w-auto bg-vhome-blue hover:bg-vhome-blue/90">Reservar Agora</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}