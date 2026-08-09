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

      // -----------------------------
      // SAVE AI RESULT
      // -----------------------------

      setResult(data.result);

      // -----------------------------
      // SAVE RESUME TEXT
      // -----------------------------

      const extractedText =
        data.resumeText || "";

      setResumeText(extractedText);

      // -----------------------------
      // SAVE PREPMATE PROFILE DATA
      // -----------------------------

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

      console.log(
        "RESUME TEXT SAVED"
      );

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
    <main className="min-h-screen bg-black text-white px-4 py-10">

      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="text-center">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 mb-5">
            ✨ AI Career Intelligence
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400">
            Resume Analysis
          </h1>

          <p className="text-gray-400 text-lg mt-4">
            Analyze your resume and discover exactly what you need
            to improve for your target role.
          </p>

        </div>


        {/* ================================= */}
        {/* TARGET ROLE */}
        {/* ================================= */}

        <section className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8">

          <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-3">
            🎯 Target Role
          </h2>

          <p className="text-gray-400 mb-5">
            Enter the role you are preparing for.
            PrepMate will use this role for Resume Analysis,
            Skill Gap Analysis, Roadmap and Company Prep.
          </p>

          <input
            type="text"
            value={targetRole}
            onChange={(e) =>
              setTargetRole(e.target.value)
            }
            placeholder="Example: Software Engineer"
            className="w-full bg-black border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
          />

          {targetRole.trim() && (
            <p className="text-green-400 text-sm mt-3">
              ✓ Target role selected:{" "}
              <span className="font-semibold">
                {targetRole}
              </span>
            </p>
          )}

        </section>


        {/* ================================= */}
        {/* UPLOAD */}
        {/* ================================= */}

        <UploadCard
          file={file}
          setFile={setFile}
          handleUpload={handleUpload}
          loading={loading}
        />


        {/* ================================= */}
        {/* RESULTS */}
        {/* ================================= */}

        {result && (
          <div className="space-y-8">

            {/* ATS */}

            <ATSCard
              score={result.atsScore}
              roleReadiness={
                result.roleReadiness ||
                result.readiness ||
                "Developing"
              }
            />


            {/* STRENGTHS + WEAKNESSES */}

            <div className="grid lg:grid-cols-2 gap-8">

              <StrengthCard
                strengths={
                  result.strengths || []
                }
              />

              <WeaknessCard
                weaknesses={
                  result.weaknesses || []
                }
              />

            </div>


            {/* MISSING SKILLS */}

            <KeywordCard
              keywords={
                result.missingSkills || []
              }
            />


            {/* SUGGESTIONS */}

            <SuggestionCard
              suggestions={
                result.suggestions || []
              }
            />

          </div>
        )}

      </div>

    </main>
  );
}