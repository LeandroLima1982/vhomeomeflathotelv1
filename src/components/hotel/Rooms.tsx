"use client";

import React, { useState, useEffect } from 'react';
import { BedDouble, Star, MousePointerClick } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import RoomDetailsModal from './RoomDetailsModal';

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, string | null> | null;
  description: string | null;
  custom_description: string | null;
  additional_features: any[] | null;
  imageUrl?: string | null;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);

        if (!supabase) {
          console.error('Supabase client not available');
          setRooms([]);
          setLoading(false);
          return;
        }

        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .order('id');

        if (roomError) {
          console.error('Error fetching rooms:', roomError);
          setRooms([]);
          setLoading(false);
          return;
        }

        if (!roomData) {
          setRooms([]);
          setLoading(false);
          return;
        }

        // Fetch images for each room
        const roomsWithImages = await Promise.all(
          roomData.map(async (room) => {
            try {
              // First, try to get the cover image from rooms folder
              const { data: coverFiles } = await supabase.storage
                .from('gallery')
                .list('rooms', { search: `${room.id}.` });

              if (coverFiles && coverFiles.length > 0) {
                const coverFile = coverFiles[0];
                const { data: { publicUrl } } = supabase.storage
                  .from('gallery')
                  .getPublicUrl(`rooms/${coverFile.name}`);
                return { ...room, imageUrl: `${publicUrl}?t=${new Date().getTime()}` };
              }

              // If no cover image, try to get first image from gallery
              const { data: galleryFiles } = await supabase.storage
                .from('gallery')
                .list(`rooms/${room.id}/gallery`, { 
                  limit: 100,
                  sortBy: { column: 'created_at', order: 'desc' }
                });

              if (galleryFiles && galleryFiles.length > 0) {
                // Filter out placeholder and order files
                const validFiles = galleryFiles.filter(
                  file => file.name !== '.emptyFolderPlaceholder' && file.name !== '_order.json'
                );

                if (validFiles.length > 0) {
                  // Try to get ordered images
                  const { data: orderFileData } = await supabase.storage
                    .from('gallery')
                    .download(`rooms/${room.id}/gallery/_order.json`);

                  let firstImageName = validFiles[0].name;

                  if (orderFileData) {
                    try {
                      const orderJson = await orderFileData.text();
                      const orderedNames = JSON.parse(orderJson) as string[];
                      if (orderedNames.length > 0) {
                        firstImageName = orderedNames[0];
                      }
                    } catch (e) {
                      console.warn(`Could not parse order file for room ${room.id}`);
                    }
                  }

                  const { data: { publicUrl } } = supabase.storage
                    .from('gallery')
                    .getPublicUrl(`rooms/${room.id}/gallery/${firstImageName}`);
                  
                  return { ...room, imageUrl: `${publicUrl}?t=${new Date().getTime()}` };
                }
              }

              // No image found
              return { ...room, imageUrl: null };
            } catch (error) {
              console.error(`Error fetching image for room ${room.id}:`, error);
              return { ...room, imageUrl: null };
            }
          })
        );

        console.log('Rooms with images:', roomsWithImages);
        setRooms(roomsWithImages);
      } catch (error) {
        console.error('Error in fetchRooms:', error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getRoomDetails = (room: Room) => {
    if (!room.details || typeof room.details !== 'object') return [];
    
    return Object.entries(room.details)
      .filter(([key, value]) => 
        value && 
        typeof value === 'string' && 
        value.trim() !== '' && 
        key !== 'description'
      )
      .map(([_, value]) => value as string)
      .slice(0, 9); // Limita a 9 detalhes para não sobrecarregar o card
  };

  if (loading) {
    return (
      <section id="rooms" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nossas Acomodações</h2>
            <p className="text-gray-600 mt-2">Escolha o quarto ideal para sua estadia</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <section id="rooms" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nossas Acomodações</h2>
            <p className="text-gray-600 mt-2">Escolha o quarto ideal para sua estadia</p>
          </div>
          <div className="text-center py-12">
            <BedDouble className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma acomodação disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="rooms" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nossas Acomodações</h2>
            <p className="text-gray-600 mt-2">Escolha o quarto ideal para sua estadia</p>
          </div>
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
                          console.error(`Failed to load image for room ${room.id}:`, room.imageUrl);
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

                    {/* Overlay escuro e ícone animado que aparecem no hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out">
                        <MousePointerClick className="h-6 w-6 text-white animate-click" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 z-10 bg-black/20 backdrop-blur-sm rounded-md px-3 py-1 border border-white/10">
                      <p className="text-white text-sm font-medium">Ver Detalhes</p>
                    </div>

                    {room.special_name && (
                      <div className="absolute top-12 left-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
                        {[...Array(4)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400 fill-current"
                            style={{ filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    {room.special_name && (
                      <div className="inline-block mb-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 group-hover:bg-yellow-500">
                        {room.special_name}
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{room.name}</h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-2 mb-4 text-sm">
                      {room.custom_description || room.description || 'Descrição não disponível'}
                    </p>
                    
                    {/* Diferenciais/Detalhes do quarto */}
                    {details.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {details.map((detail, index) => (
                          <Badge 
                            key={index}
                            variant="secondary"
                            className="text-xs bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                          >
                            {detail}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center justify-between">
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
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </>
  );
}