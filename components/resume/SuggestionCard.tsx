type Props = {
  suggestions: string[];
};

export default function SuggestionCard({ suggestions }: Props) {
  return (
    <div className="bg-zinc-900 border border-blue-500/20 rounded-3xl p-6">

      <h2 className="text-2xl font-bold text-blue-400 mb-5">
        💡 AI Suggestions
      </h2>

      <div className="space-y-3">

        {suggestions?.map((item, index) => (
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