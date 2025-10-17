import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

import Header from "@/components/hotel/Header";
import SimpleFooter from "@/components/hotel/SimpleFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { showError } from "@/utils/toast";
import { BedDouble, Calendar, Users, Tag, ArrowLeft, ExternalLink } from "lucide-react";
import DetailIcon from '@/components/hotel/DetailIcon';

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

const CheckoutV3 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, searchParams } = location.state as { room: RoomResult, searchParams: SearchParams } || {};

  useEffect(() => {
    if (!room || !searchParams) {
      showError("Detalhes da reserva não encontrados. Por favor, inicie uma nova busca.");
      navigate('/booking-v3');
    }
  }, [room, searchParams, navigate]);

  if (!room || !searchParams) {
    return null;
  }

  const handleRedirectToBookingEngine = () => {
    const baseUrl = "https://vhomeflathotel.motordereservas.com.br/novareserva";
    const url = `${baseUrl}?inicio=${searchParams.checkin}&fim=${searchParams.checkout}&adultos=${searchParams.adults}&idquartoCategoria=${room.apiRoomId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (dateStr: string) => {
    const date = parse(dateStr, "yyyyMMdd", new Date());
    return format(date, "dd 'de' LLLL 'de' yyyy", { locale: ptBR });
  };

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(room.valorTotal);

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
  
      return [...orderedDetails, ...unorderedDetails].slice(0, 9);
    }
  
    return validKeys.map(key => detailsObject[key] as string).slice(0, 9);
  };

  const roomDetails = getRoomDetails(room);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="pb-20 flex-grow min-h-[600px]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto pt-24">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">Confirme sua Seleção</h1>
            <p className="text-gray-600 text-center mb-12">
              Você será redirecionado para nosso parceiro de reservas para finalizar a compra com segurança.
            </p>

            <Card className="shadow-lg">
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
                <h3 className="text-xl font-semibold text-gray-800">{room.nomeQuarto}</h3>
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
                <div className="w-full flex items-center justify-between bg-gray-50 p-4 rounded-md">
                  <span className="text-lg font-medium text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                    <Tag className="w-5 h-5 mr-2 opacity-70" />
                    {formattedPrice}
                  </span>
                </div>
                <Button onClick={handleRedirectToBookingEngine} className="w-full text-lg py-6 bg-blue-700 hover:bg-blue-800">
                  Finalizar Reserva
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
              <CardFooter>
                <Button variant="link" asChild className="text-gray-600">
                  <Link to="/booking-v3"><ArrowLeft className="w-4 h-4 mr-2" />Voltar para a busca</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default CheckoutV3;