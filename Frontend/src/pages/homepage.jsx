// HomePage.jsx
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/homepage.css";

export default function HomePage() {
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [usageSeconds, setUsageSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsageSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const usagePercentage = Math.min((usageSeconds / (60 * 60)) * 100, 100).toFixed(1); // max 1 hour = 100%

  return (
    <div classname="home-page">
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
                style={{ strokeDashoffset: 282 - (usagePercentage * 2.82) }}
              />
            </svg>
            <div className="progress-text">{usagePercentage}%</div>
          </div>
          <p className="usage-info">You’ve been active for {(usageSeconds / 60).toFixed(1)} mins</p>
        </div>
        

        <div className="widget placeholder-widget">
          <h4>🏋️‍♀️ Daily Goal</h4>
          <p>Coming soon...</p>
        </div>
      </aside>

      <main className="main-content">
        <h2>Welcome to FitLog!</h2>
        <p>Track your fitness, build routines, and monitor your progress.</p>
        <div className="dashboard-widgets">
          <div className="dashboard-card">📊 Statistics Widget (Coming Soon)</div>
          <div className="dashboard-card">🍎 Nutrition Tips</div>
        </div>
      </main>
    </div>
    </div>
  );
}
