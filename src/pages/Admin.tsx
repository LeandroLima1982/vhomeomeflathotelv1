import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ImageManager from "@/components/admin/ImageManager";
import LogoManager from "@/components/admin/LogoManager";
import RoomImageManager from "@/components/admin/RoomImageManager";
import RoomManager from "@/components/admin/RoomManager";
import PriceManager from "@/components/admin/PriceManager"; // Importando o novo componente
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate('/login');
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Conteúdo</h1>
                <p className="text-gray-600 mt-1">
                Use as abas abaixo para gerenciar as imagens e conteúdos de cada seção do site.
                </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
            </Button>
        </div>
        
        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="grid w-full grid-cols-7"> {/* Aumentado para 7 colunas */}
            <TabsTrigger value="rooms">Acomodações</TabsTrigger>
            <TabsTrigger value="prices">Preços</TabsTrigger> {/* Nova aba */}
            <TabsTrigger value="gallery_categories">Galeria Principal</TabsTrigger>
            <TabsTrigger value="hero">Banner Principal (Hero)</TabsTrigger>
            <TabsTrigger value="about">Seção "Sobre"</TabsTrigger>
            <TabsTrigger value="room_covers">Imagens de Capa</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rooms" className="mt-6">
            <RoomManager />
          </TabsContent>

          <TabsContent value="prices" className="mt-6">
            <PriceManager />
          </TabsContent>

          <TabsContent value="gallery_categories" className="mt-6">
            <Tabs defaultValue="todos" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="quartos">Quartos</TabsTrigger>
                <TabsTrigger value="areas_comuns">Áreas Comuns</TabsTrigger>
                <TabsTrigger value="lazer">Lazer</TabsTrigger>
              </TabsList>
              <TabsContent value="todos" className="mt-6">
                <ImageManager 
                  folder="main/todos"
                  title="Galeria Principal - Todos"
                  description="Estas imagens aparecem na seção 'Conheça Nossos Ambientes' na aba 'Todos'. O ideal é ter até 12 imagens."
                />
              </TabsContent>
              <TabsContent value="quartos" className="mt-6">
                <ImageManager 
                  folder="main/quartos"
                  title="Galeria Principal - Quartos"
                  description="Estas imagens aparecem na seção 'Conheça Nossos Ambientes' na aba 'Quartos'. O ideal é ter até 12 imagens."
                />
              </TabsContent>
              <TabsContent value="areas_comuns" className="mt-6">
                <ImageManager 
                  folder="main/areas_comuns"
                  title="Galeria Principal - Áreas Comuns"
                  description="Estas imagens aparecem na seção 'Conheça Nossos Ambientes' na aba 'Áreas Comuns'. O ideal é ter até 12 imagens."
                />
              </TabsContent>
              <TabsContent value="lazer" className="mt-6">
                <ImageManager 
                  folder="main/lazer"
                  title="Galeria Principal - Lazer"
                  description="Estas imagens aparecem na seção 'Conheça Nossos Ambientes' na aba 'Lazer'. O ideal é ter até 12 imagens."
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="hero" className="mt-6">
            <ImageManager 
              folder="hero"
              title="Banner Principal (Hero)"
              description="Estas imagens aparecem no carrossel da página inicial. Adicione 2 ou 3 imagens de alta qualidade."
            />
          </TabsContent>
          <TabsContent value="about" className="mt-6">
            <ImageManager 
              folder="about"
              title="Seção Sobre"
              description="Imagens para o carrossel da seção 'Bem-vindo ao V-Home'. Adicione 2 ou 3 imagens que mostrem o hotel."
            />
          </TabsContent>
          <TabsContent value="room_covers" className="mt-6">
            <RoomImageManager />
          </TabsContent>
          <TabsContent value="logo" className="mt-6">
            <LogoManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;