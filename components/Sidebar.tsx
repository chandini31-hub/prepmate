"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: "🏠" },
  { name: "Resume Analysis", path: "/upload", icon: "📄" },
  { name: "Skill Gap", path: "/skill-gap", icon: "📊" },
  { name: "Roadmap", path: "/roadmap", icon: "🛣️" },
  { name: "Company Prep", path: "/company-prep", icon: "🏢" },
  { name: "Interview", path: "/interview", icon: "🎤" },
  { name: "Portfolio", path: "/portfolio", icon: "💼" },
  { name: "Analytics", path: "/analytics", icon: "📈" },
  { name: "Settings", path: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-zinc-950 border-r border-yellow-500/20 p-8">

      <h1 className="text-5xl font-extrabold text-yellow-400 mb-12">
        PrepMate
      </h1>

      <nav className="space-y-3">

        {menu.map((item) => (

          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
            ${
              pathname === item.path
                ? "bg-yellow-500 text-black font-bold"
                : "text-gray-300 hover:bg-zinc-900 hover:text-yellow-300"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-lg">{item.name}</span>
          </Link>

        ))}

      </nav>

    </aside>
  );
}