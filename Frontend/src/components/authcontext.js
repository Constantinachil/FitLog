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
  const [maxStreak, setMaxStreak] = useState(0);

  // --- LOGIN ---
 const login = (newToken, userData) => {
  saveToken(newToken);
  localStorage.setItem("username", userData.username);

  setToken(newToken);
  setUser(userData.username);
  setStreak(userData.streak || 0);
  setMaxStreak(userData.maxStreak || 0);
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
        maxStreak
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
