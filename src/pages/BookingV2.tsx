// Filtrar quartos que têm valor total > 0
      const pricedAndImagedResults = mergedResults.filter((room: AvailabilityResult) => 
        room.valorTotal > 0
      );