"use client";

type ATSCardProps = {
  score: number;
  roleReadiness: string;
};

export default function ATSCard({
  score,
  roleReadiness,
}: ATSCardProps) {
  const safeScore = Math.min(100, Math.max(0, score));

  let status = "Needs Improvement";
  let statusText = "A few improvements can make your resume stronger.";
  let statusStyle =
    "bg-[#FCE8E3] text-[#A65D4E] border-[#F3C7BD]";

  if (safeScore >= 85) {
    status = "Excellent Match";
    statusText =
      "Your resume is strongly aligned with your target role.";
    statusStyle =
      "bg-[#DFF2E3] text-[#4D8A5A] border-[#C2E4C9]";
  } else if (safeScore >= 70) {
    status = "Good Match";
    statusText =
      "Your resume has a solid foundation for your target role.";
    statusStyle =
      "bg-[#FFF1C9] text-[#98751F] border-[#F1D98B]";
  }

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (safeScore / 100) * circumference;

  return (
    <section className="rounded-[28px] border border-[#E8DDF2] bg-[#F8F2FF] p-7 md:p-9 shadow-[0_8px_30px_rgba(80,60,100,0.06)]">

      {/* Header */}

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8666B8]">
            Resume Health
          </p>

          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-[#302A3D]">
            ATS Score
          </h2>

          <p className="mt-2 text-sm md:text-base text-[#71697D]">
            How well your resume matches recruiter screening systems.
          </p>
        </div>

        <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-[#E7DDF0] text-lg">
          📄
        </div>

      </div>


      {/* Score Area */}

      <div className="mt-8 flex flex-col md:flex-row items-center gap-8">

        {/* Circular Score */}

        <div className="relative h-48 w-48 shrink-0">

          <svg
            width="192"
            height="192"
            viewBox="0 0 192 192"
            className="-rotate-90"
          >

            {/* Background */}

            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              stroke="#E8DDF0"
              strokeWidth="12"
            />

            {/* Progress */}

            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              stroke="#8B65C2"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />

          </svg>

          {/* Center */}

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-5xl font-bold tracking-tight text-[#302A3D]">
              {safeScore}
            </span>

            <span className="text-sm font-medium text-[#81788D]">
              out of 100
            </span>

          </div>

        </div>


        {/* Information */}

        <div className="flex-1 w-full">

          <div
            className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold ${statusStyle}`}
          >
            {safeScore >= 85
              ? "✓"
              : safeScore >= 70
              ? "●"
              : "!"}{" "}
            <span className="ml-2">
              {status}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-bold text-[#40374C]">
            {roleReadiness}
          </h3>

          <p className="mt-2 max-w-xl text-[#71697D] leading-relaxed">
            {statusText}
          </p>


          {/* Progress Bar */}

          <div className="mt-6">

            <div className="flex justify-between text-xs font-medium text-[#81788D] mb-2">
              <span>ATS compatibility</span>
              <span>{safeScore}%</span>
            </div>

            <div className="h-3 w-full rounded-full bg-white border border-[#E8DDF0] overflow-hidden">

              <div
                className="h-full rounded-full bg-[#8B65C2] transition-all duration-700"
                style={{
                  width: `${safeScore}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>


      {/* Bottom Insight */}

      <div className="mt-8 rounded-2xl bg-white/70 border border-[#E8DDF0] px-5 py-4">

        <div className="flex gap-3">

          <div className="mt-0.5 h-8 w-8 shrink-0 rounded-xl bg-[#EDE3FA] flex items-center justify-center">
            ✨
          </div>

          <div>

            <p className="font-semibold text-[#40374C]">
              PrepMate insight
            </p>

            <p className="mt-1 text-sm text-[#7A7185] leading-relaxed">
              {safeScore >= 85
                ? "Your resume is already in a strong position. Focus on keeping your experience and projects measurable."
                : safeScore >= 70
                ? "You have a good base. Strengthening keywords, achievements and role-specific experience can improve your score."
                : "Focus on adding relevant skills, measurable achievements and keywords from your target role."}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}