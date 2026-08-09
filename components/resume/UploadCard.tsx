"use client";

import { ChangeEvent } from "react";

interface UploadCardProps {
  file: File | null;
  setFile: (file: File | null) => void;
  handleUpload: () => void;
  loading: boolean;
}

export default function UploadCard({
  file,
  setFile,
  handleUpload,
  loading,
}: UploadCardProps) {

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // Only PDF
    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);

    console.log(
      "SELECTED FILE:",
      selectedFile.name
    );
  }

  return (
    <section className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-8">

      {/* HEADER */}

      <div className="text-center">

        <div className="mx-auto w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6">

          <svg
            className="w-10 h-10 text-yellow-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0-4 4m4-4 4 4"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
            />
          </svg>

        </div>

        <h2 className="text-3xl font-bold text-yellow-400">
          Upload Resume
        </h2>

        <p className="text-gray-400 mt-2">
          Upload your resume in PDF format
        </p>

      </div>


      {/* FILE SELECTOR */}

      <div className="mt-8">

        <label
          htmlFor="resume-upload"
          className="block cursor-pointer"
        >

          <div className="border-2 border-dashed border-gray-700 hover:border-yellow-500 rounded-2xl p-8 text-center transition">

            {file ? (
              <div>

                <div className="text-4xl mb-3">
                  📄
                </div>

                <p className="text-yellow-400 font-semibold text-lg">
                  {file.name}
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  PDF selected successfully
                </p>

              </div>
            ) : (
              <div>

                <div className="text-4xl mb-3">
                  📁
                </div>

                <p className="text-white font-semibold">
                  Click to choose your resume
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  PDF files only
                </p>

              </div>
            )}

          </div>

        </label>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

      </div>


      {/* ANALYZE BUTTON */}

      <div className="flex justify-center mt-8">

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-black px-8 py-4 rounded-xl font-bold transition"
        >

          {loading
            ? "⏳ Analyzing Resume..."
            : "🚀 Analyze Resume"}

        </button>

      </div>

    </section>
  );
}