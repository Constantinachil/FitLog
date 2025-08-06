import React from "react";
import "./footer.css";

export default function Footer() {
  return (
   <footer className="bg-light text-center text-lg-start mt-auto border-top">
      <div className="container p-3">
        <p className="mb-1">© {new Date().getFullYear()} FitLog. All rights reserved.</p>
        <div>
          <a href="/privacy" className="text-primary me-3">Privacy Policy</a>
          <a href="/terms" className="text-primary">Terms</a>
        </div>
      </div>
    </footer>
  );
}
