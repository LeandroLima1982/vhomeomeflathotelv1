"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

import Header from "@/components/hotel/Header";
import SimpleFooter from "@/components/hotel/SimpleFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabaseClient";
import { showError, showSuccess, showLoading, dismissToast } from "@/utils/toast";
import { BedDouble, Calendar, Users, Tag, Loader2, PartyPopper, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import DetailIcon from '@/components/hotel/DetailIcon';
import InputMask from 'react-input-mask';
import { nameSchema, emailSchema, cpfSchema, phoneSchema, companionSchema } from '@/utils/validation';

// Interface para o objeto 'room' que vem do estado da localização (sem mapeamento local)
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

// Esquema de validação atualizado
const formSchema = z.object({
  nome: nameSchema,
  sobrenome: nameSchema,
  email: emailSchema,
  cpf: cpfSchema,
  telefone: phoneSchema,
  companionNames: companionSchema.optional(),
});

const DirectCheckout = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { room, searchParams } = location.state as { room: RoomResult, searchParams: SearchParams } || {};

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validação em tempo real
    defaultValues: {
      nome: "",
      sobrenome: "",
      email: "",
      cpf: "",
      telefone: "",
      companionNames: Array.from({ length: Math.max(0, (searchParams?.adults || 1) - 1) }).map(() => ""),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "companionNames",
  });

  const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>({
    nome: false,
    sobrenome: false,
    email: false,
    cpf: false,
    telefone: false,
    ...Array.from({ length: Math.max(0, (searchParams?.adults || 1) - 1) }).reduce((acc, _, i) => ({ ...acc, [`companionNames.${i}`]: false }), {}),
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!room || !searchParams) {
      showError("Detalhes da reserva não encontrados. Por favor, inicie uma nova busca.");
      navigate('/direct-booking');
    }
  }, [room, searchParams, navigate]);

  // Atualiza os defaultValues de companionNames quando searchParams.adults muda
  useEffect(() => {
    if (searchParams) {
      const companionCount = Math.max(0, searchParams.adults - 1);
      form.reset({
        ...form.getValues(),
        companionNames: Array.from({ length: companionCount }).map(() => ""),
      });
      setFieldValidity(prev => ({
        ...prev,
        ...Array.from({ length: companionCount }).reduce((acc, _, i) => ({ ...acc, [`companionNames.${i}`]: false }), {}),
      }));
    }
  }, [searchParams?.adults, form]);

  // Atualiza progresso baseado em campos válidos
  useEffect(() => {
    const totalFields = Object.keys(fieldValidity).length;
    const validFields = Object.values(fieldValidity).filter(Boolean).length;
    setProgress((validFields / totalFields) * 100);
  }, [fieldValidity]);

  // Função para atualizar validade do campo
  const updateFieldValidity = useCallback((fieldName: string, isValid: boolean) => {
    setFieldValidity(prev => ({ ...prev, [fieldName]: isValid }));
  }, []);

  // Função para determinar a máscara do telefone baseada no valor
  const getPhoneMask = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length <= 10 ? "(99) 9999-9999" : "(99) 99999-9999";
  };

  // Verifica se todos os campos obrigatórios são válidos (removida condição de touched para ativar botão mais cedo)
  const numberOfCompanions = Math.max(0, searchParams?.adults - 1 || 0);
  const requiredFields = ['nome', 'sobrenome', 'email', 'cpf', 'telefone'];
  if (numberOfCompanions > 0) {
    for (let i = 0; i < numberOfCompanions; i++) {
      requiredFields.push(`companionNames.${i}`);
    }
  }
  const allFieldsValid = requiredFields.every(field => !form.formState.errors[field]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const toastId = showLoading("Processando sua reserva...");

    const expectedCompanions = Math.max(0, (searchParams?.adults || 1) - 1);
    if ((values.companionNames?.length || 0) !== expectedCompanions) {
      form.setError("companionNames", {
        type: "manual",
        message: "Por favor, preencha o nome de todos os acompanhantes.",
      });
      dismissToast(toastId);
      setIsSubmitting(false);
      return;
    }

    const reservationPayload = {
      checkin: searchParams.checkin,
      checkout: searchParams.checkout,
      adults: searchParams.adults,
      idQuarto: room.apiRoomId,
      valorTotal: room.valorTotal,
      nome: values.nome,
      sobrenome: values.sobrenome,
      email: values.email,
      cpf: values.cpf,
      telefone: values.telefone,
      companionNames: values.companionNames,
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
      console.error("Erro ao criar reserva no Fluxo Direto:", e);
      showError(e.message || "Não foi possível completar a reserva. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!room || !searchParams) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    const date = parse(dateStr, "yyyyMMdd", new Date());
    return format(date, "dd 'de' LLLL 'de' yyyy", { locale: ptBR });
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(room.valorTotal);

  const roomDetails: string[] = [];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="pb-20 flex-grow min-h-[600px]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto pt-24">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">Finalizar Reserva Direta</h1>
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
                      <BedDouble className="h-12 w-12 text-gray-400" />
                    </div>
                    {room.special_name && (
                      <div className="inline-block mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md mb-2">
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
                    
                    <Separator />
                    <p className="text-xs text-gray-500 italic">Cancelamento gratuito até 24h antes do check-in.</p>
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
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progresso do Formulário</span>
                          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <TooltipProvider>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Seção 1: Dados Pessoais */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-gray-800">1/3 Dados Pessoais</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="nome" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome *</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Input 
                                              placeholder="Seu nome" 
                                              {...field} 
                                              onChange={(e) => { field.onChange(e); updateFieldValidity('nome', !form.formState.errors.nome); }}
                                              onBlur={(e) => { field.onBlur(); updateFieldValidity('nome', !form.formState.errors.nome); }}
                                              aria-describedby="error-nome"
                                            />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Seu nome completo como consta no documento de identidade.</p>
                                          </TooltipContent>
                                        </Tooltip>
                                        {form.formState.touchedFields.nome && (
                                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {fieldValidity.nome ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                          </div>
                                        )}
                                      </div>
                                    </FormControl>
                                    <FormMessage role="alert" />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="sobrenome" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Sobrenome *</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Input 
                                              placeholder="Seu sobrenome" 
                                              {...field} 
                                              onChange={(e) => { field.onChange(e); updateFieldValidity('sobrenome', !form.formState.errors.sobrenome); }}
                                              onBlur={(e) => { field.onBlur(); updateFieldValidity('sobrenome', !form.formState.errors.sobrenome); }}
                                              aria-describedby="error-sobrenome"
                                            />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Seu sobrenome completo como consta no documento de identidade.</p>
                                          </TooltipContent>
                                        </Tooltip>
                                        {form.formState.touchedFields.sobrenome && (
                                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {fieldValidity.sobrenome ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                          </div>
                                        )}
                                      </div>
                                    </FormControl>
                                    <FormMessage role="alert" />
                                  </FormItem>
                                )} />
                              </div>
                            </div>

                            {/* Seção 2: Contato */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-gray-800">2/3 Contato</h3>
                              <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>E-mail *</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Input 
                                            type="email" 
                                            placeholder="seu@email.com" 
                                            {...field} 
                                            onChange={(e) => { field.onChange(e); updateFieldValidity('email', !form.formState.errors.email); }}
                                            onBlur={(e) => { field.onBlur(); updateFieldValidity('email', !form.formState.errors.email); }}
                                            aria-describedby="error-email"
                                          />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Endereço de e-mail para confirmação da reserva e comunicações.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      {form.formState.touchedFields.email && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                          {fieldValidity.email ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                        </div>
                                      )}
                                    </div>
                                  </FormControl>
                                  <FormMessage role="alert" />
                                </FormItem>
                              )} />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="cpf" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>CPF *</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <InputMask
                                              mask="999.999.999-99"
                                              value={field.value}
                                              onChange={(e) => { field.onChange(e); updateFieldValidity('cpf', !form.formState.errors.cpf); }}
                                              onBlur={(e) => { field.onBlur(); updateFieldValidity('cpf', !form.formState.errors.cpf); }}
                                            >
                                              {(inputProps: any) => <Input placeholder="123.456.789-01" {...inputProps} aria-describedby="error-cpf" />}
                                            </InputMask>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Número de identificação usado para a reserva e check-in.</p>
                                          </TooltipContent>
                                        </Tooltip>
                                        {form.formState.touchedFields.cpf && (
                                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {fieldValidity.cpf ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                          </div>
                                        )}
                                      </div>
                                    </FormControl>
                                    <FormMessage role="alert" />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="telefone" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Telefone *</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <InputMask
                                              mask={getPhoneMask(field.value)}
                                              value={field.value}
                                              onChange={(e) => { field.onChange(e); updateFieldValidity('telefone', !form.formState.errors.telefone); }}
                                              onBlur={(e) => { field.onBlur(); updateFieldValidity('telefone', !form.formState.errors.telefone); }}
                                            >
                                              {(inputProps: any) => <Input placeholder="(21) 98765-4321" {...inputProps} aria-describedby="error-telefone" />}
                                            </InputMask>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Telefone para contato em caso de emergências ou confirmações.</p>
                                          </TooltipContent>
                                        </Tooltip>
                                        {form.formState.touchedFields.telefone && (
                                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {fieldValidity.telefone ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                          </div>
                                        )}
                                      </div>
                                    </FormControl>
                                    <FormMessage role="alert" />
                                  </FormItem>
                                )} />
                              </div>
                            </div>

                            {/* Seção 3: Acompanhantes */}
                            {numberOfCompanions > 0 && (
                              <div className="space-y-4 pt-4 border-t mt-6">
                                <h3 className="text-lg font-semibold text-gray-800">3/3 Hóspedes Acompanhantes</h3>
                                <p className="text-sm text-gray-600">Por favor, preencha o nome completo de cada acompanhante.</p>
                                {fields.map((field, index) => (
                                  <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={`companionNames.${index}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <div className="relative">
                                            <Input 
                                              placeholder={`Nome completo do acompanhante ${index + 1}`} 
                                              {...field} 
                                              onChange={(e) => { field.onChange(e); updateFieldValidity(`companionNames.${index}`, !form.formState.errors.companionNames?.[index]); }}
                                              onBlur={(e) => { field.onBlur(); updateFieldValidity(`companionNames.${index}`, !form.formState.errors.companionNames?.[index]); }}
                                              aria-describedby={`error-companion-${index}`}
                                            />
                                            {form.formState.touchedFields[`companionNames.${index}`] && (
                                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {fieldValidity[`companionNames.${index}`] ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                              </div>
                                            )}
                                          </div>
                                        </FormControl>
                                        <FormMessage role="alert" />
                                      </FormItem>
                                    )}
                                  />
                                ))}
                                <FormMessage>{form.formState.errors.companionNames?.message}</FormMessage>
                              </div>
                            )}

                            {!allFieldsValid && (
                              <p className="text-sm text-red-500">Preencha todos os campos obrigatórios para continuar.</p>
                            )}

                            <p className="text-xs text-gray-500 mt-4">Seus dados são protegidos conforme nossa <Link to="/politica-privacidade" className="underline">política de privacidade</Link>.</p>

                            <Button type="submit" className="w-full" disabled={isSubmitting || !allFieldsValid}>
                              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              {isSubmitting ? "Confirmando..." : "Confirmar Reserva"}
                            </Button>
                          </form>
                        </Form>
                      </TooltipProvider>
                    </CardContent>
                    <CardFooter>
                      <Button variant="link" asChild className="text-gray-600">
                        <Link to="/direct-booking"><ArrowLeft className="w-4 h-4 mr-2" />Voltar para a busca</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default DirectCheckout;