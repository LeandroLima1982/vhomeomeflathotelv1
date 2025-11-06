"use client";

import { useState, useEffect, useCallback } from "react";
import { Lightbox } from "./Lightbox";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BUCKET_NAME = 'gallery';
const BASE_FOLDER = 'main'; // Pasta base para todas as categorias da galeria
const ORDER_FILE_NAME = '_order.json';

const categories = [
  { name: 'Todos', folder: `${BASE_FOLDER}/todos` },
  { name: 'Quartos', folder: `${BASE_FOLDER}/quartos` },
  { name: 'Áreas Comuns', folder: `${BASE_FOLDER}/areas_comuns` },
  { name: 'Lazer', folder: `${BASE_FOLDER}/lazer` },
];

export function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0].name); // Estado para a categoria ativa

  const fetchImages = useCallback(async (folder: string) => {
    setLoading(true);
    const { data: files, error: listError } = await supabase.storage.from(BUCKET_NAME).list(folder, {
      limit: 100, // Buscar mais para ter flexibilidade na ordenação
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (listError) {
      console.error(`Error fetching images for folder ${folder}:`, listError);
      setLoading(false);
      setImages([]); // Limpa as imagens em caso de erro
      return;
    }

    const imageFiles = files.filter(file => file.name !== '.emptyFolderPlaceholder' && file.name !== ORDER_FILE_NAME);
    const imageUrls = imageFiles.map(file => ({
      name: file.name,
      url: supabase.storage.from(BUCKET_NAME).getPublicUrl(`${folder}/${file.name}`).data.publicUrl,
    }));

    const { data: orderFileData } = await supabase.storage.from(BUCKET_NAME).download(`${folder}/${ORDER_FILE_NAME}`);

    if (!orderFileData) {
      setImages(imageUrls.map(img => img.url).slice(0, 12));
    } else {
      const orderJson = await orderFileData.text();
      try {
        const orderedNames = JSON.parse(orderJson) as string[];
        const imageMap = new Map(imageUrls.map(img => [img.name, img.url]));
        const sortedUrls = orderedNames.map(name => imageMap.get(name)).filter((url): url is string => !!url);
        const newImageUrls = imageUrls.filter(img => !orderedNames.includes(img.name)).map(img => img.url);
        setImages([...sortedUrls, ...newImageUrls].slice(0, 12));
      } catch (e) {
        console.error("Error parsing order file, using default order", e);
        setImages(imageUrls.map(img => img.url).slice(0, 12));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const currentCategoryFolder = categories.find(cat => cat.name === activeCategory)?.folder;
    if (currentCategoryFolder) {
      fetchImages(currentCategoryFolder);
    }
  }, [activeCategory, fetchImages]);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
  };

  const closeLightbox = () => {
    setCurrentImage(null);
  };

  const nextImage = () => {
    if (currentImage !== null) {
      setCurrentImage((currentImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (currentImage !== null) {
      setCurrentImage((currentImage - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      <section id="galeria" className="pt-24 py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Conheça Nosso Flat Hotel</h2>
          <p className="text-gray-600 mt-2 mb-12">Conheça nossos ambientes</p>
          
          <Tabs defaultValue={categories[0].name} onValueChange={setActiveCategory} className="w-full max-w-4xl mx-auto mb-8">
            <TabsList className="grid w-full grid-cols-4">
              {categories.map(cat => (
                <TabsTrigger key={cat.name} value={cat.name}>
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map(cat => (
              <TabsContent key={cat.name} value={cat.name} className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {loading ? (
                    Array.from({ length: 12 }).map((_, index) => (
                      <Skeleton key={index} className="aspect-square w-full rounded-lg" />
                    ))
                  ) : images.length > 0 ? (
                    images.map((src, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-lg shadow-lg aspect-square cursor-pointer"
                        onClick={() => openLightbox(index)}
                      >
                        <div
                          className="w-full h-full bg-cover bg-center transform hover:scale-110 transition-transform duration-300"
                          style={{ backgroundImage: `url(${src})` }}
                          role="img"
                          aria-label={`Galeria ${cat.name} ${index + 1}`}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      <p>Nenhuma imagem encontrada para esta categoria.</p>
                      <p className="text-sm">Faça o upload de imagens no painel de administração.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {currentImage !== null && (
        <Lightbox
          images={images}
          currentIndex={currentImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
}