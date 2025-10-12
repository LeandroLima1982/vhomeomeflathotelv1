import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BedDouble, Users, Wifi, Tv, ParkingSquare, UtensilsCrossed } from 'lucide-react';

const iconMap = {
  'Wi-Fi': Wifi,
  'TV': Tv,
  'Estacionamento': ParkingSquare,
  'Cozinha': UtensilsCrossed,
};

export function RoomDetailsModal({ room, onClose }) {
  if (!room) return null;

  const details = room.details || {};
  const images = details.images || [];
  const amenities = details.amenities || [];
  const price = details.price || 'N/A';
  const capacity = details.capacity || 'N/A';

  return (
    <Dialog open={!!room} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-gray-800">{room.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <div className="p-6">
            {images.length > 0 && (
              <Carousel className="w-full mb-6">
                <CarouselContent>
                  {images.map((src, index) => (
                    <CarouselItem key={index}>
                      <img src={src} alt={`${room.name} - Imagem ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}

            {room.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Descrição</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{room.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalhes</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <BedDouble className="w-5 h-5 mr-2 text-primary" />
                  <span>Preço: <span className="font-medium text-gray-800">R$ {price} / noite</span></span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  <span>Capacidade: <span className="font-medium text-gray-800">{capacity} pessoas</span></span>
                </div>
              </div>
              {amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Comodidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => {
                      const Icon = iconMap[amenity];
                      return (
                        <Badge key={amenity} variant="secondary" className="flex items-center gap-1.5">
                          {Icon && <Icon className="w-4 h-4" />}
                          {amenity}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-0">
          {room.booking_url ? (
            <Button asChild size="lg" className="w-full md:w-auto">
              <a href={room.booking_url} target="_blank" rel="noopener noreferrer">
                Reservar Agora
              </a>
            </Button>
          ) : (
            <Button size="lg" className="w-full md:w-auto" disabled>
              Reserva indisponível
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}