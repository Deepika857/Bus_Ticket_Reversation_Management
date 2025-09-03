import React, { useState, useEffect } from "react";
import axios from "axios";

const busTypes = ["AC", "Non-AC", "Sleeper", "Semi-Sleeper"];

const seatLayouts = [
  { label: "2x2", rows: 10, cols: 4 },
  { label: "2x1 Sleeper", rows: 10, cols: 3 },
];

function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [form, setForm] = useState({
    busNumber: "",
    busType: busTypes[0],
    operatorName: "",
    seatLayout: seatLayouts[0].label,
    rows: seatLayouts[0].rows,
    cols: seatLayouts[0].cols,
    capacity: seatLayouts[0].rows * seatLayouts[0].cols,
    status: "Active",
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get("http://localhost:8080/api/v1/buses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(res.data);
      setError("");
    } catch {
      setError("Failed to fetch buses.");
      setBuses([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "seatLayout") {
      const layout = seatLayouts.find((l) => l.label === value);
      setForm((prev) => ({
        ...prev,
        seatLayout: value,
        rows: layout.rows,
        cols: layout.cols,
        capacity: layout.rows * layout.cols,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const startAddBus = () => {
    setEditingBus(null);
    setForm({
      busNumber: "",
      busType: busTypes[0],
      operatorName: "",
      seatLayout: seatLayouts[0].label,
      rows: seatLayouts[0].rows,
      cols: seatLayouts[0].cols,
      capacity: seatLayouts[0].rows * seatLayouts[0].cols,
      status: "Active",
    });
    setShowForm(true);
  };

  const startEditBus = (bus) => {
    setEditingBus(bus);
    setForm({
      busNumber: bus.busNumber,
      busType: bus.busType,
      operatorName: bus.operatorName,
      seatLayout: bus.seatLayout,
      rows: bus.seatRows, // Correct field name mapping here
      cols: bus.cols,
      capacity: bus.capacity,
      status: bus.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      // Prepare payload matching backend field names
      const busPayload = {
        busNumber: form.busNumber,
        busType: form.busType,
        operatorName: form.operatorName,
        seatLayout: form.seatLayout,
        seatRows: form.rows,
        cols: form.cols,
        capacity: form.capacity,
        status: form.status,
        totalSeats: form.capacity, // Assuming totalSeats same as capacity
      };
      if (editingBus) {
        await axios.put(`http://localhost:8080/api/v1/buses/${editingBus.busId}`, busPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:8080/api/v1/buses", busPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowForm(false);
      fetchBuses();
    } catch {
      setError("Failed to save bus.");
    }
  };

  const handleDelete = async (bus) => {
    if (!window.confirm(`Are you sure you want to delete bus ${bus.busNumber}?`)) return;
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(`http://localhost:8080/api/v1/buses/${bus.busId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBuses();
    } catch {
      setError("Failed to delete bus.");
    }
  };

  return (
    <div>
      <h2>Bus Management</h2>

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      {!showForm && (
        <>
          <button className="btn btn-primary mb-3" onClick={startAddBus}>
            Add Bus
          </button>

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Bus Number</th>
                <th>Bus Type</th>
                <th>Operator</th>
                <th>Rows</th>
                <th>Columns</th>
                <th>Total Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No buses found
                  </td>
                </tr>
              )}
              {buses.map((bus) => (
                <tr key={bus.busId}>
                  <td>{bus.busNumber}</td>
                  <td>{bus.busType}</td>
                  <td>{bus.operatorName}</td>
                  <td>{bus.seatRows}</td>
                  <td>{bus.cols}</td>
                  <td>{bus.capacity}</td>
                  <td>{bus.status}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-primary" onClick={() => startEditBus(bus)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(bus)}>
                        Delete
                      </button>
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
          <h4>{editingBus ? "Edit Bus" : "Add New Bus"}</h4>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Bus Number</label>
              <input
                type="text"
                name="busNumber"
                className="form-control"
                value={form.busNumber}
                onChange={handleInputChange}
                required
                disabled={!!editingBus}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Bus Type</label>
              <select name="busType" className="form-select" value={form.busType} onChange={handleInputChange} required>
                {busTypes.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Operator Name</label>
              <input type="text" name="operatorName" className="form-control" value={form.operatorName} onChange={handleInputChange} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Seat Layout</label>
              <select name="seatLayout" className="form-select" value={form.seatLayout} onChange={handleInputChange} required>
                {seatLayouts.map((layout) => (
                  <option key={layout.label} value={layout.label}>
                    {layout.label} ({layout.rows} rows x {layout.cols} cols)
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Rows</label>
              <input type="number" name="rows" className="form-control" value={form.rows} readOnly />
            </div>
            <div className="col-md-3">
              <label className="form-label">Columns</label>
              <input type="number" name="cols" className="form-control" value={form.cols} readOnly />
            </div>
            <div className="col-md-3">
              <label className="form-label">Total Seats</label>
              <input type="number" name="capacity" className="form-control" value={form.capacity} readOnly />
            </div>
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select name="status" className="form-select" value={form.status} onChange={handleInputChange} required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-success me-2">
              {editingBus ? "Update Bus" : "Add Bus"}
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

export default BusManagement;
