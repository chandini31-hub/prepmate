"use client";

import { useState } from "react";

export default function UploadPage() {

  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold mb-8">
        Upload Resume
      </h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      {file && (
        <p className="mt-4">
          Selected: {file.name}
        </p>
      )}

      <button className="bg-indigo-600 text-white px-6 py-3 rounded mt-6">
        Analyze Resume
      </button>

    </div>
  );
}