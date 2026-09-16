"use client";

type Props = {
  weaknesses: string[];
};

export default function WeaknessCard({ weaknesses }: Props) {
  return (
    <section className="rounded-[28px] border border-orange-200 bg-[#fff1e9] p-7 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-sm font-semibold tracking-[0.25em] text-orange-600 uppercase">
            Improvement Areas
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#302d38]">
            What Needs Attention
          </h2>

          <p className="mt-2 max-w-md text-[15px] leading-6 text-[#6f6a70]">
            Areas that could make your resume stronger for your target role.
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-orange-200 bg-white text-2xl text-orange-600 shadow-sm">
          !
        </div>
      </div>

      {/* Weakness Items */}
      <div className="space-y-3">
        {weaknesses?.length > 0 ? (
          weaknesses.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl border border-orange-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              {/* Plus */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff5ef] text-lg font-medium text-orange-600">
                +
              </div>

              {/* Text */}
              <p className="flex-1 text-[15px] leading-6 text-[#574f4b]">
                {item}
              </p>

              {/* Arrow */}
              <div className="text-xl text-orange-500">
                →
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-orange-200 bg-white p-5 text-center text-[#777277]">
            No improvement areas detected.
          </div>
        )}
      </div>
    </section>
  );
}