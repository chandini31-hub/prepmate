export default function Features() {
  const features = [
    {
      title: "ATS Analysis",
      description: "Get an ATS score and improve your resume.",
    },
    {
      title: "Skill Gap Detection",
      description: "Find missing skills for your target role.",
    },
    {
      title: "Mock Interviews",
      description: "Practice AI-generated interview questions.",
    },
  ];

  return (
    <section className="py-20 px-6">
      <h2 className="text-4xl font-bold text-center mb-12">
        Why Choose PrepMate?
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="border rounded-xl p-6 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-semibold mb-4">
              {feature.title}
            </h3>

            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}