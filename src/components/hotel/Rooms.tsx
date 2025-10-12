import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { supabase } from "@/integrations/supabase";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

const fetchRooms = async () => {
  const { data, error } = await supabase.from("rooms").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export function Rooms() {
  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
  });

  return (
    <section id="acomodacoes" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Nossas Acomodações
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-96 w-full" />
              ))
            : rooms?.map((room) => (
                <Card key={room.id} className="flex flex-col">
                  <CardHeader>
                    <img
                      src={`https://hvlycmbcvcftathcnzdr.supabase.co/storage/v1/object/public/room-images/${room.special_name}.jpg`}
                      alt={room.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardTitle className="mb-2 text-xl font-semibold text-gray-800">{room.name}</CardTitle>
                    <p className="text-gray-600">{room.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      <a href={room.booking_url} target="_blank" rel="noopener noreferrer">
                        Reservar Agora
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
        </div>
        {error && <p className="text-red-500 text-center mt-4">Não foi possível carregar as acomodações.</p>}
      </div>
    </section>
  );
}