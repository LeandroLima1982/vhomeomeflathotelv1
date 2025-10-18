// NO ID ALIGNMENT OR LOCAL IMAGE/DETAIL MAPPING HERE
      const directResults = data.map((apiRoom: any) => {
        // Mapeamento personalizado para quartos com offset -4 (API IDs 7, 12 e 13)
        const apiToSupabaseMapping = { 7: 3, 12: 8, 13: 9 };
        const adjustedRoomId = apiToSupabaseMapping[apiRoom.idQuarto] || (apiRoom.idQuarto - 3); // Usa -4 para IDs 7, 12 e 13, -3 como fallback
        return {
          ...apiRoom,
          idQuarto: adjustedRoomId, // Usar o ID ajustado
          apiRoomId: apiRoom.idQuarto, // Armazena o ID original da API para o checkout
          imageUrl: null, // Não há imagem da API externa no momento
          details: null, // Não há detalhes da API externa no momento
          details_order: null,
          special_name: null,
        };
      });