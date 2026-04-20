import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { User } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, loginWithGoogle, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);

  /* =========================
     🧠 HANDLE NAVIGATION
  ========================= */
  const handleClick = (item) => {
    setOpen(false);

    if (item === "landing") navigate("/");
    if (item === "app") navigate("/app");

    if (item === "features" || item === "about") {
      if (location.pathname !== "/") {
        navigate("/");
        requestAnimationFrame(() => {
          setTimeout(() => {
            document
              .getElementById(item)
              ?.scrollIntoView({ behavior: "smooth" });
          }, 50);
        });
      } else {
        document
          .getElementById(item)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isActive = (item) => {
    if (item === "landing") return location.pathname === "/";
    if (item === "app") return location.pathname === "/app";
    return false;
  };

  /* =========================
     🧠 CLOSE DROPDOWN OUTSIDE CLICK
  ========================= */
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  /* =========================
     🔐 AUTH HANDLERS
  ========================= */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      setOpen(false);
    } catch {
      // handled in hook
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur border-b border-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* 🔹 LEFT */}
        <div className="flex items-center gap-4">

          {/* LOGO */}
          <h1
            className="text-lg font-semibold text-white cursor-pointer"
            onClick={() => handleClick("landing")}
          >
            ASSIGNPRO ✨
          </h1>

          {/* DESKTOP MENU */}
          <div className="hidden sm:flex gap-2 text-sm">
            <button
              onClick={() => handleClick("landing")}
              className={`px-3 py-1.5 rounded-full ${
                isActive("landing")
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleClick("features")}
              className="px-3 py-1.5 text-gray-400 hover:text-white"
            >
              Features
            </button>

            <button
              onClick={() => handleClick("about")}
              className="px-3 py-1.5 text-gray-400 hover:text-white"
            >
              About
            </button>

            <button
              onClick={() => handleClick("app")}
              className={`px-3 py-1.5 rounded-full ${
                isActive("app")
                  ? "bg-blue-500 text-white"
                  : "bg-blue-500/80 text-white"
              }`}
            >
              App
            </button>
          </div>
        </div>

        {/* 🔹 RIGHT (USER) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-7 h-7 rounded-full overflow-hidden border border-white/20 
             hover:scale-105 transition duration-200 
             shadow-[0_0_10px_rgba(59,130,246,0.3)]
             w-full h-full flex items-center justify-center 
                bg-gradient-to-br from-blue-500/30 to-purple-500/30 
                animate-pulse"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-white/10 w-full h-full flex items-center justify-center text-sm">
                <User size={18} className="text-white opacity-80"></User>
              </div>
            )}
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-800 rounded-xl p-2 shadow-xl">

              {!user ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded text-white"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded text-white"
                  >
                    Sign Up
                  </button>

                  <button
                    onClick={handleGoogleLogin}
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded text-white"
                    disabled={loading}
                  >
                    {loading ? "Connecting..." : "Continue with Google"}
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-sm text-gray-300">
                    {user.displayName || "User"}
                  </div>

                  <div className="px-3 text-xs text-gray-500">
                    {user.email}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 mt-2 hover:bg-gray-800 rounded text-red-400"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      <div className="sm:hidden flex justify-center gap-3 pb-3 text-sm">
        <button onClick={() => handleClick("landing")} className="text-gray-400">
          Home
        </button>
        <button onClick={() => handleClick("features")} className="text-gray-400">
          Features
        </button>
        <button onClick={() => handleClick("about")} className="text-gray-400">
          About
        </button>
        <button onClick={() => handleClick("app")} className="text-blue-400">
          App
        </button>
      </div>
    </nav>
  );
}