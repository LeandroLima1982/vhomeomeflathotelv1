"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, X, Star, Calendar, Users, Tag, ArrowLeft } from "lucide-react";
import { showError } from "@/utils/toast";
import DetailIcon from './DetailIcon';
import FeatureListDisplay, { FeatureCategory } from './FeatureListDisplay';
import { useLocation } from "react-router-dom";

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  custom_description: string | null;
  description: string | null;
  additional_features: FeatureCategory[] | null;
}

interface RoomDetailsModalProps {
  room: Room;
  onClose: () => void;
}

interface AvailabilityResult {
  idQuarto: number;
  apiRoomId: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  [key: string]: any;
}

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

const RoomDetailsModal = ({ room, onClose }: RoomDetailsModalProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [roomAvailabilityResult, setRoomAvailabilityResult] = useState<AvailabilityResult | null>(null);
  const [currentSearchParams, setCurrentSearchParams] = useState<SearchParams | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchImages = async () => {
      setLoadingImages(true);
      const { data: files, error } = await supabase.storage
        .from("gallery")
        .list(`rooms/${room.id}/gallery`, {
          limit: 20,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        console.error("Error fetching room images:", error);
        setLoadingImages(false);
        return;
      }

      const imageFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== '_order.json');
      const imageUrls = imageFiles.map(file => ({
        name: file.name,
        url: supabase.storage.from("gallery").getPublicUrl(`rooms/${room.id}/gallery/${file.name}`).data.publicUrl,
      }));

      const { data: orderFileData } = await supabase.storage
        .from("gallery")
        .download(`rooms/${room.id}/gallery/_order.json`);

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

    // Try to get current search params from localStorage or URL
    const savedCheckin = localStorage.getItem('lastCheckinDate');
    const savedCheckout = localStorage.getItem('lastCheckoutDate');
    const savedAdults = localStorage.getItem('lastGuests');

    if (savedCheckin && savedCheckout && savedAdults) {
      setCurrentSearchParams({
        checkin: savedCheckin.split('T')[0].replace(/-/g, ''),
        checkout: savedCheckout.split('T')[0].replace(/-/g, ''),
        adults: parseInt(savedAdults, 10),
      });
    }

    // Also check URL params for booking pages
    const urlParams = new URLSearchParams(location.search);
    const urlCheckin = urlParams.get('checkin');
    const urlCheckout = urlParams.get('checkout');
    const urlAdults = urlParams.get('adults');

    if (urlCheckin && urlCheckout && urlAdults) {
      setCurrentSearchParams({
        checkin: urlCheckin,
        checkout: urlCheckout,
        adults: parseInt(urlAdults, 10),
      });
    }
  }, [room.id, location.search]);

  const getRoomDetails = (roomData: Room) => {
    if (!roomData.details || typeof roomData.details !== 'object') return [];
  
    const detailsObject = roomData.details;
  
    const validKeys = Object.keys(detailsObject).filter(key => {
      const value = detailsObject[key];
      return value && typeof value === 'string' && value.trim() !== '' && key !== 'description';
    });
  
    if (roomData.details_order && Array.isArray(roomData.details_order)) {
      const orderedDetails = roomData.details_order
        .map(key => {
          if (validKeys.includes(key)) {
            return detailsObject[key];
          }
          return null;
        })
        .filter((value): value is string => value !== null);
      
      const unorderedKeys = validKeys.filter(key => !roomData.details_order.includes(key));
      const unorderedDetails = unorderedKeys.map(key => detailsObject[key] as string);
  
      return [...orderedDetails, ...unorderedDetails].slice(0, 9);
    }
  
    return validKeys.map(key => detailsObject[key] as string).slice(0, 9);
  };

  const roomDetails = getRoomDetails(room);

  const handleReserveClick = () => {
    if (roomAvailabilityResult && currentSearchParams) {
      // Construir a URL diretamente conforme especificado
      const baseUrl = 'https://vhomeflathotel.motordereservas.com.br/novareserva';
      const params = new URLSearchParams({
        inicio: currentSearchParams.checkin,
        fim: currentSearchParams.checkout,
        adultos: currentSearchParams.adults.toString(),
        idquartoCategoria: room.id.toString(), // Usar o ID do quarto do Supabase
      });
      const reservationUrl = `${baseUrl}?${params.toString()}`;
      window.location.href = reservationUrl; // Redireciona diretamente para a URL construída
    } else {
      showError("Informações de reserva não disponíveis. Por favor, faça uma busca primeiro.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-0 top-0 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-2xl font-bold text-gray-800 pr-8">
            {room.name}
          </DialogTitle>
          {room.special_name && (
            <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-800">
              {room.special_name}
            </Badge>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Carousel */}
          <div className="relative">
            {loadingImages ? (
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((src, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={src}
                          alt={`${room.name} - Imagem ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            ) : (
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Nenhuma imagem disponível</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Descrição</h3>
            <p className="text-gray-600 leading-relaxed">
              {room.custom_description || room.description || 'Descrição não disponível'}
            </p>
          </div>

          {/* Details */}
          {roomDetails.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Características</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {roomDetails.map((detail, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <DetailIcon detailText={detail} />
                    <span className="text-sm text-gray-600">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Features */}
          {room.additional_features && room.additional_features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Características Adicionais</h3>
              <FeatureListDisplay features={room.additional_features} />
            </div>
          )}

          <Separator />

          {/* Reserve Button */}
          <div className="flex justify-end">
            <Button onClick={handleReserveClick} className="bg-blue-700 hover:bg-blue-800">
              <Calendar className="mr-2 h-4 w-4" />
              Reservar Agora
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;