"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, Plus, X } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import ImageManager from './ImageManager';

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, string | null>;
  description: string | null;
}

function RoomEditor({ room, onSave }: { room: Room; onSave: () => void }) {
  const [formData, setFormData] = useState(room);
  const [isSaving, setIsSaving] = useState(false);
  const [tags, setTags] = useState<string[]>(Object.values(room.details).filter((value): value is string => value !== null && value !== ''));
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setTags(Object.values(formData.details).filter((value): value is string => value !== null && value !== ''));
  }, [formData.details]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsedDetails = JSON.parse(e.target.value);
      setFormData(prev => ({ ...prev, details: parsedDetails }));
    } catch (error) {
      console.error('Erro ao parsear JSON dos detalhes:', error);
      showError('JSON inválido nos detalhes. Verifique a sintaxe.');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      updateDetailsFromTags(updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    updateDetailsFromTags(updatedTags);
  };

  const updateDetailsFromTags = (updatedTags: string[]) => {
    const newDetails: Record<string, string | null> = {};
    updatedTags.forEach((tag, index) => {
      newDetails[`tag_${index + 1}`] = tag;
    });
    setFormData(prev => ({ ...prev, details: newDetails }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = showLoading('Salvando alterações...');

    console.log('Tentando salvar dados:', {
      id: room.id,
      formData: {
        name: formData.name,
        special_name: formData.special_name,
        booking_url: formData.booking_url,
        details: formData.details,
        description: formData.description,
      }
    });

    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({
          name: formData.name,
          special_name: formData.special_name,
          booking_url: formData.booking_url,
          details: formData.details,
          description: formData.description,
        })
        .eq('id', room.id)
        .select();

      console.log('Resposta do Supabase:', { data, error });

      if (error) {
        console.error('Erro ao salvar acomodação:', error);
        showError(`Erro ao salvar: ${error.message}`);
      } else {
        console.log('Acomodação salva com sucesso:', data);
        showSuccess('Acomodação atualizada com sucesso!');
        onSave(); // Recarrega a lista
      }
    } catch (error) {
      console.error('Erro inesperado ao salvar:', error);
      showError('Erro inesperado ao salvar. Tente novamente.');
    }

    dismissToast(toastId);
    setIsSaving(false);
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
              placeholder="Digite uma descrição detalhada da acomodação..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor={`booking_url-${room.id}`}>URL de Reserva</Label>
            <Input id={`booking_url-${room.id}`} name="booking_url" value={formData.booking_url || ''} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags da Acomodação</CardTitle>
          <CardDescription>Adicione ou remova tags facilmente. Estas aparecem como badges nos cards das acomodações.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite uma nova tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button onClick={addTag} disabled={!newTag.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <span>{tag}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTag(tag)}
                  className="h-4 w-4 p-0 hover:bg-blue-200"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes Avançados (JSON)</CardTitle>
          <CardDescription>Para edições avançadas, você pode editar diretamente o JSON. Use com cuidado.</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Salvar Informações
      </Button>
      
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

  const fetchRooms = async () => {
    setLoading(true);
    console.log('Buscando acomodações...');
    const { data, error } = await supabase.from('rooms').select('*').order('id');
    console.log('Resposta da busca de acomodações:', { data, error });
    if (error) {
      showError('Erro ao carregar acomodações.');
      console.error(error);
    } else {
      setRooms(data as Room[]);
    }
    setLoading(false);
  };

  useEffect(() => {
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
                <RoomEditor room={room} onSave={fetchRooms} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}