import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X } from "lucide-react";

export const RoomDetailsModal = ({ room, onClose }) => {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      if (!room) return;
      setIsLoadingImages(true);
      const folderPath = `rooms/${room.id}/gallery`;
      const BUCKET_NAME = 'gallery';
      const ORDER_FILE_NAME = '_order.json';

      try {
        const { data: files, error: listError } = await supabase.storage
          .from(BUCKET_NAME)
          .list(folderPath, {
            limit: 100,
            offset: 0,
            sortBy: { column: "created_at", order: "desc" },
          });

        if (listError) throw listError;

        const imageUrls = files
          .filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== ORDER_FILE_NAME)
          .map((file) => {
            const { data: { publicUrl } } = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(`${folderPath}/${file.name}`);
            return { name: file.name, url: publicUrl };
          });

        const { data: orderFileData } = await supabase.storage.from(BUCKET_NAME).download(`${folderPath}/${ORDER_FILE_NAME}`);

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
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [room]);

  if (!room) return null;

  const handleBooking = () => {
    if (room.booking_url) {
      window.open(room.booking_url, "_blank");
    }
  };

  const renderDetailsBadges = () => {
    if (!room.details) return null;
    return Object.entries(room.details)
      .filter(([key, value]) => value && key !== 'description')
      .map(([key, value]) => (
        <Badge key={key} variant="secondary">{value}</Badge>
      ));
  };

  return (
    <Dialog open={!!room} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-gray-800">{room.name}</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto">
          <div className="grid md:grid-cols-2 h-full">
            <div className="p-6 flex items-center justify-center bg-gray-100 overflow-hidden">
              {isLoadingImages ? (
                <Skeleton className="w-full h-full" />
              ) : images.length > 0 ? (
                <Carousel className="w-full max-w-full h-full flex items-center">
                  <CarouselContent>
                    {images.map((url, index) => (
                      <CarouselItem key={index}>
                        <div className="flex items-center justify-center h-full p-1">
                          <img src={url} alt={`Imagem do quarto ${index + 1}`} className="max-w-full max-h-full object-contain rounded-lg" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-2" />
                  <CarouselNext className="absolute right-2" />
                </Carousel>
              ) : (
                <div className="text-gray-500">Nenhuma imagem disponível</div>
              )}
            </div>
            <div className="p-6 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-4">
                {renderDetailsBadges()}
              </div>

              {room.description && (
                <div className="mb-4 prose prose-sm max-w-none text-gray-600">
                  <p>{room.description}</p>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Check-in / Check-out</h3>
                <div className="flex gap-4">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    className="rounded-md border"
                    disabled={{ before: new Date() }}
                  />
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    className="rounded-md border"
                    disabled={(date) => !checkInDate || date <= checkInDate}
                  />
                </div>
              </div>
              <div className="mt-auto">
                <Button onClick={handleBooking} className="w-full" disabled={!room.booking_url}>
                  Reservar Agora
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};