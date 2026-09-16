"use client";

import { useEffect, useState } from "react";
import {
Target,
BookOpen,
CalendarDays,
Wrench,
Lightbulb,
Rocket,
Check,
LoaderCircle,
} from "lucide-react";

interface MissingSkill {
skill: string;
priority: "High" | "Medium" | "Low";
gap: number;
hours: number;
}

interface RecommendedProject {
title?: string;
description?: string;
difficulty?: string;
skills?: string[];
}

interface SkillGapResult {
currentLevel?: string;
strongSkills?: string[];
missingSkills?: MissingSkill[];
estimatedTime?: string;
recommendedProjects?: RecommendedProject[];
}

export default function SkillGapPage() {
const [resumeText, setResumeText] = useState("");
const [targetRole, setTargetRole] = useState("");
const [jobDescription, setJobDescription] = useState("");
const [result, setResult] = useState<SkillGapResult | null>(null);
const [loading, setLoading] = useState(false);

// =========================================================
// LOAD RESUME + TARGET ROLE
// =========================================================

useEffect(() => {
try {
const savedResume =
localStorage.getItem("resumeText") || "";


  const savedRole =
    localStorage.getItem("targetRole") ||
    localStorage.getItem("role") ||
    "";

  const savedJobDescription =
    localStorage.getItem("jobDescription") || "";

  setResumeText(savedResume);
  setTargetRole(savedRole);
  setJobDescription(savedJobDescription);

  console.log("Loaded Skill Gap data:", {
    targetRole: savedRole,
    resumeFound: !!savedResume,
    jobDescriptionFound: !!savedJobDescription,
  });
} catch (error) {
  console.error(
    "Could not load saved Skill Gap information:",
    error
  );
}


}, []);

// =========================================================
// ANALYZE SKILL GAP
// =========================================================

async function analyzeSkillGap() {
if (!resumeText.trim()) {
alert(
"Resume not found. Please complete Resume Analysis first."
);
return;
}


if (!targetRole.trim()) {
  alert(
    "Target role not found. Please select your target role in Resume Analysis first."
  );
  return;
}

try {
  setLoading(true);
  setResult(null);

  const response = await fetch(
    "http://127.0.0.1:5001/skill-gap",
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

  console.log("SKILL GAP RESPONSE:", data);

  if (!response.ok || !data.success) {
    alert(
      data.error ||
        "Skill gap analysis failed."
    );
    return;
  }

  const skillGapResult: SkillGapResult =
    data.result || {};

  // =====================================================
  // SAVE COMPLETE SKILL GAP DATA
  // =====================================================

  localStorage.setItem(
    "prepmateSkillGap",
    JSON.stringify({
      targetRole: targetRole,
      resumeText: resumeText,
      jobDescription: jobDescription,

      currentLevel:
        skillGapResult.currentLevel || "",

      strongSkills:
        skillGapResult.strongSkills || [],

      missingSkills:
        skillGapResult.missingSkills || [],

      estimatedTime:
        skillGapResult.estimatedTime || "",

      recommendedProjects:
        skillGapResult.recommendedProjects || [],
    })
  );

  console.log(
    "Saved prepmateSkillGap:",
    {
      targetRole: targetRole,
      resumeTextLength: resumeText.length,
      missingSkills:
        skillGapResult.missingSkills?.length || 0,
    }
  );

  // Display result
  setResult(skillGapResult);

} catch (error) {
  console.error(
    "SKILL GAP ERROR:",
    error
  );

  alert(
    "Unable to connect to PrepMate backend. Make sure server.js is running on port 5001."
  );
} finally {
  setLoading(false);
}


}

// =========================================================
// COUNTS
// =========================================================

const strongCount =
result?.strongSkills?.length || 0;

const missingCount =
result?.missingSkills?.length || 0;

const totalSkills =
strongCount + missingCount;

const readiness =
totalSkills > 0
? Math.round(
(strongCount / totalSkills) * 100
)
: 0;

// =========================================================
// UI
// =========================================================

return ( <main className="min-h-screen bg-[#FCF9F4] text-[#393348] px-4 py-10">


  <div className="max-w-6xl mx-auto space-y-8">

    {/* ================= HEADER ================= */}

    <div className="text-center">

      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#EDE4FA] border border-[#D8C6F2] text-[#7652B8] text-sm font-semibold mb-5">
        <Target
          size={17}
          strokeWidth={2}
        />
        Skill Assessment
      </div>

      <h1 className="text-5xl md:text-6xl font-black text-[#393348]">
        Where You Stand
      </h1>

      <p className="text-[#777181] text-lg mt-4 max-w-2xl mx-auto">
        Understand the skills you already have,
        what you need to learn next, and how to
        move closer to your target role.
      </p>

    </div>

    {/* ================= PROFILE SUMMARY ================= */}

    <section className="bg-[#E9DFF8] border border-[#D8C6F2] rounded-[28px] p-8 shadow-sm">

      <div className="grid md:grid-cols-3 gap-6">

        {/* TARGET ROLE */}

        <div className="bg-white/70 rounded-2xl p-5">

          <p className="text-[#806F95] text-sm font-semibold uppercase tracking-wider">
            Target Role
          </p>

          <p className="text-2xl font-bold text-[#393348] mt-2">
            {targetRole || "Not selected"}
          </p>

        </div>

        {/* CURRENT LEVEL */}

        <div className="bg-white/70 rounded-2xl p-5">

          <p className="text-[#806F95] text-sm font-semibold uppercase tracking-wider">
            Current Level
          </p>

          <p className="text-2xl font-bold text-[#7652B8] mt-2">
            {result?.currentLevel ||
              "Ready to assess"}
          </p>

        </div>

        {/* READINESS */}

        <div className="bg-white/70 rounded-2xl p-5">

          <div className="flex items-center justify-between">

            <p className="text-[#806F95] text-sm font-semibold uppercase tracking-wider">
              Skill Readiness
            </p>

            {result && (
              <span className="text-[#4F8C5A] font-bold">
                {readiness}%
              </span>
            )}

          </div>

          <div className="mt-4 h-3 bg-[#E4DED5] rounded-full overflow-hidden">

            <div
              className="h-full bg-[#78B87E] rounded-full transition-all duration-700"
              style={{
                width: `${readiness}%`,
              }}
            />

          </div>

          <p className="text-sm text-[#777181] mt-2">
            Based on identified skills
          </p>

        </div>

      </div>

      {/* ANALYZE BUTTON */}

      {!result && (

        <div className="mt-7 flex justify-center md:justify-start">

          <button
            onClick={analyzeSkillGap}
            disabled={loading}
            className="bg-[#78B87E] hover:bg-[#68A970] text-white px-8 py-4 rounded-xl font-bold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
          >

            {loading ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
                Assessing your skills...
              </>
            ) : (
              <>
                <Target size={18} />
                Analyze My Skill Gap
              </>
            )}

          </button>

        </div>

      )}

    </section>

    {/* ================= RESULTS ================= */}

    {result && (

      <div className="space-y-8">

        {/* ================= STRONG SKILLS ================= */}

        {result.strongSkills &&
          result.strongSkills.length > 0 && (

            <section className="bg-[#E5F2E4] border border-[#C9E5C8] rounded-[28px] p-8 shadow-sm">

              <div className="flex items-start justify-between mb-7">

                <div>

                  <p className="text-[#4F8C5A] text-sm font-bold uppercase tracking-[0.2em]">
                    Already Have
                  </p>

                  <h2 className="text-3xl font-bold text-[#393348] mt-2">
                    Your Strong Skills
                  </h2>

                  <p className="text-[#68736A] mt-2">
                    These skills are already present
                    in your profile.
                  </p>

                </div>

                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-[#4F8C5A]">
                  <Check
                    size={22}
                    strokeWidth={2.5}
                  />
                </div>

              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {result.strongSkills.map(
                  (skill, index) => (

                    <div
                      key={index}
                      className="bg-white rounded-2xl p-5 border border-[#D1E8D0] hover:-translate-y-1 transition"
                    >

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-xl bg-[#E5F2E4] text-[#4F8C5A] flex items-center justify-center">
                          <Check
                            size={18}
                            strokeWidth={2.5}
                          />
                        </div>

                        <span className="font-semibold text-[#4B574D]">
                          {skill}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

          )}

        {/* ================= MISSING SKILLS ================= */}

        {result.missingSkills &&
          result.missingSkills.length > 0 && (

            <section className="bg-[#FFFDF8] border border-[#E8DCC8] rounded-[28px] p-8 shadow-sm">

              <div className="flex items-start justify-between mb-7">

                <div>

                  <p className="text-[#B8892D] text-sm font-semibold tracking-[0.2em] uppercase">
                    Skill Gap
                  </p>

                  <h2 className="text-3xl font-bold text-[#40382F] mt-2">
                    Skills to Build
                  </h2>

                  <p className="text-[#8A7F72] mt-2">
                    Focus on these skills to become
                    stronger for your target role.
                  </p>

                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#FFF3D6] text-[#B8892D] flex items-center justify-center">
                  <Target
                    size={24}
                    strokeWidth={2}
                  />
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                {result.missingSkills.map(
                  (item, index) => {

                    const priorityStyle =
                      item.priority === "High"
                        ? "bg-[#FDE8E5] text-[#C65A4A]"
                        : item.priority === "Medium"
                        ? "bg-[#FFF3D6] text-[#B8892D]"
                        : "bg-[#EAF4EC] text-[#4F8A5B]";

                    return (

                      <div
                        key={index}
                        className="bg-white border border-[#E8DCC8] rounded-2xl p-6 hover:shadow-md transition"
                      >

                        <div className="flex items-start gap-4">

                          <div className="w-10 h-10 rounded-xl bg-[#F5EFE5] flex items-center justify-center text-[#B8892D] font-bold shrink-0">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <div>

                            <h3 className="text-lg font-bold text-[#40382F]">
                              {item.skill}
                            </h3>

                            <span
                              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${priorityStyle}`}
                            >
                              {item.priority} Priority
                            </span>

                          </div>

                        </div>

                        <div className="mt-6">

                          <div className="flex justify-between text-sm mb-2">

                            <span className="text-[#8A7F72]">
                              Skill Gap
                            </span>

                            <span className="font-semibold text-[#40382F]">
                              {item.gap}%
                            </span>

                          </div>

                          <div className="h-2 bg-[#F1ECE4] rounded-full overflow-hidden">

                            <div
                              className="h-full bg-[#D4A72C] rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  item.gap,
                                  100
                                )}%`,
                              }}
                            />

                          </div>

                        </div>

                        <div className="mt-5 flex items-center justify-between">

                          <div>

                            <p className="text-xs text-[#9A9084] uppercase tracking-wide">
                              Estimated Learning
                            </p>

                            <p className="text-lg font-bold text-[#40382F] mt-1">
                              {item.hours} hours
                            </p>

                          </div>

                          <div className="w-10 h-10 rounded-xl bg-[#EAF4EC] text-[#4F8A5B] flex items-center justify-center">
                            <BookOpen
                              size={20}
                              strokeWidth={2}
                            />
                          </div>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

              <div className="mt-7 bg-[#FFF8E8] border border-[#EBD9A8] rounded-2xl p-5">

                <div className="flex gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#FFF3D6] text-[#B8892D] flex items-center justify-center shrink-0">
                    <Lightbulb
                      size={20}
                      strokeWidth={2}
                    />
                  </div>

                  <div>

                    <h3 className="font-bold text-[#554936]">
                      How to use this list
                    </h3>

                    <p className="text-sm text-[#8A7F72] mt-1 leading-6">
                      Start with High Priority skills,
                      then work through Medium and Low
                      Priority skills. Focus on building
                      projects that demonstrate the skills
                      instead of only completing courses.
                    </p>

                  </div>

                </div>

              </div>

            </section>

          )}

        {/* ================= PREPARATION ================= */}

        {result.estimatedTime && (

          <section className="bg-[#DDEBF8] border border-[#C5DDF0] rounded-[28px] p-8 shadow-sm">

            <div className="flex items-start gap-5">

              <div className="w-14 h-14 rounded-2xl bg-white text-[#4C82AD] flex items-center justify-center shrink-0">
                <CalendarDays
                  size={26}
                  strokeWidth={2}
                />
              </div>

              <div>

                <p className="text-[#4C82AD] text-sm font-bold uppercase tracking-[0.2em]">
                  Preparation Estimate
                </p>

                <h2 className="text-3xl font-bold text-[#393348] mt-2">
                  {result.estimatedTime}
                </h2>

                <p className="text-[#667486] mt-2 max-w-2xl">
                  A practical estimate for strengthening
                  the important skills required for your
                  target role.
                </p>

              </div>

            </div>

          </section>

        )}

        {/* ================= PROJECTS ================= */}

        {result.recommendedProjects &&
          result.recommendedProjects.length > 0 && (

            <section className="bg-[#FCE4D5] border border-[#F1CEBB] rounded-[28px] p-8 shadow-sm">

              <div className="flex items-start gap-5 mb-7">

                <div className="w-14 h-14 rounded-2xl bg-white text-[#C66C3B] flex items-center justify-center shrink-0">
                  <Wrench
                    size={26}
                    strokeWidth={2}
                  />
                </div>

                <div>

                  <p className="text-[#C66C3B] text-sm font-bold uppercase tracking-[0.2em]">
                    Practice Through Building
                  </p>

                  <h2 className="text-3xl font-bold text-[#393348] mt-2">
                    Projects Worth Building
                  </h2>

                  <p className="text-[#77675F] mt-2">
                    Turn your missing skills into
                    practical experience.
                  </p>

                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-4">

                {result.recommendedProjects.map(
                  (project, index) => (

                    <div
                      key={index}
                      className="bg-white rounded-2xl p-6 border border-[#F0D1C0] hover:-translate-y-1 hover:shadow-sm transition"
                    >

                      <div className="flex gap-4">

                        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#FCE4D5] text-[#C66C3B] flex items-center justify-center font-bold">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div className="flex-1 min-w-0">

                          <p className="font-bold text-[#51443D] text-lg">
                            {project.title ||
                              `Project ${index + 1}`}
                          </p>

                          {project.description && (
                            <p className="text-[#756B66] leading-7 mt-2">
                              {project.description}
                            </p>
                          )}

                          {project.difficulty && (
                            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-[#FCE4D5] text-[#C66C3B] text-xs font-semibold">
                              {project.difficulty}
                            </span>
                          )}

                          {project.skills &&
                            project.skills.length > 0 && (

                              <div className="flex flex-wrap gap-2 mt-4">

                                {project.skills.map(
                                  (
                                    skill,
                                    skillIndex
                                  ) => (

                                    <span
                                      key={skillIndex}
                                      className="px-3 py-1 rounded-full bg-[#F5EFE5] text-[#806F95] text-xs"
                                    >
                                      {skill}
                                    </span>

                                  )
                                )}

                              </div>

                            )}

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

          )}

        {/* ================= NEXT STEP ================= */}

        <section className="bg-white border border-[#E8E0D7] rounded-[28px] p-8 shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-[#806F95] text-sm font-bold uppercase tracking-[0.2em]">
                Your Next Move
              </p>

              <h2 className="text-2xl font-bold text-[#393348] mt-2">
                Build one skill at a time.
              </h2>

              <p className="text-[#777181] mt-2 max-w-2xl">
                Focus on the highest-value missing skill,
                practice it through a project, and then
                move to the next one.
              </p>

            </div>

            <div className="px-6 py-4 rounded-2xl bg-[#EDE4FA] text-[#7652B8] font-semibold whitespace-nowrap flex items-center gap-2">
              <Rocket
                size={18}
                strokeWidth={2}
              />
              Keep going
            </div>

          </div>

        </section>

      </div>

    )}

  </div>

</main>


);
}
