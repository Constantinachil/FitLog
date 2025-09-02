import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/homepage.css";
import { useAuth } from "../components/authcontext.js";
import StickyNotes from "../components/stickynotes.jsx";
import StreakWidget from "../components/streakwidget.jsx";
import {jwtDecode} from "jwt-decode";

export default function HomePage() {
  const [calendarValue, setCalendarValue] = useState(new Date());
  const { user } = useAuth();

  // ⏱️ State for countdown
const [timeLeft, setTimeLeft] = useState(0);
const [percentage, setPercentage] = useState(100);
const {logout} = useAuth();

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    const issuedAt = decoded.iat * 1000;
    const expiresAt = decoded.exp * 1000;
    const totalLifetime = expiresAt - issuedAt;

    const updateTime = () => {
      const diff = Math.max(0, expiresAt - Date.now());
      setTimeLeft(diff);
      setPercentage((diff / totalLifetime) * 100);
      if (diff <= 0) {
        clearInterval(interval); // stop ticking
        logout();                // auto logout
        window.location.href = "/login"; // optional redirect
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  } catch (err) {
    console.error("Failed to decode token:", err);
  }
}, [logout]);

const minutes = Math.floor(timeLeft / 60000);
const seconds = Math.floor((timeLeft % 60000) / 1000);
const [greetingMessage, setGreetingMessage] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreetingMessage("🌅 Good Morning");
    } else if (hours < 18) {
      setGreetingMessage("☀️ Good Afternoon");
    } else {
      setGreetingMessage("🌙 Good Evening");
    }
  }, []);

  return (
    <div className="home-page">
      <div className="homepage-container">
        <aside className="sidebar">
          <div className="widget calendar-widget">
            <h4>📅 Calendar</h4>
            <Calendar onChange={setCalendarValue} value={calendarValue} />
          </div>

          <div className="widget usage-widget">
            <h4>⏱️ Session Time Left</h4>
            <div className="progress-circle">
              <svg>
                <circle cx="50" cy="50" r="45" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    strokeDashoffset: 282 - percentage * 2.82,
                  }}
                />
              </svg>
              <div className="progress-text">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </div>
            </div>
            <p className="usage-info">
              
            </p>
          </div>

          <StickyNotes />
        </aside>

        <div className="center-content">
          <div className="greeting-section">
            <h2 className="greeting-text">
              {greetingMessage}, Welcome Back, {user || "User"}!
            </h2>
            <img
              src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3Z6ano3N3E4NG92YXBkZ3YxZzZ6Yjg3YjRnMXN2dTI3ODczcWN2NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3NjABnBOieYQE4BpkP/giphy.gif"
              alt="Motivation"
              className="greeting-gif"
            />
          </div>

          <StreakWidget />
        </div>

        <div className="right-content"></div>
      </div>
    </div>
  );
}
