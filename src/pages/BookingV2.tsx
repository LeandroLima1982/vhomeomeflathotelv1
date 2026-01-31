// Filtrar apenas quartos com disponibilidade > 0 E valorTotal > 0 E imageUrl não nula
      const availableResults = mergedResults.filter(room => room.disponibilidade > 0 && room.valorTotal > 0 && room.imageUrl);

      console.log('[BookingV2] Quartos disponíveis (disponibilidade > 0 E valorTotal > 0 E com imagem):', availableResults);
      console.log('[BookingV2] Número de quartos disponíveis:', availableResults.length);