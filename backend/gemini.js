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

// ======================================================
// HELPER
// ======================================================

function cleanJSON(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function getRoleCategory(targetRole = "") {
  const role = targetRole.toLowerCase();

  if (
    role.includes("software engineer") ||
    role.includes("software developer") ||
    role.includes("frontend") ||
    role.includes("backend") ||
    role.includes("full stack") ||
    role.includes("fullstack") ||
    role.includes("developer")
  ) {
    return "software";
  }

  if (
    role.includes("data analyst") ||
    role.includes("business analyst") ||
    role.includes("data analytics")
  ) {
    return "data_analyst";
  }

  if (
    role.includes("data scientist") ||
    role.includes("machine learning") ||
    role.includes("ai engineer")
  ) {
    return "datascientist";
  }

  if (
    role.includes("product manager") ||
    role.includes("product management") ||
    role.includes("associate product manager")
  ) {
    return "product_manager";
  }

  return "general";
}

// ======================================================
// ROLE-SPECIFIC SKILL REQUIREMENTS
// ======================================================

function getRoleSkills(targetRole = "") {
  const category = getRoleCategory(targetRole);

  if (category === "software") {
    return [
      "Programming Fundamentals",
      "Data Structures and Algorithms",
      "Object-Oriented Programming",
      "Git and GitHub",
      "SQL and Databases",
      "REST APIs",
      "Backend Development",
      "Frontend Development",
      "Testing and Debugging",
      "Deployment",
      "System Design",
      "Projects",
    ];
  }

  if (category === "data_analyst") {
    return [
      "Excel",
      "SQL",
      "Python",
      "Pandas",
      "NumPy",
      "Data Cleaning",
      "Exploratory Data Analysis",
      "Statistics",
      "Data Visualization",
      "Power BI",
      "Tableau",
      "Business Intelligence",
      "Dashboard Development",
      "Data Storytelling",
      "Projects",
    ];
  }

  if (category === "product_manager") {
    return [
      "Product Thinking",
      "User Research",
      "Problem Definition",
      "Product Strategy",
      "Product Roadmaps",
      "PRDs",
      "Product Metrics",
      "Analytics",
      "A/B Testing",
      "Agile",
      "Scrum",
      "Stakeholder Management",
      "Communication",
      "Prioritization",
      "Projects",
    ];
  }

  if (category === "datascientist") {
    return [
      "Python",
      "Statistics",
      "Probability",
      "Pandas",
      "NumPy",
      "Data Visualization",
      "Machine Learning",
      "Feature Engineering",
      "Model Evaluation",
      "SQL",
      "Scikit-learn",
      "Projects",
    ];
  }

  return [
    "Programming Fundamentals",
    "Communication",
    "Problem Solving",
    "Projects",
    "Git",
    "Databases",
  ];
}

// ======================================================
// RESUME ANALYSIS
// ======================================================

async function analyzeResume(
  text,
  targetRole = "Software Engineer"
) {
  const roleSkills = getRoleSkills(targetRole);

  const prompt = `
Return ONLY valid JSON.

You are a senior hiring manager reviewing a candidate for:

TARGET ROLE:
${targetRole}

ROLE CATEGORY:
${getRoleCategory(targetRole)}

Analyze ONLY the resume provided.

Do NOT give generic feedback.

ROLE-RELEVANT SKILLS TO CONSIDER:
${roleSkills.join(", ")}

Calculate ATS score realistically.

Scoring:

Skills Match = 40
Projects = 20
Education = 10
Experience = 15
Keywords Match = 15

Do not use default scores.

Different resumes must receive different scores.

A student resume should rarely exceed 80.

A strong fresher should generally score 65-80.

Only mention weaknesses that actually exist.

Only mention missing skills that are genuinely important for the target role.

Return exactly:

{
  "atsScore": 0,
  "readiness": "",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}

Readiness must be one of:

"Beginner"
"Developing"
"Job Ready"
"Industry Ready"

Resume:
${text}

Target Role:
${targetRole}
`;

  const completion = await groq.chat.completions.create({
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

  console.log("RAW GROQ RESUME RESPONSE:");
  console.log(response);

  const parsed = JSON.parse(response);

  console.log("ATS SCORE:", parsed.atsScore);

  return JSON.stringify(parsed);
}

// ======================================================
// REWRITE RESUME
// ======================================================

async function rewriteResume(text) {
  const prompt = `
You are an expert ATS resume writer.

Rewrite this resume to:

- Improve ATS compatibility
- Improve formatting
- Use strong action verbs
- Improve readability
- Highlight measurable achievements
- Keep ALL information truthful
- Never invent experience
- Never invent projects
- Never invent technologies

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

// ======================================================
// JOB MATCH
// ======================================================

async function analyzeJobMatch(
  resumeText,
  jobDescription
) {
  const prompt = `
Return ONLY valid JSON.

You are an ATS and hiring expert.

Compare the resume against the job description.

Return:

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

      response_format: {
        type: "json_object",
      },
    });

  return completion.choices[0].message.content;
}

// ======================================================
// ROADMAP
// ======================================================

async function generateRoadmap(
  resumeText,
  jobDescription = "",
  duration = "90 Days",
  targetRole = "Software Engineer"
) {
  const days = parseInt(duration) || 90;

  const weeks = Math.ceil(days / 7);

  const roleCategory =
    getRoleCategory(targetRole);

  let actualWeeks = weeks;

  // Exact roadmap lengths
  if (days <= 30) {
    actualWeeks = 4;
  } else if (days <= 60) {
    actualWeeks = 8;
  } else if (days <= 90) {
    actualWeeks = 12;
  } else if (days <= 120) {
    actualWeeks = 16;
  } else {
    actualWeeks = Math.ceil(days / 7);
  }

  let roleInstructions = "";

  if (roleCategory === "software") {
    roleInstructions = `
Focus on:

Programming Fundamentals
DSA
OOP
C++
Python/Java where appropriate
Git/GitHub
SQL
Databases
REST APIs
Backend
Frontend
Testing
Deployment
System Design
Real-world Projects

Do NOT make every week about System Design.
System Design should appear mainly in later stages.
`;
  }

  else if (roleCategory === "data_analyst") {
    roleInstructions = `
Focus on:

Excel
SQL
Python
Pandas
NumPy
Data Cleaning
Statistics
Exploratory Data Analysis
Data Visualization
Power BI
Tableau
Dashboards
Business Intelligence
Data Storytelling
Business Problem Solving
Portfolio Projects

Do NOT generate backend, frontend, system design or DSA-heavy content unless the job description specifically requires it.
`;
  }

  else if (roleCategory === "product_manager") {
    roleInstructions = `
Focus on:

Product Thinking
User Research
Problem Discovery
Product Strategy
Product Roadmaps
PRDs
Product Metrics
Analytics
A/B Testing
Agile
Scrum
Stakeholder Management
Prioritization
Communication
Market Research
Case Studies
Product Portfolio Projects

Do NOT generate a software-engineering-heavy roadmap.
Do NOT fill the roadmap with DSA, backend, frontend or system design unless explicitly required by the job description.
`;
  }

  else if (roleCategory === "datascientist") {
    roleInstructions = `
Focus on:

Python
Statistics
Probability
Pandas
NumPy
Data Cleaning
EDA
Visualization
SQL
Machine Learning
Feature Engineering
Model Evaluation
Scikit-learn
ML Projects
`;
  }

  else {
    roleInstructions = `
Use the target role and job description to determine the most relevant skills.
`;
  }

  const prompt = `
Return ONLY valid JSON.

You are an expert career mentor.

TARGET ROLE:
${targetRole}

ROLE CATEGORY:
${roleCategory}

DURATION:
${duration}

You MUST generate EXACTLY ${actualWeeks} roadmap objects.

If duration is 30 Days:
Return exactly Week 1, Week 2, Week 3, Week 4.

If duration is 60 Days:
Return exactly Week 1 through Week 8.

If duration is 90 Days:
Return exactly Week 1 through Week 12.

If duration is 120 Days:
Return exactly Week 1 through Week 16.

NEVER return more weeks than requested.

NEVER return fewer weeks than requested.

${roleInstructions}

General rules:

- Every week must contain 4-6 topics.
- Topics must progress from beginner to advanced.
- Topics must be relevant to the target role.
- Use the candidate's actual missing skills.
- Do not randomly add unrelated technologies.
- Include practical learning.
- Include projects at appropriate stages.
- Include interview preparation near the end.
- Include resume/portfolio preparation near the end.
- Include job application preparation in the final stage.

Return exactly:

{
  "missingSkills": [],
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

The roadmap array MUST contain exactly ${actualWeeks} objects.

Candidate Resume:
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

      temperature: 0.2,

      response_format: {
        type: "json_object",
      },
    });

  const cleaned = cleanJSON(
    completion.choices[0].message.content
  );

  const parsed = JSON.parse(cleaned);

  // Safety: force the frontend to receive the requested
  // number of weeks only.
  if (Array.isArray(parsed.roadmap)) {
    parsed.roadmap =
      parsed.roadmap.slice(0, actualWeeks);
  }

  return parsed;
}

// ======================================================
// INTERVIEW QUESTIONS
// ======================================================

async function generateInterviewQuestions(
  resumeText,
  jobDescription
) {
  const prompt = `
Return ONLY valid JSON.

Generate realistic interview questions based on the resume and job description.

Return:

{
  "technical": [],
  "dsa": [],
  "behavioral": [],
  "project": [],
  "hr": []
}

Generate:

5 Technical questions
5 DSA questions
5 Behavioral questions
5 Project questions
5 HR questions

Questions should be tailored to the candidate.

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

      response_format: {
        type: "json_object",
      },
    });

  return JSON.parse(
    cleanJSON(
      completion.choices[0].message.content
    )
  );
}

// ======================================================
// INTERVIEW ANSWER EVALUATION
// ======================================================

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

Score must be between 0 and 10.
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

      response_format: {
        type: "json_object",
      },
    });

  return JSON.parse(
    completion.choices[0].message.content
  );
}

// ======================================================
// PROJECT IDEAS
// ======================================================

async function generateProjectIdeas(role) {
  const prompt = `
Suggest ONE strong portfolio project for:

${role}

Return ONLY JSON:

{
  "title": "",
  "description": "",
  "features": [],
  "techStack": []
}

Rules:

- At least 5 features
- At least 3 technologies
- Project must be realistic
- Project must help the candidate demonstrate role-specific skills
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

      response_format: {
        type: "json_object",
      },
    });

  return JSON.parse(
    cleanJSON(
      completion.choices[0].message.content
    )
  );
}

// ======================================================
// CAREER MENTOR
// ======================================================

async function careerMentor(
  question,
  resumeText,
  jobDescription
) {
  const prompt = `
You are an expert career mentor.

Return ONLY JSON:

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

Rules:

- Summary minimum 250 words.
- Return exactly 5 strengths.
- Return exactly 5 weaknesses.
- Return exactly 5 action items.
- Each action item must contain at least 4 tasks.
- Be realistic.
- Do not invent resume information.

Resume:
${resumeText}

Question:
${question}

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

      response_format: {
        type: "json_object",
      },
    });

  return JSON.parse(
    cleanJSON(
      completion.choices[0].message.content
    )
  );
}

// ======================================================
// COMPANY PREPARATION
// ======================================================

async function generateCompanyPrep(
  company,
  role
) {
  const prompt = `
You are an expert placement mentor.

Company:
${company}

Role:
${role}

Return ONLY JSON:

{
  "company": "",
  "role": "",
  "overview": "",
  "hiringProcess": [],
  "dsaTopics": [],
  "coreSubjects": [],
  "hrQuestions": [],
  "technicalQuestions": [],
  "roadmap": []
}

Rules:

- Give at least 4 interview rounds.
- Give at least 6 important topics.
- Give 10 HR questions.
- Give 10 technical questions.
- Create a 30-day roadmap.
- Return only JSON.
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

      response_format: {
        type: "json_object",
      },
    });

  return JSON.parse(
    cleanJSON(
      completion.choices[0].message.content
    )
  );
}

// ======================================================
// SKILL GAP ANALYZER
// ======================================================

async function skillGapAnalyzer(
  resumeText,
  targetRole
) {
  const category =
    getRoleCategory(targetRole);

  const roleSkills =
    getRoleSkills(targetRole);

  const prompt = `
Return ONLY valid JSON.

You are a Senior Technical Hiring Manager.

Analyze this candidate ONLY for:

TARGET ROLE:
${targetRole}

ROLE CATEGORY:
${category}

IMPORTANT ROLE SKILLS:
${roleSkills.join(", ")}

Do NOT analyze the candidate as a generic software engineer.

The missing skills MUST change depending on the target role.

For example:

For Software Engineer:
Consider DSA, programming, OOP, Git, SQL, APIs, backend, frontend, testing, deployment, system design and projects.

For Data Analyst:
Consider Excel, SQL, Python, Pandas, NumPy, statistics, data cleaning, EDA, visualization, Power BI, Tableau, dashboards and data storytelling.

For Product Manager:
Consider product thinking, user research, product strategy, PRDs, roadmaps, product metrics, analytics, A/B testing, Agile, stakeholder management, prioritization and communication.

For Data Scientist:
Consider Python, statistics, probability, Pandas, NumPy, SQL, visualization, machine learning, feature engineering and model evaluation.

Do NOT automatically return System Design.

Only return System Design if it is genuinely missing AND relevant to the target role.

Do NOT return a skill merely because it is common in technology.

Check whether the skill is actually present in the resume.

Return EXACTLY:

{
  "currentLevel": "",
  "strongSkills": [],
  "missingSkills": [
    {
      "skill": "",
      "priority": "",
      "gap": 0,
      "hours": 0
    }
  ],
  "estimatedTime": ""
}

Current Level must be:

Beginner
Intermediate
Advanced

Strong Skills:

- Maximum 5
- Only skills actually present in resume.

Missing Skills:

- Only role-relevant skills.
- Do not include skills already clearly demonstrated.
- Return 5-10 important missing skills when applicable.
- Prioritize the most important gaps first.

Priority:

High
Medium
Low

Gap:

50-100

Hours:

Realistic learning hours.

EstimatedTime must be exactly one of:

30 Days
45 Days
60 Days
90 Days
120 Days
180 Days

Resume:
${resumeText}

Target Role:
${targetRole}
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

      temperature: 0.1,

      response_format: {
        type: "json_object",
      },
    });

  const raw =
    completion.choices[0].message.content;

  console.log("===== SKILL GAP RAW =====");
  console.log(raw);

  const parsed = JSON.parse(raw);

  parsed.recommendedProjects =
    recommendProjects(targetRole);

  console.log("PROJECTS SENT TO FRONTEND:");
console.log(parsed.recommendedProjects);

  return parsed;
}

// ======================================================
// RECOMMENDED PROJECTS
// ======================================================

function recommendProjects(targetRole) {
  const role = targetRole.toLowerCase();

  // Software Engineer
  if (
    role.includes("software") ||
    role.includes("developer") ||
    role.includes("full stack") ||
    role.includes("frontend") ||
    role.includes("backend")
  ) {
    return projects.software;
  }

  // Data Analyst
  if (
    role.includes("data analyst") ||
    role.includes("business analyst") ||
    role.includes("data analytics") ||
    role.includes("analytics")
  ) {
    return projects.dataanalyst || projects.datascientist;
  }

  // Data Scientist / ML / AI
  if (
    role.includes("data scientist") ||
    role.includes("machine learning") ||
    role.includes("artificial intelligence") ||
    role.includes("ai engineer")
  ) {
    return projects.datascientist;
  }

  // Product Manager
  if (
    role.includes("product manager") ||
    role.includes("product management") ||
    role.includes("product")
  ) {
    return projects.productmanager;
  }

  return [];
}
// ======================================================
// PORTFOLIO GENERATOR
// ======================================================

async function generatePortfolio(resumeText) {

  console.log("===== PORTFOLIO GENERATION START =====");

  const prompt = `
You are an extremely strict resume information extraction system.

Your ONLY job is to extract information from the resume below.

IMPORTANT:
DO NOT create a fictional portfolio.
DO NOT improve or rewrite the resume.
DO NOT invent missing information.
DO NOT use generic placeholder words.

EVERY VALUE MUST COME DIRECTLY FROM THE RESUME.

==================================================
CRITICAL EXTRACTION RULES
==================================================

1. PROJECT NAMES

Find the actual project name written in the resume.

Example:

Resume:
"Smart NGO Surplus Matcher
Developed a platform..."

Return:

{
  "title": "Smart NGO Surplus Matcher",
  "description": "Developed a platform..."
}

NEVER return:

"Project"

NEVER return:

"Project 1"

NEVER return:

"Portfolio Project"

If the project name genuinely cannot be found, return:
""

Do NOT invent a project name.

--------------------------------------------------

2. EXPERIENCE

Extract the EXACT:

- Job title / role
- Company
- Duration
- Description

Example:

Resume:
"Software Engineer II
Walmart
Feb 2023 – Present"

Return:

{
  "role": "Software Engineer II",
  "company": "Walmart",
  "duration": "Feb 2023 – Present"
}

NEVER return:

"Role"

NEVER return:

"Company"

NEVER invent a job title.

--------------------------------------------------

3. EDUCATION

Extract the EXACT:

- Degree
- Institution
- Duration
- CGPA if present

Example:

Resume:
"M.S. in Computer Science
University of XYZ
Aug 2021 – Dec 2022"

Return:

{
  "degree": "M.S. in Computer Science",
  "institute": "University of XYZ",
  "duration": "Aug 2021 – Dec 2022",
  "cgpa": ""
}

NEVER return:

"Institution"

If the institution is not present, return "".

--------------------------------------------------

4. ACHIEVEMENTS

Extract the actual achievement text.

Examples:

"Gold Medalist"

"Award Winner - XYZ Hackathon"

"Winner of ABC Competition"

Return the actual text.

NEVER return:

"Achievement"

"Achievement 1"

"Achievement 2"

If there are no achievements, return [].

--------------------------------------------------

5. CONTACT

Extract the EXACT email and phone number from the resume.

NEVER return:

"your.email@domain.com"

"example@email.com"

"1234567890" unless it actually exists in the resume.

If missing:
return "".

--------------------------------------------------

6. GITHUB

Extract the actual GitHub URL if present.

If missing:
return "".

--------------------------------------------------

7. LINKEDIN

Extract the actual LinkedIn URL if present.

If missing:
return "".

--------------------------------------------------

8. PROJECTS

Extract EVERY project mentioned in the resume.

Do not merge projects.

Do not rename projects.

Do not create projects.

Each project must contain:

- exact title
- accurate description
- technologies actually mentioned for that project

--------------------------------------------------

9. SKILLS

Extract skills actually present in the resume.

Do not add skills that are not present.

--------------------------------------------------

10. EXPERIENCE

Extract EVERY experience entry.

Do not merge different companies.

--------------------------------------------------

11. EDUCATION

Extract EVERY education entry.

Do not merge degrees.

--------------------------------------------------

12. ACHIEVEMENTS

Extract EVERY achievement that is actually present.

==================================================
PLACEHOLDER BAN
==================================================

The following values are FORBIDDEN:

"Project"
"Project 1"
"Project 2"
"Role"
"Company"
"Institution"
"Achievement"
"Achievement 1"
"Achievement 2"
"Email"
"Phone"
"your.email@domain.com"
"example@email.com"
"N/A"
"Not Available"
"Unknown"

If the information cannot be extracted:

return ""

Do NOT use a placeholder.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

{
  "name": "",
  "title": "",
  "about": "",
  "github": "",
  "linkedin": "",

  "skills": [],

  "projects": [
    {
      "title": "",
      "description": "",
      "tech": []
    }
  ],

  "experience": [
    {
      "role": "",
      "company": "",
      "duration": "",
      "description": ""
    }
  ],

  "education": [
    {
      "degree": "",
      "institute": "",
      "duration": "",
      "cgpa": ""
    }
  ],

  "achievements": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "description": ""
    }
  ],

  "contact": {
    "email": "",
    "phone": ""
  }
}

==================================================
RESUME
==================================================

${resumeText}

==================================================
FINAL VALIDATION
==================================================

Before returning JSON:

- Verify every project title exists in the resume.
- Verify every company exists in the resume.
- Verify every job role exists in the resume.
- Verify every institution exists in the resume.
- Verify every achievement exists in the resume.
- Verify email exists in the resume.
- Verify phone exists in the resume.
- Remove any invented information.
- Remove all forbidden placeholders.
- Do not return markdown.
- Return JSON only.
`;

  try {

    const completion =
      await groq.chat.completions.create({

        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content:
              "You are a strict resume information extraction engine. Never invent information."
          },
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0,

        response_format: {
          type: "json_object"
        }

      });

    const raw =
      completion.choices[0].message.content;

    console.log("===== PORTFOLIO AI RAW RESPONSE =====");
    console.log(raw);

    const data = JSON.parse(raw);

    // ==================================================
    // EXTRA CONTACT EXTRACTION
    // ==================================================

    const emailMatch =
      resumeText.match(
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
      );

    const phoneMatch =
      resumeText.match(
        /(?:\+91[\s-]?)?[6-9]\d{9}/
      );

    if (!data.contact) {
      data.contact = {};
    }

    data.contact.email =
      emailMatch ? emailMatch[0] : "";

    data.contact.phone =
      phoneMatch ? phoneMatch[0] : "";

    // ==================================================
    // REMOVE AI PLACEHOLDERS
    // ==================================================

    const forbiddenValues = [
      "Project",
      "Project 1",
      "Project 2",
      "Project 3",
      "Role",
      "Company",
      "Institution",
      "Achievement",
      "Achievement 1",
      "Achievement 2",
      "Email",
      "Phone",
      "N/A",
      "Not Available",
      "Unknown",
      "your.email@domain.com",
      "example@email.com"
    ];

    function removePlaceholder(value) {

      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();

      if (
        forbiddenValues.some(
          item =>
            item.toLowerCase() ===
            trimmed.toLowerCase()
        )
      ) {
        return "";
      }

      return value;
    }

    // ==================================================
    // CLEAN BASIC FIELDS
    // ==================================================

    data.name =
      removePlaceholder(data.name || "");

    data.title =
      removePlaceholder(data.title || "");

    data.about =
      removePlaceholder(data.about || "");

    data.github =
      removePlaceholder(data.github || "");

    data.linkedin =
      removePlaceholder(data.linkedin || "");

    // ==================================================
    // CLEAN PROJECTS
    // ==================================================

    if (Array.isArray(data.projects)) {

      data.projects = data.projects
        .map(project => {

          return {
            title:
              removePlaceholder(
                project?.title || ""
              ),

            description:
              removePlaceholder(
                project?.description || ""
              ),

            tech:
              Array.isArray(project?.tech)
                ? project.tech
                    .filter(
                      item =>
                        typeof item === "string"
                    )
                    .map(item =>
                      item.trim()
                    )
                : []
          };

        })
        .filter(
          project =>
            project.title ||
            project.description
        );
    } else {

      data.projects = [];

    }

    // ==================================================
    // CLEAN EXPERIENCE
    // ==================================================

    if (Array.isArray(data.experience)) {

      data.experience =
        data.experience
          .map(item => {

            return {

              role:
                removePlaceholder(
                  item?.role || ""
                ),

              company:
                removePlaceholder(
                  item?.company || ""
                ),

              duration:
                removePlaceholder(
                  item?.duration || ""
                ),

              description:
                removePlaceholder(
                  item?.description || ""
                )

            };

          })
          .filter(
            item =>
              item.role ||
              item.company ||
              item.description
          );

    } else {

      data.experience = [];

    }

    // ==================================================
    // CLEAN EDUCATION
    // ==================================================

    if (Array.isArray(data.education)) {

      data.education =
        data.education
          .map(item => {

            return {

              degree:
                removePlaceholder(
                  item?.degree || ""
                ),

              institute:
                removePlaceholder(
                  item?.institute || ""
                ),

              duration:
                removePlaceholder(
                  item?.duration || ""
                ),

              cgpa:
                removePlaceholder(
                  item?.cgpa || ""
                )

            };

          })
          .filter(
            item =>
              item.degree ||
              item.institute
          );

    } else {

      data.education = [];

    }

    // ==================================================
    // CLEAN ACHIEVEMENTS
    // ==================================================

    if (Array.isArray(data.achievements)) {

      data.achievements =
        data.achievements
          .map(item => {

            return {

              name:
                removePlaceholder(
                  item?.name || ""
                ),

              issuer:
                removePlaceholder(
                  item?.issuer || ""
                ),

              date:
                removePlaceholder(
                  item?.date || ""
                ),

              description:
                removePlaceholder(
                  item?.description || ""
                )

            };

          })
          .filter(
            item =>
              item.name ||
              item.description
          );

    } else {

      data.achievements = [];

    }

    // ==================================================
    // CLEAN SKILLS
    // ==================================================

    if (!Array.isArray(data.skills)) {
      data.skills = [];
    }

    data.skills =
      data.skills
        .filter(
          skill =>
            typeof skill === "string"
        )
        .map(
          skill =>
            skill.trim()
        )
        .filter(Boolean);

    console.log("===== FINAL PORTFOLIO DATA =====");
    console.log(
      JSON.stringify(data, null, 2)
    );

    return data;

  } catch (err) {

    console.error(
      "Groq Portfolio Error:",
      err
    );

    if (
      err.status === 429 ||
      err.code === "rate_limit_exceeded"
    ) {

      return {

        name: "AI Limit Reached",

        title: "",

        about:
          "Portfolio generation is temporarily unavailable because the Groq API quota has been exhausted.",

        github: "",

        linkedin: "",

        skills: [],

        projects: [],

        experience: [],

        education: [],

        achievements: [],

        contact: {}

      };

    }

    throw err;
  }
}

// ======================================================
// EXPORTS
// ======================================================

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
  generatePortfolio,
};

