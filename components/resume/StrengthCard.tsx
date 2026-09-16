"use client";

type Props = {
  strengths: string[];
};

export default function StrengthCard({ strengths }: Props) {
  return (
    <section className="rounded-[28px] border border-green-200 bg-[#eef8ee] p-7 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-sm font-semibold tracking-[0.25em] text-green-700 uppercase">
            Resume Highlights
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#302d38]">
            Your Strengths
          </h2>

          <p className="mt-2 max-w-md text-[15px] leading-6 text-[#6f6a70]">
            Skills and qualities that already make your resume stand out.
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-green-200 bg-white text-2xl shadow-sm">
          ✦
        </div>
      </div>

      {/* Strength Items */}
      <div className="space-y-3">
        {strengths?.length > 0 ? (
          strengths.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl border border-green-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              {/* Number */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e1f2e3] text-sm font-semibold text-green-700">
                {index + 1}
              </div>

              {/* Text */}
              <p className="flex-1 text-[15px] leading-6 text-[#4f4a4f]">
                {item}
              </p>

              {/* Check */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dff2e2] text-green-700">
                ✓
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-green-200 bg-white p-5 text-center text-[#777277]">
            No strengths detected yet.
          </div>
        )}
      </div>
    </section>
  );
}