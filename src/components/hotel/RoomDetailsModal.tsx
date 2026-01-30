"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, BedDouble, Calendar, Users, Tag, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lightbox } from "./Lightbox";
import { supabase } from "@/lib/supabaseClient";
import { showError } from "@/utils/toast";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import DetailIcon from './DetailIcon';
import FeatureListDisplay from './FeatureListDisplay';

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

interface RoomDetailsModalProps {
  room: Room;
  onClose: () => void;
}

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, onClose }) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSearchParams, setCurrentSearchParams] = useState<SearchParams | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const { data: files, error } = await supabase.storage
          .from('gallery')
          .list(`rooms/${room.id}/gallery`, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' },
          });

        if (error) {
          console.error("Error fetching room images:", error);
          setLoading(false);
          return;
        }

        const imageFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== '_order.json');
        const imageUrls = imageFiles.map(file => ({
          name: file.name,
          url: supabase.storage.from('gallery').getPublicUrl(`rooms/${room.id}/gallery/${file.name}`).data.publicUrl,
        }));

        const { data: orderFileData } = await supabase.storage
          .from('gallery')
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
      } catch (error) {
        console.error("Error in fetchImages:", error);
      }
      setLoading(false);
    };

    fetchImages();

    // Try to get current search params from localStorage
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
  }, [room.id]);

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

  const handleReserveWithPreConsultaId = () => {
    if (currentSearchParams) {
      try {
        const baseUrl = 'https://vhomeflathotel.motordereservas.com.br/novareserva';
        const params = new URLSearchParams({
          inicio: currentSearchParams.checkin,
          fim: currentSearchParams.checkout,
          adultos: currentSearchParams.adults.toString(),
          idquartoCategoria: room.id.toString(),
        });
        const reservationLink = `${baseUrl}?${params.toString()}`;
        window.location.href = reservationLink;
      } catch (error) {
        console.error("Erro ao gerar link de reserva:", error);
        showError("Erro ao redirecionar para reserva. Tente novamente.");
      }
    } else {
      navigate('/booking-v2');
    }
  };

  const handleDirectReserve = () => {
    if (currentSearchParams) {
      try {
        const baseUrl = 'https://vhomeflathotel.motordereservas.com.br/novareserva';
        const params = new URLSearchParams({
          inicio: currentSearchParams.checkin,
          fim: currentSearchParams.checkout,
          adultos: currentSearchParams.adults.toString(),
          idquartoCategoria: room.id.toString(),
        });
        const reservationLink = `${baseUrl}?${params.toString()}`;
        window.location.href = reservationLink;
      } catch (error) {
        console.error("Erro ao gerar link de reserva direta:", error);
        showError("Erro ao redirecionar para reserva. Tente novamente.");
      }
    } else {
      navigate('/booking-v2');
    }
  };

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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">{room.name}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Gallery */}
                <div>
                  {loading ? (
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : images.length > 0 ? (
                    <div className="space-y-4">
                      <div
                        className="aspect-square bg-cover bg-center rounded-lg cursor-pointer"
                        style={{ backgroundImage: `url(${images[0]})` }}
                        onClick={() => openLightbox(0)}
                      />
                      {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                          {images.slice(1, 5).map((src, index) => (
                            <div
                              key={index}
                              className="aspect-square bg-cover bg-center rounded-lg cursor-pointer"
                              style={{ backgroundImage: `url(${src})` }}
                              onClick={() => openLightbox(index + 1)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <BedDouble className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Room Details */}
                <div className="space-y-4">
                  {room.special_name && (
                    <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {room.special_name}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Descrição</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {room.custom_description || room.description || 'Descrição não disponível'}
                    </p>
                  </div>

                  {roomDetails.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Características</h3>
                      <div className="grid grid-cols-1 gap-2">
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
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Características Adicionais</h3>
                      <FeatureListDisplay features={room.additional_features} />
                    </div>
                  )}

                  {currentSearchParams && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalhes da Consulta</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(parse(currentSearchParams.checkin, "yyyyMMdd", new Date()), "dd/MM/yyyy", { locale: ptBR })} - {format(parse(currentSearchParams.checkout, "yyyyMMdd", new Date()), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{currentSearchParams.adults} Hóspede{currentSearchParams.adults > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              <Button onClick={handleReserveWithPreConsultaId} className="bg-blue-600 hover:bg-blue-700">
                <ArrowRight className="h-4 w-4 mr-2" />
                Reservar
              </Button>
            </div>
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