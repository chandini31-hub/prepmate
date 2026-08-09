"use client";

import { useEffect, useState } from "react";

type Week = {
  week: string;
  topics: string[];
};

type RoadmapResult = {
  missingSkills?: string[];
  roadmap?: Week[];
};

export default function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [duration, setDuration] = useState("30 Days");

  const [roadmapResult, setRoadmapResult] =
    useState<RoadmapResult | null>(null);

  const [loading, setLoading] = useState(false);

  // ==================================================
  // LOAD DATA SAVED FROM SKILL GAP ANALYZER
  // ==================================================

  useEffect(() => {
    try {
      const savedSkillGap =
        localStorage.getItem("prepmateSkillGap");

      if (!savedSkillGap) {
        console.log(
          "No Skill Gap data found."
        );
        return;
      }

      const data = JSON.parse(savedSkillGap);

      setTargetRole(data.targetRole || "");
      setResumeText(data.resumeText || "");
      setJobDescription(data.jobDescription || "");

      console.log(
        "Loaded Skill Gap data for Roadmap:",
        data
      );
    } catch (error) {
      console.error(
        "Could not load Skill Gap data:",
        error
      );
    }
  }, []);

  // ==================================================
  // CONVERT DAYS -> NUMBER OF WEEKS
  // ==================================================

  const getWeekLimit = (
    selectedDuration: string
  ): number => {
    switch (selectedDuration) {
      case "30 Days":
        return 4;

      case "60 Days":
        return 8;

      case "90 Days":
        return 12;

      case "120 Days":
        return 16;

      default:
        return 4;
    }
  };

  // ==================================================
  // GENERATE ROADMAP
  // ==================================================

  const handleGenerateRoadmap = async () => {
    if (!resumeText.trim()) {
      alert(
        "No analyzed resume found. Please analyze your resume first."
      );
      return;
    }

    if (!targetRole.trim()) {
      alert(
        "No target role found. Please complete Skill Gap Analysis first."
      );
      return;
    }

    setLoading(true);
    setRoadmapResult(null);

    const weekLimit =
      getWeekLimit(duration);

    try {
      const response = await fetch(
        "http://localhost:5001/roadmap",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            resumeText,
            jobDescription,
            duration,
            targetRole,

            // Send exact number of weeks
            weeks: weekLimit,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "ROADMAP RESPONSE:",
        data
      );

      if (!data.success) {
        alert(
          data.error ||
            "Roadmap generation failed."
        );
        return;
      }

      const result = data.result || {};

      // ==================================================
      // IMPORTANT:
      // BACKEND MAY RETURN 24 WEEKS.
      // WE ONLY DISPLAY THE REQUIRED NUMBER.
      // ==================================================

      let limitedRoadmap: Week[] = [];

      if (Array.isArray(result.roadmap)) {
        limitedRoadmap =
          result.roadmap.slice(
            0,
            weekLimit
          );
      }

      // ==================================================
      // SAFETY:
      // IF BACKEND RETURNS FEWER WEEKS,
      // DON'T INVENT EXTRA CONTENT.
      // ==================================================

      const finalResult: RoadmapResult = {
        missingSkills:
          Array.isArray(
            result.missingSkills
          )
            ? result.missingSkills
            : [],

        roadmap: limitedRoadmap,
      };

      setRoadmapResult(
        finalResult
      );

      console.log(
        `Showing ${limitedRoadmap.length} weeks for ${duration}`
      );
    } catch (error) {
      console.error(
        "ROADMAP ERROR:",
        error
      );

      alert(
        "Could not connect to the PrepMate backend. Make sure your backend is running on port 5001."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // CURRENT WEEK LIMIT
  // ==================================================

  const weekLimit =
    getWeekLimit(duration);

  // ==================================================
  // UI
  // ==================================================

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold text-yellow-400">
            AI Career Roadmap
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Your personalized learning roadmap
            is automatically created using your
            Resume Analysis and Skill Gap Analysis.
          </p>

        </div>

        {/* ========================================== */}
        {/* PROFILE SUMMARY */}
        {/* ========================================== */}

        <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8 mb-8">

          <h2 className="text-2xl font-bold text-yellow-400 mb-6">
            Your Career Profile
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* TARGET ROLE */}

            <div className="bg-black/40 border border-white/10 rounded-2xl p-5">

              <p className="text-gray-500 text-sm">
                Target Role
              </p>

              <p className="text-xl font-bold text-yellow-400 mt-2">
                {targetRole ||
                  "Not available"}
              </p>

            </div>

            {/* RESUME STATUS */}

            <div className="bg-black/40 border border-white/10 rounded-2xl p-5">

              <p className="text-gray-500 text-sm">
                Resume Status
              </p>

              <p className="text-xl font-bold text-green-400 mt-2">
                {resumeText
                  ? "✓ Analyzed"
                  : "⚠ Not Available"}
              </p>

            </div>

          </div>

          {/* INFORMATION */}

          <div className="mt-6 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5">

            <p className="text-gray-300">

              Your roadmap automatically uses
              the information from your previous
              analysis.

            </p>

            <p className="text-gray-500 text-sm mt-2">

              You don't need to enter your resume,
              current skills, or job description again.

            </p>

          </div>

        </div>

        {/* ========================================== */}
        {/* ROADMAP SETTINGS */}
        {/* ========================================== */}

        <div className="bg-zinc-900 border border-purple-500/20 rounded-3xl p-8">

          <h2 className="text-2xl font-bold text-purple-400 mb-6">
            Roadmap Settings
          </h2>

          {/* DURATION */}

          <label className="block text-gray-300 mb-3">
            Roadmap Duration
          </label>

          <select
            value={duration}
            onChange={(e) => {
              setDuration(
                e.target.value
              );

              // Clear old roadmap when duration changes
              setRoadmapResult(null);
            }}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-yellow-400"
          >

            <option value="30 Days">
              30 Days
            </option>

            <option value="60 Days">
              60 Days
            </option>

            <option value="90 Days">
              90 Days
            </option>

            <option value="120 Days">
              120 Days
            </option>

          </select>

          {/* DURATION INFORMATION */}

          <div className="mt-5 bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">

            <p className="text-gray-300">

              <span className="text-purple-400 font-bold">
                {duration}
              </span>{" "}
              roadmap

            </p>

            <p className="text-gray-500 text-sm mt-2">

              Approximately{" "}

              <span className="text-yellow-400 font-bold">
                {weekLimit} weeks
              </span>{" "}

              of structured learning.

            </p>

          </div>

          {/* GENERATE BUTTON */}

          <button
            onClick={
              handleGenerateRoadmap
            }
            disabled={
              loading ||
              !resumeText ||
              !targetRole
            }
            className="mt-6 px-8 py-4 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {loading
              ? "Generating Roadmap..."
              : "Generate AI Roadmap"}

          </button>

        </div>

        {/* ========================================== */}
        {/* ROADMAP RESULTS */}
        {/* ========================================== */}

        {roadmapResult && (

          <div className="mt-12 space-y-10">

            {/* ====================================== */}
            {/* RESULT HEADER */}
            {/* ====================================== */}

            <div>

              <h2 className="text-4xl font-bold text-purple-400">
                Your Personalized Roadmap
              </h2>

              <p className="text-gray-400 mt-2">

                A{" "}

                <span className="text-yellow-400 font-semibold">
                  {duration.toLowerCase()}
                </span>{" "}

                learning plan for{" "}

                <span className="text-yellow-400 font-semibold">
                  {targetRole}
                </span>

                .

              </p>

            </div>

            {/* ====================================== */}
            {/* MISSING SKILLS */}
            {/* ====================================== */}

            {roadmapResult.missingSkills &&
              roadmapResult.missingSkills.length >
                0 && (

                <section className="bg-zinc-900 border border-red-500/20 rounded-3xl p-8">

                  <h3 className="text-2xl font-bold text-red-400 mb-6">
                    Skills You Need to Improve
                  </h3>

                  <div className="flex flex-wrap gap-3">

                    {roadmapResult.missingSkills.map(
                      (
                        skill,
                        index
                      ) => (

                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-300"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </section>

              )}

            {/* ====================================== */}
            {/* LEARNING TIMELINE */}
            {/* ====================================== */}

            {roadmapResult.roadmap &&
              roadmapResult.roadmap.length >
                0 && (

                <section className="bg-zinc-900 border border-purple-500/20 rounded-3xl p-8">

                  <div className="flex items-center justify-between mb-8">

                    <h3 className="text-3xl font-bold text-purple-400">
                      Learning Timeline
                    </h3>

                    <span className="px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-semibold">
                      {duration}
                    </span>

                  </div>

                  {/* ================================= */}
                  {/* WEEK CARDS */}
                  {/* ================================= */}

                  <div className="space-y-6">

                    {roadmapResult.roadmap.map(
                      (
                        week,
                        index
                      ) => (

                        <div
                          key={index}
                          className="relative bg-black/40 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400 transition"
                        >

                          {/* WEEK HEADER */}

                          <div className="flex items-center gap-4 mb-5">

                            <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold">

                              {index + 1}

                            </div>

                            <h4 className="text-2xl font-bold text-yellow-400">

                              {week.week}

                            </h4>

                          </div>

                          {/* TOPICS */}

                          {week.topics &&
                            week.topics.length >
                              0 ? (

                            <div className="grid md:grid-cols-2 gap-4">

                              {week.topics.map(
                                (
                                  topic,
                                  topicIndex
                                ) => (

                                  <div
                                    key={
                                      topicIndex
                                    }
                                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
                                  >

                                    <span className="text-green-400 text-xl">
                                      ✓
                                    </span>

                                    <span className="text-gray-300">
                                      {topic}
                                    </span>

                                  </div>

                                )
                              )}

                            </div>

                          ) : (

                            <p className="text-gray-500">
                              No topics available
                              for this week.
                            </p>

                          )}

                        </div>

                      )
                    )}

                  </div>

                </section>

              )}

            {/* ====================================== */}
            {/* EMPTY RESULT */}
            {/* ====================================== */}

            {(!roadmapResult.roadmap ||
              roadmapResult.roadmap.length ===
                0) && (

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">

                <p className="text-yellow-400 font-semibold">
                  No roadmap weeks were returned.
                </p>

                <p className="text-gray-400 mt-2">
                  Try generating the roadmap again.
                </p>

              </div>

            )}

          </div>

        )}

      </div>

    </main>
  );
}