require("dotenv").config();
const projects = require("./projects");

const Groq = require("groq-sdk");

const groq = new Groq({
apiKey: process.env.GROQ_API_KEY,
});

console.log(
"Groq key:",
process.env.GROQ_API_KEY?.slice(0, 10)
);
async function analyzeResume(
  text,
  targetRole = "Software Engineer"
) {
  const prompt = `
Return ONLY valid JSON.
You are a senior hiring manager.

Do NOT give generic resume feedback.

Analyze exactly like a real recruiter hiring for:

${targetRole}

Be brutally honest.

Only mention weaknesses that genuinely exist.

Only mention missing skills that are required for this role.

If the role is Product Manager:
focus on:
- Product Thinking
- User Research
- Analytics
- A/B Testing
- Product Metrics
- Roadmaps
- Stakeholder Management
- PRDs
- Agile

If the role is Software Engineer:
focus on:
- DSA
- System Design
- Backend
- Frontend
- Databases
- APIs
- Projects
- Deployment

Avoid generic skills such as:
Cloud Computing
Cybersecurity
Machine Learning

unless they are actually required.

Analyze the resume for the target role.

Calculate ATS score realistically.

Scoring Rules:

Skills Match = 40 points
Projects = 20 points
Education = 10 points
Experience = 15 points
Keywords Match = 15 points

Do NOT give default scores.
Never use a default ATS score.

Different resumes must receive different ATS scores.

Calculate ATS score from the actual resume content.

Do not return common placeholder scores like 55, 65, 75, or 85 unless the resume genuinely earns them.

Use the scoring rubric above to compute the score.

If the resume lacks important skills for the target role,
reduce score significantly.

If the resume strongly matches the target role,
increase score.

A student resume should rarely exceed 80.

A strong fresher should score 65-80.

An excellent industry-ready profile should score 80-95.

{
  "atsScore": 0,
"readiness": "Industry Ready",
"strengths": [],
"weaknesses": [],
"missingSkills": [],
"suggestions": []
}
Target Role:
${targetRole}
Analyze specifically for this role and calculate ATS score based on this role only.

Resume:
${text}
Explain WHY each weakness exists.

Explain WHY each skill is missing.

Give realistic recruiter feedback.

Do not sound like ChatGPT.

Sound like a recruiter reviewing a candidate.
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
  const parsed = JSON.parse(response);

console.log("ATS FROM AI:", parsed.atsScore);

return JSON.stringify(parsed);

  
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
  jobDescription,
  duration
) {
  const days = parseInt(duration);
const weeks = Math.ceil(days / 7);
  const prompt = `
  Generate EXACTLY ${weeks} roadmap objects.

If weeks = 4, return Week 1 to Week 4 only.

If weeks = 9, return Week 1 to Week 9 only.

If weeks = 13, return Week 1 to Week 13 only.

Never generate extra weeks.
You are an expert career mentor.

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT return explanations.
Do NOT return text before JSON.
Do NOT return text after JSON.

Generate a COMPLETE learning roadmap.

Rules:
- Generate a complete learning roadmap for ${duration}.

Rules:

If duration is:
- 30 Days → Generate 4 weekly phases
- 60 Days → Generate 8 weekly phases
- 90 Days → Generate 12 weekly phases
- 120 Days → Generate 16 weekly phases
- 180 Days → Generate 24 weekly phases

The number of roadmap entries MUST match the selected duration.

Return only valid JSON.
- Every week must contain 4 to 6 topics.
- Topics should gradually increase in difficulty.
- Focus on helping the candidate become job-ready.
- Include DSA, Projects, Backend, Frontend, Databases, APIs, Git, Testing, Deployment and System Design whenever applicable.
Return JSON like this:

{
  "missingSkills": ["skill1","skill2"],
  "roadmap": [
    {
      "week": "Week 1",
      "topics": [
        "Topic 1",
        "Topic 2",
        "Topic 3",
        "Topic 4"
      ]
    }
  ]
}

IMPORTANT:

Return EXACTLY ${weeks} roadmap objects.

If weeks = 4
return Week 1 ... Week 4 only.

If weeks = 8
return Week 1 ... Week 8 only.

If weeks = 12
return Week 1 ... Week 12 only.

If weeks = 16
return Week 1 ... Week 16 only.

If weeks = 24
return Week 1 ... Week 24 only.

Never generate more or fewer roadmap objects.


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

  const cleaned = completion.choices[0].message.content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleaned);
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

  const cleaned = completion.choices[0].message.content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleaned);
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

  const cleaned = completion.choices[0].message.content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleaned);
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

  const cleaned = completion.choices[0].message.content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(cleaned);
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
async function skillGapAnalyzer(resumeText, targetRole) {
 

const role = targetRole.toLowerCase();

if (role.includes("software")) {
  roleProjects = projects.software;
}
else if (
  role.includes("data scientist") ||
  role.includes("machine learning") ||
  role.includes("ai")
) {
  roleProjects = projects.datascientist;
}
else if (role.includes("product")) {
  roleProjects = projects.productmanager;
}
  
const prompt = `
You are a Senior Technical Hiring Manager.

Return ONLY valid JSON.

Never return markdown.
Never return explanations.
Never return text outside JSON.

Return EXACTLY this schema:

{
  "currentLevel":"",
  "strongSkills":[
    "Skill 1",
    "Skill 2",
    "Skill 3",
    "Skill 4",
    "Skill 5"
  ],
  "missingSkills":[
    {
      "skill":"",
      "priority":"",
      "gap":0,
      "hours":0
    }
  ],
  "estimatedTime":""
}

Rules:

Analyze the resume ONLY for the target role.

Current Level must be one of:
- Beginner
- Intermediate
- Advanced

Strong Skills:
- Maximum 5
- Only skills actually present in the resume.

Missing Skills:
Return objects only.

Example:

{
  "skill":"Docker",
  "priority":"High",
  "gap":90,
  "hours":20
}

priority must be:
- High
- Medium
- Low

gap:
50-100

hours:
Estimated hours required to learn the skill.

estimatedTime must be exactly one of:

30 Days
45 Days
60 Days
90 Days
120 Days
180 Days

Estimate it based on:
- Resume quality
- Missing skills
- Target role

Role:

${targetRole}

Resume:

${resumeText}
`;
const completion =
await groq.chat.completions.create({
    model:"llama-3.1-8b-instant",

    messages:[
        {
            role:"user",
            content:prompt
        }
    ],

    temperature:0.2,

    response_format:{
        type:"json_object"
    }
});
const raw =
completion.choices[0].message.content;

console.log(raw);
const parsed = JSON.parse(raw);

parsed.recommendedProjects = recommendProjects(targetRole);

console.log("PROJECTS SENT TO FRONTEND:");
console.log(parsed.recommendedProjects);
console.log("Recommended Projects:");
console.log(parsed.recommendedProjects);

return parsed;

return JSON.parse(raw);

}
function recommendProjects(targetRole) {
  const role = targetRole.toLowerCase();

  if (role.includes("software")) {
    return projects.software;
  }

  if (
    role.includes("data scientist") ||
    role.includes("machine learning") ||
    role.includes("ai")
  ) {
    return projects.datascientist;
  }

  if (role.includes("product")) {
    return projects.productmanager;
  }

  return [];
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
  generateCompanyPrep,
  skillGapAnalyzer,
};


