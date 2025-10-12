import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const roomsData = [
  {
    name: "VGARDEN URBAN",
    description: "Quarto Quadruplo com Varanda",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "VURBAN",
    description: "Quarto Queen Executivo com 2 camas Queen Size",
    imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "VOCEAN",
    description: "Quarto Queen Deluxe com 2 Camas Queen Size",
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
  },
  {
    name: "VCOMFORT",
    description: "Quarto Standard com Cama Queen Size",
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "VURBAN",
    description: "Quarto com uma Cama de Casal ou 2 de Solteiro",
    imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "VURBAN",
    description: "Quarto com Cama Queen Size",
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "VOCEAN",
    description: "Quarto Deluxe com Cama de Casal ou 2 de Solteiro",
    imageUrl: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "VOCEAN",
    description: "Quarto com Cama Queen Size e Vista do Mar",
    imageUrl: "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1964&auto=format&fit=crop",
  },
  {
    name: "VGARDEN OCEAN",
    description: "Quarto Duplo Deluxe com Varanda",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
  },
];

export function Rooms() {
  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Nossos Quartos</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Escolha o quarto perfeito para a sua estadia.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roomsData.map((room, index) => (
            <Card key={index} className="flex flex-col overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0 overflow-hidden">
                <img 
                  src={room.imageUrl} 
                  alt={room.name} 
                  className="w-full h-56 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" 
                />
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardTitle className="mb-2 text-xl font-bold text-primary">{room.name}</CardTitle>
                <p className="text-muted-foreground">{room.description}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full">Reservar Agora</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}