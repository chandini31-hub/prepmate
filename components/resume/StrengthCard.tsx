type Props = {
  strengths: string[];
};

export default function StrengthCard({ strengths }: Props) {
  return (
    <div className="bg-zinc-900 border border-green-500/20 rounded-3xl p-6">

      <h2 className="text-2xl font-bold text-green-400 mb-5">
        ✅ Strengths
      </h2>

      <div className="space-y-3">

        {strengths?.map((item, index) => (
          <div
            key={index}
            className="bg-black rounded-xl p-3"
          >
            {item}
          </div>
        ))}

      </div>

    </div>
  );
}