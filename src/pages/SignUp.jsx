import { useState } from "react";
import { motion } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created!");
      navigate("/app");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed up with Google!");
      navigate("/app");
    } catch (err) {
      toast.error("Google signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <motion.div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-full max-w-sm">
        
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Account
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 bg-white/10 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 bg-white/10 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 py-3 rounded mb-3"
        >
          Sign Up
        </button>

        <button
          onClick={handleGoogleSignup}
          className="w-full bg-white text-black py-3 rounded mb-3"
        >
          Continue with Google
        </button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>

      </motion.div>
    </div>
  );
}