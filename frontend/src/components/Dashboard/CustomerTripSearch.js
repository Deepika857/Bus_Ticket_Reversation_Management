import React, { useState } from "react";
import CustomerTripSearch from "./CustomerTripSearch";
// You will create SeatSelection, BookingForm, TicketView components separately for modularity

function CustomerDashboard() {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Handler when user selects a trip from trip search results
  const onTripSelect = (trip) => {
    setSelectedTrip(trip);
    setSelectedSeats([]); // reset selected seats when trip changes
    setBookingConfirmed(false);
    setBookingDetails(null);
  };

  // Handler when seats selected (to be implemented in SeatSelection)
  const onSeatsSelected = (seats) => {
    setSelectedSeats(seats);
  };

  // Placeholder handler for booking confirmation
  const onBookingConfirmed = (details) => {
    setBookingConfirmed(true);
    setBookingDetails(details);
  };

  // Reset for new booking
  const resetBooking = () => {
    setSelectedTrip(null);
    setSelectedSeats([]);
    setBookingConfirmed(false);
    setBookingDetails(null);
  };

  return (
    <div className="container my-4">
      <h1>Customer Dashboard</h1>

      {!selectedTrip && (
        <CustomerTripSearch onTripSelect={onTripSelect} />
      )}

      {selectedTrip && !bookingConfirmed && (
        <>
          <h3>Seat Selection for Trip ID: {selectedTrip.tripId}</h3>
          {/* 
            <SeatSelection tripId={selectedTrip.tripId} 
              selectedSeats={selectedSeats} 
              onSeatsSelected={onSeatsSelected} />
          */}
          <p>Seat selection coming soon...</p>

          {/* Booking form would go here with selected seats passed */}
          {/* <BookingForm trip={selectedTrip} seats={selectedSeats} onBookingConfirmed={onBookingConfirmed} /> */}
          <p>Booking form coming soon...</p>

          <button className="btn btn-secondary mt-3" onClick={resetBooking}>
            Search Another Trip
          </button>
        </>
      )}

      {bookingConfirmed && (
        <>
          <h3>Booking Confirmed!</h3>
          {/* <TicketView bookingDetails={bookingDetails} /> */}
          <p>Ticket view coming soon...</p>

          <button className="btn btn-primary mt-3" onClick={resetBooking}>
            Book Another Trip
          </button>
        </>
      )}
    </div>
  );
}

export default CustomerDashboard;
