import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/authcontext.js";
import "../styles/homepage.css";

export default function StreakWidget() {
  const { token } = useAuth();
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await axios.get("/api/users/streak", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // assuming your backend returns: { streak: X, maxStreak: Y }
        setStreak(res.data.streak);
        setMaxStreak(res.data.maxStreak);
      } catch (err) {
        console.error("Failed to fetch streak:", err);
      }
    };

    if (token) fetchStreak();
  }, [token]);

  return (
    <div className="widget streak-widget">
      <h4>🔥 Streak</h4>

      {/* progress bar for current streak */}
      <div className="streak-bar">
        <div
          className="streak-fill"
          style={{ width: `${Math.min(streak, 30) * (100 / 30)}%` }}
        ></div>
      </div>

      {/* current streak */}
      <p className="streak-info">
        Current streak: {streak} day{streak !== 1 ? "s" : ""}
      </p>

      {/* max streak */}
      <p className="streak-info">
        Longest streak: {maxStreak} day{maxStreak !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
