import React, { useState, useEffect } from 'react';
import { X, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

export const RoomDetailsModal = ({ room, onClose, isAdmin, onRoomUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setDescription(room.details.description || '');
    }
  }, [room]);

  if (!room) return null;

  const handleSaveDescription = async () => {
    setIsLoading(true);
    const newDetails = { ...room.details, description: description };
    
    const { data, error } = await supabase
      .from('rooms')
      .update({ details: newDetails })
      .eq('id', room.id)
      .select()
      .single();

    setIsLoading(false);

    if (error) {
      toast.error('Falha ao salvar a descrição.');
      console.error('Error updating room:', error);
    } else {
      toast.success('Descrição salva com sucesso!');
      onRoomUpdate(data);
      setIsEditing(false);
    }
  };

  const renderDetails = (details) => {
    if (!details) return null;
    return Object.entries(details)
      .filter(([key]) => key !== 'description' && key !== 'images')
      .map(([key, value]) => (
        <Badge key={key} variant="outline" className="text-sm">
          {`${key.replace(/_/g, ' ')}: ${value}`}
        </Badge>
      ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{room.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
            <img 
              src={room.details.images?.[0] || 'https://via.placeholder.com/400'} 
              alt={room.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex flex-col overflow-y-auto w-full md:w-1/2">
            <div className="flex-grow">
              {isAdmin && !isEditing && (
                <div className="flex justify-end mb-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </Button>
                </div>
              )}
              {isEditing ? (
                <div className="flex flex-col gap-4">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[150px]"
                    disabled={isLoading}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveDescription} disabled={isLoading}>
                      {isLoading ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">{description}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-6 mt-4">
                {renderDetails(room.details)}
              </div>
            </div>
            <div className="mt-auto pt-4 border-t">
              <a href={room.booking_url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Reservar Agora
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};