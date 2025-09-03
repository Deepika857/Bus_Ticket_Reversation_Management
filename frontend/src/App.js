import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import CustomerDashboard from './components/Dashboard/CustomerDashboard';
import PrivateRoute from './components/Utils/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
              
        <Route path="/admin/dashboard" element={
          <PrivateRoute roles={['ADMIN']}>
            <AdminDashboard />
          </PrivateRoute>
        } />

        <Route path="/customer/dashboard" element={
          <PrivateRoute roles={['CUSTOMER']}>
            <CustomerDashboard />
          </PrivateRoute>
        } />

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
