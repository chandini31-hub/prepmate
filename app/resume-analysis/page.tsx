"use client";

import { useState } from "react";

import UploadCard from "../../components/resume/UploadCard";
import ATSCard from "../../components/resume/ATSCard";
import StrengthCard from "../../components/resume/StrengthCard";
import WeaknessCard from "../../components/resume/WeaknessCard";
import KeywordCard from "../../components/resume/KeywordCard";
import SuggestionCard from "../../components/resume/SuggestionCard";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");

  async function handleUpload() {
    if (!file) {
      alert("Please select a resume PDF first.");
      return;
    }

    if (!targetRole.trim()) {
      alert("Please enter your target role first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", file);
      formData.append("targetRole", targetRole.trim());

      console.log("Uploading resume...");
      console.log("Target role:", targetRole);

      const response = await fetch(
        "http://127.0.0.1:5001/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("UPLOAD RESPONSE:", data);

      if (!response.ok || !data.success) {
        alert(
          data.error ||
            "Resume analysis failed. Please try again."
        );
        return;
      }

      setResult(data.result);

      const extractedText = data.resumeText || "";

      setResumeText(extractedText);

      localStorage.setItem(
        "resumeText",
        extractedText
      );

      localStorage.setItem(
        "resumeFileName",
        file.name
      );

      localStorage.setItem(
        "targetRole",
        targetRole.trim()
      );

      localStorage.setItem(
        "role",
        targetRole.trim()
      );

      console.log(
        "TARGET ROLE SAVED:",
        targetRole.trim()
      );

      console.log("RESUME TEXT SAVED");

    } catch (error) {
      console.error(
        "RESUME UPLOAD ERROR:",
        error
      );

      alert(
        "Unable to connect to PrepMate backend. Make sure server.js is running on port 5001."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbf7f0] text-[#332d3d] px-4 py-8 md:px-8">

      <div className="max-w-6xl mx-auto">

        {/* =========================
            TOP HEADER
        ========================= */}

        <header className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-[#eadfff] flex items-center justify-center text-xl">
              ✨
            </div>

            <div>
              <h2 className="font-bold text-xl text-[#332d3d]">
                PrepMate
              </h2>

              <p className="text-sm text-[#8a8191]">
                Career companion
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => window.location.href = "/settings"}
              className="hidden sm:block px-5 py-2.5 rounded-full border border-[#dfd5ca] bg-white text-[#665d69] hover:bg-[#f6f0e9] transition"
            >
              ⚙ Settings
            </button>

            <div className="w-11 h-11 rounded-full bg-[#dfd0f5] flex items-center justify-center font-semibold text-[#7652b5]">
              C
            </div>

          </div>

        </header>


        {/* =========================
            PAGE INTRO
        ========================= */}

        <section className="bg-[#e9ddf8] border border-[#d9c9ef] rounded-[30px] p-7 md:p-10 mb-7 shadow-sm">

          <p className="uppercase tracking-[0.28em] text-sm font-semibold text-[#7954b8] mb-3">
            Resume review
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-[#30283b]">
            Resume Analysis
          </h1>

          <p className="mt-4 max-w-2xl text-[#6c6474] text-lg leading-relaxed">
            Understand how strong your resume is for your target role,
            identify missing skills, and get practical suggestions
            to improve it.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">

            <span className="px-4 py-2 bg-white/70 border border-[#d6c5ed] rounded-full text-sm text-[#7251a9]">
              📄 Resume Review
            </span>

            <span className="px-4 py-2 bg-white/70 border border-[#d6c5ed] rounded-full text-sm text-[#7251a9]">
              🎯 Role Matching
            </span>

            <span className="px-4 py-2 bg-white/70 border border-[#d6c5ed] rounded-full text-sm text-[#7251a9]">
              💡 Improvement Tips
            </span>

          </div>

        </section>


        {/* =========================
            TARGET ROLE
        ========================= */}

        <section className="bg-[#dff0df] border border-[#c9e3cc] rounded-[28px] p-7 md:p-8 mb-7 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="w-12 h-12 shrink-0 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
              🎯
            </div>

            <div className="flex-1">

              <p className="uppercase tracking-[0.2em] text-xs font-bold text-[#58835e]">
                Step 01
              </p>

              <h2 className="text-2xl font-bold mt-1 text-[#344a38]">
                Choose your target role
              </h2>

              <p className="text-[#66756a] mt-2">
                Tell PrepMate what position you're preparing for.
                This role will also be used by Skill Gap Analyzer,
                Roadmap and Company Prep.
              </p>

            </div>

          </div>


          <div className="mt-6">

            <label className="block text-sm font-semibold text-[#506353] mb-2">
              Target role
            </label>

            <input
              type="text"
              value={targetRole}
              onChange={(e) =>
                setTargetRole(e.target.value)
              }
              placeholder="Example: Software Engineer"
              className="w-full bg-white border border-[#c7ddca] rounded-2xl px-5 py-4 text-[#332d3d] placeholder-[#aaa4a9] outline-none focus:border-[#72a779] focus:ring-2 focus:ring-[#b9dcbf] transition"
            />

            {targetRole.trim() && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-[#4f8057]">
                ✓ Preparing for{" "}
                <strong>{targetRole}</strong>
              </div>
            )}

          </div>

        </section>


        {/* =========================
            UPLOAD RESUME
        ========================= */}

        <section className="bg-[#dfeaf7] border border-[#c8dced] rounded-[28px] p-7 md:p-8 mb-7 shadow-sm">

          <div className="flex items-center gap-4 mb-6">

            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
              📄
            </div>

            <div>

              <p className="uppercase tracking-[0.2em] text-xs font-bold text-[#53789d]">
                Step 02
              </p>

              <h2 className="text-2xl font-bold text-[#35495c]">
                Upload your resume
              </h2>

              <p className="text-[#718091] mt-1">
                Upload your latest PDF resume for analysis.
              </p>

            </div>

          </div>


          {/* Existing upload functionality */}
          <UploadCard
            file={file}
            setFile={setFile}
            handleUpload={handleUpload}
            loading={loading}
          />

        </section>


        {/* =========================
            RESULTS
        ========================= */}

        {result && (
          <section className="space-y-7">

            {/* Results heading */}

            <div className="bg-[#fff0df] border border-[#f0d7bc] rounded-[28px] p-7">

              <p className="uppercase tracking-[0.22em] text-xs font-bold text-[#b26d45]">
                Your results
              </p>

              <h2 className="text-3xl font-bold mt-2 text-[#4a3530]">
                Here's how your resume looks
              </h2>

              <p className="text-[#806d67] mt-2">
                Review your score, strengths, missing skills and
                suggestions before applying.
              </p>

            </div>


            {/* ATS SCORE */}

            <div className="bg-[#fff4c9] border border-[#eadca5] rounded-[28px] p-2">
              <ATSCard
                score={result.atsScore}
                roleReadiness={
                  result.roleReadiness ||
                  result.readiness ||
                  "Developing"
                }
              />
            </div>


            {/* STRENGTHS + WEAKNESSES */}

            <div className="grid lg:grid-cols-2 gap-7">

              <div className="bg-[#dff1df] border border-[#c8e2ca] rounded-[28px] p-2">
                <StrengthCard
                  strengths={
                    result.strengths || []
                  }
                />
              </div>

              <div className="bg-[#f9e0df] border border-[#ecc7c5] rounded-[28px] p-2">
                <WeaknessCard
                  weaknesses={
                    result.weaknesses || []
                  }
                />
              </div>

            </div>


            {/* MISSING SKILLS */}

            <div className="bg-[#e4ddf8] border border-[#d5caec] rounded-[28px] p-2">
              <KeywordCard
                keywords={
                  result.missingSkills || []
                }
              />
            </div>


            {/* SUGGESTIONS */}

            <div className="bg-[#dcecf7] border border-[#c8ddeb] rounded-[28px] p-2">
              <SuggestionCard
                suggestions={
                  result.suggestions || []
                }
              />
            </div>

          </section>
        )}


        {/* =========================
            FOOTER NOTE
        ========================= */}

        <div className="text-center py-10 text-sm text-[#9a929d]">

          <p>
            PrepMate helps you understand your resume —
            you decide where your career goes. ✨
          </p>

        </div>

      </div>

    </main>
  );
}