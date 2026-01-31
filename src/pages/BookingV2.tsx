// Mesclar dados da API com dados locais usando mapeamento direto: api_category_id === idQuarto da API
      const mergedResults = data.map((apiRoom: any) => {
        const localRoom = localRoomsData?.find(lr => lr.api_category_id === apiRoom.idQuarto);
        return {
          ...apiRoom,
          idQuarto: localRoom ? localRoom.id : apiRoom.idQuarto, // Usa o ID do Supabase se encontrado, senão o da API
          nomeQuarto: localRoom?.name || apiRoom.nomeQuarto, // Usa o nome do Supabase se disponível, senão o da API
          apiRoomId: apiRoom.idQuarto, // Mantém o ID original da API para reserva
          api_category_id: apiRoom.idQuarto, // O api_category_id é o idQuarto original da API
          imageUrl: localRoom ? coverImageMap.get(localRoom.id) || null : null, // Busca imagem baseada no ID do Supabase
          details: localRoom?.details || null,
          details_order: localRoom?.details_order || null,
          special_name: localRoom?.special_name || null,
        };
      });