"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, Plus, X, Edit2 } from 'lucide-react';
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
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState('');

  useEffect(() => {
    console.log('Room data received:', room);
    console.log('Room details:', room.details);
    
    // Extract only tag values from details, filtering out null/empty values
    const tagValues = Object.entries(room.details)
      .filter(([key, value]) => key.startsWith('tag_') && value && value.trim() !== '')
      .map(([key, value]) => value as string)
      .sort((a, b) => {
        const aNum = parseInt(key.split('_')[1]);
        const bNum = parseInt(b.split('_')[1]);
        return aNum - bNum;
      });
    
    console.log('Extracted tags:', tagValues);
    setTags(tagValues);
  }, [room]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const startEditingTag = (index: number, currentValue: string) => {
    setEditingTagIndex(index);
    setEditingTagValue(currentValue);
  };

  const saveEditingTag = () => {
    if (editingTagIndex !== null && editingTagValue.trim()) {
      const updatedTags = [...tags];
      updatedTags[editingTagIndex] = editingTagValue.trim();
      setTags(updatedTags);
      updateDetailsFromTags(updatedTags);
      setEditingTagIndex(null);
      setEditingTagValue('');
    }
  };

  const cancelEditingTag = () => {
    setEditingTagIndex(null);
    setEditingTagValue('');
  };

  const updateDetailsFromTags = (updatedTags: string[]) => {
    const newDetails: Record<string, string | null> = { ...formData.details };
    
    // Remove all existing tag keys
    Object.keys(newDetails).forEach(key => {
      if (key.startsWith('tag_')) {
        delete newDetails[key];
      }
    });
    
    // Add updated tag keys
    updatedTags.forEach((tag, index) => {
      newDetails[`tag_${index + 1}`] = tag;
    });
    
    console.log('Updated details object:', newDetails);
    setFormData(prev => ({ ...prev, details: newDetails }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = showLoading('Salvando alterações...');

    console.log('Final details to save:', formData.details);
    console.log('Full data to save:', {
      name: formData.name,
      special_name: formData.special_name,
      booking_url: formData.booking_url,
      details: formData.details,
      description: formData.description,
    });

    try {
      // First, let's try to update only the details column to isolate the issue
      console.log('Attempting to update details column only...');
      const { data: detailsUpdate, error: detailsError } = await supabase
        .from('rooms')
        .update({ details: formData.details })
        .eq('id', room.id)
        .select();

      console.log('Details update response:', { detailsUpdate, detailsError });

      if (detailsError) {
        console.error('Error updating details:', detailsError);
        showError(`Erro ao salvar detalhes: ${detailsError.message}`);
        dismissToast(toastId);
        setIsSaving(false);
        return;
      }

      // If details update worked, update the rest
      console.log('Details updated successfully, now updating other fields...');
      const { data, error } = await supabase
        .from('rooms')
        .update({
          name: formData.name,
          special_name: formData.special_name,
          booking_url: formData.booking_url,
          description: formData.description,
        })
        .eq('id', room.id)
        .select();

      console.log('Full update response:', { data, error });

      if (error) {
        console.error('Erro ao salvar acomodação:', error);
        showError(`Erro ao salvar: ${error.message}`);
      } else {
        console.log('Acomodação salva com sucesso. Dados retornados:', data);
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
          <CardDescription>Gerencie as tags facilmente. Adicione novas, edite existentes ou remova clicando nos botões.</CardDescription>
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
          <div className="space-y-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
                {editingTagIndex === index ? (
                  <>
                    <Input
                      value={editingTagValue}
                      onChange={(e) => setEditingTagValue(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && saveEditingTag()}
                    />
                    <Button size="sm" onClick={saveEditingTag} disabled={!editingTagValue.trim()}>
                      Salvar
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditingTag}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-blue-800">{tag}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditingTag(index, tag)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTag(tag)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            ))}
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