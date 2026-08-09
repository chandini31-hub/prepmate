"use client";

import Link from "next/link";

const actions = [
  {
    title: "Resume Analysis",
    desc: "ATS score, keyword optimization & AI suggestions",
    icon: "📄",
    link: "/upload",
  },
  {
    title: "Company Prep",
    desc: "Interview questions, company strategy & hiring focus",
    icon: "🏢",
    link: "/company-prep",
  },
  {
    title: "Interview AI",
    desc: "Practice HR & technical interviews",
    icon: "🎤",
    link: "/interview",
  },
  {
    title: "Skill Gap",
    desc: "Discover missing skills for your dream job",
    icon: "📊",
    link: "/skill-gap",
  },
  {
    title: "Roadmap",
    desc: "AI-generated learning roadmap",
    icon: "🛣️",
    link: "/roadmap",
  },
  {
    title: "Portfolio",
    desc: "Generate portfolio projects & GitHub ideas",
    icon: "💼",
    link: "/portfolio",
  },
];

export default function QuickActions() {
  return (
    <div className="mt-12">

      <h2 className="text-3xl font-bold text-blue-400 mb-8">
        🚀 Quick Actions
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {actions.map((item) => (

          <Link
            key={item.title}
            href={item.link}
            className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6 hover:border-yellow-400 hover:scale-105 transition-all duration-300"
          >

            <div className="text-5xl mb-5">
              {item.icon}
            </div>

            <h3 className="text-2xl font-bold text-yellow-400">
              {item.title}
            </h3>

            <p className="text-gray-400 mt-3">
              {item.desc}
            </p>

          </Link>

        ))}

      </div>

    </div>
  );
}