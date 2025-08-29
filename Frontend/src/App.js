import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import LoginSignUpPage from "./pages/login_signupPage";
import ForgotPassword from "./pages/forgot_password";
import HomePage from "./pages/homepage";
import ProtectedRoute from "./components/protectedroute";
import PublicRoute from "./components/publicroute";
import View from "./pages/view";
import Search from "./pages/search";
import Calculator from "./pages/calculator";
import Profile from "./pages/profile";
import { AuthProvider, useAuth } from "./components/authcontext.js";

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/homepage" replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginSignUpPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* Protected */}
      <Route
        path="/homepage"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/view"
        element={
          <ProtectedRoute>
            <View />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calculator"
        element={
          <ProtectedRoute>
            <Calculator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
