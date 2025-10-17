"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

import Header from "@/components/hotel/Header";
import SimpleFooter from "@/components/hotel/SimpleFooter"; // Importando o rodapé simplificado
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabaseClient";
import { showError, showSuccess, showLoading, dismissToast } from "@/utils/toast";
import { BedDouble, Calendar, Users, Tag, Loader2, PartyPopper, ArrowLeft } from "lucide-react";
import DetailIcon from '@/components/hotel/DetailIcon'; // Importando o DetailIcon

const formSchema = z.object({
  nome: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  sobrenome: z.string().min(2, { message: "O sobrenome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  cpf: z.string().regex(/^\d{11}$/, { message: "CPF inválido. Digite 11 números, sem pontos ou traços." }),
  telefone: z.string().min(10, { message: "Telefone inválido. Inclua o DDD." }),
});

// Interface para o objeto 'room' que vem do estado da localização
interface RoomResult {
  idQuarto: number;
  apiRoomId: number; // ID original da API
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

const Checkout = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { room, searchParams } = location.state as { room: RoomResult, searchParams: SearchParams } || {};

  useEffect(() => {
    if (!room || !searchParams) {
      showError("Detalhes da reserva não encontrados. Por favor, inicie uma nova busca.");
      navigate('/booking-v2');
    }
    // Garante que o estado de sucesso seja redefinido ao carregar ou alterar os detalhes da reserva
    setReservationSuccess(false); 
  }, [room, searchParams, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      sobrenome: "",
      email: "",
      cpf: "",
      telefone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const toastId = showLoading("Processando sua reserva...");

    const reservationPayload = {
      checkin: searchParams.checkin,
      checkout: searchParams.checkout,
      adults: searchParams.adults,
      idQuarto: room.apiRoomId, // REVERTIDO: Enviando o ID original da API externa
      valorTotal: room.valorTotal,
      ...values,
    };

    try {
      const { error } = await supabase.functions.invoke('create-reservation', {
        body: reservationPayload,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      dismissToast(toastId);
      showSuccess("Reserva confirmada com sucesso!");
      setReservationSuccess(true);

    } catch (e: any) {
      dismissToast(toastId);
      console.error("Erro ao criar reserva:", e);
      showError(e.message || "Não foi possível completar a reserva. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!room || !searchParams) {
    return null; // Evita renderizar antes do redirecionamento
  }

  const formatDate = (dateStr: string) => {
    const date = parse(dateStr, "yyyyMMdd", new Date());
    return format(date, "dd 'de' LLLL 'de' yyyy", { locale: ptBR });
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(room.valorTotal);

  // Função para obter os detalhes do quarto com base na ordem
  const getRoomDetails = (roomData: RoomResult) => {
    if (!roomData.details || typeof roomData.details !== 'object') return [];
  
    const detailsObject = roomData.details;
  
    const validKeys = Object.keys(detailsObject).filter(key => {
      const value = detailsObject[key];
      return value && typeof value === 'string' && value.trim() !== '' && key !== 'description';
    });
  
    if (roomData.details_order && Array.isArray(roomData.details_order)) {
      const orderedDetails = roomData.details_order
        .map(key => {
          if (validKeys.includes(key)) {
            return detailsObject[key];
          }
          return null;
        })
        .filter((value): value is string => value !== null);
      
      const unorderedKeys = validKeys.filter(key => !roomData.details_order.includes(key));
      const unorderedDetails = unorderedKeys.map(key => detailsObject[key] as string);
  
      return [...orderedDetails, ...unorderedDetails].slice(0, 9); // Limita a 9 detalhes para não sobrecarregar
    }
  
    return validKeys.map(key => detailsObject[key] as string).slice(0, 9);
  };

  const roomDetails = getRoomDetails(room);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="pb-20 flex-grow min-h-[600px]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto pt-24">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">Finalizar Reserva</h1>
            <p className="text-gray-600 text-center mb-12">
              Confira os detalhes e preencha suas informações para confirmar a estadia.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Coluna de Resumo */}
              <div className="lg:col-span-2">
                <Card className="sticky top-28 shadow-lg">
                  <CardHeader>
                    <CardTitle>Resumo da Reserva</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                      {room.imageUrl ? (
                        <img src={room.imageUrl} alt={room.nomeQuarto} className="w-full h-full object-cover" />
                      ) : (
                        <BedDouble className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    {room.special_name && (
                      <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md mb-2">
                        {room.special_name}
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">{room.nomeQuarto}</h3>
                    <Separator />
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="font-medium flex items-center gap-2"><Calendar className="w-4 h-4" /> Check-in:</span>
                        <span>{formatDate(searchParams.checkin)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium flex items-center gap-2"><Calendar className="w-4 h-4" /> Check-out:</span>
                        <span>{formatDate(searchParams.checkout)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium flex items-center gap-2"><Users className="w-4 h-4" /> Hóspedes:</span>
                        <span>{searchParams.adults}</span>
                      </div>
                    </div>
                    
                    {roomDetails.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-800 text-base">Características do Quarto:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            {roomDetails.map((detail, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <DetailIcon detailText={detail} />
                                <span>{detail}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    <Separator />
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-4">
                    <div className="w-full flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-700">Total:</span>
                      <span className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                        <Tag className="w-5 h-5 mr-2 opacity-70" />
                        {formattedPrice}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Coluna do Formulário */}
              <div className="lg:col-span-3">
                {reservationSuccess ? (
                  <Card className="text-center p-8 shadow-lg bg-green-50 border-green-200">
                    <PartyPopper className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-800 mb-2">Reserva Confirmada!</h2>
                    <p className="text-gray-700 mb-6">
                      Sua reserva foi realizada com sucesso. Enviamos um e-mail com todos os detalhes.
                    </p>
                    <Button asChild>
                      <Link to="/">Voltar para a Página Inicial</Link>
                    </Button>
                  </Card>
                ) : (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Informações do Hóspede</CardTitle>
                      <CardDescription>Preencha os campos abaixo para continuar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField control={form.control} name="nome" render={({ field }) => (
                              <FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Seu nome" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="sobrenome" render={({ field }) => (
                              <FormItem><FormLabel>Sobrenome</FormLabel><FormControl><Input placeholder="Seu sobrenome" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                          )} />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField control={form.control} name="cpf" render={({ field }) => (
                              <FormItem><FormLabel>CPF</FormLabel><FormControl><Input placeholder="Apenas números" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="telefone" render={({ field }) => (
                              <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input placeholder="(DDD) 99999-9999" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>
                          <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Confirmando..." : "Confirmar Reserva"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                    <CardFooter>
                      <Button variant="link" asChild className="text-gray-600">
                        <Link to="/booking-v2"><ArrowLeft className="w-4 h-4 mr-2" />Voltar para a busca</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SimpleFooter /> {/* Usando o SimpleFooter aqui */}
    </div>
  );
};

export default Checkout;