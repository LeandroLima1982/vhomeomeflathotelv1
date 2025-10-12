"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Room {
  id: string;
  name: string;
  description?: string;
  // outros campos
}

interface RoomDetailsModalProps {
  room: Room | null;
  onClose: () => void;
  isAdmin?: boolean;
}

const RoomDetailsModal = ({ room, onClose, isAdmin = false }: RoomDetailsModalProps) => {
  const [description, setDescription] = useState(room?.description || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!room) return null;

  return (
    <Dialog open={!!room} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-gray-800">{room.name}</DialogTitle>
        </DialogHeader>
        <div className="p-6 pb-0">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows={4}
              />
            ) : (
              <p className="mt-1 text-gray-600">{description || 'Nenhuma descrição disponível.'}</p>
            )}
            {isAdmin && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditing ? 'Salvar' : 'Editar'}
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {/* conteúdo existente do modal, como imagens ou outros detalhes */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;