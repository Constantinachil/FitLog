import React from "react";
import "./header.css";
import logo from "../assets/logo_no_background.png";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg header">
      <div className="container-fluid px-3">
        <a className="navbar-brand d-flex align-items-center" href="/homepage">
          <img src={logo} alt="Logo" className="logo" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/homepage">Home</a>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Programs
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="/programs/view">My Programs</a></li>
                <li><a className="dropdown-item" href="/programs/search">Our Programs</a></li>
              </ul>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/calculator">Calculator</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/profile">Profile</a>
            </li>

            {/* Show Logout only when logged in */}
            {isLoggedIn && (
              <li className="nav-item">
                <span className="nav-link" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                  Logout
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
