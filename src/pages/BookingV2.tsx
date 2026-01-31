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

      // Filtrar apenas os quartos locais que têm api_category_id configurado
      const configuredLocalRooms = localRoomsData?.filter(room => room.api_category_id !== null) || [];

      console.log('[BookingV2] Quartos locais configurados (com api_category_id):', configuredLocalRooms);
      console.log('[BookingV2] Número de quartos locais configurados:', configuredLocalRooms.length);

      if (configuredLocalRooms.length === 0) {
        console.warn('[BookingV2] Nenhum quarto local tem api_category_id configurado!');
        setRawResults([]);
        return;
      }

      // Para cada quarto local configurado, encontrar o resultado correspondente da API
      const mergedResults = configuredLocalRooms.map(localRoom => {
        const apiRoom = data.find((api: any) => api.idQuarto === localRoom.api_category_id);
        console.log(`[BookingV2] Procurando quarto API com idQuarto=${localRoom.api_category_id}, encontrado:`, apiRoom);

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
        console.log(`[BookingV2] Quarto local ${localRoom.name} (ID: ${localRoom.id}) não encontrado na API, marcando como indisponível`);
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

      console.log('[BookingV2] Resultados mesclados finais:', mergedResults);
      console.log('[BookingV2] Número de quartos mesclados:', mergedResults.length);

      setRawResults(mergedResults);

    } catch (e: any) {
      console.error("Erro ao buscar disponibilidade:", e);
      const errorMessage = e.message || "Ocorreu um erro ao buscar a disponibilidade. Tente novamente.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };