require("dotenv").config();
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const { parse } = require("dotenv");

const app = express();
const port = 3000;
let history = [];

app.use(cors({
  origin : "https://ai-resume-analyzer-six-lyart.vercel.app",
  methods: ["GET", "POST"],
  credentials: true,
}
));
app.use(express.json());
app.use(express.urlencoded({extended : true}))

// ---------- MULTER SETUP ----------
const storage = multer.memoryStorage();
const upload = multer({ storage });

async function callGemini(prompt) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" +
    process.env.GEMINI_API_KEY;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

const rawText = data.candidates[0].content.parts[0].text;

// sirf { ... } part uthao
const jsonMatch = rawText.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error("No JSON found in Gemini response");
}

const parsed = JSON.parse(jsonMatch[0]);

return parsed;

}

// ---------- TEST ROUTES ----------
app.get("/", (req, res) => {
  res.json({ message: "Home Page" });
});

app.get("/test", (req, res) => {
  res.json({ message: "Test Page" });
});

// ---------- UPLOAD ROUTE ----------
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1. Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;
    const jobDescription = req.body.jobDescription;


    // 2. Create prompt
    const prompt = `
This is a resume:
${resumeText}
This is a resume:
${jobDescription}

Compare the resume with the job description and return ONLY JSON in this format:
{
  "match_percentage": "",
  "missing_skills": [],
  "improvement_tips": []
}
`;

    // 3. Call Gemini
    const finalResult = await callGemini(prompt);

    // 4. Send response

    history.push({
    id: Date.now(),
    match_percentage: finalResult.match_percentage,
    missing_skills: finalResult.missing_skills,
    improvement_tips: finalResult.improvement_tips,
    createdAt: new Date()
    });

    res.json(finalResult);
    // res.send(analysis)
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong",
      details: err.message,
    });
  }
});

app.get('/history', (req, res)=> {
    res.json(history);
})

// ---------- START SERVER ----------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
