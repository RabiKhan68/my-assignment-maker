import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

/* =========================
   🤖 AI SETUP
========================= */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   🚦 RATE LIMITING
========================= */

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: "Too many AI requests. Wait 1 minute." },
});

app.use(generalLimiter);

/* =========================
   ⚡ CACHE
========================= */

const cache = new Map();

setInterval(() => {
  if (cache.size > 100) {
    cache.clear();
    console.log("🧹 Cache cleared");
  }
}, 10 * 60 * 1000);

/* =========================
   🧠 PROMPT
========================= */

const buildPrompt = (input) => `
Solve the following questions.

STRICT FORMAT:

QUESTION:
<question>

ANSWER:
<answer>

RULES:

- Programming:
  → ONLY code
  → NO explanation inside code

- Theory:
  → Short explanation
  → NO code

- DO NOT use markdown

Questions:
${input}
`;

/* =========================
   🧹 CLEAN TEXT
========================= */

const cleanText = (text = "") =>
  text.replace(/```[\s\S]*?```/g, "").trim();

/* =========================
   ⏱️ TIMEOUT
========================= */

const withTimeout = (promise, ms = 15000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    ),
  ]);

/* =========================
   🔁 AI ENGINE
========================= */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const generateWithAI = async (prompt) => {
  if (cache.has(prompt)) {
    console.log("⚡ Cache hit");
    return cache.get(prompt);
  }

  // 1️⃣ Gemini
  try {
    console.log("⚡ Gemini");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await withTimeout(model.generateContent(prompt));
    const text = (await result.response).text();

    cache.set(prompt, text);
    return text;
  } catch (err) {
    console.log("❌ Gemini:", err.message);
    await sleep(1500);
  }

  // 2️⃣ Grok
  try {
    console.log("⚡ Grok");

    const res = await withTimeout(
      grok.chat.completions.create({
        model: "grok-3-mini",
        messages: [{ role: "user", content: prompt }],
      })
    );

    const text = res?.choices?.[0]?.message?.content;

    if (text) {
      cache.set(prompt, text);
      return text;
    }
  } catch (err) {
    console.log("❌ Grok:", err.message);
  }

  // 3️⃣ OpenAI
  try {
    console.log("⚡ OpenAI");

    const res = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      })
    );

    const text = res?.choices?.[0]?.message?.content;

    if (text) {
      cache.set(prompt, text);
      return text;
    }
  } catch (err) {
    console.log("❌ OpenAI:", err.message);
  }

  return `
QUESTION:
Service Error

ANSWER:
All AI providers are currently unavailable.
`;
};

/* =========================
   🔍 SMART CODE DETECTION
========================= */

const isStrongCodeStart = (line) => {
  const t = line.trim();
  return (
    /^def\s/.test(t) ||
    /^function\s/.test(t) ||
    /^class\s/.test(t) ||
    /^import\s/.test(t) ||
    /^#include/.test(t) ||
    t.includes("{") ||
    t.includes("=>")
  );
};

const isCodeContinuation = (line) => {
  const t = line.trim();
  return (
    line.startsWith(" ") ||
    t.startsWith("#") ||
    t.startsWith("//") ||
    t.startsWith("/*") ||
    t.endsWith(";") ||
    t.includes("{") ||
    t.includes("}") ||
    /^[a-zA-Z_]+\s*=/.test(t)
  );
};

/* =========================
   📄 DOCX GENERATOR
========================= */

const createCodeBlock = (lines) =>
  new Paragraph({
    children: lines.flatMap((line) => [
      new TextRun({
        text: line.replace(/\t/g, "    "),
        font: "Courier New",
        size: 22,
        color: "D4D4D4",
      }),
      new TextRun({ text: "\n", break: 1 }),
    ]),
    shading: { fill: "1E1E1E" },
    spacing: { after: 300, line: 320 },
  });

const generateDocx = async (text, details, feature) => {
  const { studentName, studentId, course, faculty, assignmentNumber } = details;

  const fontstyle =
    feature === "handwritten" ? "Comic Sans MS" : "Times New Roman";

  const lines = text.split("\n");

  const content = [];
  let codeBuffer = [];
  let insideAnswer = false;
  let inCodeBlock = false;

  const flushCode = () => {
    if (codeBuffer.length > 0) {
      content.push(createCodeBlock(codeBuffer));
      codeBuffer = [];
    }
  };

  lines.forEach((raw) => {
    const line = raw.replace(/\r/g, "");
    const trimmed = line.trim();

    // QUESTION
    if (trimmed.toUpperCase().startsWith("QUESTION")) {
      flushCode();
      insideAnswer = false;
      inCodeBlock = false;

      content.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, bold: true, size: 28 })],
          shading: { fill: "D9EAF7" },
          spacing: { after: 300 },
        })
      );
      return;
    }

    // ANSWER
    if (trimmed.toUpperCase().startsWith("ANSWER")) {
      flushCode();
      insideAnswer = true;
      inCodeBlock = false;

      content.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, bold: true, size: 26 })],
          spacing: { after: 200 },
        })
      );
      return;
    }

    // CODE DETECTION
    if (insideAnswer) {
      if (!inCodeBlock && isStrongCodeStart(line)) {
        inCodeBlock = true;
      }

      if (inCodeBlock) {
        if (trimmed === "") {
          codeBuffer.push("");
          return;
        }

        if (isCodeContinuation(line) || isStrongCodeStart(line)) {
          codeBuffer.push(line);
          return;
        }

        inCodeBlock = false;
        flushCode();
      }
    }

    flushCode();

    if (trimmed.length > 0) {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed,
              size: 26,
              font: fontstyle,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }
  });

  flushCode();

  const title = assignmentNumber
  ? `ASSIGNMENT ${assignmentNumber}`
  : "ASSIGNMENT";

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({ text: `Name: ${studentName || "N/A"}` }),
          new Paragraph({ text: `ID: ${studentId || "N/A"}` }),
          new Paragraph({ text: `Course: ${course || "N/A"}` }),
          new Paragraph({
            text: `Faculty: ${faculty || "N/A"}`,
            spacing: { after: 300 },
          }),
          ...content,
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
};

/* =========================
   🌐 API
========================= */

app.post("/api/process", aiLimiter, async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input required" });
    }

    const text = cleanText(await generateWithAI(buildPrompt(input)));

    res.json({ output: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
});

app.post("/api/download", aiLimiter, async (req, res) => {
  try {
    const { input, feature, studentName, studentId, course, faculty, assignmentNumber } =
      req.body;

    const text = cleanText(await generateWithAI(buildPrompt(input)));

    const doc = await generateDocx(
      text,
      { studentName, studentId, course, faculty, assignmentNumber },
      feature
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    res.setHeader("Content-Disposition", "attachment; filename=assignment.docx");

    res.end(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed" });
  }
});

/* =========================
   🚀 START SERVER
========================= */

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});