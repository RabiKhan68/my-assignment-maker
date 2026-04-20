import { Wand2, FileDown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-gray-950 text-white">

      {/* 🔥 HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Create Assignments in Seconds ⚡
        </h1>

        <p className="text-gray-400 max-w-xl mb-6">
          Generate clean, structured, and ready-to-submit assignments using AI.
          Save time and focus on what matters.
        </p>

        <Link
          to="/app"
          className="bg-blue-500 px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition"
        >
          Get Started
        </Link>
      </section>

      {/* 🚀 FEATURES */}
      <section id="features" className="py-16 px-6 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-10">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <Wand2 className="mx-auto mb-3" />
            <h3 className="font-semibold mb-2">AI Generation</h3>
            <p className="text-gray-400 text-sm">
              Instantly generate answers for programming & theory questions.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <FileDown className="mx-auto mb-3" />
            <h3 className="font-semibold mb-2">DOCX Export</h3>
            <p className="text-gray-400 text-sm">
              Download beautifully formatted assignments in one click.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <Sparkles className="mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Smart Formatting</h3>
            <p className="text-gray-400 text-sm">
              Automatic code detection and clean structure.
            </p>
          </div>

        </div>
      </section>

      {/* ℹ️ ABOUT */}
      <section id="about" className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">About</h2>

        <p className="text-gray-400 max-w-2xl mx-auto">
          ASSIGNPRO is built to help students generate high-quality assignments
          quickly and efficiently. Whether it's programming or theory, our AI
          ensures structured, clean, and submission-ready results.
        </p>
      </section>

    </div>
  );
}