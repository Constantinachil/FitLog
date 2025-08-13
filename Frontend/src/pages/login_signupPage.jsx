import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/login_signupPage.css"; 

export default function LoginSignUpPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    securityQuestionId: "",
    securityAnswer: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (!isLogin) {
      axios.get("/api/security-questions")
        .then(res => setQuestions(res.data))
        .catch(err => console.error(err));
    }
  }, [isLogin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const res = await axios.post("/api/users/login", {
          email: formData.email,
          password: formData.password,
        });
        setMessage("Login successful!");
        localStorage.setItem("token", res.data.token);
        window.location.href = "/";
      } else {
        const res = await axios.post("/api/users/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          securityQuestionId: formData.securityQuestionId,
          securityAnswer: formData.securityAnswer,
        });
        setMessage("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        {!isLogin && (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

          <div className="mb-3">
            <select
              className="form-control"
              name="securityQuestionId"
              value={formData.securityQuestionId}
              onChange={handleChange}
              required
            >
              <option value="">Select a security question</option>
              {questions.map(q => (
                <option key={q.id} value={q.id}>{q.question}</option>
              ))}
            </select>
          </div>
            <input
              type="text"
              name="securityAnswer"
              placeholder="Security Answer"
              value={formData.securityAnswer}
              onChange={handleChange}
              required
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <i
            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-password`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>

        {message && <p className="message">{message}</p>}

        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="toggle-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>

        {isLogin && (
          <div className="forgot-password">
            <a href="/forgot-password">Forgot your password?</a>
          </div>
        )}
      </form>
    </div>
  );
}
