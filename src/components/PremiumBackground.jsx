import { motion } from "framer-motion";

export default function PremiumBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      {/* 🌈 Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 blur-3xl" />

      {/* 🌫 Radial Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />

      {/* ✨ Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-[2px] h-[2px] bg-white/40 rounded-full"
          style={{
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
          }}
          animate={{
            y: ["0%", "-20%", "0%"],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 🌠 Shooting Stars */}
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="premium-star"
          style={{
            top: Math.random() * 80 + "%",
            left: Math.random() * 80 + "%",
            animationDelay: Math.random() * 10 + "s",
          }}
        />
      ))}
    </div>
  );
}