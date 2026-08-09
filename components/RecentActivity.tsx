export default function RecentActivity() {
  const activities = [
    "✅ Resume Uploaded Successfully",
    "📈 ATS Score Improved to 82",
    "🏢 Company Prep Completed",
    "🎤 Interview Practice Finished",
  ];

  return (
    <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8">
      <h2 className="text-4xl font-bold text-blue-400 mb-6">
        📌 Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((item, index) => (
          <div
            key={index}
            className="bg-black rounded-xl p-5 text-xl text-gray-200"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}