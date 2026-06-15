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
      model: "llama-3.1-8b-instant",
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
async function generateRoadmap(
  resumeText,
  jobDescription
) {
  const prompt = `
Return ONLY valid JSON.

Do NOT return markdown.
Do NOT return explanations.
Do NOT return text before JSON.
Do NOT return text after JSON.

JSON format:

{
  "missingSkills": [],
  "roadmap": [
    {
      "week": "Week 1",
      "topics": []
    }
  ]
}

Resume:
${resumeText}

Job Description:
${jobDescription}
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
      temperature: 0.3,
    });

  return completion.choices[0].message.content;
}
async function generateInterviewQuestions(
  resumeText,
  jobDescription
) {
  const prompt = `
Return ONLY valid JSON.

Do NOT return markdown.
Do NOT return explanations.
Do NOT return text before JSON.
Do NOT return text after JSON.

Resume:
${resumeText}

Job Description:
${jobDescription}

Generate realistic interview QUESTIONS.

Return JSON:

{
  "technical": [],
  "dsa": [],
  "behavioral": [],
  "project": [],
  "hr": []
}

Rules:

- Analyze the job description.
- Determine which companies are likely to ask similar questions.
- Mention the company after each question.

Example:

"Explain Binary Search and its time complexity? (Frequently asked at Amazon)"

"What is the difference between HashMap and HashTable? (Frequently asked at Infosys)"

"Tell me about yourself. (Frequently asked at Deloitte)"

- Generate 5 Technical questions.
- Generate 5 DSA questions.
- Generate 5 Behavioral questions.
- Generate 5 Project questions based on resume projects.
- Generate 5 HR questions.

- Questions must be tailored to the candidate's resume and the job description.
- Return valid JSON only.
`;

  const completion =
    await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

  return completion.choices[0].message.content;
}
async function evaluateInterviewAnswer(
  question,
  answer
) {
  const prompt = `
You are a senior interviewer.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY JSON:

{
  "score": 0,
  "strengths": [],
  "improvements": [],
  "feedback": ""
}

Score should be between 0 and 10.
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
      temperature: 0.3,
    });

  return completion.choices[0].message.content;
}
async function careerMentor(
  question
) {

  const prompt = `
You are an expert career mentor.

Answer in a practical way.

Include:

1. Career advice
2. Learning roadmap
3. Resources
4. Common mistakes
5. Action plan

Question:

${question}
`;

  const completion =
    await groq.chat.completions.create({
      model:
        "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  return completion
    .choices[0]
    .message
    .content;
}

module.exports = {
  analyzeResume,
  rewriteResume,
  analyzeJobMatch,
  generateRoadmap,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  careerMentor
};


