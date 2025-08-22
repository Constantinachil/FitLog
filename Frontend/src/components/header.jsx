import React from "react";
import "./header.css";
import logo from "../assets/logo_no_background.png";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg header">
      <div className="container-fluid px-3">
        <a className="navbar-brand d-flex align-items-center" href={isLoggedIn ? "/homepage" : "/login"}>
          <img src={logo} alt="Logo" className="logo" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {isLoggedIn && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/homepage">Home</a>
              </li>

              {/* 🔐 Protected Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Programs
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/view">My Programs</a></li>
                  <li><a className="dropdown-item" href="/search">Our Programs</a></li>
                </ul>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/calculator">Calculator</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile">Profile</a>
              </li>

              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
