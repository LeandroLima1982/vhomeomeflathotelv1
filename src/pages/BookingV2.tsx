// Mapeamento dos resultados da API externa com dados locais
      const mergedResults = data.map((apiRoom: any) => {
        const adjustedRoomId = apiRoom.idQuarto - 3; // CORREÇÃO: Subtraindo 3 para alinhar com IDs do Supabase
        const localRoom = localRoomsData?.find(lr => lr.id === adjustedRoomId);
        return {
          ...apiRoom,
          idQuarto: adjustedRoomId, 
          apiRoomId: apiRoom.idQuarto, // Adicionando o ID original da API para o link de reserva
          imageUrl: localRoom?.imageUrl || null,
          details: localRoom?.details || null,
          details_order: localRoom?.details_order || null,
          special_name: localRoom?.special_name || null,
        };
      });