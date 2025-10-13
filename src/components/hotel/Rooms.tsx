import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Room } from "@/types/room";
import { Skeleton } from "@/components/ui/skeleton";

const fetchRooms = async (): Promise<Room[]> => {
  if (!supabase) {
    console.error("Supabase client not initialized.");
    return [];
  }
  const { data, error } = await supabase.from("rooms").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const Rooms = () => {
  const {
    data: rooms,
    isLoading,
    isError,
  } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: fetchRooms,
    enabled: !!supabase,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <div className="flex flex-wrap gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching rooms.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms?.map((room) => {
        const details = room.details 
          ? Object.values(room.details).filter((value): value is string => typeof value === 'string' && value.trim() !== '') 
          : [];
        const description = room.custom_description || room.description || "No description available.";

        return (
          <Card key={room.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="text-sm text-muted-foreground mb-4 flex-grow">
                {description}
              </p>
              <div className="mt-auto">
                {details.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {details.slice(0, 9).map((detail, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="text-xs"
                      >
                        {detail}
                      </Badge>
                    ))}
                  </div>
                )}
                {room.booking_url && (
                  <Button asChild className="w-full">
                    <a href={room.booking_url} target="_blank" rel="noopener noreferrer">
                      Book Now
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Rooms;