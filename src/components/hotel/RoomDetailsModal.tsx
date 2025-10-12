"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabaseClient";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { BedDouble, Calendar as CalendarIcon, Users } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, string | null>;
  imageUrl: string | null;
}

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
}

const BUCKET_NAME = 'gallery';
const ORDER_FILE_NAME = '_order.json';

export function RoomDetailsModal({ room, onClose }: RoomDetailsModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [checkinDate, setCheckinDate] = useState<Date | undefined>();
  const [checkoutDate, setCheckoutDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(2);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const FOLDER = 'rooms';

  useEffect(() => {
    if (room) {
      setIsLoadingImages(true);
      const fetchImages = async () => {
        const imageFolderPath = `${FOLDER}/${room.id}/gallery`;
        const { data: files, error: listError } = await supabase.storage.from(BUCKET_NAME).list(imageFolderPath);
        
        if (listError) {
          console.error("Erro ao carregar imagens da galeria.", listError);
          setImages([]);
          setIsLoadingImages(false);
          return;
        }

        const imageFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== ORDER_FILE_NAME);
        const imageUrls = imageFiles.map(file => ({
          name: file.name,
          url: supabase.storage.from(BUCKET_NAME).getPublicUrl(`${imageFolderPath}/${file.name}`).data.publicUrl,
        }));

        const { data: orderFileData } = await supabase.storage.from(BUCKET_NAME).download(`${imageFolderPath}/${ORDER_FILE_NAME}`);

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
        setIsLoadingImages(false);
      };
      fetchImages();
      // Reset form when room changes
      setCheckinDate(undefined);
      setCheckoutDate(undefined);
      setGuests(2);
    }
  }, [room]);

  useEffect(() => {
    if (checkinDate && checkoutDate && checkoutDate <= checkinDate) {
      setCheckoutDate(undefined);
    }
  }, [checkinDate, checkoutDate]);

  if (!room) return null;

  const renderDetails = (details: Record<string, string | null>) => {
    return Object.entries(details)
      .filter(([key, value]) => value && key !== 'description')
      .map(([key, value]) => (
        <Badge key={key} variant="secondary" className="font-normal">
          {value}
        </Badge>
      ));
  };

  const handleBooking = () => {
    if (!room || !checkinDate || !checkoutDate) {
      return;
    }
    const checkIn = format(checkinDate, "yyyyMMdd");
    const checkOut = format(checkoutDate, "yyyyMMdd");
    const baseUrl = "https://vhomeflathotel.motordereservas.com.br/novareserva";
    const url = `${baseUrl}?inicio=${checkIn}&fim=${checkOut}&adultos=${guests}&idquartoCategoria=${room.id}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCheckinSelect = (date: Date | undefined) => {
    setCheckinDate(date);
    setIsCheckinOpen(false);
  };

  const handleCheckoutSelect = (date: Date | undefined) => {
    setCheckoutDate(date);
    setIsCheckoutOpen(false);
  };

  return (
    <Dialog open={!!room} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-gray-800">{room.name}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 flex-grow overflow-hidden">
          <div className="p-4 flex items-center justify-center bg-gray-100 h-full">
            {isLoadingImages ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {images.length > 0 ? images.map((img, index) => (
                    <CarouselItem key={index}>
                      <img src={img} alt={`${room.name} - Imagem ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                    </CarouselItem>
                  )) : (
                    <CarouselItem>
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">
                        <BedDouble className="h-16 w-16 text-gray-400" />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
          <div className="p-6 flex flex-col overflow-y-auto">
            <div className="flex-grow">
              <p className="text-gray-600 mb-4">{room.details.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {renderDetails(room.details)}
              </div>
              
              <div className="space-y-4 border-t pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Check-in</Label>
                    <Popover open={isCheckinOpen} onOpenChange={setIsCheckinOpen}>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !checkinDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkinDate ? format(checkinDate, "dd 'de' LLL", { locale: ptBR }) : <span>Selecione</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkinDate} onSelect={handleCheckinSelect} disabled={{ before: new Date() }} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label>Check-out</Label>
                    <Popover open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !checkoutDate && "text-muted-foreground")} disabled={!checkinDate}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkoutDate ? format(checkoutDate, "dd 'de' LLL", { locale: ptBR }) : <span>Selecione</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkoutDate} onSelect={handleCheckoutSelect} disabled={(date) => !checkinDate || date <= checkinDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="guests-modal">Hóspedes</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input id="guests-modal" type="number" value={guests} onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))} min="1" className="pl-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 bg-gray-50 border-t">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          <Button 
            className="bg-blue-800 hover:bg-blue-900"
            onClick={handleBooking}
            disabled={!checkinDate || !checkoutDate}
          >
            Reservar Agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}