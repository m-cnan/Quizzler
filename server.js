// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();

// if (!process.env.GEMINI_API_KEY) {
//     console.error("❌ API key is missing! Check your .env file.");
//     process.exit(1);
// }

// const app = express();
// app.use(cors());
// app.use(express.json());

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// app.post("/generate-quiz", async (req, res) => {
//     const { difficulty, topic, numQuestions } = req.body;

//     if (!topic || !numQuestions) {
//         return res.status(400).json({ error: "Missing required fields" });
//     }

//     const prompt = `
// Generate ${numQuestions} multiple-choice questions on ${topic} with ${difficulty} difficulty.
// Each question should have exactly 4 options and one correct answer.
// Respond ONLY with pure JSON. No explanations, no code blocks.
// Format:
// [
//   {"question": "What is 2+2?", "options": ["2", "3", "4", "5"], "answer": "4"},
//   {"question": "Capital of France?", "options": ["Berlin", "Paris", "Rome", "Madrid"], "answer": "Paris"}
// ]
// `;

//     try {
//         const result = await model.generateContent(prompt);
//         const responseText = await result.response.text();
//         const jsonMatch = responseText.match(/\[.*\]/s);
//         if (!jsonMatch) throw new Error("Invalid AI response format");

//         const questions = JSON.parse(jsonMatch[0]);
//         res.json({ questions });
//     } catch (error) {
//         console.error("AI Error:", error);
//         res.status(500).json({ error: "Failed to generate quiz" });
//     }
// });

// app.listen(3000, () => console.log("✅ Server running on port 3000"));
import express from "express";
import dotenv from "dotenv";
import cors from "cors";


import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ API key is missing! Check your .env file.");
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post("/generate-quiz", async (req, res) => {
    const { difficulty, topic, numQuestions } = req.body;

    if (!topic || !numQuestions) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `
Generate ${numQuestions} multiple-choice questions on ${topic} with ${difficulty} difficulty.
Each question should have exactly 4 options and one correct answer.
Respond ONLY with pure JSON. No explanations, no code blocks.
Format:
[
  {"question": "What is 2+2?", "options": ["2", "3", "4", "5"], "answer": "4"},
  {"question": "Capital of France?", "options": ["Berlin", "Paris", "Rome", "Madrid"], "answer": "Paris"}
]
`;

    try {
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        const jsonMatch = responseText.match(/\[.*\]/s);
        if (!jsonMatch) throw new Error("Invalid AI response format");

        const questions = JSON.parse(jsonMatch[0]);
        res.json({ questions });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to generate quiz" });
    }
});

app.use(express.static("public")); // Serve frontend files

app.listen(3000, () => console.log("✅ Server running on port 3000"));

