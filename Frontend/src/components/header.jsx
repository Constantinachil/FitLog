import React from "react";
import "./header.css";
import logo from "../assets/logo_no_background.png";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/authcontext.js";

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout(); // use context logout
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg header">
      <div className="container-fluid px-3">
        <Link
          className="navbar-brand d-flex align-items-center"
          to={isLoggedIn ? "/homepage" : "/login"}
        >
          <img src={logo} alt="Logo" className="logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/homepage">
                Home
              </Link>
            </li>

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
                <li>
                  <Link className="dropdown-item" to="/view">
                    My Programs
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/search">
                    Our Programs
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/calculator">
                Calculator
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </li>

            {isLoggedIn && (
              <li className="nav-item">
                <button
                  className="btn btn-link nav-link"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
