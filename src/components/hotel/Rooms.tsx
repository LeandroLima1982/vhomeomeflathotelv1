"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BedDouble, Star, MousePointerClick } from "lucide-react";
import DetailIcon from './DetailIcon';
import RoomDetailsModal from './RoomDetailsModal';

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  custom_description: string | null;
  description: string | null;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data: roomData, error } = await supabase
        .from('rooms')
        .select('*')
        .order('id');

      if (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
        return;
      }

      if (!roomData) {
        setRooms([]);
        setLoading(false);
        return;
      }

      const roomsWithImages = await Promise.all(
        roomData.map(async (room) => {
          let imageUrl: string | null = null;
          try {
            // Try to find a cover image directly in 'rooms/' folder
            const { data: coverFiles } = await supabase.storage
              .from('gallery')
              .list('rooms', { search: `${room.id}.` });

            if (coverFiles && coverFiles.length > 0) {
              const coverFile = coverFiles[0];
              const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(`rooms/${coverFile.name}`);
              imageUrl = `${publicUrl}?t=${new Date().getTime()}`;
            }

            // If no cover image, try to find the first image in the room's gallery subfolder
            if (!imageUrl) {
              const { data: galleryFiles } = await supabase.storage
                .from('gallery')
                .list(`rooms/${room.id}/gallery`, { 
                  limit: 100,
                  sortBy: { column: 'created_at', order: 'desc' }
                });

              if (galleryFiles && galleryFiles.length > 0) {
                const validFiles = galleryFiles.filter(
                  file => file.name !== '.emptyFolderPlaceholder' && file.name !== '_order.json'
                );

                if (validFiles.length > 0) {
                  let firstImageName: string | null = null;
                  const { data: orderFileData } = await supabase.storage
                    .from('gallery')
                    .getPublicUrl(`rooms/${room.id}/gallery/_order.json`);

                  if (orderFileData) {
                    try {
                      const orderJson = await orderFileData.text();
                      const orderedNames = JSON.parse(orderJson) as string[];
                      const validOrderedName = orderedNames.find(name => 
                        validFiles.some(file => file.name === name)
                      );
                      if (validOrderedName) {
                        firstImageName = validOrderedName;
                      }
                    } catch (e) {
                      console.warn(`Could not parse order file for room ${room.id}:`, e);
                    }
                  }

                  if (!firstImageName) {
                    firstImageName = validFiles[0].name;
                  }
                  
                  const { data: { publicUrl } } = supabase.storage
                    .from('gallery')
                    .getPublicUrl(`rooms/${room.id}/gallery/${firstImageName}`);
                  
                  imageUrl = `${publicUrl}?t=${new Date().getTime()}`;
                }
              }
            }
            return { ...room, imageUrl };
          } catch (error) {
            console.error(`Error fetching image for room ${room.id}:`, error);
            return { ...room, imageUrl: null };
          }
        })
      );
      // Filter out room with id 3
      const filteredRooms = roomsWithImages.filter(room => room.id !== 3);
      setRooms(filteredRooms);
      setLoading(false);
    };

    fetchRooms();
  }, []);

  const getRoomDetails = (room: Room) => {
    if (!room.details || typeof room.details !== 'object') return [];
  
    const detailsObject = room.details;
  
    const validKeys = Object.keys(detailsObject).filter(key => {
      const value = detailsObject[key];
      return value && typeof value === 'string' && value.trim() !== '' && key !== 'description';
    });
  
    if (room.details_order && Array.isArray(room.details_order)) {
      const orderedDetails = room.details_order
        .map((key: string) => {
          if (validKeys.includes(key)) {
            return detailsObject[key];
          }
          return null;
        })
        .filter((value: string | null): value is string => value !== null);
      
      const unorderedKeys = validKeys.filter(key => !room.details_order.includes(key));
      const unorderedDetails = unorderedKeys.map(key => detailsObject[key] as string);
  
      return [...orderedDetails, ...unorderedDetails];
    }
  
    return validKeys.map(key => detailsObject[key] as string);
  };

  if (loading) {
    return (
      <section id="rooms" className="pt-24 py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Acomodações</h2>
          <p className="text-gray-600 mt-2 mb-12">Carregando nossas acomodações...</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="rooms" className="pt-24 py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Acomodações</h2>
          <p className="text-gray-600 mt-2 mb-12">Conheça nossas opções de hospedagem</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => {
              const details = getRoomDetails(room);
              
              return (
                <div
                  key={room.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="h-64 relative overflow-hidden">
                    {room.imageUrl ? (
                      <img
                        src={room.imageUrl}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'w-full h-full bg-gray-200 flex items-center justify-center';
                            placeholder.innerHTML = '<svg class="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>';
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <BedDouble className="h-16 w-16 text-gray-400" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out">
                        <MousePointerClick className="h-6 w-6 text-white animate-click" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 z-10 bg-black/20 backdrop-blur-sm rounded-md px-3 py-1 border border-white/10">
                      <p className="text-white text-sm font-medium">Ver detalhes</p>
                    </div>

                    {room.special_name && (
                      <div className="absolute top-12 left-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" style={{ filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))' }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-left">
                    {room.special_name && (
                      <div className="inline-block mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 group-hover:bg-yellow-500">
                        {room.special_name}
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 text-left">{room.name}</h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-2 mb-4 text-sm text-left">
                      {room.custom_description || room.description || 'Descrição não disponível'}
                    </p>
                    
                    {details.length > 0 && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 mb-4">
                        {details.map((detail, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <DetailIcon detailText={detail === 'Tv Smart' ? 'Tv Smart com Sky' : detail} />
                            <span className="text-sm text-gray-600">{detail === 'Tv Smart' ? 'Tv Smart com Sky' : detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center justify-between border-t pt-4">
                      <span className="text-sm text-gray-500">Clique para ver detalhes</span>
                      <div className="text-blue-600 group-hover:text-blue-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {selectedRoom && (
        <RoomDetailsModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </>
  );
};

export default Rooms;