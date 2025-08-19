import React from "react";
import "./footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";

export default function footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Left: About */}
        <div className="footer-section">
          <h5>About</h5>
          <p>FitLog is your personal fitness tracker and progress planner.</p>
        </div>

        {/* Center: Links */}
        <div className="footer-section center-section">
          <p>© 2025 FitLog. All rights reserved.</p>
        </div>

        {/* Right: Contact */}
        <div className="footer-section">
          <h5>Contact</h5>
          <p>Email: int02620@uoi.gr</p>
          <p>Phone: +30 698 597 2291</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer">
              <FaDiscord />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
