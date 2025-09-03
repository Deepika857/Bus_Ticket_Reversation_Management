import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.role) {
      setError('Please select a role');
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/v1/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafd"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 16px #efe2",
          padding: "32px 32px 20px 32px"
        }}
      >
        <h2 className="mb-4 text-center" style={{ fontWeight: '700', letterSpacing: 1 }}>
          Create Your Bus Reservation Account
        </h2>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-3">
            <label htmlFor="username" className="form-label" style={{ fontWeight: 500 }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ fontWeight: 500 }}>
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="form-label" style={{ fontWeight: 500 }}>
              Select Role
            </label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                --Select Role--
              </option>
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ fontWeight: 600, fontSize: 17, letterSpacing: .2 }}
          >
            Register
          </button>
        </form>

        <div className="text-center mt-3" style={{ fontSize: 16 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: "#267fff", textDecoration: "underline" }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
