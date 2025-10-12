"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, Plus, X, Edit2, Trash2, ClipboardPaste } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import ImageManager from './ImageManager';
import { FeatureCategory, FeatureItem } from '../hotel/FeatureListDisplay'; // Importando as interfaces

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, string | null>;
  description: string | null;
  additional_features: FeatureCategory[] | null; // Nova propriedade
}

interface DetailItem {
  id: string; // Unique ID for React keys and internal management
  key: string;
  value: string;
}

function RoomEditor({ room, onSave }: { room: Room; onSave: () => void }) {
  const [formData, setFormData] = useState(room);
  const [isSaving, setIsSaving] = useState(false);
  
  const [detailItems, setDetailItems] = useState<DetailItem[]>([]);
  const [newDetailKey, setNewDetailKey] = useState('');
  const [newDetailValue, setNewDetailValue] = useState('');
  const [editingDetailId, setEditingDetailId] = useState<string | null>(null);
  const [editingDetailKey, setEditingDetailKey] = useState('');
  const [editingDetailValue, setEditingDetailValue] = useState('');

  // State for additional features
  const [additionalFeatures, setAdditionalFeatures] = useState<FeatureCategory[]>([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryTitle, setEditingCategoryTitle] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemText, setEditingItemText] = useState('');

  // State for raw text input
  const [rawAdditionalFeaturesText, setRawAdditionalFeaturesText] = useState('');


  useEffect(() => {
    setFormData(room); // Ensure formData is updated when room prop changes
    if (room.details) {
      const items: DetailItem[] = Object.entries(room.details)
        .filter(([key, value]) => value !== null && value.trim() !== '' && key !== 'description')
        .map(([key, value]) => ({
          id: key, // Using key as ID for now, assuming unique keys.
          key: key,
          value: value as string,
        }));
      setDetailItems(items);
    } else {
      setDetailItems([]);
    }

    // Initialize additional features
    setAdditionalFeatures(room.additional_features || []);
  }, [room]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addDetail = () => {
    if (newDetailKey.trim() && newDetailValue.trim()) {
      const trimmedKey = newDetailKey.trim();
      if (detailItems.some(item => item.key === trimmedKey)) {
        showError('A chave do detalhe já existe. Por favor, use uma chave única.');
        return;
      }
      setDetailItems(prev => [...prev, { id: trimmedKey, key: trimmedKey, value: newDetailValue.trim() }]);
      setNewDetailKey('');
      setNewDetailValue('');
    } else {
      showError('Por favor, preencha a chave e o valor do detalhe.');
    }
  };

  const removeDetail = (idToRemove: string) => {
    setDetailItems(prev => prev.filter(item => item.id !== idToRemove));
  };

  const startEditingDetail = (id: string, key: string, value: string) => {
    setEditingDetailId(id);
    setEditingDetailKey(key);
    setEditingDetailValue(value);
  };

  const saveEditingDetail = () => {
    if (editingDetailId && editingDetailKey.trim() && editingDetailValue.trim()) {
      const trimmedKey = editingDetailKey.trim();
      // Check for key uniqueness if the key is being changed
      if (trimmedKey !== editingDetailId && detailItems.some(item => item.key === trimmedKey && item.id !== editingDetailId)) {
        showError('A nova chave do detalhe já existe. Por favor, use uma chave única.');
        return;
      }

      setDetailItems(prev => prev.map(item =>
        item.id === editingDetailId
          ? { ...item, id: trimmedKey, key: trimmedKey, value: editingDetailValue.trim() }
          : item
      ));
      setEditingDetailId(null);
    } else {
      showError('Por favor, preencha a chave e o valor do detalhe.');
    }
  };

  const cancelEditingDetail = () => {
    setEditingDetailId(null);
    setEditingDetailKey('');
    setEditingDetailValue('');
  };

  // Additional Features management
  const addCategory = () => {
    if (newCategoryTitle.trim()) {
      setAdditionalFeatures(prev => [...prev, { title: newCategoryTitle.trim(), items: [] }]);
      setNewCategoryTitle('');
    } else {
      showError('Por favor, insira um título para a categoria.');
    }
  };

  const removeCategory = (categoryIndex: number) => {
    setAdditionalFeatures(prev => prev.filter((_, i) => i !== categoryIndex));
  };

  const startEditingCategory = (index: number, title: string) => {
    setEditingCategoryId(String(index)); // Use index as ID for editing
    setEditingCategoryTitle(title);
  };

  const saveEditingCategory = (index: number) => {
    if (editingCategoryTitle.trim()) {
      setAdditionalFeatures(prev => prev.map((cat, i) =>
        i === index ? { ...cat, title: editingCategoryTitle.trim() } : cat
      ));
      setEditingCategoryId(null);
    } else {
      showError('O título da categoria não pode ser vazio.');
    }
  };

  const cancelEditingCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryTitle('');
  };

  const addItemToCategory = (categoryIndex: number) => {
    if (newItemText.trim()) {
      setAdditionalFeatures(prev => prev.map((cat, i) =>
        i === categoryIndex ? { ...cat, items: [...cat.items, { text: newItemText.trim() }] } : cat
      ));
      setNewItemText('');
    } else {
      showError('Por favor, insira um texto para o item.');
    }
  };

  const removeItemFromCategory = (categoryIndex: number, itemIndex: number) => {
    setAdditionalFeatures(prev => prev.map((cat, i) =>
      i === categoryIndex ? { ...cat, items: cat.items.filter((_, j) => j !== itemIndex) } : cat
    ));
  };

  const startEditingItem = (categoryIndex: number, itemIndex: number, text: string) => {
    setEditingItemId(`${categoryIndex}-${itemIndex}`);
    setEditingItemText(text);
  };

  const saveEditingItem = (categoryIndex: number, itemIndex: number) => {
    if (editingItemText.trim()) {
      setAdditionalFeatures(prev => prev.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, items: cat.items.map((item, j) => j === itemIndex ? { text: editingItemText.trim() } : item) }
          : cat
      ));
      setEditingItemId(null);
    } else {
      showError('O texto do item não pode ser vazio.');
    }
  };

  const cancelEditingItem = () => {
    setEditingItemId(null);
    setEditingItemText('');
  };

  const handleParseAndApply = () => {
    if (!rawAdditionalFeaturesText.trim()) {
      showError('Por favor, cole o texto na caixa acima.');
      return;
    }

    const lines = rawAdditionalFeaturesText.split('\n').map(line => line.trim()).filter(line => line !== '');
    const parsedFeatures: FeatureCategory[] = [];
    let currentCategory: FeatureCategory | null = null;

    lines.forEach(line => {
      if (line.endsWith(':')) {
        // New category
        currentCategory = { title: line, items: [] };
        parsedFeatures.push(currentCategory);
      } else if (currentCategory) {
        // Item for current category
        currentCategory.items.push({ text: line });
      } else {
        // If items appear before any category, create a default one
        if (parsedFeatures.length === 0) {
          currentCategory = { title: "Geral", items: [] };
          parsedFeatures.push(currentCategory);
        }
        currentCategory?.items.push({ text: line });
      }
    });

    setAdditionalFeatures(parsedFeatures);
    setRawAdditionalFeaturesText(''); // Clear the textarea after applying
    showSuccess('Texto analisado e aplicado com sucesso!');
  };


  const handleSave = async () => {
    setIsSaving(true);
    const toastId = showLoading('Salvando alterações...');

    const updatedDetails: Record<string, string | null> = {};
    detailItems.forEach(item => {
      updatedDetails[item.key] = item.value;
    });

    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({
          name: formData.name,
          special_name: formData.special_name,
          booking_url: formData.booking_url,
          description: formData.description,
          details: updatedDetails,
          additional_features: additionalFeatures, // Salva as novas características adicionais
        })
        .eq('id', room.id)
        .select();

      if (error) {
        console.error('Erro ao salvar acomodação no Supabase:', error);
        showError(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
      } else {
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
          <CardTitle>Detalhes da Acomodação (Badges)</CardTitle>
          <CardDescription>Adicione, edite ou remova os detalhes (tags) que aparecem nos cards e no modal da acomodação. Use chaves únicas para cada detalhe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input
              placeholder="Chave (ex: wifi)"
              value={newDetailKey}
              onChange={(e) => setNewDetailKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDetail()}
              className="sm:col-span-1"
            />
            <Input
              placeholder="Valor (ex: Wi-Fi Grátis)"
              value={newDetailValue}
              onChange={(e) => setNewDetailValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDetail()}
              className="sm:col-span-1"
            />
            <Button onClick={addDetail} disabled={!newDetailKey.trim() || !newDetailValue.trim()} className="sm:col-span-1">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Detalhe
            </Button>
          </div>
          <div className="space-y-2">
            {detailItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-2 bg-blue-50 p-2 rounded-md">
                {editingDetailId === item.id ? (
                  <>
                    <Input
                      value={editingDetailKey}
                      onChange={(e) => setEditingDetailKey(e.target.value)}
                      className="flex-1"
                      placeholder="Chave"
                    />
                    <Input
                      value={editingDetailValue}
                      onChange={(e) => setEditingDetailValue(e.target.value)}
                      className="flex-1"
                      placeholder="Valor"
                    />
                    <Button size="sm" onClick={saveEditingDetail} disabled={!editingDetailKey.trim() || !editingDetailValue.trim()}>
                      Salvar
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditingDetail}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-blue-800 w-24 flex-shrink-0">{item.key}:</span>
                    <span className="flex-1 text-gray-700">{item.value}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditingDetail(item.id, item.key, item.value)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeDetail(item.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nova seção para Descrição Adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Descrição Adicional (Lista de Características)</CardTitle>
          <CardDescription>
            Crie categorias e adicione itens de texto para a descrição detalhada da acomodação.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 mb-6 p-4 border rounded-md bg-blue-50">
            <Label htmlFor="raw-features-text">Colar Texto para Características Adicionais</Label>
            <Textarea
              id="raw-features-text"
              placeholder="Cole seu texto aqui. Linhas terminadas em ':' serão categorias, outras linhas serão itens."
              value={rawAdditionalFeaturesText}
              onChange={(e) => setRawAdditionalFeaturesText(e.target.value)}
              rows={8}
              className="bg-white"
            />
            <Button onClick={handleParseAndApply} className="w-full">
              <ClipboardPaste className="h-4 w-4 mr-2" />
              Analisar e Aplicar Texto
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Título da Nova Categoria (ex: Na sua cozinha privativa:)"
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              className="flex-grow"
            />
            <Button onClick={addCategory} disabled={!newCategoryTitle.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Categoria
            </Button>
          </div>

          <div className="space-y-4">
            {additionalFeatures.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border rounded-md p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  {editingCategoryId === String(categoryIndex) ? (
                    <div className="flex flex-grow gap-2">
                      <Input
                        value={editingCategoryTitle}
                        onChange={(e) => setEditingCategoryTitle(e.target.value)}
                        className="flex-grow"
                      />
                      <Button size="sm" onClick={() => saveEditingCategory(categoryIndex)}>Salvar</Button>
                      <Button size="sm" variant="outline" onClick={cancelEditingCategory}>Cancelar</Button>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold text-blue-800 text-lg">{category.title}</h4>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => startEditingCategory(categoryIndex, category.title)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeCategory(categoryIndex)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2 bg-white p-2 rounded-md border">
                      {editingItemId === `${categoryIndex}-${itemIndex}` ? (
                        <div className="flex flex-grow gap-2">
                          <Input
                            value={editingItemText}
                            onChange={(e) => setEditingItemText(e.target.value)}
                            className="flex-grow"
                          />
                          <Button size="sm" onClick={() => saveEditingItem(categoryIndex, itemIndex)}>Salvar</Button>
                          <Button size="sm" variant="outline" onClick={cancelEditingItem}>Cancelar</Button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-grow text-gray-700">{item.text}</span>
                          <Button size="sm" variant="ghost" onClick={() => startEditingItem(categoryIndex, itemIndex, item.text)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => removeItemFromCategory(categoryIndex, itemIndex)} className="text-red-600 hover:text-red-800">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Novo item de característica"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItemToCategory(categoryIndex)}
                    className="flex-grow"
                  />
                  <Button onClick={() => addItemToCategory(categoryIndex)} disabled={!newItemText.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Fim da nova seção para Descrição Adicional */}

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Salvar Informações da Acomodação
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
    const { data, error } = await supabase.from("rooms").select('*').order('id');
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