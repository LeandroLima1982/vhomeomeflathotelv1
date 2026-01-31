// Buscar dados locais dos quartos para mesclar com os resultados da API
      const { data: localRoomsData, error: localError } = await supabase
        .from('rooms')
        .select('id, name, special_name, imageUrl, details, details_order, api_category_id');

      if (localError) {
        console.warn("Erro ao buscar dados locais dos quartos:", localError);
      }

      // Filtrar apenas os quartos locais que têm api_category_id configurado
      const configuredLocalRooms = localRoomsData?.filter(room => room.api_category_id !== null) || [];

      // Para cada quarto local configurado, encontrar o resultado correspondente da API
      const mergedResults = configuredLocalRooms.map(localRoom => {
        const apiRoom = data.find((api: any) => api.idQuarto === localRoom.api_category_id);
        if (apiRoom) {
          return {
            ...apiRoom,
            idQuarto: localRoom.id, // Usar ID do Supabase
            apiRoomId: apiRoom.idQuarto, // Manter o ID original da API para links externos
            imageUrl: localRoom.imageUrl || null,
            details: localRoom.details || null,
            details_order: localRoom.details_order || null,
            special_name: localRoom.special_name || null,
          };
        }
        // Se não encontrou na API, ainda assim incluir o quarto local (mas sem disponibilidade)
        return {
          idQuarto: localRoom.id,
          apiRoomId: localRoom.api_category_id,
          nomeQuarto: localRoom.name,
          disponibilidade: 0, // Indisponível
          valorTotal: 0,
          imageUrl: localRoom.imageUrl || null,
          details: localRoom.details || null,
          details_order: localRoom.details_order || null,
          special_name: localRoom.special_name || null,
        };
      });

      setRawResults(mergedResults);