const handleSelectRoom = () => {
  try {
    const baseUrl = 'https://vhomeflathotel.motordereservas.com.br/novareserva';
    const params = new URLSearchParams({
      inicio: searchParams.checkin,
      fim: searchParams.checkout,
      adultos: searchParams.adults.toString(),
      idquartoCategoria: room.idQuarto.toString(), // Usar o idQuarto ajustado como idquartoCategoria
    });
    const reservationLink = `${baseUrl}?${params.toString()}`;
    window.location.href = reservationLink;
  } catch (error) {
    console.error("Erro ao gerar link de reserva:", error);
    showError("Erro ao redirecionar para reserva. Tente novamente.");
  }
};