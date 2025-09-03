import React, { useState, useEffect } from "react";
import axios from "axios";

function TripManagement() {
  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [form, setForm] = useState({
    busId: "",
    routeId: "",
    departureTime: "",
    arrivalTime: "",
    fare: "",
    status: "Active",
  });

  useEffect(() => {
    fetchTrips();
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get("http://localhost:8080/api/v1/trips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(res.data);
      setError("");
    } catch {
      setError("Failed to fetch trips.");
    }
  };

  const fetchBuses = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get("http://localhost:8080/api/v1/buses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(res.data);
    } catch {
      setError("Failed to fetch buses.");
    }
  };

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get("http://localhost:8080/api/v1/routes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(res.data);
    } catch {
      setError("Failed to fetch routes.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startAddTrip = () => {
    setEditingTrip(null);
    setForm({
      busId: "",
      routeId: "",
      departureTime: "",
      arrivalTime: "",
      fare: "",
      status: "Active",
    });
    setShowForm(true);
    setError("");
  };

  const startEditTrip = (trip) => {
    setEditingTrip(trip);
    setForm({
      busId: trip.bus.busId || "",
      routeId: trip.route.routeId || "",
      departureTime: trip.departureTime || "",
      arrivalTime: trip.arrivalTime || "",
      fare: trip.fare || "",
      status: trip.status || "Active",
    });
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const payload = {
        busId: form.busId,
        routeId: form.routeId,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        fare: parseFloat(form.fare),
        status: form.status,
      };
      if (editingTrip) {
        await axios.put(
          `http://localhost:8080/api/v1/trips/${editingTrip.tripId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:8080/api/v1/trips", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowForm(false);
      setError("");
      fetchTrips();
    } catch {
      setError("Failed to save trip.");
    }
  };

  const handleDelete = async (trip) => {
    if (!window.confirm(`Cancel trip ID ${trip.tripId}?`)) return;
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(`http://localhost:8080/api/v1/trips/${trip.tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError("");
      fetchTrips();
    } catch {
      setError("Failed to delete trip.");
    }
  };

  return (
    <div>
      <h2>Trip Management</h2>

      {error && <div className="alert alert-warning">{error}</div>}

      {!showForm && (
        <>
          <button className="btn btn-primary mb-3" onClick={startAddTrip}>
            Add Trip
          </button>

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Bus</th>
                <th>Route</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>Fare (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No trips found
                  </td>
                </tr>
              )}
              {trips.map((trip) => (
                <tr key={trip.tripId}>
                  <td>{trip.tripId}</td>
                  <td>
                    {trip.bus.busNumber} ({trip.bus.busType})
                  </td>
                  <td>
                    {trip.route.source} → {trip.route.destination}
                  </td>
                  <td>{new Date(trip.departureTime).toLocaleString()}</td>
                  <td>{new Date(trip.arrivalTime).toLocaleString()}</td>
                  <td>{trip.fare.toFixed(2)}</td>
                  <td>{trip.status}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => startEditTrip(trip)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(trip)}
                      >
                        Cancel
                      </button>
                      {/* Add View Seats and Reports buttons here as needed */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-3">
          <h4>{editingTrip ? "Edit Trip" : "Add Trip"}</h4>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Bus</label>
              <select
                name="busId"
                className="form-select"
                value={form.busId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Bus</option>
                {buses.map((bus) => (
                  <option key={bus.busId} value={bus.busId}>
                    {bus.busNumber} ({bus.busType})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Route</label>
              <select
                name="routeId"
                className="form-select"
                value={form.routeId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Route</option>
                {routes.map((route) => (
                  <option key={route.routeId} value={route.routeId}>
                    {route.source} → {route.destination}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Departure Time</label>
              <input
                type="datetime-local"
                name="departureTime"
                className="form-control"
                value={form.departureTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Arrival Time</label>
              <input
                type="datetime-local"
                name="arrivalTime"
                className="form-control"
                value={form.arrivalTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Fare (₹)</label>
              <input
                type="number"
                name="fare"
                className="form-control"
                value={form.fare}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleInputChange}
                required
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-success me-2">
              {editingTrip ? "Update Trip" : "Add Trip"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TripManagement;
