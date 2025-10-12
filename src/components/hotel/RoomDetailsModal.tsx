"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import FeatureListDisplay from './FeatureListDisplay'; // Importando o novo componente

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    capacity: number;
    beds: number;
    bathrooms: number;
    amenities: string[];
  };
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ isOpen, onClose, room }) => {
  if (!isOpen) return null;

  // Dados de exemplo para as características adicionais, similar à imagem
  const roomFeatures = [
    {
      title: "Na sua cozinha privativa:",
      items: [
        { text: "Geladeira" },
        { text: "Utensílios de cozinha" },
        { text: "Fogão" },
        { text: "Mesa de jantar" },
        { text: "Micro-ondas" },
        { text: "Forno" },
        { text: "Área para refeições" },
      ],
    },
    {
      title: "No seu banheiro privativo:",
      items: [
        { text: "Produtos de higiene pessoal gratuitos" },
        { text: "Chuveiro" },
        { text: "Vaso sanitário" },
        { text: "Secador de cabelo" },
        { text: "Papel higiênico" },
      ],
    },
    {
      title: "Vista:",
      items: [
        { text: "Vista do mar" },
      ],
    },
    {
      title: "Comodidades dos quartos:",
      items: [
        { text: "Estojo para notebook" },
        { text: "Mesa de trabalho" },
        { text: "Protetores de tomadas" },
        { text: "Cofre" },
        { text: "Mesa de jantar" },
        { text: "Andares superiores acessíveis por elevador" },
        { text: "TV de tela plana" },
        { text: "Forno" },
        { text: "Acesso ao Lounge Executivo" },
        { text: "Canais pay-per-view" },
        { text: "Serviço de despertar" },
        { text: "Toalhas" },
        { text: "Tomada perto da cama" },
        { text: "Micro-ondas" },
        { text: "TV" },
        { text: "Geladeira" },
        { text: "Roupa de cama" },
        { text: "Fogão" },
        { text: "Piso de mármore/azulejo" },
        { text: "Utensílios de cozinha" },
        { text: "Cozinha" },
        { text: "Aquecimento" },
        { text: "Canais a cabo" },
        { text: "Guarda-roupa ou armário" },
        { text: "Canais via satélite" },
        { text: "Ar-condicionado" },
        { text: "Área para refeições" },
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{room.name}</DialogTitle>
          <DialogDescription>
            Detalhes e informações sobre o quarto.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="details" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2 mx-6 mt-4 bg-gray-100 rounded-lg p-1">
              <TabsTrigger value="details" className="rounded-md font-medium transition-all">Detalhes</TabsTrigger>
              <TabsTrigger value="photos" className="rounded-md font-medium transition-all">Fotos</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-6 pt-4">
              <h2 className="text-xl font-bold mb-4">Sobre o Quarto</h2>
              <p className="text-gray-700 mb-6">{room.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Capacidade:</span>
                  <span>{room.capacity} pessoas</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Camas:</span>
                  <span>{room.beds}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Banheiros:</span>
                  <span>{room.bathrooms}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Preço por noite:</span>
                  <span>R$ {room.price.toFixed(2)}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-3">Comodidades:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                {room.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>

              {/* Nova seção de descrição adicional */}
              <h3 className="text-lg font-bold mb-3">Descrição Adicional:</h3>
              <FeatureListDisplay features={roomFeatures} /> {/* Usando o novo componente aqui */}
              {/* Fim da nova seção */}

            </TabsContent>
            <TabsContent value="photos" className="p-6 pt-4">
              <Carousel className="w-full max-w-full mx-auto">
                <CarouselContent>
                  {room.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <div className="flex aspect-video items-center justify-center p-6">
                          <img
                            src={image}
                            alt={`Room image ${index + 1}`}
                            className="rounded-md w-full h-full object-cover" // Usando classes Tailwind para width, height e object-fit
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;