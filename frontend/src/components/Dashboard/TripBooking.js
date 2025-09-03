import React, { useState, useEffect } from "react";
import api from "../../Services/api";

function TripBooking({ trip }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [customers, setCustomers] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const farePerSeat = trip.fare || 500;
  const [bookingError, setBookingError] = useState("");

  // Fetch customers when form opens
  useEffect(() => {
    if (showBookingForm) {
      api.get("/customers")
        .then(res => setCustomers(res.data))
        .catch(() => setCustomers([]));
    }
  }, [showBookingForm]);

  // Toggle seat selection
  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const confirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    setShowBookingForm(true);
  };

  const submitBooking = async () => {
    if (!customerId) {
      alert("Please select a customer.");
      return;
    }
    if (!paymentType) {
      alert("Please select a payment type.");
      return;
    }

    const bookingData = {
      trip: { tripId: trip.tripId },
      customerId: customerId,
      seats: selectedSeats,
      totalAmount: farePerSeat * selectedSeats.length,
      paymentType: paymentType,
      status: "Confirmed",
    };

    try {
      await api.post("/bookings", bookingData);
      alert("Booked successfully");
      setShowBookingForm(false);
      setSelectedSeats([]);
      setCustomerId("");
      setPaymentType("");
      setBookingError("");
    } catch (error) {
      setBookingError("Booking failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Trip Search & Booking</h2>
      <div>
        <p>Select Your Seats</p>
        {[...Array(40).keys()].map((i) => {
          const seatNum = (i + 1).toString();
          const isSelected = selectedSeats.includes(seatNum);
          return (
            <button
              key={seatNum}
              style={{
                width: 35,
                height: 35,
                margin: 2,
                backgroundColor: isSelected ? "green" : "#ccc",
              }}
              onClick={() => toggleSeat(seatNum)}
            >
              {seatNum}
            </button>
          );
        })}
      </div>
      <div>
        Fare per seat: ₹{farePerSeat} | Selected seats: {selectedSeats.length} | Total: ₹
        {farePerSeat * selectedSeats.length}
      </div>
      <button onClick={confirmBooking} className="btn btn-success m-2">
        Confirm Booking
      </button>
      <button onClick={() => setSelectedSeats([])} className="btn btn-secondary m-2">
        Cancel
      </button>

      {showBookingForm && (
        <div style={{ marginTop: 20 }}>
          <h3>Booking Details</h3>
          <div className="mb-2">
            <label>Select Customer:</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="form-control"
            >
              <option value="">-- Select --</option>
              {customers.map((customer) => (
                <option key={customer.customerId} value={customer.customerId}>
                  {customer.fullName} ({customer.phone})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label>Payment Type:</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="form-control"
            >
              <option value="">-- Select --</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
          <button onClick={submitBooking} className="btn btn-primary m-2">
            Submit Booking
          </button>
          <button onClick={() => setShowBookingForm(false)} className="btn btn-secondary m-2">
            Cancel
          </button>
          {bookingError && <p style={{ color: "red" }}>{bookingError}</p>}
        </div>
      )}
    </div>
  );
}

export default TripBooking;
