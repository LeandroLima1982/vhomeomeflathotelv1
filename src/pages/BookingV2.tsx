// Filtrar apenas quartos com preço > 0 (removido filtro de imagem)
      const pricedAndImagedResults = mergedResults.filter((room: AvailabilityResult) => {
        const hasPrice = room.valorTotal > 0;
        
        if (!hasPrice) {
          console.log(`[BookingV2] Quarto ${room.nomeQuarto} filtrado: sem preço`);
        }
        
        return hasPrice;
      });