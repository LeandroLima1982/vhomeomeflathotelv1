"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save, RefreshCw } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

interface RoomPrice {
  id: number;
  name: string;
  base_price: number | null;
}

export default function PriceManager() {
  const [rooms, setRooms] = useState<RoomPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchPrices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rooms')
      .select('id, name, base_price')
      .order('id');

    if (error) {
      showError('Erro ao carregar preços.');
      console.error(error);
    } else {
      setRooms(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handlePriceChange = (id: number, value: string) => {
    const numericValue = value === '' ? null : parseFloat(value);
    setRooms(prev => prev.map(room => 
      room.id === id ? { ...room, base_price: numericValue } : room
    ));
  };

  const savePrice = async (room: RoomPrice) => {
    setSavingId(room.id);
    const toastId = showLoading(`Salvando preço de ${room.name}...`);

    const { error } = await supabase
      .from('rooms')
      .update({ base_price: room.base_price })
      .eq('id', room.id);

    dismissToast(toastId);
    setSavingId(null);

    if (error) {
      showError(`Erro ao salvar: ${error.message}`);
    } else {
      showSuccess('Preço atualizado com sucesso!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciador de Preços</CardTitle>
          <CardDescription>
            Atualize o valor da diária "a partir de" para cada acomodação.
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={fetchPrices}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rooms.map((room) => (
            <div key={room.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4 bg-gray-50">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{room.name}</h3>
                <p className="text-xs text-gray-500">ID: {room.id}</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                  <Input
                    type="number"
                    value={room.base_price || ''}
                    onChange={(e) => handlePriceChange(room.id, e.target.value)}
                    className="pl-9"
                    placeholder="0.00"
                  />
                </div>
                <Button 
                  onClick={() => savePrice(room)} 
                  disabled={savingId === room.id}
                  size="sm"
                >
                  {savingId === room.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}