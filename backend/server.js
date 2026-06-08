const PDFDocument = require("pdfkit");
const path = require("path");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require("fs");

const {
  analyzeResume,
  rewriteResume,
  analyzeJobMatch,
  generateRoadmap,
} = require("./gemini");

console.log(
  "Using Groq key:",
  process.env.GROQ_API_KEY?.slice(0, 10)
);

console.log(
  "analyzeResume:",
  typeof analyzeResume
);

console.log(
  "rewriteResume:",
  typeof rewriteResume
);

const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("PrepMate Backend Running");
});

/* =========================
   RESUME ANALYSIS
========================= */

app.post(
  "/upload",
  upload.single("resume"),
  async (req, res) => {
    try {
      console.log("Upload route hit");

      const dataBuffer =
        fs.readFileSync(req.file.path);

      const pdfData = await pdf(dataBuffer);

      const resumeText = pdfData.text;

      console.log(
        "Resume length:",
        resumeText.length
      );

      console.log(
        "Resume preview:"
      );

      console.log(
        resumeText.substring(0, 300)
      );

      const analysis =
        await analyzeResume(resumeText);

      console.log(
        "Raw AI response:"
      );

      console.log(analysis);

      const cleaned = analysis
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
        console.log("CLEANED RESPONSE:");
console.log(cleaned);

      let parsed = JSON.parse(cleaned);

if (Array.isArray(parsed)) {
  parsed = parsed[0];
}

parsed.strengths = parsed.strengths || [];
parsed.weaknesses = parsed.weaknesses || [];
parsed.missingSkills = parsed.missingSkills || [];
parsed.suggestions = parsed.suggestions || [];

// Calculate ATS score
let score = 50;

// strengths
score += parsed.strengths.length * 2;

// weaknesses
score -= parsed.weaknesses.length * 2;

// missing skills
score -= parsed.missingSkills.length * 3;

// resume size bonus
if (resumeText.length > 4000) {
  score += 30;
}
else if (resumeText.length > 3000) {
  score += 20;
}
else if (resumeText.length > 2000) {
  score += 10;
}

// internship / experience bonus
const text = resumeText.toLowerCase();

if (
  text.includes("intern") ||
  text.includes("experience") ||
  text.includes("servicenow") ||
  text.includes("product manager")
) {
  score += 15;
}

score = Math.max(40, Math.min(95, score));

parsed.score = score;
console.log("FINAL RESULT:");
console.log(parsed);

return res.json({
  success: true,
  result: parsed,
});
      
    } catch (error) {
      console.error(
        "FULL ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

/* =========================
   RESUME REWRITER
========================= */

app.post(
  "/rewrite",
  upload.single("resume"),
  async (req, res) => {
    try {
      const dataBuffer =
        fs.readFileSync(req.file.path);

      const pdfData =
        await pdf(dataBuffer);

      const improvedResume =
        await rewriteResume(
          pdfData.text
        );

      return res.json({
        success: true,
        resume: improvedResume,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);
app.post(
  "/job-match",
  upload.single("resume"),
  async (req, res) => {
    try {
      const dataBuffer = fs.readFileSync(
        req.file.path
      );

      const pdfData = await pdf(dataBuffer);

      const resumeText = pdfData.text;

      const jobDescription =
        req.body.jobDescription;

      const analysis =
        await analyzeJobMatch(
          resumeText,
          jobDescription
        );

      const cleaned = analysis
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      return res.json({
        success: true,
        result: parsed,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);
app.post("/download-pdf", async (req, res) => {
  try {
    const { resume } = req.body;

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Improved_Resume.pdf"'
    );

    doc.pipe(res);

    doc
      .fontSize(24)
      .text("Improved Resume", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(12)
      .text(resume);

    doc.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.post(
  "/roadmap",
  upload.single("resume"),
  async (req, res) => {
    try {
      const dataBuffer =
        fs.readFileSync(req.file.path);

      const pdfData =
        await pdf(dataBuffer);

      const resumeText =
        pdfData.text;

      const jobDescription =
        req.body.jobDescription;

      const roadmap =
        await generateRoadmap(
          resumeText,
          jobDescription
        );

      const cleaned = roadmap
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed =
        JSON.parse(cleaned);

      res.json({
        success: true,
        result: parsed,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

app.listen(5001, () => {
  console.log(
    "Server running on port 5001"
  );
});