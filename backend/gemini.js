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
  console.log("rewriteResume called");
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
console.log("Groq response received");


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

Return ONLY valid JSON.

Do not add explanations.
Do not add markdown.
Do not add text before or after JSON.

Example:

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
async function generateProjectIdeas(role) {

  const prompt = `
Suggest ONE strong portfolio project.

Skills:
${role}

Return ONLY valid JSON.

{
  "title":"",
  "description":"",
  "features":[
    "",
    "",
    ""
  ],
  "techStack":[
    "",
    ""
  ]
}

IMPORTANT:
- features must contain at least 5 items
- techStack must contain at least 3 items
- never return empty arrays
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
      temperature: 0.5,
    });

  return completion.choices[0].message.content;
}

async function careerMentor(
  question,
  resumeText,
  jobDescription
) {
  
const prompt = `
You are an expert career mentor.

Return ONLY valid JSON.

{
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "actionPlan": [
    {
      "title": "",
      "description": "",
      "tasks": [],
      "deadline": ""
    }
  ]
}
  ActionPlan Rules:
- Return exactly 5 action items
- Each action item must contain:
  - title
  - description
  - tasks
  - deadline
- description should be detailed
- tasks should contain at least 4 steps
Summary Rules:
- Write a detailed career analysis.
- Minimum 250 words.
- Explain current profile.
- Explain chances of cracking the target company.
- Explain biggest strengths.
- Explain biggest gaps.
- Explain what must be improved.
- Give realistic expectations.
- Use complete paragraphs.

Strengths:
- Return 5 strengths

Weaknesses:
- Return 5 weaknesses

ActionPlan:
- Return 5 action items

Resume:
${resumeText}

Question:
${question}
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

  const cleaned =
  completion.choices[0].message.content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

return JSON.parse(cleaned);
}
async function generateCompanyPrep(
  company,
  role
) {

  const prompt = `
Generate interview preparation data.

Company: ${company}
Role: ${role}

Return ONLY valid JSON.

{
  "company":"",
  "role":"",
  "interviewRounds":[
    {
      "round":"",
      "description":""
    }
  ],
  "importantTopics":[
    {
      "topic":"",
      "description":""
    }
  ],
  "resources":[
    {
      "resource":"",
      "description":""
    }
  ],
  "tips":[
    {
      "tip":"",
      "description":""
    }
  ]
}

IMPORTANT:
- Give at least 4 interview rounds.
- Give at least 6 important topics.
- Give at least 5 resources.
- Give at least 5 tips.
- Never leave arrays empty.
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

module.exports = {
  analyzeResume,
  rewriteResume,
  analyzeJobMatch,
  generateRoadmap,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  careerMentor,
  generateProjectIdeas,
  generateCompanyPrep
};


