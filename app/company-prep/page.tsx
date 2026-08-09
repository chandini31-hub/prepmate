"use client";

import { useEffect, useState } from "react";

interface InterviewRound {
  round: string;
  description: string;
}

interface Topic {
  topic: string;
  description: string;
}

interface Question {
  question: string;
}

interface RoadmapItem {
  day: number | string;
  task: string;
}

interface CompanyData {
  company?: string;
  role?: string;
  overview?: string;
  hiringProcess?: string[];
  dsaTopics?: string[];
  coreSubjects?: string[];
  hrQuestions?: string[];
  technicalQuestions?: string[];
  roadmap?: RoadmapItem[];
  interviewRounds?: InterviewRound[];
  importantTopics?: Topic[];
  resources?: Topic[];
  tips?: Topic[] | string[];
}

export default function CompanyPrepPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] =
    useState<CompanyData | null>(null);

  // Get target role already stored by PrepMate
  useEffect(() => {
    const savedRole =
      localStorage.getItem("targetRole") ||
      localStorage.getItem("role") ||
      "";

    setRole(savedRole);
  }, []);

  const handleCompanyPrep = async () => {
    if (!company.trim()) {
      alert("Please enter a company name.");
      return;
    }

    if (!role.trim()) {
      alert(
        "Target role not found. Please select your target role in Resume Analysis first."
      );
      return;
    }

    setLoading(true);
    setCompanyData(null);

    try {
      const response = await fetch(
        "http://localhost:5001/company-prep",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company: company.trim(),
            role: role.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log("COMPANY PREP RESPONSE:", data);

      if (!response.ok || !data.success) {
        alert(
          data.error || "Company preparation generation failed."
        );
        return;
      }

      setCompanyData(data.result);
    } catch (error) {
      console.error("COMPANY PREP ERROR:", error);

      alert(
        "Unable to connect to the PrepMate backend. Make sure your backend is running on port 5001."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center">

          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 mb-6">
            ✨ AI Career Intelligence
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400">
            Company Prep Pro
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mt-4">
            Prepare for your dream company with AI-powered
            interview guidance.
          </p>

        </div>

        {/* INPUT CARD */}
        <section className="bg-zinc-900/70 border border-blue-500/20 rounded-3xl p-8">

          <h2 className="text-3xl font-bold text-blue-400 mb-6">
            🎯 Target Enterprise Strategy
          </h2>

          {/* COMPANY */}
          <label className="block text-gray-300 mb-3">
            Company Name
          </label>

          <input
            type="text"
            placeholder="Example: Google, Amazon, Infosys"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-xl px-5 py-4 text-white focus:border-yellow-400 outline-none"
          />

          {/* ROLE AUTOMATICALLY DETECTED */}
          <div className="mt-6">

            <label className="block text-gray-300 mb-3">
              Target Role
            </label>

            {role ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-4">
                <p className="text-green-400 font-semibold">
                  ✓ Target role detected
                </p>

                <p className="text-white text-lg mt-1">
                  {role}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Automatically taken from your PrepMate career profile.
                </p>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4">
                <p className="text-red-400 font-semibold">
                  ⚠ Target role not found
                </p>

                <p className="text-gray-400 text-sm mt-1">
                  Set your target role in Resume Analysis first.
                </p>
              </div>
            )}

          </div>

          {/* GENERATE */}
          <button
            onClick={handleCompanyPrep}
            disabled={loading}
            className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold transition disabled:opacity-50"
          >
            {loading
              ? "Generating Company Intelligence..."
              : "🚀 Generate Company Prep"}
          </button>

        </section>

        {/* RESULTS */}
        {companyData && (
          <div className="space-y-8">

            {/* COMPANY TITLE */}
            <section className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8">

              <h2 className="text-4xl font-bold text-yellow-400">
                🏢 {companyData.company || company}
              </h2>

              <p className="text-gray-400 text-lg mt-2">
                Preparation Guide for{" "}
                <span className="text-white font-semibold">
                  {companyData.role || role}
                </span>
              </p>

            </section>

            {/* OVERVIEW */}
            {companyData.overview && (
              <section className="bg-zinc-900 border border-blue-500/20 rounded-3xl p-8">

                <h2 className="text-2xl font-bold text-blue-400 mb-4">
                  🏢 Company Overview
                </h2>

                <p className="text-gray-300 leading-8">
                  {companyData.overview}
                </p>

              </section>
            )}

            {/* HIRING PROCESS */}
            {companyData.hiringProcess &&
              companyData.hiringProcess.length > 0 && (
                <section className="bg-zinc-900 border border-purple-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-purple-400 mb-6">
                    🔄 Hiring Process
                  </h2>

                  <div className="space-y-4">

                    {companyData.hiringProcess.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="bg-black/40 border border-white/10 rounded-2xl p-5"
                        >
                          <div className="flex gap-4">

                            <div className="w-10 h-10 shrink-0 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                              {index + 1}
                            </div>

                            <p className="text-gray-300 leading-7">
                              {item}
                            </p>

                          </div>
                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* INTERVIEW ROUNDS */}
            {companyData.interviewRounds &&
              companyData.interviewRounds.length > 0 && (
                <section className="bg-zinc-900 border border-purple-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-purple-400 mb-6">
                    🎤 Interview Rounds
                  </h2>

                  <div className="grid md:grid-cols-2 gap-5">

                    {companyData.interviewRounds.map(
                      (round, index) => (
                        <div
                          key={index}
                          className="bg-black/40 border border-purple-500/20 rounded-2xl p-6"
                        >

                          <h3 className="text-xl font-bold text-yellow-400">
                            {round.round}
                          </h3>

                          <p className="text-gray-400 mt-3 leading-7">
                            {round.description}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* DSA */}
            {companyData.dsaTopics &&
              companyData.dsaTopics.length > 0 && (
                <section className="bg-zinc-900 border border-red-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-red-400 mb-6">
                    💻 Important DSA Topics
                  </h2>

                  <div className="flex flex-wrap gap-3">

                    {companyData.dsaTopics.map(
                      (topic, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-300"
                        >
                          {topic}
                        </span>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* CORE SUBJECTS */}
            {companyData.coreSubjects &&
              companyData.coreSubjects.length > 0 && (
                <section className="bg-zinc-900 border border-green-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-green-400 mb-6">
                    📚 Core CS Subjects
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">

                    {companyData.coreSubjects.map(
                      (subject, index) => (
                        <div
                          key={index}
                          className="bg-black/40 border border-white/10 rounded-xl p-4"
                        >
                          <span className="text-gray-300">
                            ✓ {subject}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* IMPORTANT TOPICS */}
            {companyData.importantTopics &&
              companyData.importantTopics.length > 0 && (
                <section className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-yellow-400 mb-6">
                    ⭐ Important Preparation Topics
                  </h2>

                  <div className="grid md:grid-cols-2 gap-5">

                    {companyData.importantTopics.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="bg-black/40 border border-yellow-500/20 rounded-2xl p-5"
                        >

                          <h3 className="text-lg font-bold text-yellow-300">
                            {item.topic}
                          </h3>

                          <p className="text-gray-400 mt-2">
                            {item.description}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* TECHNICAL QUESTIONS */}
            {companyData.technicalQuestions &&
              companyData.technicalQuestions.length > 0 && (
                <section className="bg-zinc-900 border border-blue-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-blue-400 mb-6">
                    💻 Technical Interview Questions
                  </h2>

                  <div className="space-y-3">

                    {companyData.technicalQuestions.map(
                      (question, index) => (
                        <div
                          key={index}
                          className="bg-black/40 border border-white/10 rounded-xl p-4"
                        >
                          <span className="text-gray-300">
                            {index + 1}. {question}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* HR QUESTIONS */}
            {companyData.hrQuestions &&
              companyData.hrQuestions.length > 0 && (
                <section className="bg-zinc-900 border border-pink-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-pink-400 mb-6">
                    👤 HR Interview Questions
                  </h2>

                  <div className="space-y-3">

                    {companyData.hrQuestions.map(
                      (question, index) => (
                        <div
                          key={index}
                          className="bg-black/40 border border-white/10 rounded-xl p-4"
                        >
                          <span className="text-gray-300">
                            {index + 1}. {question}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* ROADMAP */}
            {companyData.roadmap &&
  companyData.roadmap.length > 0 && (
    <section className="bg-zinc-900 border border-indigo-500/20 rounded-3xl p-8">

      <h2 className="text-2xl font-bold text-indigo-400 mb-6">
        🗓️ 30-Day Preparation Roadmap
      </h2>

      <div className="space-y-4">

        {companyData.roadmap.map((item, index) => (
          <div
            key={index}
            className="bg-black/40 border border-indigo-500/20 rounded-xl p-5 hover:border-indigo-400/40 transition"
          >

            <div className="flex gap-4 items-start">

              <div className="min-w-20 text-indigo-400 font-bold">
                Day {item.day || index + 1}
              </div>

              <p className="text-gray-300 leading-7">
                {item.task}
              </p>

            </div>

          </div>
        ))}

      </div>

    </section>
  )}

            {/* TIPS */}
            {companyData.tips &&
              companyData.tips.length > 0 && (
                <section className="bg-zinc-900 border border-orange-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-orange-400 mb-6">
                    💡 Company-Specific Tips
                  </h2>

                  <div className="space-y-4">

                    {companyData.tips.map(
                      (tip, index) => (
                        <div
                          key={index}
                          className="bg-black/40 border border-orange-500/20 rounded-xl p-5"
                        >
                          <p className="text-gray-300">
                            {typeof tip === "string"
                              ? tip
                              : `${tip.topic}: ${tip.description}`}
                          </p>
                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

          </div>
        )}

      </div>
    </main>
  );
}