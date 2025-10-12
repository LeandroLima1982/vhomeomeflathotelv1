import { X, Bed, Bath, Users, Wifi, Tv, Coffee, Wind, ParkingCircle, UtensilsCrossed, Dumbbell, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const iconMap = {
  'beds': <Bed className="w-4 h-4 mr-2" />,
  'baths': <Bath className="w-4 h-4 mr-2" />,
  'guests': <Users className="w-4 h-4 mr-2" />,
  'wifi': <Wifi className="w-4 h-4 mr-2" />,
  'tv': <Tv className="w-4 h-4 mr-2" />,
  'coffee_maker': <Coffee className="w-4 h-4 mr-2" />,
  'ac': <Wind className="w-4 h-4 mr-2" />,
  'parking': <ParkingCircle className="w-4 h-4 mr-2" />,
  'restaurant': <UtensilsCrossed className="w-4 h-4 mr-2" />,
  'gym': <Dumbbell className="w-4 h-4 mr-2" />,
  'pool': <Waves className="w-4 h-4 mr-2" />,
};

const renderDetails = (details) => {
  if (!details) return null;
  return Object.entries(details)
    .filter(([key]) => key !== 'images' && key !== 'description')
    .map(([key, value]) => {
      if (value === null || value === undefined) return null;
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const icon = iconMap[key] || null;
      return (
        <Badge key={key} variant="outline" className="flex items-center text-sm text-gray-700 py-1 px-3">
          {icon}
          <span>{label}: {String(value)}</span>
        </Badge>
      );
    });
};

const RoomDetailsModal = ({ room, onClose }) => {
  if (!room) return null;

  const images = room.details?.images || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{room.name}</h2>
            {room.special_name && <p className="text-sm text-indigo-600">{room.special_name}</p>}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/2 h-64 md:h-full bg-gray-100">
            {images.length > 0 ? (
              <Carousel className="w-full h-full">
                <CarouselContent className="h-full">
                  {images.map((img, index) => (
                    <CarouselItem key={index} className="h-full">
                      <div className="p-1 h-full">
                        <img src={img} alt={`${room.name} view ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col overflow-y-auto w-full md:w-1/2">
            <div className="flex-grow">
              <p className="text-gray-600 mb-4">{room.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {renderDetails(room.details)}
              </div>
            </div>
            <div className="mt-auto pt-6 border-t">
              {room.booking_url ? (
                <a href={room.booking_url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Book Now
                  </Button>
                </a>
              ) : (
                <Button className="w-full" disabled>
                  Booking Not Available
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;