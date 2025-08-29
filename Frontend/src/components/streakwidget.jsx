import React from "react";
import { useAuth } from "../components/authcontext.js";
import "../styles/homepage.css";

export default function StreakWidget() {
  const { streak } = useAuth();

  return (
    <div className="widget streak-widget">
      <h4>🔥 Streak</h4>
      <div className="streak-bar">
        <div
          className="streak-fill"
          style={{ width: `${Math.min(streak, 30) * (100 / 30)}%` }}
        ></div>
      </div>
      <p className="streak-info">{streak} day{streak !== 1 ? "s" : ""} in a row</p>
    </div>
  );
}
