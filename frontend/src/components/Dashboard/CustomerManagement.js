import React, { useEffect, useState } from "react";
import api from "../../Services/api";

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add customer modal state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    fullName: "",
    phone: "",
    address: "",
    docId: ""
  });

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editCustomerData, setEditCustomerData] = useState({});

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
      setError("");
    } catch {
      setError("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  // Add customer handlers
  const handleAddInputChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = async () => {
    if (
      !newCustomer.fullName ||
      !newCustomer.phone ||
      !newCustomer.address ||
      !newCustomer.docId
    ) {
      alert("All fields are required.");
      return;
    }
    try {
      await api.post("/customers", newCustomer);
      setShowAddForm(false);
      setNewCustomer({ fullName: "", phone: "", address: "", docId: "" });
      fetchCustomers();
    } catch {
      alert("Failed to add customer.");
    }
  };

  // Edit customer handlers
  const startEditing = (customer) => {
    setEditingId(customer.customerId);
    setEditCustomerData({
      fullName: customer.fullName,
      phone: customer.phone,
      address: customer.address,
      docId: customer.docId
    });
  };

  const handleEditInputChange = (e) => {
    setEditCustomerData({ ...editCustomerData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (customerId) => {
    if (
      !editCustomerData.fullName ||
      !editCustomerData.phone ||
      !editCustomerData.address ||
      !editCustomerData.docId
    ) {
      alert("All fields are required.");
      return;
    }
    try {
      await api.put(`/customers/${customerId}`, editCustomerData);
      setEditingId(null);
      fetchCustomers();
    } catch {
      alert("Failed to update customer.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCustomerData({});
  };

  // Delete customer handler
  const deleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await api.delete(`/customers/${customerId}`);
        fetchCustomers();
      } catch {
        alert("Failed to delete customer.");
      }
    }
  };

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      <h2>Customer Management</h2>

      <button className="btn btn-primary mb-3" onClick={() => setShowAddForm(true)}>
        Add Customer
      </button>

      {/* Add Customer Modal */}
      {showAddForm && (
        <div className="card p-3 mb-3 border">
          <h5>Add Customer</h5>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={newCustomer.fullName}
            onChange={handleAddInputChange}
            className="form-control mb-1"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={newCustomer.phone}
            onChange={handleAddInputChange}
            className="form-control mb-1"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newCustomer.address}
            onChange={handleAddInputChange}
            className="form-control mb-1"
          />
          <input
            type="text"
            name="docId"
            placeholder="Document ID"
            value={newCustomer.docId}
            onChange={handleAddInputChange}
            className="form-control mb-1"
          />
          <div className="d-flex gap-2 mt-2">
            <button className="btn btn-success flex-fill" onClick={handleAddCustomer}>
              Submit
            </button>
            <button
              className="btn btn-secondary flex-fill"
              onClick={() => {
                setShowAddForm(false);
                setNewCustomer({ fullName: "", phone: "", address: "", docId: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Document ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust.customerId}>
              <td>{cust.customerId}</td>
              {editingId === cust.customerId ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="fullName"
                      value={editCustomerData.fullName}
                      onChange={handleEditInputChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phone"
                      value={editCustomerData.phone}
                      onChange={handleEditInputChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="address"
                      value={editCustomerData.address}
                      onChange={handleEditInputChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                  <input
                    type="text"
                    name="docId"
                    value={editCustomerData.docId}
                    onChange={handleEditInputChange}
                    className="form-control"
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => saveEdit(cust.customerId)}
                    >
                      Save
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </td>
                </>
              ) : (
                <>
                  <td>{cust.fullName}</td>
                  <td>{cust.phone}</td>
                  <td>{cust.address}</td>
                  <td>{cust.docId}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => startEditing(cust)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteCustomer(cust.customerId)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerManagement;
