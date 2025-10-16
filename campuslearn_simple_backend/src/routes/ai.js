const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


async function getFAQs() {
  const res = await fetch("http://localhost:5000/api/faqs");
  return await res.json();
}


router.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Missing message." });

  try {
    
    const faqs = await getFAQs();
    const lowerMsg = message.toLowerCase();
    for (const faq of faqs) {
      const keywords = faq.keywords
        ? faq.keywords.split(",").map((k) => k.trim().toLowerCase())
        : [];
      if (keywords.some((kw) => lowerMsg.includes(kw))) {
        return res.json({ reply: faq.answer, source: "faq" });
      }
    }


    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not set");
      return res.status(500).json({ reply: "AI service unavailable." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    const text = response.text || "No reply from AI.";
    res.json({ reply: text, source: "ai" });

  } catch (err) {
    console.error("Error in /chat:", err);
    if (err.status === 429) {
      return res.status(429).json({ reply: "AI service quota exceeded. Try later." });
    }
    res.status(500).json({ reply: "AI request failed." });
  }
});

module.exports = router;
