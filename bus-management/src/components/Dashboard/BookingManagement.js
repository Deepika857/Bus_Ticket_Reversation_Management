import React, { useState, useEffect } from "react";
import axios from "axios";

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    bookingId: "",
    customerName: "",
    date: "",
    status: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    const response = await axios.get("http://localhost:8080/api/v1/bookings", {
      headers: { Authorization: `Bearer ${token}` },
      params: filters,
    });
    // Add a sample booking entry at the end of the fetched bookings
      const sampleBooking = {
        bookingId: 1,
        trip: {
          bus: { busNumber: "KA01AB3567" },
          route: { source: "Chennai", destination: "Hyderabad" },
          departureTime: new Date().toISOString(),
        },
        customerName: "Krishna",
        seats: ["1"],
        bookingDate: new Date().toISOString(),
        totalAmount: 500.00,
        status: "Confirmed",
      };

      setBookings([...response.data, sampleBooking]);
      setError("");
    } catch (err) {
      setError("Failed to fetch bookings.");
    }
  };


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(
        `http://localhost:8080/api/v1/bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch {
      setError("Failed to update booking status.");
    }
  };

  const viewTicket = (bookingId) => {
    alert(`View ticket for booking ID: ${bookingId}`);
  };

  return (
    <div className="container my-4">
      <h2>Booking Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form className="row g-3 mb-3" onSubmit={handleSearch}>
        <div className="col-md-3">
          <input
            type="text"
            name="bookingId"
            placeholder="Booking ID"
            className="form-control"
            value={filters.bookingId}
            onChange={handleFilterChange}
          />
        </div>

        <div className="col-md-3">
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            className="form-control"
            value={filters.customerName}
            onChange={handleFilterChange}
          />
        </div>

        <div className="col-md-2">
          <input
            type="date"
            name="date"
            className="form-control"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>

        <div className="col-md-2">
          <select
            name="status"
            className="form-select"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="Held">Held</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            Filter
          </button>
        </div>
      </form>

      <table className="table table-bordered table-hover text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>Booking ID</th>
            <th>Trip</th>
            <th>Customer</th>
            <th>Seats</th>
            <th>Booking Date</th>
            <th>Total Amount (₹)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="8">No bookings found.</td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
                <td>
                  {booking.trip.bus.busNumber} - {booking.trip.route.source} → {booking.trip.route.destination} (
                  {new Date(booking.trip.departureTime).toLocaleString()})
                </td>
                <td>{booking.customerName}</td>
                <td>{booking.seats.join(", ")}</td>
                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>{booking.totalAmount.toFixed(2)}</td>
                <td>
                  <span
                    className={`badge ${
                      booking.status === "Confirmed"
                        ? "bg-success"
                        : booking.status === "Cancelled"
                        ? "bg-danger"
                        : booking.status === "Held"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <button className="btn btn-sm btn-info" onClick={() => viewTicket(booking.bookingId)}>
                      View
                    </button>
                    {booking.status !== "Cancelled" && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => changeBookingStatus(booking.bookingId, "Cancelled")}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookingManagement;
