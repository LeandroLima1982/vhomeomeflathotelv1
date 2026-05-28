"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BedDouble, Star, MousePointerClick } from "lucide-react";
import DetailIcon from "./DetailIcon";
import RoomDetailsModal from "./RoomDetailsModal";

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  custom_description: string | null;
  description: string | null;
  base_price: number | null;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);

    const { data: roomData, error } = await supabase
      .from("rooms")
      .select("*")
      .order("id");

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

    const filtered = roomData.filter(
      (room) => !(room.id === 3 && room.name === "Quarto Duplo 1 Cama Queen ( Standard)")
    );

    const roomsWithImages = await Promise.all(
      filtered.map(async (room) => {
        let imageUrl: string | null = null;

        try {
          // Tenta capa em /rooms
          const { data: coverFiles } = await supabase.storage
            .from("gallery")
            .list("rooms", { search: `${room.id}.` });

          if (coverFiles && coverFiles.length > 0) {
            const { data: { publicUrl } } = supabase.storage
              .from("gallery")
              .getPublicUrl(`rooms/${coverFiles[0].name}`);
            imageUrl = `${publicUrl}?t=${Date.now()}`;
          }

          // Se não tiver capa, busca na galeria do quarto
          if (!imageUrl) {
            const { data: galleryFiles } = await supabase.storage
              .from("gallery")
              .list(`rooms/${room.id}/gallery`, { limit: 100 });

            if (galleryFiles && galleryFiles.length > 0) {
              const validFiles = galleryFiles.filter(
                (f) => f.name !== ".emptyFolderPlaceholder" && f.name !== "_order.json"
              );

              if (validFiles.length > 0) {
                const first = validFiles[0];
                const { data: { publicUrl } } = supabase.storage
                  .from("gallery")
                  .getPublicUrl(`rooms/${room.id}/gallery/${first.name}`);
                imageUrl = `${publicUrl}?t=${Date.now()}`;
              }
            }
          }
        } catch (e) {
          imageUrl = null;
        }

        return { ...room, imageUrl };
      })
    );

    setRooms(roomsWithImages);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Recarrega imagens ao voltar para a aba (evita sumiço)
  useEffect(() => {
    const refetch = () => fetchRooms();
    window.addEventListener("focus", refetch);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refetch();
    });
    return () => window.removeEventListener("focus", refetch);
  }, [fetchRooms]);

  if (loading) {
    return <div className="flex justify-center py-20">Carregando acomodações...</div>;
  }

  return (
    <section id="acomodacoes" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Nossas Acomodações</h2>
          <p className="text-gray-600 mt-2">Conforto e sofisticação em cada detalhe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
              <div className="relative h-56 bg-gray-200">
                {room.imageUrl ? (
                  <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <BedDouble className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{room.name}</h3>
                    {room.special_name && <p className="text-sm text-blue-600">{room.special_name}</p>}
                  </div>
                  {room.base_price && (
                    <div className="text-right">
                      <span className="text-xs text-gray-500">a partir de</span>
                      <p className="font-bold text-lg text-gray-800">R$ {room.base_price}</p>
                    </div>
                  )}
                </div>

                {room.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
                )}

                {/* Ícones de comodidades */}
                {room.details && room.details_order && room.details_order.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {room.details_order.slice(0, 4).map((key) => (
                      <DetailIcon key={key} label={key} value={room.details?.[key]} />
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setSelectedRoom(room)}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  Ver detalhes <MousePointerClick className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <RoomDetailsModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </section>
  );
};

export default Rooms;
