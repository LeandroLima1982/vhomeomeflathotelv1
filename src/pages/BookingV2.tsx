const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setRawResults(null);
    setError(null);
    setSearchParams(params);

    if (!supabase) {
      const errorMessage = "Cliente Supabase não está disponível. Verifique a configuração.";
      setError(errorMessage);
      showError(errorMessage);
      setIsLoading(false);
      return;
    }

    try {
      console.log('[BookingV2] Iniciando busca de disponibilidade com parâmetros:', params);

      const { data, error: functionError } = await supabase.functions.invoke('get-availability', {
        body: params,
      });

      if (functionError) {
        const errorDetails = await functionError.context.json();
        if (errorDetails && errorDetails.error) throw new Error(errorDetails.error);
        throw new Error(functionError.message || "Erro na comunicação com a função.");
      }

      if (data.error) throw new Error(data.error);

      console.log('[BookingV2] Dados recebidos da API:', data);
      console.log('[BookingV2] Número de quartos retornados pela API:', data.length);

      // Buscar dados locais dos quartos para mesclar com os resultados da API
      const { data: localRoomsData, error: localError } = await supabase
        .from('rooms')
        .select('id, name, special_name, imageUrl, details, details_order, api_category_id');

      if (localError) {
        console.warn("Erro ao buscar dados locais dos quartos:", localError);
      }

      console.log('[BookingV2] Dados locais dos quartos:', localRoomsData);
      console.log('[BookingV2] Número de quartos locais:', localRoomsData?.length || 0);

      // MODIFICAÇÃO: Em vez de filtrar apenas quartos locais configurados,
      // vamos mostrar TODOS os quartos da API disponíveis
      const mergedResults = data.map((apiRoom: any) => {
        // Tentar encontrar correspondência local
        const localRoom = localRoomsData?.find(lr => lr.api_category_id === apiRoom.idQuarto);

        console.log(`[BookingV2] Processando quarto API ${apiRoom.idQuarto}:`, {
          apiRoom,
          localRoom: localRoom || 'não encontrado'
        });

        if (localRoom) {
          // Se encontrou correspondência local, usar dados locais
          return {
            ...apiRoom,
            idQuarto: localRoom.id, // Usar ID do Supabase
            apiRoomId: apiRoom.idQuarto, // Manter o ID original da API para links externos
            imageUrl: localRoom.imageUrl || null,
            details: localRoom.details || null,
            details_order: localRoom.details_order || null,
            special_name: localRoom.special_name || null,
          };
        } else {
          // Se NÃO encontrou correspondência local, ainda assim mostrar o quarto da API
          // com dados padrão
          console.log(`[BookingV2] Quarto API ${apiRoom.idQuarto} não tem correspondência local, usando dados padrão`);
          return {
            ...apiRoom,
            idQuarto: apiRoom.idQuarto, // Usar ID da API como ID do Supabase
            apiRoomId: apiRoom.idQuarto, // Manter o ID original da API para links externos
            imageUrl: null, // Sem imagem local
            details: null, // Sem detalhes locais
            details_order: null, // Sem ordem de detalhes
            special_name: null, // Sem nome especial
          };
        }
      });

      console.log('[BookingV2] Resultados mesclados finais:', mergedResults);
      console.log('[BookingV2] Número de quartos mesclados:', mergedResults.length);

      // Filtrar apenas quartos com disponibilidade > 0 E valorTotal > 0
      const availableResults = mergedResults.filter(room => room.disponibilidade > 0 && room.valorTotal > 0);

      console.log('[BookingV2] Quartos disponíveis (disponibilidade > 0 E valorTotal > 0):', availableResults);
      console.log('[BookingV2] Número de quartos disponíveis:', availableResults.length);

      setRawResults(availableResults);

    } catch (e: any) {
      console.error("Erro ao buscar disponibilidade:", e);
      const errorMessage = e.message || "Ocorreu um erro ao buscar a disponibilidade. Tente novamente.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };