import React, { useState, useEffect } from "react";
import api from "../../Services/api";

function BookingForm({ trip, selectedSeats, fare, totalAmount, onCancel, onBookingSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/customers")
      .then(res => setCustomers(res.data))
      .catch(() => setCustomers([]));
  }, []);

  const submitBooking = async () => {
    if (!customerId) {
      setError("Please select a customer.");
      return;
    }
    if (!paymentType) {
      setError("Please select a payment type.");
      return;
    }
    if (!selectedSeats || selectedSeats.length === 0) {
      setError("Please select at least one seat.");
      return;
    }
    setError("");

    const selectedCustomer = customers.find(c => c.customerId === parseInt(customerId));

    const payload = {
      trip: { tripId: trip.tripId },
      customerName: selectedCustomer ? selectedCustomer.fullName : "",
      seats: selectedSeats.length > 0 ? selectedSeats.map(String) : [],
      totalAmount: fare * selectedSeats.length,
      paymentType,
      status: "Confirmed",               
    };

    try {
      const res = await api.post("/bookings", payload);
      onBookingSuccess(res.data);
    } catch {
      setError("Booking failed. Please try again.");
    }
  };

  return (
    <div className="card p-3 mt-3">
      <h3>Booking Details</h3>

      <div className="mb-3">
        <label>Trip ID:</label>
        <input
          className="form-control"
          value={trip.tripId}
          readOnly
          tabIndex={-1}
          style={{ background: '#f3f3f3', fontWeight: 600 }}
        />
      </div>

      <div className="mb-3">
        <label>Select Customer:</label>
        <select
          className="form-control"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">-- Select --</option>
          {customers.map(customer => (
            <option key={customer.customerId} value={customer.customerId}>
              {customer.fullName} ({customer.phone})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Total Amount:</label>
        <input
          className="form-control"
          value={`₹${totalAmount}`}
          readOnly
          tabIndex={-1}
          style={{ background: '#f9f9f9', fontWeight: 600 }}
        />
      </div>

      <div className="mb-3">
        <label>Payment Type:</label>
        <select
          className="form-control"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
        {error && <span style={{ color: "red", whiteSpace: "nowrap" }}>{error}</span>}
        <button onClick={submitBooking} className="btn btn-primary">Submit Booking</button>
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
}

// Optional seat selection component (can be rendered outside or inside BookingForm)
export const SeatSelection = ({ selectedSeats, toggleSeatSelection }) => {
  const seats = Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <div className="mt-3">
      <h4>Select Your Seats</h4>
      <div style={{ display: "flex", flexWrap: "wrap", maxWidth: 400 }}>
        {seats.map(seat => (
          <div
            key={seat}
            onClick={() => toggleSeatSelection(seat)}
            style={{
              width: 40,
              height: 40,
              margin: 5,
              lineHeight: "40px",
              textAlign: "center",
              borderRadius: 5,
              cursor: "pointer",
              backgroundColor: selectedSeats.includes(seat) ? "green" : "#ccc",
              color: selectedSeats.includes(seat) ? "white" : "black",
            }}
          >
            {seat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingForm;
