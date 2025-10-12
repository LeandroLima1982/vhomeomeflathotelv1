import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const bookingSchema = z.object({
  checkIn: z.date({
    required_error: "A data de check-in é obrigatória.",
  }),
  checkOut: z.date({
    required_error: "A data de check-out é obrigatória.",
  }),
  adults: z.number().min(1, "Pelo menos um adulto é necessário."),
  children: z.number().min(0),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingForm() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      adults: 1,
      children: 0,
    },
  });

  const checkInDate = watch("checkIn");
  const checkOutDate = watch("checkOut");

  const onSubmit = (data: BookingFormValues) => {
    console.log(data);
    // Handle booking logic here
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Reserve seu Quarto</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">Check-in</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkInDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? format(checkInDate, "PPP") : <span>Escolha uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={(date) => setValue("checkIn", date as Date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn.message}</p>}
          </div>
          <div>
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">Check-out</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkOutDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? format(checkOutDate, "PPP") : <span>Escolha uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={(date) => setValue("checkOut", date as Date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="adults" className="block text-sm font-medium text-gray-700">Adultos</label>
            <input
              type="number"
              id="adults"
              {...register("adults", { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
            {errors.adults && <p className="text-red-500 text-xs mt-1">{errors.adults.message}</p>}
          </div>
          <div>
            <label htmlFor="children" className="block text-sm font-medium text-gray-700">Crianças</label>
            <input
              type="number"
              id="children"
              {...register("children", { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
            {errors.children && <p className="text-red-500 text-xs mt-1">{errors.children.message}</p>}
          </div>
        </div>
        <div>
          <Button type="submit" className="w-full font-bold bg-orange-500 hover:bg-orange-600 text-white">
            Consultar
          </Button>
        </div>
      </form>
    </div>
  );
}