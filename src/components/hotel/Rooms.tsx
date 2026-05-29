"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BedDouble, Star, ArrowRight } from "lucide-react";
import DetailIcon from "./DetailIcon";
import RoomDetailsModal from "./RoomDetailsModal";

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  description: string | null;
  base_price: number | null;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const { data: roomData, error } = await supabase.from("rooms").select("*").order("id");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const filtered = roomData?.filter(
      (room) => !(room.id === 3 && room.name === "Quarto Duplo 1 Cama Queen ( Standard)")
    ) || [];

    const roomsWithImages = await Promise.all(
      filtered.map(async (room) => {
        let imageUrl: string | null = null;
        try {
          const { data: files } = await supabase.storage.from("gallery").list("rooms", { search: `${room.id}.` });
          if (files && files.length > 0) {
            const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(`rooms/${files[0].name}`);
            imageUrl = `${publicUrl}?t=${Date.now()}`;
          }
        } catch {}
        return { ...room, imageUrl };
      })
    );

    setRooms(roomsWithImages);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  // Recarrega ao voltar para a aba
  useEffect(() => {
    const refetch = () => fetchRooms();
    window.addEventListener("focus", refetch);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refetch();
    });
    return () => window.removeEventListener("focus", refetch);
  }, [fetchRooms]);

  if (loading) return <div className="flex justify-center py-20">Carregando acomodações...</div>;

  return (
    <section id="acomodacoes" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Nossas Acomodações</h2>
          <p className="text-gray-600 mt-2">Conforto e sofisticação em cada detalhe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {rooms.map((room) => (
            <div 
              key={room.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col group"
            >
              {/* === IMAGEM COM EFEITOS === */}
              <div className="relative h-56 bg-gray-200 overflow-hidden">
                {room.imageUrl ? (
                  <img 
                    src={room.imageUrl} 
                    alt={room.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <BedDouble className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Estrelas no canto superior esquerdo */}
                <div className="absolute top-3 left-3 flex gap-0.5 z-10">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow" />
                  ))}
                </div>

                {/* Botão "Ver detalhes" com efeito vidro (canto inferior direito) */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/25 backdrop-blur-md border border-white/40 text-white text-xs font-medium shadow z-10">
                  Ver detalhes
                </div>

                {/* Círculo com seta no centro (aparece no hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                  <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/50 shadow">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Conteúdo do card */}
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-3">
                  {room.special_name && (
                    <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {room.special_name}
                    </span>
                  )}
                  <h3 className="font-bold text-xl text-gray-800 leading-tight">{room.name}</h3>
                </div>

                {room.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{room.description}</p>
                )}

                {/* Ícones */}
                {room.details && room.details_order && room.details_order.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-5">
                    {room.details_order.slice(0, 6).map((key) => {
                      const value = room.details?.[key];
                      if (!value) return null;
                      return <DetailIcon key={key} detailText={value} />;
                    })}
                  </div>
                )}

                {/* Preço + Botão */}
                <div className="mt-auto pt-4 border-t">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-gray-500">A PARTIR DE</span>
                      <p className="text-2xl font-bold text-gray-800">
                        R$ {room.base_price?.toFixed(2).replace(".", ",")}
                      </p>
                      <span className="text-xs text-gray-500">/ diária</span>
                    </div>

                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      Ver detalhes →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRoom && <RoomDetailsModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
    </section>
  );
};

export default Rooms;
