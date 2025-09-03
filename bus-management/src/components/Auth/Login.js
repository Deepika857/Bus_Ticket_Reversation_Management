import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', form);
      const { token, role } = response.data;
      localStorage.setItem('jwtToken', token);

      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'CUSTOMER') {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please try again.');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ background: '#f7f9fb' }}
    >
      <div
        className="p-4 bg-white rounded-4 shadow-sm"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ fontSize: '2rem' }}>
          Login
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
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
              required
              autoComplete="email"
              style={{ boxShadow: 'inset 0 0 5px #d4d9df' }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">
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
              required
              autoComplete="current-password"
              style={{ boxShadow: 'inset 0 0 5px #d4d9df' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            style={{ fontSize: '1.15rem', padding: '0.6rem' }}
          >
            Login
          </button>
        </form>

        <p className="mt-3 text-center text-muted" style={{ fontSize: '0.95rem' }}>
          Don’t have an account?{' '}
          <Link to="/register" className="text-primary text-decoration-underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
