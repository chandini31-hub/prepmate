"use client";

type Props = {
  keywords: string[];
};

export default function KeywordCard({ keywords }: Props) {
  return (
    <section className="rounded-[28px] border border-purple-200 bg-[#fbf8ef] p-7 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-sm font-semibold tracking-[0.25em] text-[#a87928] uppercase">
            ATS Optimization
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#302d38]">
            Missing Skills & Keywords
          </h2>

          <p className="mt-2 text-[15px] leading-6 text-[#80776b]">
            Important skills that could improve your resume's match with your
            target role.
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#eadfca] bg-white text-2xl shadow-sm">
          🔑
        </div>
      </div>

      {/* Keyword Pills */}
      <div className="flex flex-wrap gap-3">
        {keywords?.length > 0 ? (
          keywords.map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-3 rounded-full border border-[#ead9b4] bg-[#fff8df] px-4 py-2.5 text-[15px] text-[#66563c] transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#b17b22]">
                +
              </span>

              <span>{item}</span>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-[#eadfca] bg-white px-5 py-4 text-[#777277]">
            No missing skills detected.
          </div>
        )}
      </div>
    </section>
  );
}