import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api";
import CustomerManagement from "./CustomerManagement";
import BookingForm, { SeatSelection } from "./BookingForm";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tripSearch");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState("");
  const [fare, setFare] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("bus-app-token");
    navigate("/login");
  };

  const searchTrips = async () => {
    if (!from || !to || !date) {
      setError("Please enter From, To, and Date to search trips.");
      return;
    }
    setError("");
    try {
      const res = await api.get("/trips/search", { params: { from, to, date } });
      setTrips(res.data);
      if (res.data.length === 0) {
        setError("No trips found for the selected criteria.");
      }
    } catch {
      setError("Failed to fetch trips. Please try again.");
    }
  };

  const handleBookTicket = (trip) => {
    setSelectedTrip(trip);
    setSelectedSeats([]);
    setFare(trip.fare);
    setBookingConfirmed(false);
    setBookingDetails(null);
    setShowBookingForm(false);
  };

  const toggleSeatSelection = seatNumber => {
  const updated = selectedSeats.includes(seatNumber)
    ? selectedSeats.filter(s => s !== seatNumber)
    : [...selectedSeats, seatNumber];
  setSelectedSeats(updated);
  };

  const openBookingForm = () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat.");
      return;
    }
    setError("");
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (booking) => {
    setBookingConfirmed(true);
    setBookingDetails(booking);
    setShowBookingForm(false);
    setSelectedTrip(null);
    setSelectedSeats([]);
  };

  const resetBooking = () => {
    setFrom("");
    setTo("");
    setDate("");
    setTrips([]);
    setSelectedTrip(null);
    setSelectedSeats([]);
    setBookingConfirmed(false);
    setBookingDetails(null);
    setFare(0);
    setError("");
    setShowBookingForm(false);
  };
  const totalAmount = fare * selectedSeats.length;


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary px-3" style={{ color: "white" }}>
        <span className="navbar-brand fw-bold text-white">Customer Dashboard</span>
        <div className="navbar-nav ms-auto d-flex flex-row align-items-center">
          <button
            className={`nav-link btn btn-link ${
              activeTab === "tripSearch" ? "text-white fw-bold" : "text-light"
            }`}
            onClick={() => setActiveTab("tripSearch")}
          >
            Trip Search & Booking
          </button>
          <button
            className={`nav-link btn btn-link ${
              activeTab === "myCustomers" ? "text-white fw-bold" : "text-light"
            }`}
            onClick={() => setActiveTab("myCustomers")}
          >
            Customers
          </button>
        </div>
        <button className="btn btn-danger ms-auto" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="container my-4">
        {activeTab === "tripSearch" && (
          <>
            <h1>Trip Search & Booking</h1>

            {!selectedTrip && !bookingConfirmed && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="From"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="form-control mb-2"
                  />
                  <input
                    type="text"
                    placeholder="To"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="form-control mb-2"
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-control mb-2"
                  />
                  <button className="btn btn-primary" onClick={searchTrips}>
                    Search Trips
                  </button>
                  {error && <p className="text-danger mt-2">{error}</p>}
                </div>

                {trips.length > 0 && (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Bus No.</th>
                        <th>Fare</th>
                        <th>Book Ticket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trips.map((trip) => (
                        <tr key={trip.tripId}>
                          <td>{trip.route.source}</td>
                          <td>{trip.route.destination}</td>
                          <td>{trip.departureTime.replace("T", " ")}</td>
                          <td>{trip.arrivalTime.replace("T", " ")}</td>
                          <td>{trip.bus.busNumber}</td>
                          <td>₹{trip.fare}</td>
                          <td>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleBookTicket(trip)}
                            >
                              Book Ticket
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {selectedTrip && !bookingConfirmed && !showBookingForm && (
              <>
                <SeatSelection
                  selectedSeats={selectedSeats}
                  toggleSeatSelection={toggleSeatSelection}
                />
                <p>
                  Fare per seat: ₹{fare} | Selected seats: {selectedSeats.length} | Total: ₹
                  {fare * selectedSeats.length}
                </p>
                <button className="btn btn-success" onClick={openBookingForm}>
                  Confirm Booking
                </button>
                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => setSelectedTrip(null)}
                >
                  Cancel
                </button>
                {error && <p className="text-danger mt-2">{error}</p>}
              </>
            )}

            {selectedTrip && showBookingForm && (
              <BookingForm
                trip={selectedTrip}
                selectedSeats={selectedSeats}
                fare={fare}
                totalAmount={totalAmount}
                onCancel={() => setShowBookingForm(false)}
                onBookingSuccess={handleBookingSuccess}
              />
            )}

            {bookingConfirmed && (
              <>
                <h3>Booking Confirmed!</h3>
                <p>Your ticket booking for trip {bookingDetails?.trip?.tripId} is confirmed.</p>
                <p>Customer Name: {bookingDetails?.customerName}</p>
                <p>Total fare paid: ₹{bookingDetails?.totalAmount}</p>
                <button className="btn btn-primary" onClick={resetBooking}>
                  Book Another Trip
                </button>
              </>
            )}
          </>
        )}

        {activeTab === "myCustomers" && <CustomerManagement />}
      </div>
    </>
  );
}

export default CustomerDashboard;
