type Props = {
  weaknesses: string[];
};

export default function WeaknessCard({ weaknesses }: Props) {
  return (
    <div className="bg-zinc-900 border border-red-500/20 rounded-3xl p-6">

      <h2 className="text-2xl font-bold text-red-400 mb-5">
        ❌ Weaknesses
      </h2>

      <div className="space-y-3">

        {weaknesses?.map((item, index) => (
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