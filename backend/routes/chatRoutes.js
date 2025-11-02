import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { message = "", vitals = {}, history = [] } = req.body;
    
    if (!message.trim()) {
      return res.json({ 
        reply: "👋 Hello! What would you like to know about your health today?" 
      });
    }

    // ✅ Enhanced off-topic detection with helpful redirect
    const healthKeywords = /(health|diet|sleep|exercise|heart|bp|blood pressure|oxygen|spo2|body|fitness|food|calories|hydration|water|vitamin|nutrition|workout|cardio|weight|bmi|stress|mental|wellness|vitals|temperature|fever|steps|walk|run|sugar|diabetes|cholesterol|medicine|doctor|symptoms|pain|fatigue|energy)/i;
    
    const offTopic = !healthKeywords.test(message);
    
    if (offTopic) {
      return res.json({ 
        reply: `I'm your HealthMate AI 🤖 — I specialize in health and wellness topics!\n\nI can help you with:\n• Understanding your vitals 💓\n• Nutrition advice 🥗\n• Exercise tips 🏃‍♂️\n• Sleep improvement 😴\n• General wellness 🌟\n\nTry asking: "Is my heart rate normal?" or "How can I improve my sleep?"` 
      });
    }

    const chatHistory = history
      ?.slice(-3) // Only last 3 messages for context
      .map((m) => `${m.sender === "user" ? "User" : "HealthMate"}: ${m.text}`)
      .join("\n");

    const prompt = `
You are HealthMate, a friendly and knowledgeable AI health assistant created to help users understand their health data and provide wellness guidance.

**Your Role:**
- Provide accurate, helpful health information
- Explain vitals in simple, easy-to-understand language
- Give practical wellness tips and lifestyle advice
- Be encouraging and supportive
- Use emojis appropriately to make responses friendly

**Important Guidelines:**
- NEVER diagnose medical conditions
- NEVER prescribe medication
- Always recommend consulting healthcare professionals for serious concerns
- Keep responses concise (3-5 sentences)
- Be positive and motivating

**User's Current Vitals:**
💓 Heart Rate: ${vitals?.heartRate || "Not logged"} bpm
🩸 SpO₂: ${vitals?.spo2 || "Not logged"}%
🩺 Blood Pressure: ${vitals?.bp || "Not logged"} mmHg
🌡️ Temperature: ${vitals?.temp || "Not logged"}°F
👟 Steps: ${vitals?.steps || "Not logged"} steps

**Recent Conversation:**
${chatHistory || "None"}

**User Question:** ${message}

**HealthMate Response:**
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text() || "I'm not sure how to respond to that. Could you rephrase your health question?";
    
    res.json({ reply });
  } catch (err) {
    console.error("⚠️ Gemini API Error:", err);
    res.status(500).json({ 
      reply: "⚠️ I'm having trouble connecting right now. Please try again in a moment.\n\nIn the meantime, make sure you're logging your vitals regularly! 💪" 
    });
  }
});

export default router;