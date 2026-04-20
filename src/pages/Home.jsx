import { useState, useEffect } from "react";
import { Wand2 } from "lucide-react";
import { processText } from "../api/apiClient";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Home() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [feature, setFeature] = useState("summary");
    const [loading, setLoading] = useState(false);

    const [studentName, setStudentName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [course, setCourse] = useState("");
    const [faculty, setFaculty] = useState("");
    const [assignmentNumber, setAssignmentNumber] = useState("");

    const LIMIT = 5;

    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("date");
    const storedUsage = parseInt(localStorage.getItem("usage")) || 0;

    const [usage, setUsage] = useState(
        storedDate === today ? storedUsage : 0
    );

    useEffect(() => {
        if (storedDate !== today) {
            localStorage.setItem("date", today);
            localStorage.setItem("usage", 0);
            setUsage(0);
        }
    }, []);

    /* =========================
       🚀 GENERATE
    ========================= */
    const handleGenerate = async () => {
        if (!input.trim()) return;

        if (usage >= LIMIT) {
            toast.error("Daily limit reached. Try tomorrow.");
            return;
        }

        setLoading(true);
        setOutput("");

        try {
            const result = await processText(
                input,
                feature,
                studentName,
                studentId,
                course,
                faculty,
                assignmentNumber
            );

            setOutput(result);

            const newUsage = usage + 1;
            setUsage(newUsage);
            localStorage.setItem("usage", newUsage);
            localStorage.setItem("date", today);

        } catch (err) {
            console.error(err);
            toast.error("Failed to generate");
        }

        setLoading(false);
    };

    /* =========================
       📋 COPY
    ========================= */
    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        toast.success("Copied!");
    };

    /* =========================
       📥 DOWNLOAD
    ========================= */
    const handleDownload = async () => {
        if (!input.trim()) return;

        try {
            const res = await fetch("http://localhost:5000/api/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    input,
                    feature,
                    studentName,
                    studentId,
                    course,
                    faculty,
                    assignmentNumber,
                }),
            });

            if (!res.ok) {
                toast.error("Failed to generate file");
                return;
            } else {
                toast.success("Generating file...");
            }

            const blob = await res.blob();

            if (blob.size === 0) {
                toast.error("File corrupted");
                return;
            }

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${feature}-assignment.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            toast.error("Download error");
        }
    };

    return (
        <div id="home" className="relative min-h-screen bg-gray-950 text-white">

            {/* 🌈 Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl"></div>

            <div className="relative max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

                {/* 🏷️ TITLE */}
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2">
                        ASSIGNPRO ✨
                    </h1>
                    <p className="text-center text-gray-400 mb-6">
                        Your AI Assignment Assistant
                    </p>
                </motion.div>

                {/* ⚙️ FEATURES */}
                <motion.div
                    className="flex gap-2 overflow-x-auto pb-2 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {["summary", "humanize", "handwritten"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFeature(f)}
                            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                                feature === f
                                    ? "bg-blue-500"
                                    : "bg-white/10 backdrop-blur border border-white/10"
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </motion.div>

                {/* 🧾 FORM */}
                <motion.div
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <input
                            placeholder="Student Name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="p-3 bg-white/10 border border-white/10 rounded-lg"
                        />

                        <input
                            placeholder="Student ID"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="p-3 bg-white/10 border border-white/10 rounded-lg"
                        />

                        <input
                            placeholder="Course"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="p-3 bg-white/10 border border-white/10 rounded-lg"
                        />

                        <input
                            placeholder="Faculty"
                            value={faculty}
                            onChange={(e) => setFaculty(e.target.value)}
                            className="p-3 bg-white/10 border border-white/10 rounded-lg"
                        />

                        <input
                            placeholder="Assignment No (e.g. 1)"
                            value={assignmentNumber}
                            onChange={(e) => setAssignmentNumber(e.target.value)}
                            className="p-3 bg-white/10 border border-white/10 rounded-lg col-span-2"
                        />
                    </div>

                    <textarea
                        className="w-full mt-4 p-3 bg-white/10 border border-white/10 rounded-lg resize-none"
                        rows="5"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-5 bg-blue-500 py-4 rounded-xl flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        <Wand2 size={18} />
                        {loading ? "Generating..." : "Generate"}
                    </button>
                </motion.div>

                {/* 📤 OUTPUT */}
                {output && (
                    <motion.div
                        className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex justify-between mb-3 text-sm">
                            <button onClick={handleCopy}>Copy</button>
                            <button onClick={handleDownload}>Download</button>
                        </div>

                        <p className="whitespace-pre-wrap text-gray-200 text-sm sm:text-base leading-relaxed">
                            {output}
                        </p>
                    </motion.div>
                )}

            </div>
        </div>
    );
}