const handleReserveClick = (isDirectBooking: boolean) => {
    if (roomAvailabilityResult && currentSearchParams) {
      // Close the modal before redirecting
      onClose();
      
      // Generate the external reservation link with pre-filled data
      const reservationLink = generateReservationLink(roomAvailabilityResult.apiRoomId, currentSearchParams);
      
      // Redirect to the external booking site
      window.location.href = reservationLink;
    }
  };