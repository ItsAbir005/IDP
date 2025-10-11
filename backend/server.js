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
    const { message, vitals } = req.body;

    // Block off-topic messages
    const offTopic = !/(health|diet|sleep|exercise|heart|bp|oxygen|spo2|body|fitness|food|calories|hydration)/i.test(
      message
    );
    if (offTopic) {
      return res.json({
        reply: "I'm your health assistant 🤖 — I can only talk about your health, fitness, and wellness.",
      });
    }

    // Construct system-aware prompt
    const prompt = `
You are HealthMate, a friendly health AI assistant.
Only discuss health, wellness, fitness, and motivation.
Use the provided vitals to give helpful advice — but never provide medical diagnosis.

User vitals:
💓 Heart Rate: ${vitals?.heartRate || "N/A"} bpm
🩸 SpO₂: ${vitals?.spo2 || "N/A"}%
🩺 Blood Pressure: ${vitals?.bp || "N/A"}
🌡️ Temperature: ${vitals?.temp || "N/A"} °C
🚶 Steps: ${vitals?.steps || "N/A"}

User: ${message}
HealthMate:
`;

    // Call Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.json({
      reply:
        "⚠️ Sorry, I couldn't connect to the AI right now. Here's a quick tip: stay hydrated and take deep breaths regularly 💧😌",
    });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
