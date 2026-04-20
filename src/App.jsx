import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ShootingStars from "./components/ShootingStars";
import PremiumBackground from "./components/PremiumBackground";

import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import useAuth from "./hooks/useAuth";

/* 🔒 Protected Route */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>

      {/* 🌌 Backgrounds */}
      <ShootingStars />
      <PremiumBackground />

      {/* 🔝 Navbar */}
      <Navbar />

      {/* 🚀 Routes */}
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ❌ Optional: catch unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* 🔔 Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />

      {/* 🔻 Footer */}
      <Footer />

    </BrowserRouter>
  );
}