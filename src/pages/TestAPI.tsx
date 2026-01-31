"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/hotel/Header";
import SimpleFooter from "@/components/hotel/SimpleFooter";

const TestAPI = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const testAPIConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('test-api-connection');

      if (error) {
        setTestResult({
          success: false,
          error: error.message
        });
      } else {
        setTestResult(data);
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        error: e.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="pb-20 flex-grow min-h-[600px]">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Teste de Conexão com API Externa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Este teste verifica se a conexão com o sistema de reservas externo está funcionando corretamente.
                </p>

                <Button
                  onClick={testAPIConnection}
                  disabled={isTesting}
                  className="w-full"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testando conexão...
                    </>
                  ) : (
                    'Testar Conexão'
                  )}
                </Button>

                {testResult && (
                  <div className={`p-4 rounded-lg border ${
                    testResult.success
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {testResult.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span className="font-semibold">
                        {testResult.success ? 'Sucesso!' : 'Erro'}
                      </span>
                    </div>

                    {testResult.message && (
                      <p className="mb-2">{testResult.message}</p>
                    )}

                    {testResult.error && (
                      <p className="mb-2 font-mono text-sm bg-gray-100 p-2 rounded">
                        {testResult.error}
                      </p>
                    )}

                    {testResult.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">Detalhes técnicos</summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(testResult.details, null, 2)}
                        </pre>
                      </details>
                    )}

                    {testResult.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">Dados da resposta</summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(testResult.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default TestAPI;