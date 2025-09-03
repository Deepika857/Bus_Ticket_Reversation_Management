import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RouteList({ onAddRoute, onEditRoute }) {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState('');

  // Fetch routes on mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:8080/api/v1/routes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoutes(response.data); // Expected: array of { id, source, destination }
      } catch {
        setRoutes([]);
      }
    };
    fetchRoutes();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this route?')) return;
    const token = localStorage.getItem('jwtToken');
    await axios.delete(`http://localhost:8080/api/v1/routes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setRoutes(routes => routes.filter(r => r.id !== id));
  };

  // Filtered routes
  const filtered = routes.filter(r =>
    r.source.toLowerCase().includes(search.toLowerCase()) ||
    r.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <span>All Routes</span>
        <button
          className="btn btn-primary"
          onClick={onAddRoute}
        >
          Add New Route
        </button>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <div>
            Show&nbsp;
            <select disabled style={{ width: 60 }}>
              <option>10</option>
            </select>
            &nbsp;entries
          </div>
          <div>
            Search:&nbsp;
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control d-inline-block"
              style={{ width: 160 }}
            />
          </div>
        </div>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>From</th>
              <th>To</th>
              <th style={{ width: 150 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">No routes found.</td>
              </tr>
            )}
            {filtered.map((route, idx) => (
              <tr key={route.id}>
                <td>{idx + 1}</td>
                <td>{route.source}</td>
                <td>{route.destination}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => onEditRoute(route)}
                  >Edit</button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(route.id)}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RouteList;
