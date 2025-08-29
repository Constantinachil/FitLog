import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [usageSeconds, setUsageSeconds] = useState(0);
  const [streak, setStreak] = useState(0);
  const [user, setUser] = useState(localStorage.getItem("username") || "");

  const login = (newToken, username) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", username);
    setToken(newToken);
    setUser(username);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsageSeconds(0);
  };

  // ✅ Handle streak logic only once on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem("lastLogin");

    if (lastLogin) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastLogin === yesterday.toDateString()) {
        const newStreak = (parseInt(localStorage.getItem("streak")) || 0) + 1;
        setStreak(newStreak);
        localStorage.setItem("streak", newStreak);
      } else if (lastLogin === today) {
        setStreak(parseInt(localStorage.getItem("streak")) || 1);
      } else {
        setStreak(1);
        localStorage.setItem("streak", 1);
      }
    } else {
      setStreak(1);
      localStorage.setItem("streak", 1);
    }

    localStorage.setItem("lastLogin", today);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn: !!token,
        login,
        logout,
        usageSeconds,
        streak,
        user,
        setUsageSeconds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
