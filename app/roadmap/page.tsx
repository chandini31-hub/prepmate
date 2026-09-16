"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Flag,
  LoaderCircle,
  Map,
  Target,
  TrendingUp,
  Sparkles,
  RotateCcw,
} from "lucide-react";

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

  // Stores completed topics
  const [completedTopics, setCompletedTopics] = useState<
    Record<string, boolean>
  >({});

  // =========================================================
  // LOAD PREVIOUS ANALYSIS
  // =========================================================

  useEffect(() => {
    try {
      const savedSkillGap =
        localStorage.getItem("prepmateSkillGap");

      if (!savedSkillGap) {
        console.log("No Skill Gap data found.");
        return;
      }

      const data = JSON.parse(savedSkillGap);

console.log("SAVED SKILL GAP DATA:", data);
console.log("SAVED TARGET ROLE:", data.targetRole);

setTargetRole(data.targetRole || "");

      setResumeText(data.resumeText || "");
      setJobDescription(data.jobDescription || "");
    } catch (error) {
      console.error(
        "Could not load Skill Gap data:",
        error
      );
    }
  }, []);

  // =========================================================
  // LOAD SAVED ROADMAP PROGRESS
  // =========================================================

  useEffect(() => {
    try {
      const savedProgress =
        localStorage.getItem(
          "prepmateRoadmapProgress"
        );

      if (savedProgress) {
        setCompletedTopics(
          JSON.parse(savedProgress)
        );
      }
    } catch (error) {
      console.error(
        "Could not load roadmap progress:",
        error
      );
    }
  }, []);

  // =========================================================
  // SAVE ROADMAP PROGRESS
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "prepmateRoadmapProgress",
      JSON.stringify(completedTopics)
    );
  }, [completedTopics]);

  // =========================================================
  // DURATION -> WEEKS
  // =========================================================

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

  const weekLimit = getWeekLimit(duration);

  // =========================================================
  // GENERATE ROADMAP
  // =========================================================

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
            weeks: weekLimit,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "ROADMAP RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        alert(
          data.error ||
            "Roadmap generation failed."
        );
        return;
      }

      const result = data.result || {};

      const limitedRoadmap: Week[] =
        Array.isArray(result.roadmap)
          ? result.roadmap.slice(
              0,
              weekLimit
            )
          : [];

      const finalResult: RoadmapResult = {
        missingSkills:
          Array.isArray(
            result.missingSkills
          )
            ? result.missingSkills
            : [],
        roadmap: limitedRoadmap,
      };

      setRoadmapResult(finalResult);
      localStorage.setItem(
  "prepmateRoadmap",
  JSON.stringify({
    targetRole,
    duration,
    roadmap: limitedRoadmap,
    missingSkills: finalResult.missingSkills,
  })
);
console.log(
  `Showing ${limitedRoadmap.length} weeks for ${duration}`
);

      // Start fresh progress for newly generated roadmap
      setCompletedTopics({});

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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

  // =========================================================
  // TOPIC ID
  // =========================================================

  const getTopicId = (
    weekIndex: number,
    topicIndex: number
  ) => {
    return `week-${weekIndex}-topic-${topicIndex}`;
  };

  // =========================================================
  // TOGGLE TOPIC
  // =========================================================

  const toggleTopic = (
    topicId: string
  ) => {
    setCompletedTopics((previous) => ({
      ...previous,
      [topicId]:
        !previous[topicId],
    }));
  };

  // =========================================================
  // TOTAL TOPICS
  // =========================================================

  const totalTopics = useMemo(() => {
    if (!roadmapResult?.roadmap) {
      return 0;
    }

    return roadmapResult.roadmap.reduce(
      (total, week) =>
        total + (week.topics?.length || 0),
      0
    );
  }, [roadmapResult]);

  // =========================================================
  // COMPLETED TOPICS
  // =========================================================

  const completedCount = useMemo(() => {
    return Object.values(
      completedTopics
    ).filter(Boolean).length;
  }, [completedTopics]);

  // =========================================================
  // PROGRESS %
  // =========================================================

  const progress =
    totalTopics > 0
      ? Math.round(
          (completedCount /
            totalTopics) *
            100
        )
      : 0;

  // =========================================================
  // COMPLETED WEEKS
  // =========================================================

  const completedWeeks = useMemo(() => {
    if (!roadmapResult?.roadmap) {
      return 0;
    }

    return roadmapResult.roadmap.filter(
      (week, weekIndex) => {
        if (!week.topics?.length) {
          return false;
        }

        return week.topics.every(
          (_, topicIndex) =>
            completedTopics[
              getTopicId(
                weekIndex,
                topicIndex
              )
            ]
        );
      }
    ).length;
  }, [
    roadmapResult,
    completedTopics,
  ]);

  // =========================================================
  // CURRENT TOPIC
  // =========================================================

  const currentFocus = useMemo(() => {
    if (!roadmapResult?.roadmap) {
      return null;
    }

    for (
      let weekIndex = 0;
      weekIndex <
      roadmapResult.roadmap.length;
      weekIndex++
    ) {
      const week =
        roadmapResult.roadmap[
          weekIndex
        ];

      for (
        let topicIndex = 0;
        topicIndex <
        (week.topics?.length || 0);
        topicIndex++
      ) {
        const id =
          getTopicId(
            weekIndex,
            topicIndex
          );

        if (!completedTopics[id]) {
          return {
            week,
            topic:
              week.topics[
                topicIndex
              ],
            weekIndex,
          };
        }
      }
    }

    return null;
  }, [
    roadmapResult,
    completedTopics,
  ]);

  // =========================================================
  // RESET PROGRESS
  // =========================================================

  const resetProgress = () => {
    setCompletedTopics({});
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-[#FCF9F4] text-[#393348]">

      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10 sm:py-14">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDE4FA] border border-[#D8C6F2] text-[#7652B8] text-sm font-semibold mb-5">
            <Map
              size={17}
              strokeWidth={2}
            />
            Career Roadmap
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#393348]">
            Your Path Forward
          </h1>

          <p className="text-[#777181] text-lg mt-4 max-w-2xl leading-8">
            A practical learning path built around
            your current skills, target role, and
            the gaps you need to close.
          </p>

        </header>

        {/* =================================================
            CAREER PROFILE
        ================================================= */}

        <section className="bg-[#E9DFF8] border border-[#D8C6F2] rounded-[28px] p-6 sm:p-8 shadow-sm mb-7">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-[#7652B8]">
              <Target
                size={21}
                strokeWidth={2}
              />
            </div>

            <div>
              <p className="text-[#806F95] text-xs font-bold uppercase tracking-[0.18em]">
                Career Profile
              </p>

              <h2 className="text-2xl font-bold text-[#393348] mt-1">
                Your starting point
              </h2>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {/* TARGET ROLE */}

            <div className="bg-white/75 rounded-2xl p-5 border border-white/80">

              <p className="text-[#806F95] text-xs font-bold uppercase tracking-wider">
                Target Role
              </p>

              <p className="text-2xl font-bold text-[#393348] mt-2 capitalize">
                {targetRole ||
                  "Not available"}
              </p>

            </div>

            {/* RESUME */}

            <div className="bg-white/75 rounded-2xl p-5 border border-white/80">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[#806F95] text-xs font-bold uppercase tracking-wider">
                    Resume Analysis
                  </p>

                  <p className="text-lg font-bold text-[#4F8C5A] mt-2">
                    {resumeText
                      ? "Completed"
                      : "Not available"}
                  </p>

                </div>

                <div className="w-10 h-10 rounded-xl bg-[#E5F2E4] text-[#4F8C5A] flex items-center justify-center">
                  <CheckCircle2
                    size={21}
                  />
                </div>

              </div>

            </div>

          </div>

          <div className="mt-5 bg-white/55 border border-[#D8C6F2] rounded-2xl p-4">

            <p className="text-sm text-[#6F657A] leading-6">
              Your roadmap is automatically
              created from your previous Resume
              Analysis and Skill Gap Analysis.
              You don't need to enter the same
              information again.
            </p>

          </div>

        </section>

        {/* =================================================
            ROADMAP SETUP
        ================================================= */}

        {!roadmapResult && (

          <section className="bg-white border border-[#E8E0D7] rounded-[28px] p-6 sm:p-8 shadow-sm mb-8">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-11 h-11 rounded-2xl bg-[#FFF3D6] text-[#B8892D] flex items-center justify-center">
                <CalendarDays
                  size={21}
                />
              </div>

              <div>

                <p className="text-[#B8892D] text-xs font-bold uppercase tracking-[0.18em]">
                  Plan Duration
                </p>

                <h2 className="text-2xl font-bold text-[#393348] mt-1">
                  Choose your pace
                </h2>

              </div>

            </div>

            <div className="grid sm:grid-cols-4 gap-3">

              {[
                "30 Days",
                "60 Days",
                "90 Days",
                "120 Days",
              ].map((option) => (

                <button
                  key={option}
                  onClick={() => {
                    setDuration(option);
                    setRoadmapResult(null);
                  }}
                  className={`rounded-2xl px-4 py-4 text-sm font-bold border transition ${
                    duration === option
                      ? "bg-[#EDE4FA] border-[#CBB5EA] text-[#7652B8] shadow-sm"
                      : "bg-[#FCF9F4] border-[#E8E0D7] text-[#6F6875] hover:border-[#CBB5EA]"
                  }`}
                >
                  {option}

                </button>

              ))}

            </div>

            <div className="mt-5 flex items-center gap-3 bg-[#EEF5FC] border border-[#CFE1F2] rounded-2xl p-4">

              <Clock3
                size={20}
                className="text-[#4C82AD] shrink-0"
              />

              <p className="text-sm text-[#667486]">
                This creates approximately{" "}
                <span className="font-bold text-[#4C82AD]">
                  {weekLimit} weeks
                </span>{" "}
                of structured learning.
              </p>

            </div>

            <button
              onClick={
                handleGenerateRoadmap
              }
              disabled={
                loading ||
                !resumeText ||
                !targetRole
              }
              className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#78B87E] hover:bg-[#68A970] text-white font-bold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {loading ? (
                <>
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                  Creating your roadmap...
                </>
              ) : (
                <>
                  <Sparkles
                    size={19}
                  />
                  Create My Roadmap
                  <ArrowRight
                    size={18}
                  />
                </>
              )}

            </button>

          </section>

        )}

        {/* =================================================
            RESULTS
        ================================================= */}

        {roadmapResult && (

          <div className="space-y-7">

            {/* =================================================
                ROADMAP OVERVIEW
            ================================================= */}

            <section className="bg-white border border-[#E8E0D7] rounded-[28px] p-6 sm:p-8 shadow-sm">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div>

                  <p className="text-[#7652B8] text-xs font-bold uppercase tracking-[0.18em]">
                    Your Roadmap
                  </p>

                  <h2 className="text-3xl sm:text-4xl font-black text-[#393348] mt-2">
                    {duration} to{" "}
                    <span className="text-[#7652B8]">
                      {targetRole}
                    </span>
                  </h2>

                  <p className="text-[#777181] mt-2">
                    Follow the plan consistently
                    and track your progress as you go.
                  </p>

                </div>

                <button
                  onClick={resetProgress}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#E8E0D7] bg-[#FCF9F4] text-[#6F6875] text-sm font-semibold hover:border-[#CBB5EA] transition"
                >
                  <RotateCcw
                    size={16}
                  />
                  Reset Progress
                </button>

              </div>

              {/* PROGRESS */}

              <div className="mt-7">

                <div className="flex justify-between items-center mb-2">

                  <span className="text-sm font-semibold text-[#6F6875]">
                    Overall Progress
                  </span>

                  <span className="text-sm font-bold text-[#4F8C5A]">
                    {progress}%
                  </span>

                </div>

                <div className="h-3 bg-[#E8E3DB] rounded-full overflow-hidden">

                  <div
                    className="h-full bg-[#78B87E] rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

              {/* STATS */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

                <div className="bg-[#F8F3FC] rounded-2xl p-4 border border-[#E8DDF3]">

                  <p className="text-xs text-[#806F95] font-semibold">
                    Duration
                  </p>

                  <p className="text-xl font-bold text-[#393348] mt-1">
                    {duration}
                  </p>

                </div>

                <div className="bg-[#EEF7EF] rounded-2xl p-4 border border-[#D6EBD7]">

                  <p className="text-xs text-[#68816D] font-semibold">
                    Completed
                  </p>

                  <p className="text-xl font-bold text-[#4F8C5A] mt-1">
                    {completedCount}
                    <span className="text-sm font-medium text-[#68816D]">
                      {" "}
                      / {totalTopics}
                    </span>
                  </p>

                </div>

                <div className="bg-[#EEF5FC] rounded-2xl p-4 border border-[#D6E6F3]">

                  <p className="text-xs text-[#667486] font-semibold">
                    Weeks Done
                  </p>

                  <p className="text-xl font-bold text-[#4C82AD] mt-1">
                    {completedWeeks}
                    <span className="text-sm font-medium text-[#667486]">
                      {" "}
                      / {roadmapResult.roadmap?.length || 0}
                    </span>
                  </p>

                </div>

                <div className="bg-[#FFF5DF] rounded-2xl p-4 border border-[#F0DFC0]">

                  <p className="text-xs text-[#8A744C] font-semibold">
                    Skills to Improve
                  </p>

                  <p className="text-xl font-bold text-[#B8892D] mt-1">
                    {roadmapResult.missingSkills?.length || 0}
                  </p>

                </div>

              </div>

            </section>

            {/* =================================================
                CURRENT FOCUS
            ================================================= */}

            {currentFocus && (

              <section className="bg-[#E5F2E4] border border-[#C9E5C8] rounded-[28px] p-6 sm:p-7">

                <div className="flex gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-white text-[#4F8C5A] flex items-center justify-center shrink-0">

                    <Flag
                      size={22}
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-[#4F8C5A] text-xs font-bold uppercase tracking-[0.18em]">
                      Current Focus
                    </p>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#393348] mt-1">
                      {currentFocus.topic}
                    </h3>

                    <p className="text-[#68736A] text-sm mt-2">
                      {currentFocus.week.week ||
                        `Week ${
                          currentFocus.weekIndex +
                          1
                        }`}{" "}
                      • Your next recommended topic
                    </p>

                  </div>

                </div>

              </section>

            )}

            {/* =================================================
                SKILLS TO IMPROVE
            ================================================= */}

            {roadmapResult.missingSkills &&
              roadmapResult.missingSkills.length >
                0 && (

                <section className="bg-[#FFF8E8] border border-[#EBD9A8] rounded-[28px] p-6 sm:p-8">

                  <div className="flex items-center gap-3 mb-5">

                    <div className="w-11 h-11 rounded-2xl bg-white text-[#B8892D] flex items-center justify-center">

                      <TrendingUp
                        size={21}
                      />

                    </div>

                    <div>

                      <p className="text-[#B8892D] text-xs font-bold uppercase tracking-[0.18em]">
                        Skill Focus
                      </p>

                      <h3 className="text-2xl font-bold text-[#40382F]">
                        Skills to Strengthen
                      </h3>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    {roadmapResult.missingSkills.map(
                      (skill, index) => (

                        <div
                          key={index}
                          className="px-4 py-2.5 rounded-xl bg-white border border-[#EBD9A8] text-[#806F50] font-semibold text-sm"
                        >
                          {skill}
                        </div>

                      )
                    )}

                  </div>

                </section>

              )}

            {/* =================================================
                LEARNING TIMELINE
            ================================================= */}

            {roadmapResult.roadmap &&
              roadmapResult.roadmap.length >
                0 && (

                <section>

                  <div className="mb-6">

                    <p className="text-[#7652B8] text-xs font-bold uppercase tracking-[0.18em]">
                      Learning Plan
                    </p>

                    <h3 className="text-3xl sm:text-4xl font-black text-[#393348] mt-2">
                      Your Weekly Journey
                    </h3>

                    <p className="text-[#777181] mt-2">
                      Complete each topic to build
                      momentum and move through your roadmap.
                    </p>

                  </div>

                  <div className="space-y-5">

                    {roadmapResult.roadmap.map(
                      (week, weekIndex) => {

                        const weekCompleted =
                          week.topics?.length > 0 &&
                          week.topics.every(
                            (_, topicIndex) =>
                              completedTopics[
                                getTopicId(
                                  weekIndex,
                                  topicIndex
                                )
                              ]
                          );

                        return (

                          <div
                            key={weekIndex}
                            className={`bg-white rounded-[26px] border p-6 sm:p-7 shadow-sm transition ${
                              weekCompleted
                                ? "border-[#C9E5C8]"
                                : "border-[#E8E0D7]"
                            }`}
                          >

                            {/* WEEK HEADER */}

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                              <div className="flex items-center gap-4">

                                <div
                                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                                    weekCompleted
                                      ? "bg-[#E5F2E4] text-[#4F8C5A]"
                                      : "bg-[#EDE4FA] text-[#7652B8]"
                                  }`}
                                >
                                  {weekCompleted ? (
                                    <CheckCircle2
                                      size={22}
                                    />
                                  ) : (
                                    weekIndex +
                                    1
                                  )}
                                </div>

                                <div>

                                  <p className="text-xs text-[#9A9084] font-semibold uppercase tracking-wider">
                                    Week{" "}
                                    {weekIndex +
                                      1}
                                  </p>

                                  <h4 className="text-xl sm:text-2xl font-bold text-[#393348] mt-1">
                                    {week.week ||
                                      `Week ${
                                        weekIndex +
                                        1
                                      }`}
                                  </h4>

                                </div>

                              </div>

                              {weekCompleted && (

                                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#E5F2E4] text-[#4F8C5A] text-xs font-bold">
                                  <Check
                                    size={14}
                                  />
                                  Completed
                                </span>

                              )}

                            </div>

                            {/* TOPICS */}

                            {week.topics &&
                            week.topics.length >
                              0 ? (

                              <div className="grid md:grid-cols-2 gap-3">

                                {week.topics.map(
                                  (
                                    topic,
                                    topicIndex
                                  ) => {

                                    const topicId =
                                      getTopicId(
                                        weekIndex,
                                        topicIndex
                                      );

                                    const isCompleted =
                                      !!completedTopics[
                                        topicId
                                      ];

                                    return (

                                      <button
                                        key={
                                          topicIndex
                                        }
                                        onClick={() =>
                                          toggleTopic(
                                            topicId
                                          )
                                        }
                                        className={`text-left flex items-center gap-3 p-4 rounded-2xl border transition ${
                                          isCompleted
                                            ? "bg-[#EEF7EF] border-[#C9E5C8]"
                                            : "bg-[#FCF9F4] border-[#E8E0D7] hover:border-[#CBB5EA] hover:bg-[#FAF7FD]"
                                        }`}
                                      >

                                        <div
                                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                            isCompleted
                                              ? "bg-[#DCEEDC] text-[#4F8C5A]"
                                              : "bg-white text-[#A59A8E] border border-[#E5DED5]"
                                          }`}
                                        >

                                          {isCompleted ? (
                                            <Check
                                              size={
                                                17
                                              }
                                              strokeWidth={
                                                2.5
                                              }
                                            />
                                          ) : (
                                            <Circle
                                              size={
                                                17
                                              }
                                              strokeWidth={
                                                1.8
                                              }
                                            />
                                          )}

                                        </div>

                                        <span
                                          className={`text-sm font-semibold ${
                                            isCompleted
                                              ? "text-[#68816D] line-through"
                                              : "text-[#514A55]"
                                          }`}
                                        >
                                          {topic}
                                        </span>

                                      </button>

                                    );
                                  }
                                )}

                              </div>

                            ) : (

                              <div className="p-4 rounded-2xl bg-[#FCF9F4] text-sm text-[#8A8177]">
                                No topics available
                                for this week.
                              </div>

                            )}

                          </div>

                        );
                      }
                    )}

                  </div>

                </section>

              )}

            {/* =================================================
                COMPLETED STATE
            ================================================= */}

            {progress === 100 &&
              totalTopics > 0 && (

                <section className="bg-[#E5F2E4] border border-[#C9E5C8] rounded-[28px] p-8 text-center">

                  <div className="w-14 h-14 rounded-2xl bg-white text-[#4F8C5A] flex items-center justify-center mx-auto">

                    <CheckCircle2
                      size={28}
                    />

                  </div>

                  <h3 className="text-2xl font-bold text-[#393348] mt-4">
                    Roadmap completed
                  </h3>

                  <p className="text-[#68736A] mt-2 max-w-xl mx-auto">
                    You completed every topic in this
                    learning plan. This is a great time
                    to apply what you learned through
                    projects, interviews, and real-world
                    practice.
                  </p>

                </section>

              )}

            {/* =================================================
                EMPTY ROADMAP
            ================================================= */}

            {(!roadmapResult.roadmap ||
              roadmapResult.roadmap.length ===
                0) && (

              <section className="bg-[#FFF8E8] border border-[#EBD9A8] rounded-[26px] p-7">

                <div className="flex items-start gap-4">

                  <BookOpen
                    size={23}
                    className="text-[#B8892D] mt-1"
                  />

                  <div>

                    <h3 className="font-bold text-[#40382F] text-lg">
                      No roadmap weeks were returned.
                    </h3>

                    <p className="text-[#8A7F72] mt-1">
                      Try generating the roadmap again.
                    </p>

                  </div>

                </div>

              </section>

            )}

          </div>

        )}

      </div>

    </main>
  );
}