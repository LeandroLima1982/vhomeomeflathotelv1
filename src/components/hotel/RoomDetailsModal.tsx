const handleReserveClick = () => {
    if (roomAvailabilityResult && currentSearchParams) {
      // Construir a URL diretamente conforme especificado
      const baseUrl = 'https://vhomeflathotel.motordereservas.com.br/novareserva';
      const params = new URLSearchParams({
        inicio: currentSearchParams.checkin,
        fim: currentSearchParams.checkout,
        adultos: currentSearchParams.adults.toString(),
        idquartoCategoria: room.id.toString(), // Usar o ID do quarto do Supabase
      });
      const reservationUrl = `${baseUrl}?${params.toString()}`;
      window.location.href = reservationUrl; // Redireciona diretamente para a URL construída
    }
  };