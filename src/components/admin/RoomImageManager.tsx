"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { roomsData } from '@/data/rooms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

const BUCKET_NAME = 'gallery';
const FOLDER = 'rooms';

type RoomWithImage = (typeof roomsData)[number] & {
  imageUrl: string | null;
};

function RoomItem({ room, onImageChange }: { room: RoomWithImage; onImageChange: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(room.imageUrl);

  useEffect(() => {
    setPreviewUrl(room.imageUrl);
  }, [room.imageUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError('Por favor, selecione um arquivo.');
      return;
    }

    setUploading(true);
    const toastId = showLoading(`Enviando imagem para ${room.name}...`);
    
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${room.id}.${fileExt}`;
    const filePath = `${FOLDER}/${fileName}`;

    const { data: existingFiles } = await supabase.storage.from(BUCKET_NAME).list(FOLDER, {
        search: `${room.id}.`
    });
    if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map(f => `${FOLDER}/${f.name}`);
        await supabase.storage.from(BUCKET_NAME).remove(filesToRemove);
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: true,
      });

    dismissToast(toastId);
    setUploading(false);

    if (error) {
      showError(`Falha no upload: ${error.message}`);
    } else {
      showSuccess('Imagem atualizada com sucesso!');
      setSelectedFile(null);
      onImageChange();
    }
  };
  
  const handleDelete = async () => {
    if (!room.imageUrl) return;

    const toastId = showLoading('Excluindo imagem...');
    const { data: existingFiles } = await supabase.storage.from(BUCKET_NAME).list(FOLDER, {
        search: `${room.id}.`
    });

    if (!existingFiles || existingFiles.length === 0) {
        dismissToast(toastId);
        showError("Nenhum arquivo de imagem encontrado para excluir.");
        return;
    }

    const filesToRemove = existingFiles.map(f => `${FOLDER}/${f.name}`);
    const { error } = await supabase.storage.from(BUCKET_NAME).remove(filesToRemove);
    
    dismissToast(toastId);

    if (error) {
      showError(`Falha ao excluir: ${error.message}`);
    } else {
      showSuccess('Imagem excluída com sucesso!');
      setPreviewUrl(null);
      onImageChange();
    }
  };

  return (
    <div className="border p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <div className="md:col-span-1">
        <p className="font-semibold text-gray-800">{room.name}</p>
      </div>
      <div className="md:col-span-1 flex items-center justify-center">
        <div className="w-32 h-32 border rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt={`Preview for ${room.name}`} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="h-8 w-8 text-gray-400" />
          )}
        </div>
      </div>
      <div className="md:col-span-1 flex flex-col gap-2">
        <Input id={`file-upload-${room.id}`} type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
        <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={uploading || !selectedFile} className="w-full">
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Salvar
            </Button>
            {previewUrl && (
                <Button variant="destructive" size="icon" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}

export default function RoomImageManager() {
  const [rooms, setRooms] = useState<RoomWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoomImages = async () => {
    setLoading(true);
    const { data: files, error } = await supabase.storage.from(BUCKET_NAME).list(FOLDER);

    if (error) {
        showError("Erro ao carregar as imagens das acomodações.");
        console.error(error);
        setLoading(false);
        return;
    }

    const imageMap = new Map(files?.map(file => {
        const fileNameWithoutExt = file.name.split('.')[0];
        const publicUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(`${FOLDER}/${file.name}`).data.publicUrl;
        return [fileNameWithoutExt, `${publicUrl}?t=${new Date().getTime()}`];
    }));

    const roomsWithImages = roomsData.map(room => ({
      ...room,
      imageUrl: imageMap.get(String(room.id)) || null,
    }));

    setRooms(roomsWithImages);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoomImages();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Imagens das Acomodações</CardTitle>
          <CardDescription>
            Gerencie a imagem de cada acomodação individualmente. A imagem enviada substituirá a anterior.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="ml-4">Carregando acomodações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagens das Acomodações</CardTitle>
        <CardDescription>
          Gerencie a imagem de cada acomodação individualmente. A imagem enviada substituirá a anterior.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rooms.map(room => (
            <RoomItem key={room.id} room={room} onImageChange={fetchRoomImages} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}