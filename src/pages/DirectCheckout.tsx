"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, parse, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, CheckCircle, AlertCircle, Calendar, Users, Tag, CreditCard, User, Mail, Phone, FileText } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { showSuccess, showError } from "@/utils/toast";
import Header from "@/components/hotel/Header";
import SimpleFooter from "@/components/hotel/SimpleFooter";
import { nameSchema, emailSchema, cpfSchema, phoneSchema, companionSchema } from "@/utils/validation";
import { z } from "zod";

interface RoomResult {
  idQuarto: number;
  apiRoomId: number;
  nomeQuarto: string;
  disponibilidade: number;
  valorTotal: number;
  imageUrl: string | null;
  details: Record<string, string | null> | null;
  details_order: string[] | null;
  special_name?: string | null;
  [key: string]: any;
}

interface SearchParams {
  checkin: string;
  checkout: string;
  adults: number;
}

interface LocationState {
  room: RoomResult;
  searchParams: SearchParams;
}

const DirectCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    cpf: '',
    telefone: '',
    companionNames: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!state?.room || !state?.searchParams) {
      navigate('/direct-booking');
      return;
    }
  }, [state, navigate]);

  if (!state?.room || !state?.searchParams) {
    return null;
  }

  const { room, searchParams } = state;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(room.valorTotal);

  const checkinDateObj = parse(searchParams.checkin, "yyyyMMdd", new Date());
  const checkoutDateObj = parse(searchParams.checkout, "yyyyMMdd", new Date());
  const numberOfNights = differenceInDays(checkoutDateObj, checkinDateObj);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCompanionChange = (index: number, value: string) => {
    const newCompanions = [...formData.companionNames];
    newCompanions[index] = value;
    setFormData(prev => ({ ...prev, companionNames: newCompanions }));
  };

  const addCompanion = () => {
    setFormData(prev => ({ ...prev, companionNames: [...prev.companionNames, ''] }));
  };

  const removeCompanion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      companionNames: prev.companionNames.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    try {
      nameSchema.parse(formData.nome);
    } catch (e: any) {
      newErrors.nome = e.errors[0].message;
    }

    try {
      nameSchema.parse(formData.sobrenome);
    } catch (e: any) {
      newErrors.sobrenome = e.errors[0].message;
    }

    try {
      emailSchema.parse(formData.email);
    } catch (e: any) {
      newErrors.email = e.errors[0].message;
    }

    try {
      cpfSchema.parse(formData.cpf);
    } catch (e: any) {
      newErrors.cpf = e.errors[0].message;
    }

    try {
      phoneSchema.parse(formData.telefone);
    } catch (e: any) {
      newErrors.telefone = e.errors[0].message;
    }

    try {
      companionSchema.parse(formData.companionNames.filter(name => name.trim() !== ''));
    } catch (e: any) {
      newErrors.companionNames = e.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const reservationPayload = {
        checkin: searchParams.checkin,
        checkout: searchParams.checkout,
        adults: searchParams.adults,
        idQuarto: room.apiRoomId, // Use the original API room ID
        valorTotal: room.valorTotal,
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        companionNames: formData.companionNames.filter(name => name.trim() !== ''),
      };

      const { data, error } = await supabase.functions.invoke('create-reservation', {
        body: reservationPayload,
      });

      if (error) {
        const errorDetails = await error.context.json();
        if (errorDetails && errorDetails.error) throw new Error(errorDetails.error);
        throw new Error(error.message || "Erro na comunicação com o servidor.");
      }

      if (data.error) throw new Error(data.error);

      setReservationData(data);
      setIsSuccess(true);
      showSuccess('Reserva criada com sucesso!');

    } catch (e: any) {
      console.error("Erro ao criar reserva:", e);
      const errorMessage = e.message || "Ocorreu um erro ao processar sua reserva. Tente novamente.";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess && reservationData) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-700">Reserva Confirmada!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-gray-600">
                <p>Sua reserva foi criada com sucesso. Você receberá um e-mail de confirmação em breve.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Acomodação:</span>
                  <span>{room.nomeQuarto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Check-in:</span>
                  <span>{format(checkinDateObj, "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Check-out:</span>
                  <span>{format(checkoutDateObj, "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Hóspedes:</span>
                  <span>{searchParams.adults}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formattedPrice}</span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-500">
                  Em caso de dúvidas, entre em contato conosco pelo telefone (22) 2141-2091 ou e-mail contato@vhomeflathotel.com
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('/')} variant="outline">
                    Voltar ao Início
                  </Button>
                  <Button onClick={() => navigate('/direct-booking')}>
                    Fazer Nova Reserva
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <SimpleFooter />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Finalizar Reserva Direta</h1>
            <p className="text-gray-600 mt-2">Complete suas informações para confirmar a reserva</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reservation Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resumo da Reserva
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        {format(checkinDateObj, "dd/MM", { locale: ptBR })} - {format(checkoutDateObj, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{searchParams.adults} Hóspede{searchParams.adults > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg">{room.nomeQuarto}</h3>
                    {room.special_name && (
                      <Badge variant="secondary" className="mt-1">{room.special_name}</Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>{numberOfNights} diária{numberOfNights > 1 ? 's' : ''}</span>
                      <span>{formattedPrice}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {formattedPrice}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-blue-800 mb-1">Política de Pagamento</p>
                    <p>O pagamento será realizado diretamente no hotel no momento do check-in.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações do Hóspede
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome *</Label>
                        <Input
                          id="nome"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          className={errors.nome ? "border-red-500" : ""}
                        />
                        {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
                      </div>
                      <div>
                        <Label htmlFor="sobrenome">Sobrenome *</Label>
                        <Input
                          id="sobrenome"
                          name="sobrenome"
                          value={formData.sobrenome}
                          onChange={handleInputChange}
                          className={errors.sobrenome ? "border-red-500" : ""}
                        />
                        {errors.sobrenome && <p className="text-red-500 text-sm mt-1">{errors.sobrenome}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          name="cpf"
                          value={formData.cpf}
                          onChange={handleInputChange}
                          placeholder="123.456.789-01"
                          className={errors.cpf ? "border-red-500" : ""}
                        />
                        {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
                      </div>
                      <div>
                        <Label htmlFor="telefone">Telefone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleInputChange}
                            placeholder="(21) 99999-9999"
                            className={`pl-10 ${errors.telefone ? "border-red-500" : ""}`}
                          />
                        </div>
                        {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
                      </div>
                    </div>

                    {/* Companions */}
                    {searchParams.adults > 1 && (
                      <div>
                        <Label>Nomes dos Acompanhantes</Label>
                        <div className="space-y-2">
                          {formData.companionNames.map((name, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={name}
                                onChange={(e) => handleCompanionChange(index, e.target.value)}
                                placeholder={`Nome do acompanhante ${index + 1}`}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeCompanion(index)}
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {formData.companionNames.length < searchParams.adults - 1 && (
                            <Button type="button" variant="outline" onClick={addCompanion}>
                              + Adicionar Acompanhante
                            </Button>
                          )}
                        </div>
                        {errors.companionNames && <p className="text-red-500 text-sm mt-1">{errors.companionNames}</p>}
                      </div>
                    )}

                    <Separator />

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Política de Reserva</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• O pagamento será realizado no hotel no momento do check-in</li>
                        <li>• Cancelamento gratuito até 24 horas antes do check-in</li>
                        <li>• Check-in: 14:00 | Check-out: 12:00</li>
                      </ul>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando Reserva...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Confirmar Reserva
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default DirectCheckout;