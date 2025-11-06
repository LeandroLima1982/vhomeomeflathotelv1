"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Upload, Loader2 } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const BUCKET_NAME = 'gallery';
const ORDER_FILE_NAME = '_order.json';

interface ImageFile {
  id: string;
  name: string;
  path: string;
  publicURL: string;
}

interface SortableImageProps {
  image: ImageFile;
  onDelete: (path: string) => void;
}

function SortableImage({ image, onDelete }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <Card className="overflow-hidden group relative cursor-grab active:cursor-grabbing">
        <img src={image.publicURL} alt={image.name} className="aspect-square w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <Button
            variant="destructive"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.path);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface ImageManagerProps {
  folder: string;
  title: string;
  description: string;
}

export default function ImageManager({ folder, title, description }: ImageManagerProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    const { data: files, error: listError } = await supabase.storage.from(BUCKET_NAME).list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (listError) {
      showError(`Erro ao carregar imagens: ${listError.message}`);
      setLoading(false);
      return;
    }

    const imageFilesData = files
      .filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== ORDER_FILE_NAME)
      .map(file => {
        const imagePath = `${folder}/${file.name}`;
        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(imagePath);
        return { id: file.name, name: file.name, path: imagePath, publicURL: publicUrl };
      });

    const { data: orderFileData } = await supabase.storage.from(BUCKET_NAME).download(`${folder}/${ORDER_FILE_NAME}`);

    if (!orderFileData) {
      setImages(imageFilesData);
    } else {
      const orderJson = await orderFileData.text();
      try {
        const orderedNames = JSON.parse(orderJson) as string[];
        const imageMap = new Map(imageFilesData.map(img => [img.name, img]));
        const sortedImages = orderedNames.map(name => imageMap.get(name)).filter((img): img is ImageFile => !!img);
        const newImages = imageFilesData.filter(img => !orderedNames.includes(img.name));
        setImages([...sortedImages, ...newImages]);
      } catch (e) {
        console.error("Error parsing order file, using default order", e);
        setImages(imageFilesData);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, [folder]);

  const updateOrderFile = async (currentImages: ImageFile[]) => {
    const orderedNames = currentImages.map(img => img.name);
    const blob = new Blob([JSON.stringify(orderedNames, null, 2)], { type: 'application/json' });
    const filePath = `${folder}/${ORDER_FILE_NAME}`;

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, blob, { upsert: true });
    if (error) {
      showError('Não foi possível salvar a nova ordem das imagens.');
      console.error('Error updating order file:', error);
    }
  };

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
    
    // Sanitize the file name
    const originalFileName = selectedFile.name;
    const fileExtension = originalFileName.split('.').pop();
    const baseFileName = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
    const sanitizedBaseFileName = baseFileName
      .normalize("NFD") // Normalize to decompose combined characters (e.g., é -> e + ´)
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (accents)
      .replace(/[^a-zA-Z0-9_.-]/g, '_') // Replace non-alphanumeric, non-underscore, non-hyphen, non-dot with underscore
      .replace(/__+/g, '_') // Replace multiple underscores with a single one
      .toLowerCase(); // Convert to lowercase for consistency

    const fileName = `${Date.now()}-${sanitizedBaseFileName}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, selectedFile);

    dismissToast(toastId);
    setUploading(false);

    if (error) {
      showError(`Falha no upload: ${error.message}`);
    } else {
      showSuccess('Imagem enviada com sucesso!');
      setSelectedFile(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchImages();
    }
  };

  const handleDelete = async (imagePath: string) => {
    const toastId = showLoading('Excluindo imagem...');
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([imagePath]);
    
    dismissToast(toastId);

    if (error) {
      showError(`Falha ao excluir: ${error.message}`);
    } else {
      showSuccess('Imagem excluída com sucesso!');
      const imageName = imagePath.split('/').pop();
      const updatedImages = images.filter(img => img.name !== imageName);
      setImages(updatedImages);
      await updateOrderFile(updatedImages);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        updateOrderFile(newItems);
        return newItems;
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
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
          <>
            <p className="text-sm text-gray-500 mb-4">Arraste e solte as imagens para reordená-las.</p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={images} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <SortableImage key={image.id} image={image} onDelete={handleDelete} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}
        {!loading && images.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                <p>Nenhuma imagem encontrada.</p>
                <p className="text-sm">Comece enviando uma imagem para esta seção.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}