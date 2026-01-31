// Filtrar apenas quartos com disponibilidade > 0, valorTotal > 0 E imageUrl
      const availableResults = mergedResults.filter(room => 
        room.disponibilidade > 0 && 
        room.valorTotal > 0 && 
        room.imageUrl // Apenas quartos com imagem
      );