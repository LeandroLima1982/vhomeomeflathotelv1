import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BedDouble, Users, Wifi, Tv, ParkingSquare, UtensilsCrossed } from 'lucide-react';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap = {
  'Wi-Fi': Wifi,
  'TV': Tv,
  'Estacionamento': ParkingSquare,
  'Cozinha': UtensilsCrossed,
};

const BUCKET_NAME = 'gallery';
const ORDER_FILE_NAME = '_order.json';

export function RoomDetailsModal({ room, onClose }) {
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    if (!room) {
      setImages([]);
      return;
    }

    const fetchImages = async () => {
      setLoadingImages(true);
      const FOLDER = `rooms/${room.id}/gallery`;
      const { data: files, error: listError } = await supabase.storage.from(BUCKET_NAME).list(FOLDER, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (listError) {
        console.error(`Error fetching images for room ${room.id}:`, listError);
        setImages([]);
        setLoadingImages(false);
        return;
      }

      const imageFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== ORDER_FILE_NAME);
      const imageUrls = imageFiles.map(file => ({
        name: file.name,
        url: supabase.storage.from(BUCKET_NAME).getPublicUrl(`${FOLDER}/${file.name}`).data.publicUrl,
      }));

      const { data: orderFileData } = await supabase.storage.from(BUCKET_NAME).download(`${FOLDER}/${ORDER_FILE_NAME}`);

      if (!orderFileData) {
        setImages(imageUrls.map(img => img.url));
      } else {
        const orderJson = await orderFileData.text();
        try {
          const orderedNames = JSON.parse(orderJson) as string[];
          const imageMap = new Map(imageUrls.map(img => [img.name, img.url]));
          const sortedUrls = orderedNames.map(name => imageMap.get(name)).filter((url): url is string => !!url);
          const newImageUrls = imageUrls.filter(img => !orderedNames.includes(img.name)).map(img => img.url);
          setImages([...sortedUrls, ...newImageUrls]);
        } catch (e) {
          console.error("Error parsing order file, using default order", e);
          setImages(imageUrls.map(img => img.url));
        }
      }
      setLoadingImages(false);
    };

    fetchImages();
  }, [room]);

  if (!room) return null;

  const details = room.details || {};
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
            {loadingImages ? (
              <Skeleton className="w-full h-64 rounded-lg mb-6" />
            ) : images.length > 0 && (
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