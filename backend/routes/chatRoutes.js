import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message = "", vitals = {}, history = [] } = req.body;
    if (!message.trim()) return res.json({ reply: "Please enter a message 😊" });

    const offTopic = !/(health|diet|sleep|exercise|heart|bp|oxygen|spo2|body|fitness|food|calories|hydration|suggestions)/i.test(message);
    if (offTopic)
      return res.json({ reply: "I'm your HealthMate 🤖 — I can only chat about your health, wellness, or daily routine." });

    const chatHistory = history
      ?.map((m) => `${m.sender === "user" ? "User" : "HealthMate"}: ${m.text}`)
      .join("\n");

    const prompt = `
You are HealthMate, a friendly AI health assistant.
Only discuss health, wellness, and motivation — never medical diagnoses.

Vitals:
💓 Heart Rate: ${vitals?.heartRate || "N/A"} bpm
🩸 SpO₂: ${vitals?.spo2 || "N/A"}%
🩺 Blood Pressure: ${vitals?.bp || "N/A"}
🌡️ Temperature: ${vitals?.temp || "N/A"} °C
🚶 Steps: ${vitals?.steps || "N/A"}

Chat history:
${chatHistory || "None"}

User: ${message}
HealthMate:
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text() || "Hmm, can you rephrase that?";
    res.json({ reply });
  } catch (err) {
    console.error("⚠️ Gemini API Error:", err);
    res.status(500).json({ reply: "⚠️ HealthMate is currently unavailable. Try again later." });
  }
});

export default router;
