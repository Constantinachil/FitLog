import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/homepage.css";
import { useAuth } from "../components/authcontext.js";
import StickyNotes from "../components/stickynotes.jsx";
import StreakWidget from "../components/streakwidget.jsx";

export default function HomePage() {
  const [calendarValue, setCalendarValue] = useState(new Date());
  const { usageSeconds, user } = useAuth();

  const usagePercentage = Math.min((usageSeconds / (60 * 60)) * 100, 100);

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
            <h4>⏱️ Usage Time</h4>
            <div className="progress-circle">
              <svg>
                <circle cx="50" cy="50" r="45" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    strokeDashoffset: 282 - usagePercentage * 2.82,
                  }}
                />
              </svg>
              <div className="progress-text">
                {usagePercentage.toFixed(1)}%
              </div>
            </div>
            <p className="usage-info">
              You’ve been active for {(usageSeconds / 60).toFixed(1)} mins
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
