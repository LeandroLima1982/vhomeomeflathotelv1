import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import RoomCard from '../components/hotel/RoomCard';
import RoomDetailsModal from '../components/hotel/RoomDetailsModal';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('rooms').select('*');
      if (error) {
        console.error('Error fetching rooms:', error);
      } else {
        setRooms(data);
      }
      setLoading(false);
    };

    fetchRooms();
  }, []);

  const handleRoomUpdate = (updatedRoom) => {
    setRooms(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room));
    setSelectedRoom(updatedRoom);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-8">
        <h1 className="text-4xl font-bold">Nossos Quartos</h1>
        <div className="flex items-center space-x-2">
          <Switch id="admin-mode" checked={isAdmin} onCheckedChange={setIsAdmin} />
          <Label htmlFor="admin-mode">Modo Admin</Label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} onSelectRoom={setSelectedRoom} />
        ))}
      </div>
      <RoomDetailsModal 
        room={selectedRoom} 
        onClose={() => setSelectedRoom(null)}
        isAdmin={isAdmin}
        onRoomUpdate={handleRoomUpdate}
      />
    </div>
  );
};

export default Index;