"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import ImageManager from './ImageManager';

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, any>;
  description: string | null;
}

function RoomEditor({ room }: { room: Room }) {
  const [formData, setFormData] = useState(room);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      setFormData(prev => ({ ...prev, details: JSON.parse(e.target.value) }));
    } catch (error) {
      showError("O formato do JSON nos detalhes é inválido.");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = showLoading('Salvando alterações...');

    const { error } = await supabase
      .from('rooms')
      .update({
        name: formData.name,
        special_name: formData.special_name,
        booking_url: formData.booking_url,
        details: formData.details,
        description: formData.description,
      })
      .eq('id', room.id);

    dismissToast(toastId);
    setIsSaving(false);

    if (error) {
      showError(`Erro ao salvar: ${error.message}`);
    } else {
      showSuccess('Acomodação atualizada com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Acomodação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`name-${room.id}`}>Nome</Label>
            <Input id={`name-${room.id}`} name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor={`special_name-${room.id}`}>Nome Especial (Badge)</Label>
            <Input id={`special_name-${room.id}`} name="special_name" value={formData.special_name || ''} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor={`description-${room.id}`}>Descrição</Label>
            <Textarea
              id={`description-${room.id}`}
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={5}
              placeholder="Adicione uma descrição detalhada do quarto..."
            />
            <p className="text-sm text-gray-500 mt-1">Esta descrição aparecerá no modal de detalhes do quarto.</p>
          </div>
          <div>
            <Label htmlFor={`booking_url-${room.id}`}>URL de Reserva</Label>
            <Input id={`booking_url-${room.id}`} name="booking_url" value={formData.booking_url || ''} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor={`details-${room.id}`}>Detalhes (JSON)</Label>
            <Textarea
              id={`details-${room.id}`}
              name="details"
              value={JSON.stringify(formData.details, null, 2)}
              onChange={handleDetailsChange}
              rows={8}
              className="font-mono"
            />
            <p className="text-sm text-gray-500 mt-1">Edite os detalhes da acomodação em formato JSON.</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Informações
          </Button>
        </CardContent>
      </Card>
      
      <ImageManager
        folder={`rooms/${room.id}/gallery`}
        title="Galeria de Imagens da Acomodação"
        description="Envie, ordene e exclua as imagens que aparecerão no pop-up de detalhes."
      />
    </div>
  );
}

export default function RoomManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('rooms').select('*').order('id');
      if (error) {
        showError('Erro ao carregar acomodações.');
        console.error(error);
      } else {
        setRooms(data as Room[]);
      }
      setLoading(false);
    };
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="ml-4">Carregando gerenciador...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciador de Acomodações</CardTitle>
        <CardDescription>
          Clique em uma acomodação para editar suas informações e gerenciar sua galeria de imagens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {rooms.map(room => (
            <AccordionItem value={`item-${room.id}`} key={room.id}>
              <AccordionTrigger className="text-lg">{room.name}</AccordionTrigger>
              <AccordionContent>
                <RoomEditor room={room} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}