"use client";

import React, { useState, useEffect } from 'react';
import { BedDouble } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
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
              const { data: files } = await supabase.storage
                .from('gallery')
                .list(`rooms/${room.id}/gallery`, { limit: 1 });

              let imageUrl = null;
              if (files && files.length > 0 && files[0].name !== '.emptyFolderPlaceholder') {
                const { data: { publicUrl } } = supabase.storage
                  .from('gallery')
                  .getPublicUrl(`rooms/${room.id}/gallery/${files[0].name}`);
                imageUrl = `${publicUrl}?t=${new Date().getTime()}`;
              }

              return { ...room, imageUrl };
            } catch (error) {
              console.error(`Error fetching image for room ${room.id}:`, error);
              return { ...room, imageUrl: null };
            }
          })
        );

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
            {rooms.map((room) => (
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
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <BedDouble className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  {room.special_name && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {room.special_name}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{room.name}</h3>
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {room.custom_description || room.description || 'Descrição não disponível'}
                  </p>
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
            ))}
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