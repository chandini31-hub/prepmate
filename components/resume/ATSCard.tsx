"use client";

type ATSCardProps = {
  score: number;
  roleReadiness: string;
};

export default function ATSCard({
  score,
  roleReadiness,
}: ATSCardProps) {
  return (
    <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8">

      <h2 className="text-3xl font-bold text-yellow-400 mb-8">
        ATS Score
      </h2>

      <div className="flex justify-center">

        <div className="relative w-48 h-48">

          {/* Outer Circle */}

          <div className="absolute inset-0 rounded-full border-12 border-zinc-700"></div>

          {/* Progress Circle */}

          <svg
            className="absolute inset-0 -rotate-90"
            width="192"
            height="192"
          >
            <circle
              cx="96"
              cy="96"
              r="82"
              stroke="#EAB308"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={515}
              strokeDashoffset={515 - (score / 100) * 515}
              strokeLinecap="round"
            />
          </svg>

          {/* Score */}

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <h1 className="text-6xl font-black text-yellow-400">
              {score}
            </h1>

            <p className="text-gray-400">
              /100
            </p>

          </div>

        </div>

      </div>

      <div className="mt-8 text-center">

        <h3 className="text-2xl text-blue-400 font-bold">
          {roleReadiness}
        </h3>

      </div>

      <div className="mt-6">

        {score >= 85 && (
          <div className="bg-green-500/20 text-green-400 p-4 rounded-xl text-center">
            Excellent Resume 🚀
          </div>
        )}

        {score >= 70 && score < 85 && (
          <div className="bg-yellow-500/20 text-yellow-300 p-4 rounded-xl text-center">
            Good Resume 👍
          </div>
        )}

        {score < 70 && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-xl text-center">
            Needs Improvement ⚠️
          </div>
        )}

      </div>

    </div>
  );
}