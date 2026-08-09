"use client";

import { useEffect, useState } from "react";

interface MissingSkill {
  skill: string;
  priority: "High" | "Medium" | "Low";
  hours: number;
}

interface Project {
  title: string;
  description: string;
  difficulty: string;
  skills: string[];
}

interface CareerGapResult {
  currentLevel?: string;
  missingSkills?: MissingSkill[];
  recommendedProjects?: Project[];
}

export default function SkillGapPage() {
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const [result, setResult] =
    useState<CareerGapResult | null>(null);

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // LOAD SAVED RESUME + PREVIOUS SKILL GAP DATA
  // --------------------------------------------------

  useEffect(() => {
    // Load resume from Resume Analysis
    const savedResume =
      localStorage.getItem("resumeText") || "";

    const savedFileName =
      localStorage.getItem("resumeFileName") || "";

    setResumeText(savedResume);
    setResumeFileName(savedFileName);

    // Load previously saved Skill Gap data
    const savedSkillGap =
      localStorage.getItem("prepmateSkillGap");

    if (savedSkillGap) {
      try {
        const data = JSON.parse(savedSkillGap);

        if (data.targetRole) {
          setTargetRole(data.targetRole);
        }

        if (
          data.currentLevel ||
          data.missingSkills ||
          data.recommendedProjects
        ) {
          setResult({
            currentLevel: data.currentLevel || "",
            missingSkills: data.missingSkills || [],
            recommendedProjects:
              data.recommendedProjects || [],
          });
        }

        console.log(
          "Loaded saved Skill Gap data:",
          data
        );
      } catch (error) {
        console.error(
          "Could not load saved Skill Gap data:",
          error
        );
      }
    }
  }, []);

  // --------------------------------------------------
  // ANALYZE SKILL GAP
  // --------------------------------------------------

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      alert(
        "Please analyze your resume first from the Resume Analysis page."
      );
      return;
    }

    if (!targetRole.trim()) {
      alert("Please enter your target job role.");
      return;
    }

    try {
      setLoading(true);

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

      const data = await response.json();

      if (data.success) {
        // --------------------------------------------
        // SAVE RESULT IN STATE
        // --------------------------------------------

        setResult(data.result);

        // --------------------------------------------
        // SAVE EVERYTHING FOR ROADMAP PAGE
        // --------------------------------------------

        const skillGapData = {
          targetRole,
          resumeText,
          resumeFileName,

          currentLevel:
            data.result?.currentLevel || "",

          missingSkills:
            data.result?.missingSkills || [],

          recommendedProjects:
            data.result?.recommendedProjects || [],
        };

        localStorage.setItem(
          "prepmateSkillGap",
          JSON.stringify(skillGapData)
        );

        console.log(
          "Skill Gap data saved successfully:",
          skillGapData
        );

        alert(
          "Skill Gap analysis completed successfully!"
        );
      } else {
        alert(
          data.error ||
            "Skill gap analysis failed."
        );
      }
    } catch (error) {
      console.error(
        "Skill Gap Error:",
        error
      );

      alert(
        "Unable to connect to the PrepMate backend. Make sure your backend is running on port 5001."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="mb-10">

          <h1 className="text-5xl font-black text-yellow-400">
            Skill Gap Analyzer
          </h1>

          <p className="text-gray-400 text-lg mt-3">
            Find the skills you are missing for your
            dream role.
          </p>

        </div>

        {/* ========================================== */}
        {/* ANALYSIS CARD */}
        {/* ========================================== */}

        <div className="bg-zinc-900/70 border border-yellow-500/30 rounded-3xl p-8">

          <h2 className="text-2xl font-bold text-yellow-400 mb-8">
            Analyze Your Skill Gap
          </h2>

          {/* ---------------------------------------- */}
          {/* TARGET ROLE */}
          {/* ---------------------------------------- */}

          <div className="mb-6">

            <label className="block text-gray-300 mb-3">
              Target Job Role
            </label>

            <input
              type="text"
              value={targetRole}
              onChange={(e) =>
                setTargetRole(e.target.value)
              }
              placeholder="Example: Software Engineer"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-yellow-400"
            />

          </div>

          {/* ---------------------------------------- */}
          {/* RESUME STATUS */}
          {/* ---------------------------------------- */}

          <div className="mb-6">

            <label className="block text-gray-300 mb-3">
              Resume
            </label>

            {resumeText ? (

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">

                <p className="text-green-400 font-semibold">
                  ✓ Resume analyzed
                </p>

                <p className="text-gray-400 mt-2">
                  {resumeFileName ||
                    "Uploaded resume"}
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  Your analyzed resume will
                  automatically be used for skill
                  gap analysis and career roadmap
                  generation.
                </p>

              </div>

            ) : (

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">

                <p className="text-red-400 font-semibold">
                  ⚠ No analyzed resume found
                </p>

                <p className="text-gray-400 mt-2">
                  Go to Resume Analysis and upload
                  your resume first.
                </p>

              </div>

            )}

          </div>

          {/* ---------------------------------------- */}
          {/* ANALYZE BUTTON */}
          {/* ---------------------------------------- */}

          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeText}
            className="px-7 py-4 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {loading
              ? "Analyzing..."
              : "Analyze Skill Gap"}

          </button>

        </div>

        {/* ========================================== */}
        {/* RESULTS */}
        {/* ========================================== */}

        {result && (

          <div className="mt-10 space-y-8">

            {/* -------------------------------------- */}
            {/* CURRENT LEVEL */}
            {/* -------------------------------------- */}

            <section className="bg-green-500/10 border border-green-500/30 rounded-3xl p-8">

              <h2 className="text-2xl font-bold text-green-400 mb-4">
                Current Level
              </h2>

              <p className="text-xl text-gray-200">
                {result.currentLevel ||
                  "Not available"}
              </p>

            </section>

            {/* -------------------------------------- */}
            {/* MISSING SKILLS */}
            {/* -------------------------------------- */}

            <section className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8">

              <h2 className="text-2xl font-bold text-red-400 mb-6">
                Missing Skills
              </h2>

              {result.missingSkills &&
              result.missingSkills.length > 0 ? (

                <div className="space-y-4">

                  {result.missingSkills.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="bg-black/40 border border-white/10 rounded-2xl p-5"
                      >

                        <div className="flex justify-between items-center gap-4">

                          <h3 className="text-xl font-bold">
                            {item.skill}
                          </h3>

                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${
                              item.priority ===
                              "High"
                                ? "bg-red-500/20 text-red-400"
                                : item.priority ===
                                  "Medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {item.priority}
                          </span>

                        </div>

                        <p className="text-gray-400 mt-4">

                          Estimated Learning:{" "}

                          <span className="text-yellow-400 font-bold">
                            {item.hours} Hours
                          </span>

                        </p>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-gray-400">
                  No missing skills found.
                </p>

              )}

            </section>

            {/* -------------------------------------- */}
            {/* RECOMMENDED PROJECTS */}
            {/* -------------------------------------- */}

            <section className="bg-purple-500/10 border border-purple-500/30 rounded-3xl p-8">

              <h2 className="text-2xl font-bold text-purple-400 mb-6">
                Recommended Projects
              </h2>

              {result.recommendedProjects &&
              result.recommendedProjects.length >
                0 ? (

                <div className="grid md:grid-cols-2 gap-6">

                  {result.recommendedProjects.map(
                    (project, index) => (

                      <div
                        key={index}
                        className="bg-black/40 border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-400 transition"
                      >

                        <h3 className="text-xl font-bold text-yellow-400">
                          {project.title}
                        </h3>

                        <p className="text-gray-400 mt-3">
                          {project.description}
                        </p>

                        <p className="text-purple-300 mt-4">

                          Difficulty:{" "}

                          <span className="font-bold">
                            {project.difficulty}
                          </span>

                        </p>

                        <div className="flex flex-wrap gap-2 mt-4">

                          {project.skills?.map(
                            (
                              skill,
                              skillIndex
                            ) => (

                              <span
                                key={skillIndex}
                                className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm"
                              >
                                {skill}
                              </span>

                            )
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-gray-400">
                  No recommended projects available.
                </p>

              )}

            </section>

          </div>

        )}

      </div>
    </main>
  );
}