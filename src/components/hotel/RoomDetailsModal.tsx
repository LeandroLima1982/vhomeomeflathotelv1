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
import { supabase } from "@/integrations/supabase";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X } from "lucide-react";

export const RoomDetailsModal = ({ room, onClose }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      if (!room || !room.special_name) return;
      setIsLoadingImages(true);
      try {
        const { data, error } = await supabase.storage
          .from("hotel-images")
          .list(`${room.special_name}`, {
            limit: 10,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          });

        if (error) throw error;

        const imageUrls = data.map((file) => {
          const { data: { publicUrl } } = supabase.storage
            .from("hotel-images")
            .getPublicUrl(`${room.special_name}/${file.name}`);
          return publicUrl;
        });
        setImages(imageUrls);
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
                <Carousel className="w-full h-full flex items-center">
                  <CarouselContent className="h-auto">
                    {images.map((url, index) => (
                      <CarouselItem key={index}>
                        <div className="flex items-center justify-center h-full">
                          <img src={url} alt={`Room image ${index + 1}`} className="max-w-full max-h-full object-contain" />
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
                {room.details?.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>

              {room.description && (
                <div className="mb-4">
                  <p className="text-gray-600">{room.description}</p>
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
                  />
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <div className="mt-auto">
                <Button onClick={handleBooking} className="w-full" disabled={!room.booking_url}>
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};