"use client";

export default function PerformanceChart() {
  return (
    <div className="bg-zinc-900 rounded-3xl border border-yellow-500/20 p-8">

      <h2 className="text-3xl font-bold text-blue-400 mb-6">
        📈 Progress Overview
      </h2>

      <div className="space-y-6">

        <div>
          <div className="flex justify-between mb-2">
            <span>Resume Score</span>
            <span>82%</span>
          </div>

          <div className="w-full bg-zinc-700 h-3 rounded-full">
            <div className="bg-yellow-400 h-3 rounded-full w-[82%]"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span>Interview Prep</span>
            <span>68%</span>
          </div>

          <div className="w-full bg-zinc-700 h-3 rounded-full">
            <div className="bg-blue-400 h-3 rounded-full w-[68%]"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span>DSA Progress</span>
            <span>45%</span>
          </div>

          <div className="w-full bg-zinc-700 h-3 rounded-full">
            <div className="bg-green-400 h-3 rounded-full w-[45%]"></div>
          </div>
        </div>

      </div>

    </div>
  );
}