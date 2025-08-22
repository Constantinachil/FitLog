import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import LoginSignUpPage from "./pages/login_signupPage";
import ForgotPassword from "./pages/forgot_password";
import HomePage from "./pages/homepage"; // You must create this if not already

function App() {
  // Check login status by looking for a token
  const isLoggedIn = localStorage.getItem("token");

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            {/* ✅ Dynamic redirect based on login */}
            <Route path="/" element={<Navigate to={isLoggedIn ? "/homepage" : "/login"} replace />} />

            {/* Routes */}
            <Route path="/login" element={<LoginSignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/homepage" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
