"use client";

import { useState } from "react";

export default function CompanyPrepPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
const [companyData, setCompanyData] = useState<any>(null);

const handleCompanyPrep = async () => {

  console.log("Step 1");

  if (!company || !role) {
    alert("Please enter company and role.");
    return;
  }

  console.log("Step 2");

  try {
  console.log("Before Fetch");

  const response = await fetch("http://localhost:5001/company-prep", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      company,
      role,
    }),
  });

  console.log("Fetch Finished");

  const text = await response.text();

  console.log("Response Text:", text);

} catch (err) {
  console.error("FETCH ERROR:", err);
}
};
  return (
    <div className="min-h-screen bg-black text-white px-10 py-12">

      {/* Heading */}

      <div className="text-center">

        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 mb-6">

          ✨ AI Career Intelligence

        </div>

        <h1 className="text-6xl font-extrabold text-yellow-400">
          Company Prep Pro
        </h1>

        <p className="text-gray-400 text-xl mt-4">
          Prepare for your dream company with AI-powered guidance.
        </p>

      </div>
      {/* Search Panel */}

<div className="mt-16 max-w-6xl mx-auto">

  <div className="bg-zinc-900/80 border border-yellow-500/20 rounded-3xl p-8">

    <h2 className="text-3xl font-bold text-blue-400 mb-6">
      Target Enterprise Strategy
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      {/* Company */}

      <input
  type="text"
  placeholder="Company Name (Google, Amazon...)"
  value={company}
  onChange={(e) => setCompany(e.target.value)}
  className="w-full bg-black border border-gray-700 rounded-xl px-5 py-4 text-white focus:border-yellow-400 outline-none"
/>

      {/* Role */}

      <input
  type="text"
  placeholder="Target Role (SDE, Frontend...)"
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className="w-full bg-black border border-gray-700 rounded-xl px-5 py-4 text-white focus:border-yellow-400 outline-none"
/>

    </div>

    <button
  onClick={handleCompanyPrep}
  className="mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition"
>
  {loading ? "Generating..." : "🚀 Extract Company Intel"}
</button>

  </div>

</div>

    </div>
  );
}