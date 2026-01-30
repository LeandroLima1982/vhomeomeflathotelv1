"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, BedDouble, Users, Calendar, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbox } from "./Lightbox";
import DetailIcon from './DetailIcon';
import FeatureListDisplay from './FeatureListDisplay';
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/lib/supabaseClient";

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  custom_description: string | null;
  description: string | null;
  additional_features: any[] | null;
}

interface RoomAvailabilityResult {
  idQuarto: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  special_name?: string | null;
  apiRoomId: number;
  [key: string]: any;
}

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

interface RoomDetailsModalProps {
  room: Room;
  onClose: () => void;
  roomAvailabilityResult?: RoomAvailabilityResult;
  currentSearchParams?: SearchParams;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  room,
  onClose,
  roomAvailabilityResult,
  currentSearchParams,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [currentImage, setCurrentImage] = useState<number | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoadingImages(true);
      try {
        const { data: files, error } = await supabase.storage
          .from("gallery")
          .list(`rooms/${room.id}/gallery`, {
            limit: 100,
            offset: 0,
            sortBy: { column: "created_at", order: "desc" },
          });

        if (error) {
          console.error("Error fetching images:", error);
          setImages([]);
          setLoadingImages(false);
          return;
        }

        const imageFiles = files.filter(
          (file) => file.name !== ".emptyFolderPlaceholder" && file.name !== "_order.json"
        );

        const imageUrls = imageFiles.map((file) => ({
          name: file.name,
          url: supabase.storage
            .from("gallery")
            .getPublicUrl(`rooms/${room.id}/gallery/${file.name}`).data.publicUrl,
        }));

        const { data: orderFileData } = await supabase.storage
          .from("gallery")
          .download(`rooms/${room.id}/gallery/_order.json`);

        if (!orderFileData) {
          setImages(imageUrls.map((img) => img.url));
        } else {
          const orderJson = await orderFileData.text();
          try {
            const orderedNames = JSON.parse(orderJson) as string[];
            const imageMap = new Map(imageUrls.map((img) => [img.name, img.url]));
            const sortedUrls = orderedNames
              .map((name) => imageMap.get(name))
              .filter((url): url is string => !!url);
            const newImageUrls = imageUrls
              .filter((img) => !orderedNames.includes(img.name))
              .map((img) => img.url);
            setImages([...sortedUrls, ...newImageUrls]);
          } catch (e) {
            console.error("Error parsing order file, using default order", e);
            setImages(imageUrls.map((img) => img.url));
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImages();
  }, [room.id]);

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
        idquartoCategoria: room.id.toString(), // Usar room.id (ID do Supabase) para idquartoCategoria
      });
      const reservationUrl = `${baseUrl}?${params.toString()}`;
      window.location.href = reservationUrl; // Redireciona diretamente para a URL construída
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImage(index);
  };

  const closeLightbox = () => {
    setCurrentImage(null);
  };

  const nextImage = () => {
    if (currentImage !== null) {
      setCurrentImage((currentImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (currentImage !== null) {
      setCurrentImage((currentImage - 1 + images.length) % images.length);
    }
  };

  const formattedPrice = roomAvailabilityResult
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(roomAvailabilityResult.valorTotal)
    : null;

  const checkinDateObj = currentSearchParams ? parse(currentSearchParams.checkin, "yyyyMMdd", new Date()) : null;
  const checkoutDateObj = currentSearchParams ? parse(currentSearchParams.checkout, "yyyyMMdd", new Date()) : null;
  const numberOfNights = checkinDateObj && checkoutDateObj ? Math.ceil((checkoutDateObj.getTime() - checkinDateObj.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const getCapacityDisplay = (details: Record<string, string | null> | null) => {
    if (!details) return null;
    const capacityDetail = Object.entries(details).find(([key, value]) => 
      key.toLowerCase().includes('capacidade') || (value && value.toLowerCase().includes('hóspedes')) || (value && value.toLowerCase().includes('adultos'))
    );
    return capacityDetail ? capacityDetail[1] : null;
  };

  const capacity = getCapacityDisplay(room.details);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">{room.name}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Imagens */}
              <div>
                {loadingImages ? (
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {images.slice(0, 4).map((src, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={src}
                          alt={`${room.name} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                    {images.length > 4 && (
                      <div
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer relative"
                        onClick={() => openLightbox(4)}
                      >
                        <img
                          src={images[4]}
                          alt={`${room.name} 5`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {images.length > 5 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">+{images.length - 5}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <BedDouble className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Detalhes */}
              <div className="space-y-6">
                {room.special_name && (
                  <Badge variant="secondary" className="w-fit">
                    {room.special_name}
                  </Badge>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Descrição</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {room.custom_description || room.description || 'Descrição não disponível'}
                  </p>
                </div>

                {capacity && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-blue-700" />
                    <span>{capacity}</span>
                  </div>
                )}

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

                {room.additional_features && room.additional_features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Características Adicionais</h3>
                    <FeatureListDisplay features={room.additional_features} />
                  </div>
                )}

                {roomAvailabilityResult && currentSearchParams && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resumo da Reserva</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Check-in:
                        </span>
                        <span>{format(checkinDateObj!, "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Check-out:
                        </span>
                        <span>{format(checkoutDateObj!, "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Hóspedes:
                        </span>
                        <span>{currentSearchParams.adults}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Noites:</span>
                        <span>{numberOfNights}</span>
                      </div>
                      <div className="border-t pt-3 flex items-center justify-between font-semibold">
                        <span className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Total:
                        </span>
                        <span className="text-blue-600">{formattedPrice}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          <div className="border-t p-6 flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            {roomAvailabilityResult && currentSearchParams && (
              <Button onClick={handleReserveClick} className="bg-blue-700 hover:bg-blue-800">
                Reservar Agora
              </Button>
            )}
          </div>
        </div>
      </div>

      {currentImage !== null && (
        <Lightbox
          images={images}
          currentIndex={currentImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
};

export default RoomDetailsModal;