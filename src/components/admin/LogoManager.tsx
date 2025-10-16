"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Loader2 } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

const BUCKET_NAME = 'gallery';
const LOGO_PATH = 'logo/logo.png'; // Caminho fixo para o logo

export default function LogoManager() {
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchCurrentLogo = async () => {
    setLoading(true);
    // Verifica se o arquivo de logo existe
    const { data: listData } = await supabase.storage.from(BUCKET_NAME).list('logo', {
        search: 'logo.png'
    });

    if (listData && listData.length > 0) {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(LOGO_PATH);
        // Adiciona um timestamp para evitar problemas de cache do navegador
        setCurrentLogoUrl(`${data.publicUrl}?t=${new Date().getTime()}`);
    } else {
        setCurrentLogoUrl(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCurrentLogo();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError('Por favor, selecione um arquivo primeiro.');
      return;
    }

    setUploading(true);
    const toastId = showLoading('Enviando novo logo...');
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(LOGO_PATH, selectedFile, {
        cacheControl: '3600',
        upsert: true, // Isso irá sobrescrever o arquivo se ele já existir
      });

    dismissToast(toastId);
    setUploading(false);

    if (error) {
      showError(`Falha no upload: ${error.message}`);
      console.error('Error uploading logo:', error);
    } else {
      showSuccess('Logo atualizado com sucesso!');
      setSelectedFile(null);
      setPreviewUrl(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchCurrentLogo(); // Atualiza a exibição do logo atual
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciador de Logo</CardTitle>
        <CardDescription>
          Faça o upload de uma nova imagem para o logo. A imagem será usada tanto no cabeçalho quanto no rodapé. O arquivo anterior será substituído.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Logo Atual</h3>
            <div className="border rounded-lg p-4 h-48 flex items-center justify-center bg-gray-50">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : currentLogoUrl ? (
                <img src={currentLogoUrl} alt="Logo Atual" className="max-h-full max-w-full" />
              ) : (
                <p className="text-gray-500">Nenhum logo definido.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Novo Logo</h3>
            <div className="space-y-4">
              <Input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleFileChange} />
              {previewUrl && (
                <div className="border rounded-lg p-4 h-48 flex items-center justify-center bg-gray-50">
                  <img src={previewUrl} alt="Pré-visualização do novo logo" className="max-h-full max-w-full" />
                </div>
              )}
              <Button onClick={handleUpload} disabled={uploading || !selectedFile} className="w-full">
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Salvar Novo Logo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}