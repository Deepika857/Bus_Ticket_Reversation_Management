import React, { useState } from "react";
import BusManagement from "./BusManagement";
import TripManagement from "./TripManagement";
import BookingManagement from "./BookingManagement";
import RouteManagement from "./RouteManagement";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("bus");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "bus":
        return <BusManagement />;
      case "route":
        return <RouteManagement />;
      case "trip":
        return <TripManagement />;
      case "booking":
        return <BookingManagement />;
      default:
        return <BusManagement />;
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm">
        <span className="navbar-brand fw-bold fs-4">Admin Dashboard</span>
        <div className="navbar-nav ms-auto d-flex flex-row align-items-center">
          {["bus", "route", "trip", "booking"].map((section) => (
            <a
              key={section}
              href="#!"
              onClick={() => setActiveSection(section)}
              className={`nav-link fw-semibold px-3 ${
                activeSection === section ? "active border-bottom border-3 border-white" : "text-white"
              }`}
              style={{ cursor: "pointer" }}
            >
              {section === "bus"
                ? "Buses"
                : section === "route"
                ? "Routes"
                : section === "trip"
                ? "Trips"
                : "Bookings/Payments"}
            </a>
          ))}
        </div>
        <button
          className="btn btn-danger fw-semibold"
          onClick={handleLogout}
          style={{ minWidth: "90px" }}
        >
          Logout
        </button>
      </nav>

      <div className="container mt-4">{renderSection()}</div>
    </div>
  );
}

export default AdminDashboard;
