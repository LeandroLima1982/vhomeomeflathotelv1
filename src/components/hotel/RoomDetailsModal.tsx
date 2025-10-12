"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Edit, Save, X } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, string | null>;
  imageUrl: string | null;
  description?: string;
}

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
  isAdmin?: boolean;
}

const RoomDetailsModal = ({ room, onClose, isAdmin = false }: RoomDetailsModalProps) => {
  const [description, setDescription] = useState(room?.description || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    if (room) {
      setDescription(room.description || '');
      fetchGalleryImages();
    }
  }, [room]);

  const fetchGalleryImages = async () => {
    if (!room) return;

    const { data: files, error } = await supabase.storage
      .from('gallery')
      .list(`rooms/${room.id}/gallery`, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('Error fetching gallery images:', error);
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
      setGalleryImages(imageUrls.map(img => img.url));
    } else {
      const orderJson = await orderFileData.text();
      try {
        const orderedNames = JSON.parse(orderJson) as string[];
        const imageMap = new Map(imageUrls.map(img => [img.name, img.url]));
        const sortedUrls = orderedNames.map(name => imageMap.get(name)).filter((url): url is string => !!url);
        const newImageUrls = imageUrls.filter(img => !orderedNames.includes(img.name)).map(img => img.url);
        setGalleryImages([...sortedUrls, ...newImageUrls]);
      } catch (e) {
        console.error("Error parsing order file, using default order", e);
        setGalleryImages(imageUrls.map(img => img.url));
      }
    }
  };

  const handleSaveDescription = async () => {
    if (!room) return;

    setIsSaving(true);
    const toastId = showLoading('Salvando descrição...');

    const { error } = await supabase
      .from('rooms')
      .update({ description })
      .eq('id', room.id);

    dismissToast(toastId);
    setIsSaving(false);

    if (error) {
      showError(`Erro ao salvar descrição: ${error.message}`);
    } else {
      showSuccess('Descrição salva com sucesso!');
      setIsEditing(false);
    }
  };

  const renderDetails = (details: Record<string, string | null>) => {
    return Object.entries(details)
      .filter(([key, value]) => value && key !== 'description')
      .map(([key, value]) => (
        <Badge key={key} variant="secondary" className="font-normal">
          {value}
        </Badge>
      ));
  };

  if (!room) return null;

  return (
    <Dialog open={!!room} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-800">{room.name}</DialogTitle>
              {room.special_name && (
                <p className="text-sm text-blue-600 font-medium mt-1">{room.special_name}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Descrição */}
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold">Descrição</Label>
                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Digite a descrição da acomodação..."
                      rows={6}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveDescription} disabled={isSaving}>
                        {isSaving ? 'Salvando...' : <><Save className="mr-2 h-4 w-4" /> Salvar</>}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                      {description || 'Nenhuma descrição disponível.'}
                    </p>
                    {isAdmin && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Descrição
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Detalhes */}
              <div>
                <Label className="text-lg font-semibold">Características</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {renderDetails(room.details)}
                </div>
              </div>
            </div>

            {/* Galeria */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Galeria de Imagens</Label>
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {galleryImages.map((imageUrl, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={imageUrl}
                        alt={`Imagem ${index + 1} da acomodação ${room.name}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Nenhuma imagem disponível na galeria.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;