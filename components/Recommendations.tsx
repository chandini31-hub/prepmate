export default function Recommendations() {
  const tips = [
    "Learn Docker & Kubernetes",
    "Practice Dynamic Programming",
    "Improve React Projects",
    "Solve 15 DSA Problems Today",
  ];

  return (
    <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8">
      <h2 className="text-4xl font-bold text-yellow-400 mb-6">
        🤖 AI Recommendations
      </h2>

      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-black rounded-xl p-5 text-xl text-gray-200"
          >
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}