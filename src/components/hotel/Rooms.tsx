import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Room {
  id: number;
  name: string;
  special_name: string | null;
  booking_url: string | null;
  details: Record<string, string | null>;
  description: string | null;
  custom_description: string | null;
  additional_features: any;
}

interface RoomsProps {
  rooms?: Room[];
}

export default function Rooms({ rooms = [] }: RoomsProps) {
  console.log("Rooms component rendering with:", rooms);

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma acomodação disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        // Extrair detalhes do objeto details
        const detailsObj = room.details || {};
        const detailsArray = Object.entries(detailsObj)
          .filter(([key, value]) => value && key !== 'description')
          .map(([_, value]) => value as string);
        
        // Processar additional_features
        let additionalFeaturesArray: string[] = [];
        if (room.additional_features && Array.isArray(room.additional_features)) {
          // Se for um array de categorias com items
          additionalFeaturesArray = room.additional_features.flatMap((category: any) => {
            if (category.items && Array.isArray(category.items)) {
              return category.items.map((item: any) => item.text || item);
            }
            return [];
          });
        }
        
        const allTags = [...detailsArray, ...additionalFeaturesArray];
        
        return (
          <Card key={room.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
              {room.special_name && (
                <CardDescription className="text-primary font-semibold">
                  {room.special_name}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {(room.custom_description || room.description) && (
                <p className="text-sm text-muted-foreground mb-4">
                  {room.custom_description || room.description}
                </p>
              )}
              
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {allTags.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {room.booking_url && (
                <Button 
                  className="mt-auto w-full"
                  onClick={() => window.open(room.booking_url!, '_blank')}
                >
                  Reservar
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}