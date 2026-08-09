type Props = {
  keywords: string[];
};

export default function KeywordCard({ keywords }: Props) {
  return (
    <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6">

      <h2 className="text-2xl font-bold text-yellow-400 mb-5">
        🔑 Missing Keywords
      </h2>

      <div className="flex flex-wrap gap-3">

        {keywords?.map((item, index) => (
          <span
            key={index}
            className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-300"
          >
            {item}
          </span>
        ))}

      </div>

    </div>
  );
}