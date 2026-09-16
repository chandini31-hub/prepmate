"use client";

type Props = {
  suggestions: string[];
};

export default function SuggestionCard({ suggestions }: Props) {
  return (
    <section className="rounded-[28px] border border-blue-200 bg-[#eef5fb] p-7 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-sm font-semibold tracking-[0.25em] text-blue-700 uppercase">
            Resume Improvements
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#302d38]">
            Your Next Steps
          </h2>

          <p className="mt-2 max-w-2xl text-[15px] leading-6 text-[#6f6a70]">
            A few practical changes that can make your resume stronger for
            your target role.
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-white text-2xl shadow-sm">
          ✎
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {suggestions?.length > 0 ? (
          suggestions.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              {/* Number */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e4eff9] text-sm font-semibold text-blue-700">
                {index + 1}
              </div>

              {/* Suggestion */}
              <p className="flex-1 text-[15px] leading-6 text-[#514d52]">
                {item}
              </p>

              {/* Arrow */}
              <span className="pt-1 text-lg text-blue-500">
                →
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-blue-100 bg-white p-5 text-center text-[#777277]">
            No additional improvements suggested.
          </div>
        )}
      </div>
    </section>
  );
}