"use client";

import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Lock, ShieldCheck, Layout } from "lucide-react";
import { useAuth, UserPermissions } from "@/components/AuthProvider";
import ImageManager from "@/components/admin/ImageManager";
import LogoManager from "@/components/admin/LogoManager";
import RoomImageManager from "@/components/admin/RoomImageManager";
import RoomManager from "@/components/admin/RoomManager";
import PriceManager from "@/components/admin/PriceManager";
import PermissionManager from "@/components/admin/PermissionManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { showSuccess } from "@/utils/toast";

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, profile, isLoading, hasPermission } = useAuth();

  const handleLogout = async () => {
    if (supabase) await supabase.signOut();
    showSuccess("Você saiu do painel administrativo");
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="text-center py-12">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Acesso Negado</h2>
            <p className="text-gray-600">Faça login para acessar o painel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Configuração das abas e suas permissões
  const allTabs = [
    { id: 'gallery', label: 'Galeria', component: (
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
    )},
    { id: 'hero', label: 'Banner', component: <ImageManager folder="hero" title="Banner Principal" description="Imagens do topo." /> },
    { id: 'about', label: 'Sobre', component: <ImageManager folder="about" title="Seção Sobre" description="Imagens da história." /> },
    { id: 'rooms', label: 'Quartos', component: <RoomManager /> },
    { id: 'prices', label: 'Preços', component: <PriceManager /> },
    { id: 'covers', label: 'Capas', component: <RoomImageManager /> },
    { id: 'logo', label: 'Logo', component: <LogoManager /> },
    { id: 'permissions', label: 'Permissões', component: <PermissionManager /> },
  ];

  // Filtra as abas que o usuário tem permissão de ver
  const allowedTabs = allTabs.filter(tab => hasPermission(tab.id as keyof UserPermissions));

  if (allowedTabs.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="text-center py-12">
            <ShieldCheck className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Sem Permissões</h2>
            <p className="text-gray-600">Você não tem permissão para visualizar nenhuma aba. Entre em contato com o administrador master.</p>
            <Button onClick={handleLogout} variant="outline" className="mt-4">Sair</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
            <p className="text-gray-600 mt-1">
              Olá, {profile.role === 'admin' ? 'Administrador Master' : 'Usuário'}.
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>

        <Tabs defaultValue={allowedTabs[0].id} className="w-full">
          <TabsList className={`grid w-full`} style={{ gridTemplateColumns: `repeat(${allowedTabs.length}, minmax(0, 1fr))` }}>
            {allowedTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          
          {allowedTabs.map(tab => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

export default Admin;