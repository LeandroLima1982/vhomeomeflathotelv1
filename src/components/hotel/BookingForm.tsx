"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const formSchema = z.object({
  checkin: z.date({
    required_error: "A data de check-in é obrigatória.",
  }),
  checkout: z.date({
    required_error: "A data de check-out é obrigatória.",
  }),
  adults: z.string().min(1, { message: "Pelo menos 1 adulto." }),
  children: z.string(),
});

export function BookingForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adults: "1",
      children: "0",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const checkinDate = format(values.checkin, 'yyyy-MM-dd');
    const checkoutDate = format(values.checkout, 'yyyy-MM-dd');
    const adults = values.adults;
    const children = values.children;
    const bookingUrl = `https://www.booking.com/hotel/br/flat-studio-4-pessoas-no-corac-a-o-de-joa-o-pessoa.pt-br.html?aid=304142&label=gen173nr-1FCAEoggI46AdIM1gEaMIBiAEBmAEJuAEXyAEM2AEB6AEB-AECiAIBqAIDuAK45_bLBsACAdICJGYzM2EzYjcwLTYxY2UtNDZkZS05ZGIyLTU3YjQzYjY3YjEwNNgCBe&sid=e915b5b8b2b8b2b8b2b8b2b8b2b8b2b8;dest_id=-650339;dest_type=city&;checkin=${checkinDate};checkout=${checkoutDate};group_adults=${adults};no_rooms=1;group_children=${children}`;
    window.open(bookingUrl, '_blank');
  }

  return (
    <section id="booking" className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Faça sua Reserva</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <FormField
                control={form.control}
                name="checkin"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkout"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adultos</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="children"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crianças</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button type="submit" className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white">
                  Verificar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}