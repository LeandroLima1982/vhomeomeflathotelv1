const handleDirectReserve = () => {
    if (currentSearchParams) {
      try {
        const baseUrl = 'https://vhomeflathotel.motordereservas.com.br/novareserva';
        const params = new URLSearchParams({
          inicio: currentSearchParams.checkin,
          fim: currentSearchParams.checkout,
          adultos: currentSearchParams.adults.toString(),
          idquartoCategoria: room.idQuarto.toString(), // Usar o idQuarto ajustado
        });
        const reservationLink = `${baseUrl}?${params.toString()}`;
        window.location.href = reservationLink;
      } catch (error) {
        console.error("Erro ao gerar link de reserva direta:", error);
        showError("Erro ao redirecionar para reserva. Tente novamente.");
      }
    }
  };