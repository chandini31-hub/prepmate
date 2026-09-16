"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Sprout,
  Target,
  RotateCcw,
  BookOpen,
  Code2,
  Hammer,
  Brain,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Week = {
  week: string;
  topics: string[];
};

type RoadmapData = {
  targetRole?: string;
  duration?: string;
  roadmap?: Week[];
};

type Task = {
  id: string;
  title: string;
  description: string;
  type: "Learn" | "Practice" | "Build" | "Review";
  time: string;
  icon: "learn" | "practice" | "build" | "review";
};

export default function DailyPlanPage() {
  const router = useRouter();

  const [roadmap, setRoadmap] =
    useState<RoadmapData | null>(null);

  const [day, setDay] = useState(1);

  const [completedTasks, setCompletedTasks] =
    useState<string[]>([]);

  // =========================================================
  // LOAD ROADMAP
  // =========================================================

  useEffect(() => {
    try {
      const savedRoadmap =
        localStorage.getItem("prepmateRoadmap");

      if (!savedRoadmap) {
        console.log("No roadmap found.");
        return;
      }

      const data: RoadmapData =
        JSON.parse(savedRoadmap);

      setRoadmap(data);

      console.log(
        "Daily Plan loaded for:",
        data.targetRole
      );
    } catch (error) {
      console.error(
        "Could not load roadmap:",
        error
      );
    }
  }, []);

  // =========================================================
  // LOAD CURRENT DAY
  // =========================================================

  useEffect(() => {
    const savedDay =
      localStorage.getItem(
        "prepmateCurrentDay"
      );

    if (savedDay) {
      const parsedDay =
        Number(savedDay);

      if (
        !Number.isNaN(parsedDay) &&
        parsedDay > 0
      ) {
        setDay(parsedDay);
      }
    }
  }, []);

  // =========================================================
  // SAVE CURRENT DAY
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "prepmateCurrentDay",
      String(day)
    );
  }, [day]);

  // =========================================================
  // LOAD COMPLETED TASKS
  // =========================================================

  useEffect(() => {
    const savedProgress =
      localStorage.getItem(
        `prepmateDailyPlanDay${day}`
      );

    if (!savedProgress) {
      setCompletedTasks([]);
      return;
    }

    try {
      const parsed =
        JSON.parse(savedProgress);

      if (Array.isArray(parsed)) {
        setCompletedTasks(parsed);
      } else {
        setCompletedTasks([]);
      }
    } catch {
      setCompletedTasks([]);
    }
  }, [day]);

  // =========================================================
  // GET CURRENT WEEK
  // =========================================================

  const currentWeekIndex =
    Math.floor((day - 1) / 7);

  const currentWeek =
    roadmap?.roadmap?.[
      currentWeekIndex
    ];

  // =========================================================
  // GET TOPICS FOR CURRENT WEEK
  //
  // IMPORTANT:
  // We DO NOT assume that every week has 7 topics.
  //
  // Instead, roadmap topics are distributed across
  // the 7 days of that week.
  // =========================================================

  const weekTopics =
    currentWeek?.topics || [];

  const dayInWeek =
    (day - 1) % 7;

  const todayTopics = useMemo(() => {
  if (!currentWeek?.topics?.length) {
    return [];
  }

  const topics = currentWeek.topics;

  // Spread available topics across the 7 days.
  const dayInWeek = (day - 1) % 7;

  // If there are 7+ topics, one topic per day.
  if (topics.length >= 7) {
    return topics[dayInWeek] ? [topics[dayInWeek]] : [];
  }

  // If there are fewer than 7 topics,
  // keep cycling through the week's topics.
  const topicIndex = dayInWeek % topics.length;

  return topics[topicIndex]
    ? [topics[topicIndex]]
    : [];
}, [currentWeek, day]);
  // =========================================================
  // ROLE-SPECIFIC DAILY TASKS
  // =========================================================

  const tasks: Task[] = useMemo(() => {
    if (!todayTopics.length) {
      return [];
    }

    const topic =
      todayTopics[0];

    return [
      {
        id: `${day}-learn`,
        title: `Learn ${topic}`,
        description:
          `Study the core concepts of ${topic} and understand how it is used in real-world ${roadmap?.targetRole || "technology"} roles.`,
        type: "Learn",
        time: "30 min",
        icon: "learn",
      },

      {
        id: `${day}-practice`,
        title: `Practice ${topic}`,
        description:
          `Solve practical exercises related to ${topic}. Focus on understanding the approach instead of memorizing solutions.`,
        type: "Practice",
        time: "45 min",
        icon: "practice",
      },

      {
        id: `${day}-build`,
        title: `Build with ${topic}`,
        description:
          `Create a small hands-on implementation using ${topic}. Try to connect it with a realistic project related to your target role.`,
        type: "Build",
        time: "60 min",
        icon: "build",
      },

      {
        id: `${day}-review`,
        title: `Review ${topic}`,
        description:
          `Review today's concepts, write down important points, and identify anything that you still need to practice.`,
        type: "Review",
        time: "20 min",
        icon: "review",
      },
    ];
  }, [
    todayTopics,
    day,
    roadmap?.targetRole,
  ]);

  // =========================================================
  // TASK ICON
  // =========================================================

  const getTaskIcon = (
    type: Task["icon"]
  ) => {
    switch (type) {
      case "learn":
        return (
          <BookOpen
            size={19}
            strokeWidth={2}
          />
        );

      case "practice":
        return (
          <Code2
            size={19}
            strokeWidth={2}
          />
        );

      case "build":
        return (
          <Hammer
            size={19}
            strokeWidth={2}
          />
        );

      case "review":
        return (
          <Brain
            size={19}
            strokeWidth={2}
          />
        );

      default:
        return (
          <BookOpen
            size={19}
          />
        );
    }
  };

  // =========================================================
  // TOGGLE TASK
  // =========================================================

  const toggleTask = (
    taskId: string
  ) => {
    const updatedTasks =
      completedTasks.includes(taskId)
        ? completedTasks.filter(
            (id) => id !== taskId
          )
        : [
            ...completedTasks,
            taskId,
          ];

    setCompletedTasks(
      updatedTasks
    );

    localStorage.setItem(
      `prepmateDailyPlanDay${day}`,
      JSON.stringify(updatedTasks)
    );
  };

  // =========================================================
  // PROGRESS
  // =========================================================

  const completedToday =
    tasks.filter((task) =>
      completedTasks.includes(
        task.id
      )
    ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedToday /
            tasks.length) *
            100
        );

  // =========================================================
  // TOTAL DAYS
  // =========================================================

  const totalDays =
    roadmap?.roadmap?.length
      ? roadmap.roadmap.length * 7
      : 0;

  // =========================================================
  // RESET TODAY
  // =========================================================

  const resetToday = () => {
    setCompletedTasks([]);

    localStorage.removeItem(
      `prepmateDailyPlanDay${day}`
    );
  };

  // =========================================================
  // GO PREVIOUS DAY
  // =========================================================

  const previousDay = () => {
    setDay((current) =>
      Math.max(1, current - 1)
    );
  };

  // =========================================================
  // GO NEXT DAY
  // =========================================================

  const nextDay = () => {
    if (
      totalDays > 0 &&
      day >= totalDays
    ) {
      return;
    }

    setDay(
      (current) => current + 1
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-[#FBF7F1] text-[#342D3D] px-5 py-8 md:px-10 lg:px-16">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-[#E9DDF8] opacity-40 blur-3xl" />

        <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-[#DCEEDB] opacity-40 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#F9DFC9] opacity-30 blur-3xl" />

      </div>

      <div className="relative z-10 mx-auto max-w-5xl">

        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <nav className="mb-10 flex items-center justify-between">

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DDF8]">

              <Target
                size={21}
                strokeWidth={1.8}
                className="text-[#7651B5]"
              />

            </div>

            <div className="text-left">

              <div className="text-lg font-bold">
                PrepMate
              </div>

              <div className="text-xs text-[#817887]">
                Career companion
              </div>

            </div>

          </button>

          <button
            onClick={() =>
              router.push("/roadmap")
            }
            className="rounded-full border border-[#E4DCD3] bg-white px-4 py-2 text-sm text-[#655C69] hover:bg-[#F5EFE8]"
          >
            ← Career Roadmap
          </button>

        </nav>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="rounded-4xl border border-[#D8C7ED] bg-[#E9DFF7] px-7 py-9 shadow-[0_12px_35px_rgba(80,60,100,0.08)] md:px-10">

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7951B6]">
            Daily Learning Plan
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Day {day}
              </h1>

              <p className="mt-3 text-[#665C6F]">
                Focused learning tasks based on your
                personal career roadmap.
              </p>

            </div>

            {/* TARGET ROLE */}

            <div className="rounded-2xl bg-white/75 px-5 py-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-[#938894]">
                Target role
              </p>

              <p className="mt-1 text-lg font-bold text-[#65479A]">
                {roadmap?.targetRole ||
                  "Not selected"}
              </p>

            </div>

          </div>

          {/* DURATION */}

          {roadmap?.duration && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm text-[#665C6F]">

              <Clock3 size={16} />

              {roadmap.duration} roadmap

            </div>
          )}

        </section>

        {/* =====================================================
            NO ROADMAP
        ===================================================== */}

        {!roadmap && (

          <section className="mt-8 rounded-[28px] border border-[#F0D4C2] bg-[#FBE5D6] p-8">

            <h2 className="text-2xl font-bold text-[#794D36]">
              No roadmap found
            </h2>

            <p className="mt-2 text-[#8A6652]">
              Create your personalized Career Roadmap
              before opening your Daily Plan.
            </p>

            <button
              onClick={() =>
                router.push("/roadmap")
              }
              className="mt-5 rounded-full bg-white px-5 py-3 font-semibold text-[#794D36] shadow-sm"
            >
              Go to Career Roadmap →
            </button>

          </section>

        )}

        {/* =====================================================
            ROADMAP EXISTS
        ===================================================== */}

        {roadmap && (

          <>

            {/* =================================================
                CURRENT WEEK
            ================================================= */}

            <section className="mt-8 rounded-[28px] border border-[#D7E5D5] bg-[#E2F1E0] p-7">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#5C9B66]">

                  <Target
                    size={22}
                  />

                </div>

                <div>

                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5C7560]">
                    Current focus
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[#3F6947]">
                    {currentWeek?.week ||
                      `Week ${currentWeekIndex + 1}`}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#5C7560]">
                    Day {dayInWeek + 1} of this
                    week's learning plan.
                  </p>

                  {todayTopics.length > 0 && (

                    <div className="mt-4 inline-flex items-center rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[#4F7554]">

                      Today's topic:
                      <span className="ml-1">
                        {todayTopics[0]}
                      </span>

                    </div>

                  )}

                </div>

              </div>

            </section>

            {/* =================================================
                PROGRESS
            ================================================= */}

            <section className="mt-6 rounded-[28px] border border-[#E8D9B4] bg-[#F8EDCB] p-7">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-sm text-[#806D3C]">
                    Today's progress
                  </p>

                  <h2 className="mt-1 text-3xl font-bold text-[#876B20]">
                    {progress}%
                  </h2>

                </div>

                <div className="text-right">

                  <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#806D3C]">
                    {completedToday} /{" "}
                    {tasks.length} completed
                  </span>

                </div>

              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/80">

                <div
                  className="h-3 rounded-full bg-[#C49A32] transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </section>

            {/* =================================================
                TASKS
            ================================================= */}

            <section className="mt-8">

              <div className="mb-5 flex items-end justify-between gap-4">

                <div>

                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#938894]">
                    Today's tasks
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Learn. Practice. Build. Review.
                  </h2>

                </div>

                {tasks.length > 0 && (

                  <button
                    onClick={resetToday}
                    className="hidden items-center gap-2 rounded-full border border-[#E4DCD3] bg-white px-4 py-2 text-sm font-semibold text-[#756A79] hover:bg-[#F5EFE8] sm:flex"
                  >

                    <RotateCcw
                      size={15}
                    />

                    Reset

                  </button>

                )}

              </div>

              <div className="space-y-4">

                {tasks.length > 0 ? (

                  tasks.map((task) => {

                    const completed =
                      completedTasks.includes(
                        task.id
                      );

                    return (

                      <button
                        key={task.id}
                        onClick={() =>
                          toggleTask(
                            task.id
                          )
                        }
                        className={`w-full rounded-[26px] border p-6 text-left transition-all ${
                          completed
                            ? "border-[#C7E3C4] bg-[#E2F1E0]"
                            : "border-[#E5DDD5] bg-white hover:-translate-y-0.5 hover:shadow-md"
                        }`}
                      >

                        <div className="flex items-start gap-4">

                          {/* TASK ICON */}

                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                              completed
                                ? "bg-[#DCEFD9] text-[#5C9B66]"
                                : "bg-[#E8DDF8] text-[#7651B5]"
                            }`}
                          >

                            {completed ? (
                              <CheckCircle2
                                size={21}
                                strokeWidth={2.2}
                              />
                            ) : (
                              getTaskIcon(
                                task.icon
                              )
                            )}

                          </div>

                          <div className="flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3
                                className={`text-lg font-bold ${
                                  completed
                                    ? "text-[#3F6947] line-through"
                                    : "text-[#342D3D]"
                                }`}
                              >
                                {task.title}
                              </h3>

                              <span className="rounded-full bg-[#E8DDF8] px-3 py-1 text-xs font-semibold text-[#7651B5]">
                                {task.type}
                              </span>

                              <span className="inline-flex items-center gap-1 rounded-full bg-[#F8EDCB] px-3 py-1 text-xs font-semibold text-[#806D3C]">

                                <Clock3
                                  size={12}
                                />

                                {task.time}

                              </span>

                            </div>

                            <p className="mt-2 text-sm leading-6 text-[#756A79]">
                              {task.description}
                            </p>

                          </div>

                        </div>

                      </button>

                    );
                  })

                ) : (

                  <div className="rounded-[26px] border border-[#E5DDD5] bg-white p-8">

                    <div className="flex items-start gap-4">

                      <BookOpen
                        size={23}
                        className="mt-1 text-[#7651B5]"
                      />

                      <div>

                        <h3 className="text-lg font-bold">
                          No topic available
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#756A79]">
                          Your current roadmap week does
                          not contain any topics. Generate
                          the roadmap again from the
                          Career Roadmap page.
                        </p>

                        <button
                          onClick={() =>
                            router.push(
                              "/roadmap"
                            )
                          }
                          className="mt-4 rounded-full bg-[#E8DDF8] px-5 py-2.5 text-sm font-semibold text-[#65479A]"
                        >
                          Open Career Roadmap →
                        </button>

                      </div>

                    </div>

                  </div>

                )}

              </div>

            </section>

            {/* =================================================
                DAY NAVIGATION
            ================================================= */}

            <section className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <button
                disabled={day <= 1}
                onClick={previousDay}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E4DCD3] bg-white px-6 py-3 font-semibold text-[#655C69] transition hover:bg-[#F5EFE8] disabled:cursor-not-allowed disabled:opacity-40"
              >

                <ChevronLeft
                  size={17}
                />

                Previous day

              </button>

              <div className="text-center">

                <p className="text-sm font-semibold text-[#655C69]">
                  Day {day}
                  {totalDays
                    ? ` of ${totalDays}`
                    : ""}
                </p>

                <p className="mt-1 text-xs text-[#9A919B]">
                  Week {currentWeekIndex + 1}
                </p>

              </div>

              <button
                disabled={
                  totalDays > 0 &&
                  day >= totalDays
                }
                onClick={nextDay}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8DDF8] px-6 py-3 font-semibold text-[#65479A] transition hover:bg-[#DCCCF0] disabled:cursor-not-allowed disabled:opacity-40"
              >

                Next day

                <ChevronRight
                  size={17}
                />

              </button>

            </section>

            {/* =================================================
                COMPLETED DAY
            ================================================= */}

            {progress === 100 &&
              tasks.length > 0 && (

                <section className="mt-8 rounded-[28px] border border-[#C7E3C4] bg-[#E2F1E0] p-7 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#5C9B66]">

                    <CheckCircle2
                      size={28}
                    />

                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-[#3F6947]">
                    Day {day} completed 🎉
                  </h2>

                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#5C7560]">
                    Great work. You've completed today's
                    learning, practice, building, and review
                    tasks for your{" "}
                    <span className="font-bold">
                      {roadmap.targetRole}
                    </span>{" "}
                    roadmap.
                  </p>

                </section>

              )}

            {/* =================================================
                MOTIVATION
            ================================================= */}

            <section className="mt-8 rounded-[28px] border border-[#D7E4EF] bg-[#E3EFF7] p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70">

                <Sprout
                  size={28}
                  strokeWidth={1.7}
                  className="text-[#5C9B66]"
                />

              </div>

              <h2 className="mt-4 text-xl font-bold text-[#41677F]">
                Small progress counts.
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#617989]">
                You don't need to master everything in one
                day. Complete today's tasks, build consistently,
                and keep moving toward your{" "}
                <span className="font-semibold">
                  {roadmap.targetRole}
                </span>{" "}
                goal.
              </p>

            </section>

          </>
        )}

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="py-10 text-center">

          <p className="text-sm text-[#9A919B]">
            PrepMate · Your personal career companion
          </p>

        </footer>

      </div>

    </main>
  );
}