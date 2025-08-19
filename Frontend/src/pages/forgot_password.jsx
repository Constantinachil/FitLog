import React, { useState } from "react";
import axios from "axios";
import "../styles/login_signupPage.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("/api/users/forgot-password/question", {
        email,
      });
      setSecurityQuestion(res.data.securityQuestion);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error finding user.");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post("/api/users/forgot-password/reset", {
        email,
        securityAnswer,
        newPassword,
      });
      setMessage("Password reset successful! You can now log in.");
      setStep(1);
      setEmail("");
      setSecurityAnswer("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Error resetting password.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {step === 1 && (
          <form className="auth-form" onSubmit={handleEmailSubmit}>
            <h2>Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Next</button>
            {message && <p className="message">{message}</p>}
          </form>
        )}

        {step === 2 && (
          <form className="auth-form" onSubmit={handleResetSubmit}>
            <h2>Answer Security Question</h2>
            <p><strong>{securityQuestion}</strong></p>
            <input
              type="text"
              placeholder="Your Answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
            {message && <p className="message">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
