import React, { useState, useEffect } from "react";
import axios from "axios";

function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [form, setForm] = useState({
    source: "",
    destination: "",
    distance: "",
    duration: "",
    stops: [],
    status: "Active",
    stopInput: "",
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get("http://localhost:8080/api/v1/routes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(res.data);
      setError("");
    } catch {
      setError("Failed to fetch routes.");
      setRoutes([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addStop = () => {
    const stop = form.stopInput.trim();
    if (stop === "" || form.stops.includes(stop)) return;
    setForm((prev) => ({
      ...prev,
      stops: [...prev.stops, stop],
      stopInput: "",
    }));
  };

  const removeStop = (index) => {
    setForm((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  const startAddRoute = () => {
    setEditingRoute(null);
    setForm({
      source: "",
      destination: "",
      distance: "",
      duration: "",
      stops: [],
      status: "Active",
      stopInput: "",
    });
    setShowForm(true);
    setError("");
  };

  const startEditRoute = (route) => {
    setEditingRoute(route);
    setForm({
      source: route.source || "",
      destination: route.destination || "",
      distance: route.distance || "",
      duration: route.duration || "",
      stops: route.stops || [],
      status: route.status || "Active",
      stopInput: "",
    });
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const payload = {
        source: form.source,
        destination: form.destination,
        distance: parseInt(form.distance, 10) || 0,
        duration: form.duration,
        stops: form.stops,
        status: form.status,
      };
      if (editingRoute) {
        await axios.put(
          `http://localhost:8080/api/v1/routes/${editingRoute.routeId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:8080/api/v1/routes", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowForm(false);
      setError("");
      fetchRoutes();
    } catch (error) {
      setError("Failed to save route.");
    }
  };

  const handleDelete = async (route) => {
    if (!window.confirm(`Delete route from ${route.source} to ${route.destination}?`))
      return;
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(`http://localhost:8080/api/v1/routes/${route.routeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError("");
      fetchRoutes();
    } catch {
      setError("Failed to delete route.");
    }
  };

  return (
    <div>
      <h2>Route Management</h2>

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      {!showForm && (
        <>
          <button className="btn btn-primary mb-3" onClick={startAddRoute}>
            Add Route
          </button>

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Route ID</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Distance (km)</th>
                <th>Duration</th>
                <th>Stops</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No routes found
                  </td>
                </tr>
              )}
              {routes.map((route) => (
                <tr key={route.routeId}>
                  <td>{route.routeId}</td>
                  <td>{route.source}</td>
                  <td>{route.destination}</td>
                  <td>{route.distance || "-"}</td>
                  <td>{route.duration || "-"}</td>
                  <td>{route.stops ? route.stops.join(", ") : "-"}</td>
                  <td>{route.status}</td>
                  <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => startEditRoute(route)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(route)}>Delete</button>
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showForm && (
        <form className="card p-3" onSubmit={handleSubmit}>
          <h4>{editingRoute ? "Edit Route" : "Add New Route"}</h4>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Source</label>
              <input
                type="text"
                name="source"
                className="form-control"
                value={form.source}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Destination</label>
              <input
                type="text"
                name="destination"
                className="form-control"
                value={form.destination}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Distance (km)</label>
              <input
                type="number"
                name="distance"
                className="form-control"
                value={form.distance}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Duration (e.g. 9h 30m)</label>
              <input
                type="text"
                name="duration"
                className="form-control"
                value={form.duration}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Stops (Add one stop at a time)</label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  name="stopInput"
                  className="form-control"
                  placeholder="Enter stop name"
                  value={form.stopInput}
                  onChange={handleInputChange}
                />
                <button type="button" className="btn btn-outline-secondary" onClick={addStop}>
                  Add Stop
                </button>
              </div>
              <ul className="list-group">
                {form.stops.map((stop, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    {stop}
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeStop(idx)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleInputChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-success me-2">
              {editingRoute ? "Update Route" : "Add Route"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default RouteManagement;
