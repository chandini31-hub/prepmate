"use client";

import { useRouter } from "next/navigation";


const features = [
  {
    title: "Resume Analysis",
    description: "Understand your resume strength, ATS score and areas to improve.",
    icon: "📄",
    path: "/resume-analysis",
    bg: "bg-[#E8DDF8]",
    border: "border-[#D8C6F2]",
    iconBg: "bg-[#F7F2FD]",
    accent: "text-[#7651B5]",
  },
  {
    title: "Skill Gap Analyzer",
    description: "See which skills you already have and what you need to learn next.",
    icon: "🎯",
    path: "/skill-gap",
    bg: "bg-[#DDEEDB]",
    border: "border-[#C7E3C4]",
    iconBg: "bg-[#F3FAF1]",
    accent: "text-[#4D8A55]",
  },
  {
    title: "Career Roadmap",
    description: "Follow a practical step-by-step roadmap toward your target role.",
    icon: "🗺️",
    path: "/roadmap",
    bg: "bg-[#DDEAF7]",
    border: "border-[#C5DDED]",
    iconBg: "bg-[#F3F8FC]",
    accent: "text-[#477BA7]",
  },
  {
  title: "Daily Learning Plan",
  description:
    "Turn your career roadmap into simple daily tasks and build consistent learning habits.",
  icon: "01",
  path: "/daily-plan",
  bg: "bg-[#FBE3D2]",
  border: "border-[#F2CEB6]",
  iconBg: "bg-[#FFF5ED]",
  accent: "text-[#C96D42]",
},
  {
    title: "Portfolio Generator",
    description: "Turn your resume into a clean, professional personal portfolio.",
    icon: "💼",
    path: "/portfolio",
    bg: "bg-[#F4E4B8]",
    border: "border-[#E9D59A]",
    iconBg: "bg-[#FFF9E8]",
    accent: "text-[#A47B21]",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FBF7F1] text-[#342D3D] px-5 py-8 md:px-10 lg:px-16">

      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-[#E9DDF8] opacity-40 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-[#DCEEDB] opacity-40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#F9DFC9] opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* NAVBAR */}
        <nav className="mb-10 flex items-center justify-between">

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DDF8] text-sm font-black text-[#7651B5]">
  P
</div>

            <div className="text-left">
              <div className="text-lg font-bold tracking-tight">
                PrepMate
              </div>

              <div className="text-xs text-[#817887]">
                Career companion
              </div>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/settings")}
              className="rounded-full border border-[#E4DCD3] bg-white px-4 py-2 text-sm text-[#655C69] transition hover:bg-[#F5EFE8]"
            >
               Settings
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCCCF0] font-semibold text-[#604393]">
              C
            </div>
          </div>

        </nav>


        {/* HERO */}
        <section className="mb-8 rounded-3xl border border-[#D8C7ED] bg-[#E9DFF7] px-7 py-10 shadow-[0_12px_35px_rgba(80,60,100,0.08)] md:px-12">

          <div className="max-w-3xl">

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#7951B6]">
              Welcome back
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-[#342D3D] md:text-5xl">
              Hey, Chandini 
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#665C6F] md:text-lg">
              Build your skills, strengthen your resume and prepare
              confidently for the career you want.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <span className="rounded-full border border-[#D4C1EE] bg-white/70 px-4 py-2 text-sm text-[#65479A]">
               BTech Student
              </span>

              <span className="rounded-full border border-[#D4C1EE] bg-white/70 px-4 py-2 text-sm text-[#65479A]">
               Software Engineering
              </span>

              <span className="rounded-full border border-[#D4C1EE] bg-white/70 px-4 py-2 text-sm text-[#65479A]">
               Career Growth
              </span>

            </div>

          </div>

        </section>


        {/* QUICK PROGRESS */}
        <section className="mb-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl border border-[#D7E5D5] bg-[#E2F1E0] p-6">
            <p className="text-sm font-medium text-[#5C7560]">
              Career Readiness
            </p>

            <div className="mt-2 flex items-end justify-between">
              <h2 className="text-3xl font-bold text-[#3F6947]">
                78%
              </h2>

              <span className="text-sm text-[#5C7560]">
                On track
              </span>
            </div>

            <div className="mt-4 h-2 rounded-full bg-white/70">
              <div className="h-2 w-[78%] rounded-full bg-[#6EAA76]" />
            </div>
          </div>


          <div className="rounded-3xl border border-[#E8D9B4] bg-[#F8EDCB] p-6">
            <p className="text-sm font-medium text-[#806D3C]">
              Resume Score
            </p>

            <div className="mt-2 flex items-end justify-between">
              <h2 className="text-3xl font-bold text-[#876B20]">
                82/100
              </h2>

              <span className="text-sm text-[#806D3C]">
                Good
              </span>
            </div>

            <div className="mt-4 h-2 rounded-full bg-white/70">
              <div className="h-2 w-[82%] rounded-full bg-[#C49A32]" />
            </div>
          </div>


          <div className="rounded-3xl border border-[#F0D4C2] bg-[#FBE5D6] p-6">
            <p className="text-sm font-medium text-[#8A6652]">
              Current Goal
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#794D36]">
              Become a Software Engineer
            </h2>

            <p className="mt-2 text-sm text-[#8A6652]">
              Keep building consistently.
            </p>
          </div>

        </section>


        {/* SECTION TITLE */}
        <div className="mb-5 flex items-end justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#887D8C]">
              Your workspace
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Everything you need
            </h2>
          </div>

          <span className="hidden text-sm text-[#8B818E] md:block">
            5 tools available
          </span>

        </div>


        {/* FEATURE CARDS */}
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => (

            <button
              key={feature.title}
              onClick={() => router.push(feature.path)}
              className={`group rounded-[28px] border ${feature.border} ${feature.bg} p-7 text-left shadow-[0_8px_25px_rgba(70,55,70,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(70,55,70,0.10)]`}
            >

              <div className="flex items-start justify-between">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconBg} text-2xl shadow-sm`}
                >
                  {feature.icon}
                </div>

                <span
                  className={`text-lg ${feature.accent} transition-transform duration-300 group-hover:translate-x-1`}
                >
                  ↗
                </span>

              </div>

              <h3 className={`mt-6 text-xl font-bold ${feature.accent}`}>
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#6D6472]">
                {feature.description}
              </p>

              <div className="mt-6 text-sm font-semibold text-[#756A79]">
                Open tool →
              </div>

            </button>

          ))}

        </section>


        {/* TODAY'S PLAN */}
        <section className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">

          <div className="rounded-[28px] border border-[#E5DDD5] bg-white p-7 shadow-[0_8px_25px_rgba(70,55,70,0.04)]">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#938894]">
                  Today
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Your preparation plan
                </h2>
              </div>

              <span className="rounded-full bg-[#F1E9F8] px-3 py-1 text-xs font-semibold text-[#7451A1]">
                2 / 4 completed
              </span>

            </div>


            <div className="mt-6 space-y-4">

              <div className="flex items-center gap-4 rounded-2xl bg-[#F7F3F9] p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DCEFD9] text-sm">
                  ✓
                </div>

                <div>
                  <p className="font-semibold">
                    Review resume improvements
                  </p>

                  <p className="text-sm text-[#8A808D]">
                    Resume Analysis
                  </p>
                </div>
              </div>


              <div className="flex items-center gap-4 rounded-2xl bg-[#F7F3F9] p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8DDF8] text-sm">
                  2
                </div>

                <div>
                  <p className="font-semibold">
                    Work on your missing skills
                  </p>

                  <p className="text-sm text-[#8A808D]">
                    Skill Gap Analyzer
                  </p>
                </div>
              </div>


              <div className="flex items-center gap-4 rounded-2xl bg-[#F7F3F9] p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8E5D5] text-sm">
                  3
                </div>

                <div>
                  <p className="font-semibold">
                    Continue your career roadmap
                  </p>

                  <p className="text-sm text-[#8A808D]">
                    Career Roadmap
                  </p>
                </div>
              </div>

            </div>

          </div>


          {/* MOTIVATION CARD */}
          <div className="rounded-[28px] border border-[#D7E4EF] bg-[#E3EFF7] p-7">

            <h2 className="text-xl font-bold text-[#41677F]">
  Small progress counts.
</h2>

            <h2 className="mt-5 text-xl font-bold text-[#41677F]">
              Small progress counts.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#617989]">
              You don't need to become job-ready overnight.
              Keep improving one skill, one project and one
              application at a time.
            </p>

            <button
              onClick={() => router.push("/roadmap")}
              className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#41677F] shadow-sm transition hover:-translate-y-0.5"
            >
              Continue roadmap →
            </button>

          </div>

        </section>


        {/* FOOTER */}
        <footer className="py-10 text-center">

          <p className="text-sm text-[#9A919B]">
            PrepMate · Your personal career companion
          </p>

        </footer>

      </div>
    </main>
  );
}