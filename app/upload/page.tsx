"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import Dashboard from "../dashboard/page";

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

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("interviewHistory") || "[]");
    setInterviewHistory(history);
  }, []);

  async function handleUpload() {
    if (!file) {
      alert("Please select a PDF");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
        setResumeText(data.resumeText || "");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
    setLoading(false);
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
        setRewrittenResume(data.resume);
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
      const response = await fetch("http://localhost:5001/job-match", {
        method: "POST",
        body: formData,
      });
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
        body: formData,
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
      const response = await fetch("http://localhost:5001/interview-questions", {
        method: "POST",
        body: formData,
      });
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
        <div className="w-64 min-h-screen bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6 sticky top-6 self-start">
          <h2 className="text-2xl font-bold text-yellow-400 mb-8">PrepMate</h2>
          <div className="space-y-4">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "resume", label: "Resume Analysis" },
              { id: "jobmatch", label: "Job Match" },
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
          {activeTab === "dashboard" && <Dashboard />}

          {activeTab === "resume" && (
            <div className="space-y-6">
              {/* Core Resume Upload card logic */}
              <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8">
                <div className="flex flex-col items-center">
                  <Upload size={50} className="text-yellow-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Upload Resume</h3>
                  <input type="file" accept=".pdf" className="mt-4 text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  {file && <p className="text-green-400 mt-2 flex items-center gap-2"><FileText size={16}/> {file.name}</p>}
                  
                  <div className="flex gap-4 mt-6">
                    <button onClick={handleUpload} className="px-6 py-2 rounded-xl bg-yellow-500 text-black font-semibold hover:scale-105 transition">
                      {loading ? "Analyzing..." : "Analyze Resume"}
                    </button>
                    <button onClick={handleRewrite} className="px-6 py-2 rounded-xl border border-yellow-500/40 text-yellow-400 font-semibold hover:scale-105 transition">
                      ✨ Rewrite with AI
                    </button>
                  </div>
                </div>
              </div>
              {rewrittenResume && (
                <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-6">
                  <h3 className="text-yellow-400 font-bold mb-4">Improved Draft</h3>
                  <pre className="whitespace-pre-wrap text-gray-300 text-sm max-h-96 overflow-y-auto bg-black/40 p-4 rounded-xl">{rewrittenResume}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === "jobmatch" && (
            <div className="bg-white/5 border border-blue-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-blue-400">Target Role Validation</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the Job Description profile here..."
                className="w-full h-40 bg-black/40 border border-yellow-500/20 rounded-xl p-4 text-white"
              />
              <button onClick={handleJobMatch} className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:scale-105 transition">
                Check Core Compatibility
              </button>

              {jobMatchResult && (
                <div className="mt-4 p-4 bg-black/40 rounded-xl space-y-4">
                  <p className="text-3xl font-extrabold text-green-400">{jobMatchResult.matchScore}% Match Score</p>
                  <div>
                    <h4 className="text-green-400 font-bold">Identified Strengths</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {jobMatchResult.matchingSkills?.map((s: string, i: number) => <span key={i} className="px-2 py-1 bg-green-500/10 text-green-300 text-xs rounded-md">✓ {s}</span>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-red-400 font-bold">Unfulfilled Criteria / Gap Areas</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {jobMatchResult.missingSkills?.map((s: string, i: number) => <span key={i} className="px-2 py-1 bg-red-500/10 text-red-300 text-xs rounded-md">✗ {s}</span>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "roadmap" && (
            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-purple-400">Skill Acquisition Timeline</h2>
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
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-sm text-gray-300">
                  {mentorResponse.summary && <p className="mb-2">{typeof mentorResponse.summary === "object" ? mentorResponse.summary.description : mentorResponse.summary}</p>}
                </div>
              )}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-yellow-400">AI Project Blueprint Engine</h2>
              <textarea value={projectSkills} onChange={(e) => setProjectSkills(e.target.value)} placeholder="Enter skill constraints (e.g. TypeScript, Next.js, Redis)" className="w-full h-24 bg-black/40 border border-yellow-500/20 rounded-xl p-4 text-white" />
              <button onClick={handleProjectGenerator} className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-xl">Compile Architecture</button>
              {projectResult && (
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl mt-4">
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">{projectResult.title}</h3>
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
                  <h3 className="text-lg font-bold text-blue-400 mb-2">{companyPrep.company} Roadmap</h3>
                  <p className="text-sm text-gray-400">Tracking criteria for: {companyPrep.role}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}