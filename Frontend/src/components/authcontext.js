import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getToken,
  setToken as saveToken,
  clearToken,
  isTokenExpired,
} from "../components/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = getToken();
    if (stored && !isTokenExpired(stored)) {
      return stored;
    } else {
      clearToken();
      return null;
    }
  });

  const [usageSeconds, setUsageSeconds] = useState(0);
  const [streak, setStreak] = useState(0);
  const [user, setUser] = useState(localStorage.getItem("username") || "Unnamed User");

  // --- LOGIN ---
  const login = (newToken, username) => {
    saveToken(newToken);
    localStorage.setItem("username", username);
    setToken(newToken);
    setUser(username);
  };

  // --- LOGOUT ---
  const logout = () => {
    clearToken();
    localStorage.removeItem("username");
    setToken(null);
    setUser("Unnamed User");
    setUsageSeconds(0);
  };

  // --- UPDATE USERNAME ---
  const updateUsername = (newUsername) => {
    setUser(newUsername);
    localStorage.setItem("username", newUsername);
  };

  // --- STREAK LOGIC ---
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
        setUsageSeconds,
        streak,
        user,
        updateUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
