import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./sidebar.css";

export default function SidebarStats() {
  const [date, setDate] = useState(new Date());
  const [usageTime, setUsageTime] = useState(0); // in minutes or %

  // Example: simulate user usage time
  useEffect(() => {
    // Simulate: user has used 60 out of 120 minutes today (50%)
    const totalTime = 120;
    const usedTime = 60;
    const percentage = Math.round((usedTime / totalTime) * 100);
    setUsageTime(percentage);
  }, []);

  return (
    <div className="sidebar-box">
      <h4>📅 Today's Schedule</h4>
      <Calendar onChange={setDate} value={date} />

      <div className="progress-container">
        <div className="progress-label">
          <span>🕒 Usage Progress</span>
          <span>{usageTime}%</span>
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${usageTime}%` }}
            aria-valuenow={usageTime}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
  );
}
