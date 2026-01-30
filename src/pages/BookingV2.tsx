const mergedResults = data.map((apiRoom: any) => {
        // Mapeamento personalizado para quartos com offset +4 (API IDs 12 e 13)
        const apiToSupabaseMapping = { 12: 8, 13: 9 };
        // TESTE: Para o quarto id 3, não aplicar a regra -3
        const adjustedRoomId = apiToSupabaseMapping[apiRoom.idQuarto] || 
          (apiRoom.idQuarto === 6 ? 3 : (apiRoom.idQuarto - 3)); // API id 6 -> Supabase id 3
        const localRoom = localRoomsData.find(lr => lr.id === adjustedRoomId);
        return {
          ...apiRoom,
          idQuarto: adjustedRoomId,
          apiRoomId: apiRoom.idQuarto,
          imageUrl: localRoom?.imageUrl || null,
          details: localRoom?.details || null,
          details_order: localRoom?.details_order || null,
          special_name: localRoom?.special_name || null,
        };
      });