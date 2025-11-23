import express from "express";
import cors from "cors";
import multer from "multer";
import pdfParse from "pdf-parse";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();

const VERTEX_API_KEY = process.env.VERTEX_API_KEY;
console.log("API KEY FOUND?", !!VERTEX_API_KEY);

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const pdf = await pdfParse(req.file.buffer);

    const prompt = `
Analyze this resume and return:
- ATS Score /100
- Skill Match Score /100
- Grammar Score /100
- Summary
- Improvements

Resume:
${pdf.text}
`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + VERTEX_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const result =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.json({ success: true, output: result });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer Backend Running");
});

app.listen(8080, () => console.log("Server running on 8080"));
