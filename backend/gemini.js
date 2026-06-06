require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
apiKey: process.env.GROQ_API_KEY,
});

console.log(
"Groq key:",
process.env.GROQ_API_KEY?.slice(0, 10)
);

async function analyzeResume(text) {
const prompt = `
Return ONLY valid JSON.

Do NOT return markdown.
Do NOT return explanations.
Do NOT return any text before or after the JSON.

Analyze the resume and calculate an ATS score from 0-100.

JSON format:

{
"strengths": [],
"weaknesses": [],
"missingSkills": [],
"suggestions": []
}

Resume:

${text}
`;

const completion =
await groq.chat.completions.create({
model: "llama-3.1-8b-instant",
messages: [
{
role: "user",
content: prompt,
},
],
temperature: 0.2,
response_format: {
type: "json_object",
},
});

const response =
completion.choices[0].message.content;

console.log("RAW GROQ RESPONSE:");
console.log(response);

return response;
}

async function rewriteResume(text) {
const prompt = `
You are an expert ATS resume writer.

Rewrite this resume to:

* Improve ATS score
* Improve formatting
* Use stronger action verbs
* Improve readability
* Highlight achievements
* Keep all information truthful

Resume:

${text}

Return only the rewritten resume.
`;

const completion =
await groq.chat.completions.create({
model: "llama-3.1-8b-instant",
messages: [
{
role: "user",
content: prompt,
},
],
temperature: 0.4,
});

return completion.choices[0].message.content;
}
async function analyzeJobMatch(
  resumeText,
  jobDescription
) {
  const prompt = `
You are an ATS and hiring expert.

Compare this resume against the job description.

Return ONLY valid JSON.

{
  "matchScore": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "suggestions": []
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

  return completion.choices[0].message.content;
}

module.exports = {
  analyzeResume,
  rewriteResume,
  analyzeJobMatch,
};
