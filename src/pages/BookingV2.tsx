// Mesclar dados da API externa com dados locais do Supabase
      const mergedResults = data.map((apiRoom: any) => {
        // Encontrar o quarto local correspondente pelo api_category_id
        const localRoom = localRoomsData?.find(lr => lr.api_category_id === apiRoom.idQuarto);
        return {
          ...apiRoom,
          idQuarto: localRoom?.id || apiRoom.idQuarto, // Usar ID do Supabase se disponível
          apiRoomId: apiRoom.idQuarto, // Manter o ID original da API para links externos
          imageUrl: localRoom?.imageUrl || null,
          details: localRoom?.details || null,
          details_order: localRoom?.details_order || null,
          special_name: localRoom?.special_name || null,
        };
      });

      // Filtrar apenas os quartos que têm correspondência no Supabase (api_category_id configurado)
      const pricedAndImagedResults = mergedResults.filter((room: AvailabilityResult) => {
        const localRoom = localRoomsData?.find(lr => lr.api_category_id === room.apiRoomId);
        return localRoom !== undefined;
      });