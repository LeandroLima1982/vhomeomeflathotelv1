import ImageManager from "@/components/admin/ImageManager";

const Admin = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Gerenciamento de Imagens</h1>
        <p className="text-gray-600 mb-8">
          Faça o upload, visualize e exclua as imagens da galeria do site. As alterações serão refletidas na página inicial.
        </p>
        <ImageManager />
      </div>
    </div>
  );
};

export default Admin;