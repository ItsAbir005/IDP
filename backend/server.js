import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST route for health chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { message, vitals, history } = req.body;

    // Filter out non-health topics
    const offTopic = !/(health|diet|sleep|exercise|heart|bp|oxygen|spo2|body|fitness|food|calories|hydration|suggestions)/i.test(message);
    if (offTopic) {
      return res.json({
        reply: "I'm your health assistant 🤖 — I can only talk about your health, fitness, and wellness.",
      });
    }

    // Build chat history text
    const chatHistory = history
      ?.map((m) => `${m.sender === "user" ? "User" : "HealthMate"}: ${m.text}`)
      .join("\n");

    const prompt = `
You are HealthMate, a friendly AI health assistant.
Only discuss health, wellness, and motivation — never give medical diagnoses.

User vitals:
💓 Heart Rate: ${vitals?.heartRate || "N/A"} bpm
🩸 SpO₂: ${vitals?.spo2 || "N/A"}%
🩺 Blood Pressure: ${vitals?.bp || "N/A"}
🌡️ Temperature: ${vitals?.temp || "N/A"} °C
🚶 Steps: ${vitals?.steps || "N/A"}

Conversation so far:
${chatHistory || "None"}

User: ${message}
HealthMate:
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.json({ reply: "⚠️ Sorry, the AI is not responding right now. Try again later!" });
  }
});


app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
