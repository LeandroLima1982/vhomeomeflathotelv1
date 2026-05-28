"use client";

import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import ImageManager from "@/components/admin/ImageManager";
import LogoManager from "@/components/admin/LogoManager";
import RoomImageManager from "@/components/admin/RoomImageManager";
import RoomManager from "@/components/admin/RoomManager";
import PriceManager from "@/components/admin/PriceManager";
import PermissionManager from "@/components/admin/PermissionManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess } from "@/utils/toast";

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, isEditor, profile, isLoading } = useAuth();

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    showSuccess("Você saiu do painel administrativo");
    navigate('/login');
  };

  // Se o usuário for apenas viewer, ele não pode salvar nada
  const canEdit = isAdmin || isEditor;

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
        </div>
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
            <p className="text-gray-600">Você precisa fazer login para acessar o painel administrativo.</p>
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
              Olá, {profile.role === 'admin' ? 'Administrador' : profile.role === 'editor' ? 'Editor' : 'Visualizador'}.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">
                Nível de acesso: {profile.role === 'admin' ? 'Completo' : profile.role === 'editor' ? 'Edição' : 'Visualização'}
              </span>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>

        {/* Aviso para usuários com acesso limitado */}
        {!canEdit && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Acesso Limitado</h3>
                  <p className="text-amber-700 text-sm">
                    Você tem acesso de visualização. Algumas funções de edição estão desabilitadas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue={canEdit ? "rooms" : "gallery"} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
            {/* Abas disponíveis para todos */}
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="hero">Banner</TabsTrigger>
            <TabsTrigger value="about">Sobre</TabsTrigger>
            
            {/* Abas disponíveis para editores e admins */}
            {canEditor && (
              <>
                <TabsTrigger value="rooms">Quartos</TabsTrigger>
                <TabsTrigger value="prices">Preços</TabsTrigger>
                <TabsTrigger value="covers">Capas</TabsTrigger>
                <TabsTrigger value="logo">Logo</TabsTrigger>
              </>
            )}
            
            {/* Abas disponíveis apenas para admins */}
            {isAdmin && (
              <TabsTrigger value="permissions" className="bg-blue-50 text-blue-700">Permissões</TabsTrigger>
            )}
          </TabsList>
          
          {/* Conteúdo das abas */}
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

          {/* Abas de edição (apenas para editores e admins) */}
          {canEditor && (
            <>
              <TabsContent value="rooms" className="mt-6"><RoomManager /></TabsContent>
              <TabsContent value="prices" className="mt-6"><PriceManager /></TabsContent>
              <TabsContent value="covers" className="mt-6"><RoomImageManager /></TabsContent>
              <TabsContent value="logo" className="mt-6"><LogoManager /></TabsContent>
            </>
          )}

          {/* Abas de permissão (apenas para admins) */}
          {isAdmin && (
            <TabsContent value="permissions" className="mt-6">
              <PermissionManager />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;