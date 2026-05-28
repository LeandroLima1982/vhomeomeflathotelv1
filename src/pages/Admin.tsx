import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Lock } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import ImageManager from "@/components/admin/ImageManager";
import LogoManager from "@/components/admin/LogoManager";
import RoomImageManager from "@/components/admin/RoomImageManager";
import RoomManager from "@/components/admin/RoomManager";
import PriceManager from "@/components/admin/PriceManager";
import UserManager from "@/components/admin/UserManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, isEditor, profile } = useAuth();

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate('/login');
  };

  // Se o usuário for apenas viewer, ele não pode salvar nada. 
  // Os componentes internos já devem lidar com a desativação de botões se necessário,
  // mas aqui vamos focar na visibilidade das abas.

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
                <p className="text-gray-600 mt-1">
                  Olá, {profile?.role === 'admin' ? 'Administrador' : profile?.role === 'editor' ? 'Editor' : 'Visualizador'}.
                </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
        </div>
        
        <Tabs defaultValue={isEditor ? "rooms" : "hero"} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
            {isEditor && <TabsTrigger value="rooms">Quartos</TabsTrigger>}
            {isEditor && <TabsTrigger value="prices">Preços</TabsTrigger>}
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="hero">Banner</TabsTrigger>
            <TabsTrigger value="about">Sobre</TabsTrigger>
            {isEditor && <TabsTrigger value="covers">Capas</TabsTrigger>}
            {isEditor && <TabsTrigger value="logo">Logo</TabsTrigger>}
            {isAdmin && <TabsTrigger value="users" className="bg-blue-50 text-blue-700">Usuários</TabsTrigger>}
          </TabsList>
          
          {isEditor ? (
            <>
              <TabsContent value="rooms" className="mt-6"><RoomManager /></TabsContent>
              <TabsContent value="prices" className="mt-6"><PriceManager /></TabsContent>
              <TabsContent value="covers" className="mt-6"><RoomImageManager /></TabsContent>
              <TabsContent value="logo" className="mt-6"><LogoManager /></TabsContent>
            </>
          ) : (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800">
              <Lock className="h-5 w-5" />
              <p>Você tem acesso de visualização. Algumas funções de edição estão desabilitadas.</p>
            </div>
          )}

          <TabsContent value="gallery" className="mt-6">
            <Tabs defaultValue="todos">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="quartos">Quartos</TabsTrigger>
                <TabsTrigger value="areas_comuns">Comuns</TabsTrigger>
                <TabsTrigger value="lazer">Lazer</TabsTrigger>
              </TabsList>
              <TabsContent value="todos"><ImageManager folder="main/todos" title="Galeria - Todos" description="Imagens gerais." /></TabsContent>
              <TabsContent value="quartos"><ImageManager folder="main/quartos" title="Galeria - Quartos" description="Imagens dos quartos." /></TabsContent>
              <TabsContent value="areas_comuns"><ImageManager folder="main/areas_comuns" title="Galeria - Áreas Comuns" description="Áreas do hotel." /></TabsContent>
              <TabsContent value="lazer"><ImageManager folder="main/lazer" title="Galeria - Lazer" description="Áreas de lazer." /></TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="hero" className="mt-6">
            <ImageManager folder="hero" title="Banner Principal" description="Imagens do topo." />
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <ImageManager folder="about" title="Seção Sobre" description="Imagens da história." />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users" className="mt-6">
              <UserManager />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;