"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Trash2, Upload, Loader2 } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

const BUCKET_NAME = 'gallery';

interface ImageFile {
  id: string;
  name: string;
  publicURL: string;
}

export default function ImageManager() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      showError('Erro ao carregar imagens.');
      console.error('Error fetching images:', error);
      setLoading(false);
      return;
    }

    if (data) {
      const imageFiles = data
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => {
          const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
          return { id: file.id, name: file.name, publicURL: publicUrl };
        });
      setImages(imageFiles);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError('Por favor, selecione um arquivo primeiro.');
      return;
    }

    setUploading(true);
    const toastId = showLoading('Enviando imagem...');
    const fileName = `${Date.now()}-${selectedFile.name}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, selectedFile);

    dismissToast(toastId);
    setUploading(false);

    if (error) {
      showError('Falha no upload da imagem.');
      console.error('Error uploading image:', error);
    } else {
      showSuccess('Imagem enviada com sucesso!');
      setSelectedFile(null);
      fetchImages(); // Refresh the gallery
    }
  };

  const handleDelete = async (imageName: string) => {
    const toastId = showLoading('Excluindo imagem...');
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([imageName]);
    
    dismissToast(toastId);

    if (error) {
      showError('Falha ao excluir a imagem.');
      console.error('Error deleting image:', error);
    } else {
      showSuccess('Imagem excluída com sucesso!');
      fetchImages(); // Refresh the gallery
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8 border-b pb-6">
          <Input type="file" accept="image/*" onChange={handleFileChange} className="flex-grow" />
          <Button onClick={handleUpload} disabled={uploading || !selectedFile}>
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Enviar Imagem
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Carregando imagens...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden group relative">
                <img src={image.publicURL} alt={image.name} className="aspect-square w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(image.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
        {!loading && images.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                <p>Nenhuma imagem encontrada.</p>
                <p className="text-sm">Comece enviando uma imagem para a galeria.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}