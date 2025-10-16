import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    // Get the model instance
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    // Generate content
    const result = await model.generateContent("Hello Gemini!");
    
    // Print the text output
    console.log("✅ Success:", result.response.text());
  } catch (err) {
    console.error("❌ Failed:", err.message);
  }
}

testGemini();
