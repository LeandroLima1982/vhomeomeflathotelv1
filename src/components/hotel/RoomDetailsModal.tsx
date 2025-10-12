import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import FeatureListDisplay, { FeatureCategory } from './FeatureListDisplay';
import { Logo } from './Logo';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Calendar, Info } from 'lucide-react';
import { RoomBookingForm } from './RoomBookingForm';

interface Room {
  id: number;
  name: string;
  description: string | null;
  details: Record<string, string | null>;
  additional_features: FeatureCategory[] | null;
}

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, onClose }) => {
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    if (room) {
      const fetchRoomImages = async () => {
        setLoadingImages(true);
        const folderPath = `rooms/${room.id}/gallery`;
        const { data: files, error } = await supabase.storage.from('gallery').list(folderPath);

        if (error) {
          console.error("Error fetching room images:", error);
          setRoomImages([]);
        } else {
          const imageUrls = files
            .filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== '_order.json')
            .map(file => supabase.storage.from('gallery').getPublicUrl(`${folderPath}/${file.name}`).data.publicUrl);

          const { data: orderFileData } = await supabase.storage.from('gallery').download(`${folderPath}/_order.json`);
          if (orderFileData) {
            try {
              const orderJson = await orderFileData.text();
              const orderedNames = JSON.parse(orderJson) as string[];
              const imageMap = new Map(imageUrls.map(url => [url.split('/').pop(), url]));
              const sortedUrls = orderedNames.map(name => imageMap.get(name)).filter((url): url is string => !!url);
              const newImageUrls = imageUrls.filter(url => !orderedNames.includes(url.split('/').pop() || ''));
              setRoomImages([...sortedUrls, ...newImageUrls]);
            } catch (e) {
              console.error("Error parsing room gallery order file, using default order", e);
              setRoomImages(imageUrls);
            }
          } else {
            setRoomImages(imageUrls);
          }
        }
        setLoadingImages(false);
      };
      fetchRoomImages();
    }
  }, [room]);

  if (!room) return null;

  const roomAmenities = Object.entries(room.details)
    .filter(([key, value]) => value && value.trim() !== '' && key !== 'description')
    .map(([, value]) => value as string);

  return (
    <Dialog open={!!room} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[1100px] max-h-[95vh] w-full mx-2 sm:mx-4 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-md border border-slate-200/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col transition-all duration-500 ease-in-out">
        <DialogHeader className="relative bg-gradient-to-r from-slate-100 via-blue-50 to-emerald-50 px-8 sm:px-10 md:px-12 py-8 sm:py-10 md:py-12 border-b border-slate-200/30 flex-shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-gold-200/20 via-transparent to-emerald-100/20 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-slate-200/20 to-blue-100/20 rounded-full translate-y-16 -translate-x-16"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-slate-300/30 to-transparent rounded-full"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f1f5f9" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-gold-200/50 transition-transform duration-300 hover:scale-105">
              <Logo isScrolled={false} isModal={true} />
            </div>
            
            <div className="flex-1 text-center mx-8 sm:mx-10">
              <DialogTitle className="text-3xl sm:text-4xl md:text-5xl font-extralight text-slate-800 tracking-wider leading-tight drop-shadow-sm">
                {room.name}
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-base sm:text-lg md:text-xl mt-3 font-medium italic tracking-wide">
                Descubra o conforto e reserve sua experiência única
              </DialogDescription>
            </div>
            
            <div className="flex-shrink-0 w-24 sm:w-28 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-emerald-500 rounded-full shadow-lg opacity-20"></div>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10">
          <Tabs defaultValue="details" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-slate-100 to-blue-50 rounded-2xl p-2 mb-6 sm:mb-8 shadow-inner border border-slate-200/50 flex-shrink-0">
              <TabsTrigger value="details" className="rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 sm:gap-3 py-3 sm:py-4 text-sm sm:text-base md:text-lg text-slate-700 hover:bg-white hover:shadow-lg hover:scale-105">
                <Info className="h-5 w-5 sm:h-6 sm:w-6" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="book" className="rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 sm:gap-3 py-3 sm:py-4 text-sm sm:text-base md:text-lg text-slate-700 hover:bg-white hover:shadow-lg hover:scale-105">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                Reservar
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-6 sm:space-y-8 md:space-y-10 mt-0">
              <div className="md:flex md:gap-10">
                <div className="w-full md:w-1/2 md:sticky md:top-0 md:self-start">
                  {loadingImages ? (
                    <div className="flex justify-center items-center h-56 sm:h-64 md:h-72 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl shadow-lg border border-slate-200/30">
                      <Loader2 className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 animate-spin text-slate-500" />
                      <p className="ml-3 sm:ml-4 text-slate-600 font-medium text-base sm:text-lg">Carregando imagens...</p>
                    </div>
                  ) : roomImages.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      <Carousel className="w-full max-w-[300px] sm:max-w-sm md:max-w-md mx-auto md:mx-0">
                        <CarouselContent>
                          {roomImages.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="p-2 sm:p-3">
                                <div className="flex aspect-[4/3] items-center justify-center">
                                  <img
                                    src={image}
                                    alt={`Imagem do quarto ${index + 1}`}
                                    className="rounded-2xl w-full h-full object-cover shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-slate-200/50"
                                  />
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 sm:left-3 bg-white/90 hover:bg-white shadow-xl h-10 w-10 sm:h-11 sm:w-11 border border-slate-200/50" />
                        <CarouselNext className="right-2 sm:right-3 bg-white/90 hover:bg-white shadow-xl h-10 w-10 sm:h-11 sm:w-11 border border-slate-200/50" />
                      </Carousel>
                      <p className="text-center text-slate-500 text-sm sm:text-base font-medium tracking-wide">
                        {roomImages.length} imagem{roomImages.length !== 1 ? 's' : ''} disponível{roomImages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-10 sm:py-12 md:py-14 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl shadow-lg border border-slate-200/30">
                      <p className="text-slate-500 font-medium text-base sm:text-lg">Nenhuma imagem disponível para esta acomodação.</p>
                      <p className="text-sm sm:text-base text-slate-400 mt-2 tracking-wide">Imagens serão adicionadas em breve.</p>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-1/2 space-y-6 sm:space-y-7 md:space-y-8">
                  <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg border border-slate-200/30 transition-all duration-300 hover:shadow-xl">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5 text-slate-800 flex items-center justify-between tracking-wide">
                      <span>Sobre o Quarto</span>
                      {room.special_name && (
                        <Badge className="bg-gradient-to-r from-gold-400 to-emerald-500 text-white border-0 rounded-full px-4 py-2 text-sm sm:text-base font-semibold shadow-lg">
                          {room.special_name}
                        </Badge>
                      )}
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-base sm:text-lg md:text-xl tracking-wide">{room.description}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:gap-7 md:gap-8">
                    <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg border border-slate-200/30 transition-all duration-300 hover:shadow-xl">
                      <h4 className="font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-5 text-slate-800 tracking-wide">Características Principais</h4>
                      {roomAmenities.length > 0 ? (
                        <ul className="list-disc list-inside text-slate-700 space-y-2 sm:space-y-3 text-base sm:text-lg md:text-xl leading-relaxed tracking-wide">
                          {roomAmenities.map((amenity, index) => (
                            <li key={index}>{amenity}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-500 font-medium text-base sm:text-lg tracking-wide">Nenhuma característica específica listada.</p>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg border border-slate-200/30 transition-all duration-300 hover:shadow-xl">
                      <h4 className="font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-5 text-slate-800 tracking-wide">Capacidade e Preços</h4>
                      <div className="space-y-3 sm:space-y-4">
                        {room.details.capacity && (
                          <div className="flex justify-between items-center py-2 sm:py-3 border-b border-slate-200/50 last:border-b-0">
                            <span className="text-slate-600 font-medium text-base sm:text-lg tracking-wide">Capacidade:</span>
                            <span className="font-bold text-slate-800 text-base sm:text-lg tracking-wide">{room.details.capacity} pessoas</span>
                          </div>
                        )}
                        {room.details.beds && (
                          <div className="flex justify-between items-center py-2 sm:py-3 border-b border-slate-200/50 last:border-b-0">
                            <span className="text-slate-600 font-medium text-base sm:text-lg tracking-wide">Camas:</span>
                            <span className="font-bold text-slate-800 text-base sm:text-lg tracking-wide">{room.details.beds}</span>
                          </div>
                        )}
                        {room.details.price && (
                          <div className="flex justify-between items-center py-2 sm:py-3 border-b border-slate-200/50 last:border-b-0">
                            <span className="text-slate-600 font-medium text-base sm:text-lg tracking-wide">Preço por noite:</span>
                            <span className="font-bold text-emerald-600 text-lg sm:text-xl md:text-2xl tracking-wide">R$ {parseFloat(room.details.price).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {room.additional_features && room.additional_features.length > 0 && (
                    <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg border border-slate-200/30 transition-all duration-300 hover:shadow-xl">
                      <h4 className="font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-5 text-slate-800 tracking-wide">Características Adicionais</h4>
                      <FeatureListDisplay features={room.additional_features} />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="book" className="space-y-6 sm:space-y-7 md:space-y-8 mt-0">
              <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-slate-200/30 transition-all duration-300 hover:shadow-xl">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-4 sm:mb-5 tracking-wide">Reserve sua Estadia</h3>
                <p className="text-slate-600 mb-6 sm:mb-7 md:mb-8 text-base sm:text-lg md:text-xl tracking-wide">
                  Selecione as datas desejadas e confirme a disponibilidade para {room.name}.
                </p>
                <RoomBookingForm roomId={room.id} onCancel={() => {}} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;