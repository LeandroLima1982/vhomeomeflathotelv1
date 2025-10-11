import ImageManager from "@/components/admin/ImageManager";
import LogoManager from "@/components/admin/LogoManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Gerenciamento de Conteúdo</h1>
        <p className="text-gray-600 mb-8">
          Use as abas abaixo para gerenciar as imagens de cada seção do site.
        </p>
        
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gallery">Galeria Principal</TabsTrigger>
            <TabsTrigger value="hero">Banner Principal (Hero)</TabsTrigger>
            <TabsTrigger value="about">Seção "Sobre"</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
          </TabsList>
          <TabsContent value="gallery" className="mt-6">
            <ImageManager 
              folder="main"
              title="Galeria Principal"
              description="Estas imagens aparecem na seção 'Conheça Nossos Ambientes'. O ideal é ter 9 imagens."
            />
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
          <TabsContent value="logo" className="mt-6">
            <LogoManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;