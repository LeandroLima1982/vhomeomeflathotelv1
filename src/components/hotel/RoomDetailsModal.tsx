import React from 'react';
import Logo from './Logo';

const RoomDetailsModal = ({ isOpen, onClose, room }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Logo à esquerda com fundo elegante apenas em telas maiores */}
            <div className="flex-shrink-0 md:bg-white/90 md:backdrop-blur-sm md:rounded-xl md:p-2 md:shadow-lg md:border md:border-white/20">
              <Logo isScrolled={false} isModal={true} />
            </div>
            
            {/* Conteúdo do quarto */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{room.name}</h2>
              {room.special_name && <p className="text-lg text-gray-600 mb-2">{room.special_name}</p>}
              <p className="text-gray-700 mb-4">{room.description || room.custom_description}</p>
              
              {room.details && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Detalhes</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {Object.entries(room.details).map(([key, value]) => (
                      <li key={key}>{key}: {value}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {room.additional_features && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Recursos Adicionais</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {Object.entries(room.additional_features).map(([key, value]) => (
                      <li key={key}>{key}: {value}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {room.booking_url && (
                <a 
                  href={room.booking_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Reservar Agora
                </a>
              )}
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;