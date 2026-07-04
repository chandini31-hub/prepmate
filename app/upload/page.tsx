"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Upload,
  Sparkles,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Brain,
  Lightbulb,
  Target,
  Briefcase,
  Rocket,
  Award,
} from "lucide-react";


export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [rewrittenResume, setRewrittenResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [jobMatchResult, setJobMatchResult] = useState<any>(null);
  const [roadmapResult, setRoadmapResult] = useState<any>(null);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [projectSkills, setProjectSkills] = useState("");
  const [projectResult, setProjectResult] = useState<any>(null);
  const [company, setCompany] = useState("");
  const [careerGapResult, setCareerGapResult] = useState<any>(null);
  const [role, setRole] = useState("");
  const [companyPrep, setCompanyPrep] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [answer, setAnswer] = useState("");
  const [interviewResult, setInterviewResult] = useState<any>(null);
  const [mockInterviewResult, setMockInterviewResult] = useState<any>(null);
  const [interviewHistory, setInterviewHistory] = useState<any[]>([]);
  const [mentorQuestion, setMentorQuestion] = useState("");
  const [mentorResponse, setMentorResponse] = useState<any>(null);
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [roadmapDuration,setRoadmapDuration]=useState("90 Days");
const [customDays, setCustomDays] = useState("");
const router = useRouter();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("interviewHistory") || "[]");
    setInterviewHistory(history);
  }, []);

  async function handleUpload() {
  try {
    if (!file) {
      alert("Please select a resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("targetRole", targetRole);
    formData.append("jobDescription", jobDescription);

    console.log("Sending request...");

    const response = await fetch("http://127.0.0.1:5001/upload", {
      method: "POST",
      body: formData,
    });

    console.log("Response received:", response.status);

    const text = await response.text();

    console.log("RAW RESPONSE:");
    console.log(text);

    const data = JSON.parse(text);

    console.log("PARSED DATA:");
    console.log(data);

    if (data.success) {
      setResult(data.result);
      setResumeText(data.resumeText || "");
    } else {
      alert(data.error);
    }

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
  }
}

  const handleRewrite = async () => {
    if (!file) {
      alert("Upload a resume first");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const response = await fetch("http://localhost:5001/rewrite", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setRewrittenResume(data.result);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Resume rewrite failed");
    }
  };

  const handleJobMatch = async () => {
    if (!file) {
      alert("Upload resume first");
      return;
    }
    if (!jobDescription.trim()) {
      alert("Enter job description");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch(
  "http://localhost:5001/job-match",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resumeText,
      jobDescription,
    }),
  }
);
      const data = await response.json();
      if (data.success) {
        setJobMatchResult(data.result);
        alert("Match Score: " + Math.round(data.result.matchScore * 100) + "%");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Job Match Failed");
    }
  };

  const handleInterviewEvaluation = async () => {
    if (!selectedQuestion) {
      alert("Select a question");
      return;
    }
    if (!answer.trim()) {
      alert("Enter your answer");
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: selectedQuestion, answer }),
      });
      const data = await response.json();
      if (data.success) {
        setMockInterviewResult(data.result);
        const history = JSON.parse(localStorage.getItem("interviewHistory") || "[]");
        history.push({
          question: selectedQuestion,
          score: data.result.score,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem("interviewHistory", JSON.stringify(history));
        setInterviewHistory(history);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Interview Evaluation Failed");
    }
  };

  const handleRoadmap = async () => {
    if (!file) {
      alert("Upload resume first");
      return;
    }
    if (!jobDescription.trim()) {
      alert("Enter job description");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("http://localhost:5001/roadmap", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    resumeText,
    jobDescription,
    duration:roadmapDuration,
  }),
});
      const data = await response.json();
      if (data.success) {
        setRoadmapResult(data.result);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Roadmap generation failed");
    }
  };

  const handleInterviewQuestions = async () => {
    if (!file) {
      alert("Upload resume first");
      return;
    }
    if (!jobDescription.trim()) {
      alert("Enter job description");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch(
  "http://localhost:5001/interview-questions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resumeText,
    }),
  }
);
      const data = await response.json();
      if (data.success) {
        setInterviewResult(data.result);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Interview Generation Failed");
    }
  };

  const handleCareerMentor = async () => {
    try {
      const response = await fetch("http://localhost:5001/career-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: mentorQuestion, resumeText, jobDescription }),
      });
      const data = await response.json();
      if (data.success && data.result) {
        setMentorResponse(data.result);
      } else {
        alert("Mentor returned empty response");
      }
    } catch (error) {
      console.error(error);
      alert("Career Mentor Failed");
    }
  };

  const handleProjectGenerator = async () => {
    try {
      const response = await fetch("http://localhost:5001/project-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: projectSkills }),
      });
      const data = await response.json();
      if (data.success) {
        setProjectResult(data.result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompanyPrep = async () => {
    try {
      const response = await fetch("http://localhost:5001/company-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role }),
      });
      const data = await response.json();
      if (data.success && data.result) {
        setCompanyPrep(data.result);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleCareerGap = async () => {
  try {
    const response = await fetch(
      "http://localhost:5001/career-gap",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          targetRole,
        }),
      }
    );
    console.log(careerGapResult?.recommendedProjects);

    const data = await response.json();
console.log("CAREER GAP RESPONSE:");
console.log(data);
console.log(
  JSON.stringify(data.result.recommendedProjects, null, 2)
);
    if (data.success) {
      setCareerGapResult(data.result);
      console.log("CAREER GAP RESULT");
console.log(data.result);
    }
  } catch (error) {
    console.error(error);
  }
};
  const getAverageScore = () => {
    if (interviewHistory.length === 0) return "0.0";
    const sum = interviewHistory.reduce((acc, item) => acc + Number(item.score || 0), 0);
    return (sum / interviewHistory.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden p-6">
      {/* Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#D4AF3720,transparent_45%)]"></div>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-yellow-500/10 blur-[140px] rounded-full"></div>

      <div className="flex gap-6 relative z-10">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-linear-to-br
from-black
via-zinc-900
to-black
border border-yellow-500/20
shadow-[0_0_25px_rgba(212,175,55,0.15)]
hover:scale-105
transition-all
duration-300 backdrop-blur-xl rounded-3xl p-6 sticky top-6 self-start">
          <h2 className="text-2xl font-bold text-yellow-400 mb-8">PrepMate</h2>
          <div className="space-y-4">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "resume", label: "Resume Analysis" },
              { id: "gapanalyzer", label: "Skill Gap Analyzer" },
              { id: "roadmap", label: "Roadmap" },
              { id: "interview", label: "Interview Prep" },
              { id: "careermatch", label: "Career Mentor" },
              { id: "projects", label: "Projects" },
              { id: "companyprep", label: "Company Prep" },
            ].map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer p-3 rounded-xl transition font-medium ${
                  activeTab === tab.id
                    ? "bg-yellow-500 text-black font-bold"
                    : "text-gray-300 hover:text-yellow-400"
                }`}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>

        {/* Main Workspace Area */}
        <div className="flex-1 space-y-8">
          {/* Header Block Always Visible */}
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-2 rounded-full">
              <Sparkles size={18} />
              AI Career Intelligence
            </div>
            <h1 className="text-6xl font-black mt-4 bg-linear-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              PrepMate
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Land Your Dream Job With AI</p>
          </div>

          {/* Conditional Rendering base on Tabs */}
          {activeTab === "dashboard" && (
  <div className="space-y-8">
    <h2 className="text-4xl font-bold text-yellow-400">
      Dashboard
    </h2>
    <div className="grid md:grid-cols-4 gap-6">
      <div className="bg-linear-to-br from-yellow-500/20 to-yellow-600/5 rounded-3xl p-6 border border-yellow-500/20">
        <h3 className="text-gray-400">ATS Score</h3>
        <p className="text-5xl font-bold text-yellow-400">
         {result?.atsScore || 0}
        </p>
      </div>

      <div className="bg-linear-to-br from-green-500/20 to-green-600/5 rounded-3xl p-6 border border-green-500/20">
        <h3 className="text-gray-400">Job Match</h3>
        <p className="text-5xl font-bold text-green-400">
          {jobMatchResult?.matchScore || 0}%
        </p>
      </div>

      <div className="bg-linear-to-br from-blue-500/20 to-blue-600/5 rounded-3xl p-6 border border-blue-500/20">
        <h3 className="text-gray-400">Projects</h3>
        <p className="text-5xl font-bold text-blue-400">
          {projectResult ? 1 : 0}
        </p>
      </div>

      <div className="bg-linear-to-br from-purple-500/20 to-purple-600/5 rounded-3xl p-6 border border-purple-500/20">
        <h3 className="text-gray-400">Interview</h3>
        <p className="text-5xl font-bold text-purple-400">
          {mockInterviewResult?.score || 0}
        </p>
      </div>
    </div>
    {/* Quick Actions */}
    <div className="grid md:grid-cols-3 gap-6">

      <div
        onClick={() => setActiveTab("resume")}
        className="cursor-pointer rounded-3xl p-6 bg-yellow-500/10 border border-yellow-500/20 hover:scale-105 transition"
      >
        <div className="text-4xl mb-3">📄</div>
        <h3 className="text-xl font-bold text-yellow-400">
          Upload Resume
        </h3>
        <p className="text-gray-400 mt-2">
          Analyze ATS score instantly
        </p>
      </div>

      <div
        onClick={() => setActiveTab("jobmatch")}
        className="cursor-pointer rounded-3xl p-6 bg-green-500/10 border border-green-500/20 hover:scale-105 transition"
      >
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="text-xl font-bold text-green-400">
          Job Match
        </h3>
        <p className="text-gray-400 mt-2">
          Compare resume with JD
        </p>
      </div>

      <div
        onClick={() => setActiveTab("interview")}
        className="cursor-pointer rounded-3xl p-6 bg-purple-500/10 border border-purple-500/20 hover:scale-105 transition"
      >
        <div className="text-4xl mb-3">🎤</div>
        <h3 className="text-xl font-bold text-purple-400">
          Interview Prep
        </h3>
        <p className="text-gray-400 mt-2">
          Practice AI interviews
        </p>
      </div>

    </div>
  </div>
)}

          {activeTab === "resume" && (
            <div className="space-y-6">
              {/* Core Resume Upload card logic */}
              <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8">
                <div className="flex flex-col items-center">
                  <Upload size={50} className="text-yellow-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Upload Resume</h3>
                  <textarea
  value={jobDescription}
  onChange={(e) => setJobDescription(e.target.value)}
  placeholder="Paste Target Job Description Here"
  className="w-full h-40 bg-black/40 border border-yellow-500/20 rounded-xl p-4 text-white mt-4"
/>

                  <input type="file" accept=".pdf" className="mt-4 text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <div className="flex gap-4 mt-6">
  <button
    onClick={handleUpload}
    className="px-6 py-2 rounded-xl bg-yellow-500 text-black font-semibold"
  >
    {loading ? "Analyzing..." : "Analyze Resume"}
  </button>

  <button
    onClick={handleRewrite}
    className="px-6 py-2 rounded-xl border border-yellow-500/40 text-yellow-400"
  >
    Rewrite with AI
  </button>
</div>
                    {result && (
                   <>
    <div className="
bg-linear-to-br
from-yellow-500/20
via-yellow-500/5
to-transparent
border border-yellow-500/20
rounded-3xl
p-8
mb-8
shadow-[0_0_40px_rgba(212,175,55,0.15)]
">

  <div className="text-center">

    <h2 className="text-yellow-400 text-2xl font-bold">
      ATS SCORE
    </h2>

    <div className="mt-4 text-8xl font-black text-yellow-300">
      {result.atsScore}
    </div>

    <div className="text-gray-500 text-xl">
      /100
    </div>

    <p className="text-blue-300 mt-4 text-lg">
      {result.roleReadiness}
    </p>

    <div className="mt-5">
      <span className="
      px-4
      py-2
      rounded-full
      bg-red-500/20
      text-red-400
      font-semibold
      ">
        {result.atsScore >= 80
          ? "Excellent Match"
          : result.atsScore >= 65
          ? "Good Match"
          : "Needs Improvement"}
      </span>
    </div>

  </div>

</div>  
<div className="grid grid-cols-3 gap-4 mb-8">

  <div className="bg-green-500/10 rounded-2xl p-5 text-center">
    <div className="text-3xl font-bold text-green-400">
      {result.strengths?.length || 0}
    </div>
    <div className="text-gray-400">
      Strengths
    </div>
  </div>

  <div className="bg-red-500/10 rounded-2xl p-5 text-center">
    <div className="text-3xl font-bold text-red-400">
      {result.missingSkills?.length || 0}
    </div>
    <div className="text-gray-400">
      Skill Gaps
    </div>
  </div>

  <div className="bg-blue-500/10 rounded-2xl p-5 text-center">
    <div className="text-3xl font-bold text-blue-400">
      {result.atsScore}%
    </div>
    <div className="text-gray-400">
      Readiness
    </div>
  </div>

</div>
  <div className="grid md:grid-cols-2 gap-6 mt-6">

  <div className="bg-green-500/10 p-5 rounded-xl">
    <h3 className="text-green-400 font-bold mb-3">
      Strengths
    </h3>

    {result.strengths?.map((s:any,i:number)=>(
      <p key={i}>✅ {s}</p>
    ))}
  </div>

  <div className="bg-red-500/10 p-5 rounded-xl">
    <h3 className="text-red-400 font-bold mb-3">
      Weaknesses
    </h3>

    {result.weaknesses?.map((s:any,i:number)=>(
      <p key={i}>❌ {s}</p>
    ))}
  </div>

  <div className="bg-yellow-500/10 p-5 rounded-xl">
    <h3 className="text-yellow-400 font-bold mb-3">
      Missing Skills
    </h3>

    {result.missingSkills?.map((s:any,i:number)=>(
      <p key={i}>⚠️ {s}</p>
    ))}
  </div>

  <div className="bg-blue-500/10 p-5 rounded-xl">
    <h3 className="text-blue-400 font-bold mb-3">
      Suggestions
    </h3>

    {result.suggestions?.map((s:any,i:number)=>(
      <p key={i}>💡 {s}</p>
    ))}
  </div>

</div>
  </>
)}
              {rewrittenResume && (
                <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-6">
                  <h3 className="text-yellow-400 font-bold mb-4">Improved Draft</h3>
                  <pre className="whitespace-pre-wrap text-gray-300 text-sm max-h-96 overflow-y-auto bg-black/40 p-4 rounded-xl">{rewrittenResume}</pre>
                </div>
              )}
            </div>
            </div></div>)}
          

          {activeTab === "gapanalyzer" && (
  <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8">

    <h2 className="text-2xl font-bold text-yellow-400 mb-4">
      Skill Gap Analyzer
    </h2>

    <button
      onClick={handleCareerGap}
      className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-bold"
    >
      Analyze Skill Gap
    </button>
    

    {careerGapResult && (
      <div className="mt-6 space-y-4">

        <div className="bg-green-500/10 p-4 rounded-xl">
          <h3 className="text-green-400 font-bold">
            Current Level
          </h3>
         <p>{careerGapResult.currentLevel}</p>
        </div>

        <div className="bg-red-500/10 p-4 rounded-xl">
          <h3 className="text-red-400 font-bold">
            Weaknesses
          </h3>

          {careerGapResult.missingSkills?.map(
(item:any,index:number)=>(
<div
key={index}
className="mb-5 bg-black/20 rounded-xl p-4"
>

<div className="flex justify-between">

<h3 className="font-bold text-red-300">
❌ {item.skill}
</h3>

<span className={
item.priority==="High"
?"text-red-400"
:item.priority==="Medium"
?"text-yellow-400"
:"text-green-400"
}>
{item.priority}
</span>

</div>

<div className="w-full h-2 bg-gray-700 rounded-full mt-3">

<div
className="bg-red-500 h-2 rounded-full"
style={{
width:`${item.gap}%`
}}
></div>

</div>

<p className="text-sm text-gray-400 mt-2">

Estimated Learning

{item.hours} Hours

</p>

</div>
)
)
   }   </div>

        <div className="bg-blue-500/10 p-4 rounded-xl">
          <h3 className="text-blue-400 font-bold">
            Recommended Projects
          </h3>
          <div className="bg-yellow-500/10 p-5 rounded-xl mt-5">
  
</div>
{careerGapResult?.recommendedProjects?.map((project: any, index: number) => (
  <div
    key={index}
    className="bg-black/30 rounded-xl p-5 mb-4 border border-blue-500/20"
  >
    <h3 className="text-lg font-bold text-blue-300">
      🚀 {project.title}
    </h3>

    <p className="text-yellow-400 text-sm mt-1">
      {project.difficulty}
    </p>

    <p className="text-gray-300 mt-3">
      {project.description}
    </p>

    <div className="flex flex-wrap gap-2 mt-4">
      {project.skills?.map((skill: string, i: number) => (
        <span
          key={i}
          className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
))}
        </div>

      </div>
    )
}
<div className="bg-blue-950/30 rounded-xl p-5 mt-6">
  <h3 className="text-blue-400 font-bold text-xl">
    Estimated Time to Become Job Ready
  </h3>

  <p className="text-3xl font-bold mt-4 text-white">
    {careerGapResult?.estimatedTime}
  </p>
  <button
    className="w-full mt-6 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl"
    onClick={() => setActiveTab("roadmap")}
  >
    ✨ Generate Personalized Roadmap
  </button>
</div>
</div>
          )}
          

          {activeTab === "roadmap" && (
            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-purple-400">Skill Acquisition Timeline</h2>
              <div className="mb-6">

<h3 className="text-lg font-bold text-purple-300 mb-3">
Choose Your Target Timeline
</h3>

<select
className="bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 w-full"
value={roadmapDuration}
onChange={(e)=>setRoadmapDuration(e.target.value)}
>

<option>30 Days</option>
<option>60 Days</option>
<option>90 Days</option>
<option>3 Months</option>
<option>6 Months</option>
<option>Custom</option>

</select>

</div>
              <button onClick={handleRoadmap} className="px-6 py-2 bg-purple-500 text-white font-bold rounded-xl hover:scale-105 transition">Generate Velocity Roadmap</button>
              {roadmapResult?.roadmap?.map((week: any, idx: number) => (
                <div key={idx} className="p-4 bg-black/30 rounded-xl border border-purple-500/10">
                  <h4 className="text-purple-300 font-bold">{week.week}</h4>
                  <ul className="list-disc list-inside mt-2 text-gray-300 text-sm space-y-1">
                    {week.topics?.map((topic: string, i: number) => <li key={i}>{topic}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === "interview" && (
            <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-400">Simulation Room</h2>
                <span className="text-sm bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full">Avg Score: {getAverageScore()} / 10</span>
              </div>
              <button onClick={handleInterviewQuestions} className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl">Extract Evaluation Questions</button>
              
              {interviewResult && (
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {["technical", "dsa", "behavioral"].map((category) => (
                    <div key={category} className="bg-black/40 p-4 rounded-xl border border-white/5">
                      <h4 className="text-yellow-400 font-bold capitalize mb-2">{category}</h4>
                      <ul className="space-y-2 text-xs text-gray-300">
                        {interviewResult[category]?.map((q: any, i: number) => {
                          const questionText = typeof q === "string" ? q : q.question;
                          return (
                            <li key={i} onClick={() => setSelectedQuestion(questionText)} className="cursor-pointer hover:text-yellow-400 p-2 bg-white/5 rounded transition">
                              👉 {questionText}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {selectedQuestion && (
                <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl space-y-3">
                  <p className="text-sm font-semibold text-yellow-400">Active Prompt: "{selectedQuestion}"</p>
                  <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your optimal technical response..." className="w-full h-24 bg-black/60 rounded-xl p-3 text-sm text-white border border-white/10" />
                  <button onClick={handleInterviewEvaluation} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">Submit Response for Analysis</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "careermatch" && (
            <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-yellow-400">AI Context Mentor</h2>
              <textarea value={mentorQuestion} onChange={(e) => setMentorQuestion(e.target.value)} placeholder="Ask targeted queries like 'What technical components should I scale up next given my current background?'" className="w-full h-32 bg-black/40 border border-yellow-500/20 rounded-xl p-4 text-white" />
              <button onClick={handleCareerMentor} className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl">Consult Mentor</button>
              {mentorResponse && (
  <div className="space-y-6">

    <div className="bg-black/40 p-5 rounded-xl">
      <h3 className="text-yellow-400 font-bold mb-3">
        Career Analysis
      </h3>

      <p className="text-gray-300 whitespace-pre-wrap">
        {mentorResponse.summary}
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-4">

      <div className="bg-green-500/10 p-4 rounded-xl">
        <h3 className="text-green-400 font-bold mb-3">
          Strengths
        </h3>

        <ul className="space-y-2">
          {mentorResponse.strengths?.map((item:any,i:number)=>(
            <li key={i}>✅ {item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-red-500/10 p-4 rounded-xl">
        <h3 className="text-red-400 font-bold mb-3">
          Weaknesses
        </h3>

        <ul className="space-y-2">
          {mentorResponse.weaknesses?.map((item:any,i:number)=>(
            <li key={i}>❌ {item}</li>
          ))}
        </ul>
      </div>

    </div>

    <div className="bg-yellow-500/10 p-5 rounded-xl">
      <h3 className="text-yellow-400 font-bold mb-4">
        Action Plan
      </h3>

      <div className="space-y-4">
        {mentorResponse.actionPlan?.map((plan:any,index:number)=>(
          <div
            key={index}
            className="bg-black/30 p-4 rounded-lg"
          >
            <h4 className="font-bold text-white">
              {plan.title}
            </h4>

            <p className="text-gray-300 mt-2">
              {plan.description}
            </p>

            <ul className="list-disc ml-6 mt-3 text-sm text-gray-400">
              {plan.tasks?.map((task:string,i:number)=>(
                <li key={i}>{task}</li>
              ))}
            </ul>

            <div className="mt-3 text-yellow-400 text-sm">
              Deadline: {plan.deadline}
            </div>
          </div>
        ))}
      </div>

    </div>

  </div>
)}
</div>)}

          {activeTab === "projects" && (
            <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-yellow-400">AI Project Blueprint Engine</h2>
              <textarea value={projectSkills} onChange={(e) => setProjectSkills(e.target.value)} placeholder="Enter skill constraints (e.g. TypeScript, Next.js, Redis)" className="w-full h-24 bg-black/40 border border-yellow-500/20 rounded-xl p-4 text-white" />
              <button onClick={handleProjectGenerator} className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl">Compile Architecture</button>
              {projectResult && (
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl mt-4">
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">{projectResult.projectTitle}</h3>
                  <p className="text-gray-300 text-sm">{projectResult.description}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "companyprep" && (
            <div className="bg-white/5 border border-blue-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-blue-400">Target Enterprise Strategy</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} className="p-3 rounded-xl bg-black/40 border border-white/10" />
                <input type="text" placeholder="Role (e.g., Engineer)" value={role} onChange={(e) => setRole(e.target.value)} className="p-3 rounded-xl bg-black/40 border border-white/10" />
              </div>
              <button onClick={handleCompanyPrep} className="px-6 py-2 bg-blue-500 text-white font-bold rounded-xl">Extract Portal Intel</button>
              {companyPrep && (
                <div className="p-4 bg-black/40 rounded-xl border border-blue-500/10 mt-4">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">
  Company Preparation
</h3>

<p className="text-gray-300">
  {companyPrep.coreFocus}
</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );}
