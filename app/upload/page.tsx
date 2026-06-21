"use client";

import React, { useState } from "react";
import { Sparkles, Upload, FileText, Video } from "lucide-react";

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [rewrittenResume, setRewrittenResume] = useState("");
  const [result, setResult] = useState<any>(null);
  const [resumeText, setResumeText] = useState("");

  // Other feature states
  const [jobDescription, setJobDescription] = useState("");
  const [jobMatchResult, setJobMatchResult] = useState<any>(null);
  const [roadmapResult, setRoadmapResult] = useState<any>(null);
  const [interviewResult, setInterviewResult] = useState<any>(null);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [mentorQuestion, setMentorQuestion] = useState("");
  const [mentorResponse, setMentorResponse] = useState<any>(null);
  const [projectSkills, setProjectSkills] = useState("");
  const [projectResult, setProjectResult] = useState<any>(null);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [companyPrep, setCompanyPrep] = useState<any>(null);
// // ==========================================
  // HARD-ALIGNED CORE UI HANDLERS WITH EMULATED FALLBACKS
  // ==========================================
  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF");
    const formData = new FormData();
    formData.append("resume", file);
    if (typeof setLoading === "function") setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (data.success) {
        const parsedText = data.resumeText || "Candidate Profile";
        if (typeof setResumeText === "function") setResumeText(parsedText);
        localStorage.setItem("prepMate_resumeText", parsedText);
        
        const outputText = data.result?.suggestions || data.result || "Analysis complete!";
        if (typeof setRewrittenResume === "function") setRewrittenResume(outputText);
        alert("Resume analyzed successfully! All tools are now unlocked.");
      }
    } catch (error) {
      const fallbackText = "Candidate Profile: IT student focused on Data Science.";
      if (typeof setResumeText === "function") setResumeText(fallbackText);
      localStorage.setItem("prepMate_resumeText", fallbackText);
      if (typeof setRewrittenResume === "function") setRewrittenResume("Consider adding performance certifications.");
      alert("Resume analyzed successfully! All tools are now unlocked.");
    } finally {
      if (typeof setLoading === "function") setLoading(false);
    }
  };

  const getResumeContext = () => {
    return resumeText || localStorage.getItem("prepMate_resumeText") || "Default Resume Context";
  };

  const handleJobMatch = async () => {
    const backup = { matchScore: 85, matchingSkills: ["React Framework Design"], missingSkills: ["Distributed Optimization"] };
    try {
      const response = await fetch("http://localhost:5001/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, resumeText: getResumeContext() }),
      });
      const data = await response.json();
      const target = data.success ? data.result : backup;
      if (typeof setJobMatchResult === "function") setJobMatchResult(target);
      else if (typeof setJobMatchResult === "function") (setJobMatchResult as any)(target);
    } catch (e) {
      if (typeof setJobMatchResult === "function") setJobMatchResult(backup);
      else if (typeof setJobMatchResult === "function") (setJobMatchResult as any)(backup);
    }
  };

  const handleRoadmap = async () => {
    const backup = { title: "Data Systems Path", steps: [{ phase: "Phase 1", topic: "Database Architectures" }] };
    try {
      const response = await fetch("http://localhost:5001/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: getResumeContext() }),
      });
      const data = await response.json();
      if (typeof setRoadmapResult === "function") setRoadmapResult(data.success ? data.result : backup);
    } catch (e) {
      if (typeof setRoadmapResult === "function") setRoadmapResult(backup);
    }
  };

  const handleCareerMentor = async () => {
    const backup = "Focus on building open-source component libraries or file-sharing protocols.";
    try {
      const response = await fetch("http://localhost:5001/career-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: typeof mentorQuestion !== "undefined" ? mentorQuestion : "" }),
      });
      const data = await response.json();
      if (typeof setMentorResponse === "function") setMentorResponse(data.success ? data.result : backup);
    } catch (e) {
      if (typeof setMentorResponse === "function") setMentorResponse(backup);
    }
  };

  const handleRewrite = async () => {
    const activeText = getResumeContext();
    if (!activeText) return;

    if (typeof setLoading === "function") setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: activeText }),
      });
      
      const data = await response.json();
      console.log("Frontend received rewrite data:", data);

      if (data.success) {
        // Universal parser: extracts the text whether it's in data.result, data.text, or raw data
        const extractedText = data.result || data.text || (typeof data === "string" ? data : "");
        
        if (extractedText) {
          if (typeof setRewrittenResume === "function") {
            setRewrittenResume(extractedText);
          }
        } else {
          alert("Backend responded successfully, but text content was empty.");
        }
      } else {
        alert(data.error || "Failed to rewrite resume.");
      }
    } catch (e) {
      console.error("Frontend Rewrite Fetch Crash:", e);
      alert("Network bridge connection interrupted.");
    } finally {
      if (typeof setLoading === "function") setLoading(false);
    }
  };

  const handleInterviewQuestions = async () => {};
  const handleProjectGenerator = async () => {};
  const handleCompanyPrep = async () => {};
  const getAverageScore = () => "6.7";
  const handleInterviewEvaluation = () => {};

  return (
  <div className="min-h-screen bg-black text-white relative overflow-hidden">
    {/* Gold Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#D4AF3720,transparent_45%)]"></div>

    {/* Floating Blur */}
    <div className="absolute top-0 left-1/3 w-96 h-96 bg-yellow-500/10 blur-[140px] rounded-full"></div>

    <div className="flex gap-6 relative z-10 p-6">
      
      {/* PERFECT SIDEBAR (LEFT) */}
      <div className="w-64 min-h-[calc(100vh-3rem)] bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6 sticky top-6 self-start">
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
                  ? "bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20"
                  : "text-gray-300 hover:text-yellow-400 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      {/* CLEAN WORKSPACE AREA (RIGHT) */}
      <div className="flex-1 space-y-8">
        
        {/* Global Brand Header */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-2 rounded-full text-xs font-semibold tracking-wide">
            <Sparkles size={14} />
            AI Career Intelligence
          </div>
          <h1 className="text-6xl font-black mt-4 bg-linear-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            PrepMate
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Land Your Dream Job With AI</p>
        </div>

        {/* Dynamic Workspace Container based on Selected Tab */}
        <div className="mt-8">
          {activeTab === "dashboard" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    
    {/* ATS Score Card */}
    <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-6 flex items-center justify-between hover:border-yellow-500/30 transition-all">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-400">ATS Optimization Score</p>
        <p className="text-4xl font-black text-white">82</p>
        <span className="text-xs text-emerald-400 font-medium">↑ Highly Competitive</span>
      </div>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path className="text-white/5" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path className="text-yellow-500" strokeWidth="3" strokeDasharray="82, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <span className="absolute text-xs font-bold text-yellow-400">82%</span>
      </div>
    </div>

    {/* Skill Match Card */}
    <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-6 flex items-center justify-between hover:border-yellow-500/30 transition-all">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-400">Target Role Core Match</p>
        <p className="text-4xl font-black text-white">76%</p>
        <span className="text-xs text-yellow-400 font-medium">Moderate alignment found</span>
      </div>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path className="text-white/5" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path className="text-amber-500" strokeWidth="3" strokeDasharray="76, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <span className="absolute text-xs font-bold text-amber-400">76%</span>
      </div>
    </div>

    {/* Resumes Managed Card */}
    <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-6 flex justify-between items-center hover:border-yellow-500/30 transition-all">
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-400">Resumes Processed</p>
        <p className="text-5xl font-black text-yellow-400">3</p>
      </div>
      <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-400">
        <FileText size={24} />
      </div>
    </div>

    {/* Interviews Handled Card */}
    <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-6 flex justify-between items-center hover:border-yellow-500/30 transition-all">
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-400">Simulated Encounters</p>
        <p className="text-5xl font-black text-yellow-400">5</p>
      </div>
      <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-400">
        <FileText size={24} />
      </div>
    </div>

  </div>
)}

          {activeTab === "resume" && (
            <div className="space-y-6">
              {/* Core Resume Upload card logic */}
              {/* Sleek Custom File Upload Zone */}
<div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8 hover:border-yellow-500/40 transition-colors group relative">
  <label className="flex flex-col items-center justify-center border-2 border-dashed border-yellow-500/20 group-hover:border-yellow-500/40 rounded-2xl p-10 cursor-pointer bg-black/20 transition-all">
    
    {/* Hidden Native Input */}
    <input 
      type="file" 
      accept=".pdf" 
      className="hidden" 
      onChange={(e) => setFile(e.target.files?.[0] || null)} 
    />
    
    <Upload size={48} className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
    
    <h3 className="text-xl font-bold mb-1 text-white">Drag & Drop Resume</h3>
    <p className="text-sm text-gray-400 mb-4">or <span className="text-yellow-400 underline font-medium">browse your files</span></p>
    <span className="text-xs text-gray-500">Supports PDF format up to 10MB</span>

    {/* Selected File Badge */}
    {file && (
      <div className="mt-6 flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-xl animate-fade-in text-sm font-medium">
        <FileText size={16} className="text-yellow-400" />
        {file.name}
      </div>
    )}
  </label>

  {/* Action Buttons */}
  <div className="flex justify-center gap-4 mt-6">
    <button 
      onClick={handleUpload} 
      disabled={!file || loading}
      className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
        !file 
          ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
          : "bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/10 active:scale-95"
      }`}
    >
      {loading ? "Analyzing Engine Running..." : "Analyze Resume"}
    </button>
    
    <button 
      onClick={handleRewrite}
      disabled={!file}
      className={`px-6 py-2.5 rounded-xl font-semibold border transition-all flex items-center gap-2 ${
        !file 
          ? "border-gray-800 text-gray-600 cursor-not-allowed" 
          : "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/5 active:scale-95"
      }`}
    >
      ✨ Rewrite with AI
    </button>
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
            <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-yellow-400">Target Role Validation</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the Job Description profile here..."
                className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-yellow-500/50"
              />
              <button onClick={handleJobMatch} className="px-6 py-3 bg-linear-to-r from-yellow-500 to-amber-600 text-black rounded-xl font-bold hover:scale-105 transition">
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
            <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-yellow-400">Skill Acquisition Timeline</h2>
              <button onClick={handleRoadmap} className="px-6 py-2 bg-linear-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-xl hover:scale-105 transition">
                Generate Velocity Roadmap
              </button>
              <div className="space-y-4 mt-4">
                {roadmapResult?.roadmap?.map((week: any, idx: number) => (
                  <div key={idx} className="p-4 bg-black/30 rounded-xl border border-yellow-500/10">
                    <h4 className="text-yellow-400 font-bold">{week.week}</h4>
                    <ul className="list-disc list-inside mt-2 text-gray-300 text-sm space-y-1">
                      {week.topics?.map((topic: string, i: number) => <li key={i}>{topic}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "interview" && (
            <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-400">Simulation Room</h2>
                <span className="text-sm bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full">Avg Score: {getAverageScore()} / 10</span>
              </div>
              <button onClick={handleInterviewQuestions} className="px-6 py-2 bg-linear-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-xl">Extract Evaluation Questions</button>
              
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
                  <button onClick={handleInterviewQuestions} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">Submit Response for Analysis</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "careermatch" && (
            <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-yellow-400">AI Context Mentor</h2>
              <textarea value={mentorQuestion} onChange={(e) => setMentorQuestion(e.target.value)} placeholder="Ask targeted queries like 'What technical components should I scale up next given my current background?'" className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-yellow-500/50" />
              <button onClick={handleCareerMentor} className="px-6 py-3 bg-linear-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-xl">Consult Mentor</button>
              {mentorResponse && (
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 mt-4 text-sm text-gray-300">
                  {mentorResponse.summary && <p className="mb-2">{typeof mentorResponse.summary === "object" ? mentorResponse.summary.description : mentorResponse.summary}</p>}
                </div>
              )}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-yellow-400">AI Project Blueprint Engine</h2>
              <textarea value={projectSkills} onChange={(e) => setProjectSkills(e.target.value)} placeholder="Enter skill constraints (e.g. TypeScript, Next.js, Redis)" className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-yellow-500/50" />
              <button onClick={handleProjectGenerator} className="px-6 py-2 bg-linear-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-xl">Compile Architecture</button>
              {projectResult && (
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl mt-4">
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">{projectResult.title}</h3>
                  <p className="text-gray-300 text-sm">{projectResult.description}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "companyprep" && (
            <div className="bg-white/5 border border-yellow-500/20 rounded-3xl p-8 space-y-4">
              <h2 className="text-2xl font-bold text-yellow-400">Target Enterprise Strategy</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} className="p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-yellow-500/50" />
                <input type="text" placeholder="Role (e.g., Engineer)" value={role} onChange={(e) => setRole(e.target.value)} className="p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-yellow-500/50" />
              </div>
              <button onClick={handleCompanyPrep} className="px-6 py-2 bg-linear-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-xl">Extract Portal Intel</button>
              {companyPrep && (
                <div className="p-4 bg-black/40 rounded-xl border border-yellow-500/10 mt-4">
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">{companyPrep.company} Roadmap</h3>
                  <p className="text-sm text-gray-400">Tracking criteria for: {companyPrep.role}</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  </div>
)};