"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-2 rounded-full">
          ✨ AI Career Intelligence
        </div>

        <h1 className="text-6xl font-black mt-4 bg-linear-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          PrepMate
        </h1>

        <p className="text-gray-400 mt-2 text-lg">
          Land Your Dream Job With AI
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

        {/* ATS */}
        <div
          onClick={() => router.push("/resume-analysis")}
          className="cursor-pointer rounded-3xl p-6 bg-yellow-500/10 border border-yellow-500/20 hover:scale-105 transition"
        >
          <div className="text-4xl mb-3">📄</div>

          <h3 className="text-xl font-bold text-yellow-400">
            Resume Analysis
          </h3>

          <p className="text-gray-400 mt-2">
            Analyze your resume and get an ATS score.
          </p>
        </div>

        {/* Skill Gap */}
        <div
          onClick={() => router.push("/skill-gap")}
          className="cursor-pointer rounded-3xl p-6 bg-red-500/10 border border-red-500/20 hover:scale-105 transition"
        >
          <div className="text-4xl mb-3">🎯</div>

          <h3 className="text-xl font-bold text-red-400">
            Skill Gap Analyzer
          </h3>

          <p className="text-gray-400 mt-2">
            Find missing skills and improve your profile.
          </p>
        </div>

        {/* Roadmap */}
        <div
          onClick={() => router.push("/roadmap")}
          className="cursor-pointer rounded-3xl p-6 bg-purple-500/10 border border-purple-500/20 hover:scale-105 transition"
        >
          <div className="text-4xl mb-3">🗺️</div>

          <h3 className="text-xl font-bold text-purple-400">
            Career Roadmap
          </h3>

          <p className="text-gray-400 mt-2">
            Generate a personalized learning roadmap.
          </p>
        </div>

        {/* Company Prep */}
        <div
          onClick={() => router.push("/company-prep")}
          className="cursor-pointer rounded-3xl p-6 bg-blue-500/10 border border-blue-500/20 hover:scale-105 transition"
        >
          <div className="text-4xl mb-3">🏢</div>

          <h3 className="text-xl font-bold text-blue-400">
            Company Prep Pro
          </h3>

          <p className="text-gray-400 mt-2">
            Prepare for your target company and role.
          </p>
        </div>

        {/* Portfolio */}
        <div
          onClick={() => router.push("/portfolio")}
          className="cursor-pointer rounded-3xl p-6 bg-green-500/10 border border-green-500/20 hover:scale-105 transition"
        >
          <div className="text-4xl mb-3">💼</div>

          <h3 className="text-xl font-bold text-green-400">
            Portfolio Generator
          </h3>

          <p className="text-gray-400 mt-2">
            Generate a professional portfolio from your resume.
          </p>
        </div>

      </div>

    </div>
  );
}