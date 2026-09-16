"use client";

import { useEffect, useState } from "react";

interface Project {
  title?: string;
  description?: string;
  tech?: string[];
}

interface Experience {
  role?: string;
  company?: string;
  duration?: string;
  description?: string;
}

interface Education {
  degree?: string;
  institute?: string;
  duration?: string;
  cgpa?: string;
}

interface Achievement {
  name?: string;
  issuer?: string;
  date?: string;
  description?: string;
}

interface PortfolioData {
  name?: string;
  title?: string;
  about?: string;
  github?: string;
  linkedin?: string;
  skills?: string[];
  projects?: Project[];
  experience?: Experience[];
  education?: Education[];
  achievements?: Achievement[];
  contact?: {
    email?: string;
    phone?: string;
  };
}

export default function PortfolioPage() {
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] =
    useState<PortfolioData | null>(null);

  const [resumeText, setResumeText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedResume =
      localStorage.getItem("resumeText") || "";

    setResumeText(savedResume);
  }, []);
  

  async function generatePortfolio() {
    setError("");

    if (!resumeText.trim()) {
      setError(
        "Resume not found. Please upload your resume in Resume Analysis first."
      );
      return;
      
    }

    setLoading(true);
    setPortfolio(null);

    try {
      const response = await fetch(
        "http://localhost:5001/portfolio",
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

      console.log(
        "PORTFOLIO RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Portfolio generation failed."
        );
      }

      setPortfolio(data.result);
    } catch (err) {
      console.error(
        "PORTFOLIO ERROR:",
        err
      );

      setError(
        "Unable to generate portfolio. Make sure the PrepMate backend is running on port 5001."
      );
    } finally {
      setLoading(false);
    }
  }

  function openLink(url?: string) {
    if (!url) return;

    const finalUrl =
      url.startsWith("http")
        ? url
        : `https://${url}`;

    window.open(
      finalUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-8 py-10">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="text-center mb-12">

          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 mb-6">
            ✨ AI Career Intelligence
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400">
            Portfolio Generator
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mt-4 max-w-3xl mx-auto">
            Transform your resume into a professional,
            recruiter-ready portfolio with AI.
          </p>

        </div>

        {/* ================= GENERATOR CARD ================= */}

        {!portfolio && (
          <section className="bg-zinc-900/80 border border-yellow-500/20 rounded-3xl p-8 md:p-10 shadow-2xl">

            <div className="text-center">

              <div className="w-20 h-20 mx-auto rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-4xl mb-6">
                🚀
              </div>

              <h2 className="text-3xl font-bold text-white">
                Build Your Developer Portfolio
              </h2>

              <p className="text-gray-400 mt-3 max-w-2xl mx-auto leading-7">
                PrepMate will analyze your uploaded resume
                and automatically create a structured
                professional portfolio containing your
                skills, projects, experience, education
                and achievements.
              </p>

              {/* Resume status */}

              <div className="mt-8">

                {resumeText ? (
                  <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-green-500/10 border border-green-500/30">

                    <span className="text-green-400 text-xl">
                      ✓
                    </span>

                    <div className="text-left">

                      <p className="text-green-400 font-semibold">
                        Resume Ready
                      </p>

                      <p className="text-gray-500 text-sm">
                        Your uploaded resume is ready
                        for portfolio generation.
                      </p>

                    </div>

                  </div>
                ) : (
                  <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/30">

                    <span className="text-red-400 text-xl">
                      ⚠
                    </span>

                    <div className="text-left">

                      <p className="text-red-400 font-semibold">
                        Resume Not Found
                      </p>

                      <p className="text-gray-500 text-sm">
                        Upload your resume in Resume
                        Analysis first.
                      </p>

                    </div>

                  </div>
                )}

              </div>

              {/* Error */}

              {error && (
                <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-400">
                  {error}
                </div>
              )}

              {/* Generate button */}

              <button
                onClick={generatePortfolio}
                disabled={
                  loading || !resumeText
                }
                className="mt-8 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-yellow-500/10"
              >

                {loading
                  ? "Generating Portfolio..."
                  : "✨ Generate My Portfolio"}

              </button>

            </div>

          </section>
        )}

        {/* ================= PORTFOLIO ================= */}

        {portfolio && (
          <div className="space-y-8">

            {/* ================= HERO ================= */}

            <section className="relative overflow-hidden bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8 md:p-12">

              <div className="absolute -top-32 -right-32 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />

              <div className="relative">

                <p className="text-yellow-400 font-semibold tracking-widest uppercase text-sm">
                  Professional Portfolio
                </p>

                <h2 className="text-5xl md:text-6xl font-extrabold mt-3 text-white">
                  {portfolio.name ||
                    "Your Name"}
                </h2>

                <p className="text-2xl text-yellow-400 font-semibold mt-3">
                  {portfolio.title ||
                    "Software Developer"}
                </p>

                {portfolio.about && (
                  <p className="text-gray-400 max-w-4xl mt-6 leading-8 text-lg">
                    {portfolio.about}
                  </p>
                )}

                {/* Links */}

                <div className="flex flex-wrap gap-4 mt-8">

                  {portfolio.github && (
                    <button
                      onClick={() =>
                        openLink(
                          portfolio.github
                        )
                      }
                      className="px-5 py-3 rounded-xl bg-black border border-gray-700 hover:border-yellow-400 transition"
                    >
                      💻 GitHub
                    </button>
                  )}

                  {portfolio.linkedin && (
                    <button
                      onClick={() =>
                        openLink(
                          portfolio.linkedin
                        )
                      }
                      className="px-5 py-3 rounded-xl bg-black border border-gray-700 hover:border-yellow-400 transition"
                    >
                      💼 LinkedIn
                    </button>
                  )}

                </div>

              </div>

            </section>

            {/* ================= SKILLS ================= */}

            {portfolio.skills &&
              portfolio.skills.length > 0 && (
                <section className="bg-zinc-900 border border-blue-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-blue-400 mb-6">
                    🧠 Technical Skills
                  </h2>

                  <div className="flex flex-wrap gap-3">

                    {portfolio.skills.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* ================= PROJECTS ================= */}

            {portfolio.projects &&
              portfolio.projects.length > 0 && (
                <section className="bg-zinc-900 border border-purple-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-purple-400 mb-6">
                    🚀 Projects
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">

                    {portfolio.projects.map(
                      (project, index) => (
                        <div
                          key={index}
                          className="bg-black/40 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition"
                        >

                          <h3 className="text-xl font-bold text-white">
                            {project.title ||
                              "Project"}
                          </h3>

                          {project.description && (
                            <p className="text-gray-400 mt-3 leading-7">
                              {
                                project.description
                              }
                            </p>
                          )}

                          {project.tech &&
                            project.tech.length >
                              0 && (
                              <div className="flex flex-wrap gap-2 mt-5">

                                {project.tech.map(
                                  (
                                    tech,
                                    techIndex
                                  ) => (
                                    <span
                                      key={
                                        techIndex
                                      }
                                      className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm"
                                    >
                                      {tech}
                                    </span>
                                  )
                                )}

                              </div>
                            )}

                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* ================= EXPERIENCE ================= */}

            {portfolio.experience &&
              portfolio.experience.length >
                0 && (
                <section className="bg-zinc-900 border border-green-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-green-400 mb-8">
                    💼 Experience
                  </h2>

                  <div className="space-y-6">

                    {portfolio.experience.map(
                      (experience, index) => (
                        <div
                          key={index}
                          className="relative pl-8 border-l-2 border-green-500/30"
                        >

                          <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-green-400" />

                          <h3 className="text-xl font-bold text-white">
                            {experience.role ||
                              "Role"}
                          </h3>

                          <p className="text-green-400 mt-1 font-semibold">
                            {experience.company ||
                              "Company"}
                          </p>

                          {experience.duration && (
                            <p className="text-gray-500 text-sm mt-1">
                              {
                                experience.duration
                              }
                            </p>
                          )}

                          {experience.description && (
                            <p className="text-gray-400 mt-3 leading-7">
                              {
                                experience.description
                              }
                            </p>
                          )}

                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* ================= EDUCATION ================= */}

            {portfolio.education &&
              portfolio.education.length >
                0 && (
                <section className="bg-zinc-900 border border-cyan-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-cyan-400 mb-6">
                    🎓 Education
                  </h2>

                  <div className="grid md:grid-cols-2 gap-5">

                    {portfolio.education.map(
                      (education, index) => (
                        <div
                          key={index}
                          className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6"
                        >

                          <h3 className="text-xl font-bold text-white">
                            {education.degree ||
                              "Degree"}
                          </h3>

                          <p className="text-cyan-400 mt-2">
                            {education.institute ||
                              "Institution"}
                          </p>

                          {education.duration && (
                            <p className="text-gray-500 mt-2">
                              {
                                education.duration
                              }
                            </p>
                          )}

                          {education.cgpa && (
                            <p className="text-gray-300 mt-3">
                              CGPA:{" "}
                              <span className="text-cyan-400 font-semibold">
                                {
                                  education.cgpa
                                }
                              </span>
                            </p>
                          )}

                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* ================= ACHIEVEMENTS ================= */}

            {portfolio.achievements &&
              portfolio.achievements.length >
                0 && (
                <section className="bg-zinc-900 border border-orange-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-orange-400 mb-6">
                    🏆 Achievements
                  </h2>

                  <div className="grid md:grid-cols-2 gap-5">

                    {portfolio.achievements.map(
                      (
                        achievement,
                        index
                      ) => (
                        <div
                          key={index}
                          className="bg-black/40 border border-orange-500/20 rounded-2xl p-6"
                        >

                          <h3 className="text-lg font-bold text-white">
                            {achievement.name ||
                              "Achievement"}
                          </h3>

                          {achievement.issuer && (
                            <p className="text-orange-400 mt-2">
                              {
                                achievement.issuer
                              }
                            </p>
                          )}

                          {achievement.date && (
                            <p className="text-gray-500 text-sm mt-1">
                              {achievement.date}
                            </p>
                          )}

                          {achievement.description && (
                            <p className="text-gray-400 mt-3 leading-7">
                              {
                                achievement.description
                              }
                            </p>
                          )}

                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

            {/* ================= CONTACT ================= */}

            {portfolio.contact &&
              (portfolio.contact.email ||
                portfolio.contact.phone) && (
                <section className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8">

                  <h2 className="text-2xl font-bold text-yellow-400 mb-6">
                    📬 Contact
                  </h2>

                  <div className="grid md:grid-cols-2 gap-5">

                    {portfolio.contact.email && (
                      <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                        <p className="text-gray-500 text-sm">
                          Email
                        </p>

                        <p className="text-white mt-2 break-all">
                          {
                            portfolio.contact
                              .email
                          }
                        </p>
                      </div>
                    )}

                    {portfolio.contact.phone && (
                      <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                        <p className="text-gray-500 text-sm">
                          Phone
                        </p>

                        <p className="text-white mt-2">
                          {
                            portfolio.contact
                              .phone
                          }
                        </p>
                      </div>
                    )}

                  </div>

                </section>
              )}

            {/* ================= REGENERATE ================= */}

            <div className="text-center pt-4">

              <button
                onClick={generatePortfolio}
                disabled={loading}
                className="px-8 py-4 rounded-xl border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 transition disabled:opacity-50"
              >
                {loading
                  ? "Generating..."
                  : "🔄 Regenerate Portfolio"}
              </button>

            </div>

          </div>
        )}

      </div>

    </main>
  );
}