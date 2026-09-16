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
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);

    console.log("SELECTED FILE:", selectedFile.name);
  }

  return (
    <section className="bg-white border border-[#d7e2ef] rounded-[28px] p-6 md:p-8 shadow-sm">

      {/* HEADER */}

      <div className="flex items-start gap-4 mb-7">

        <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#e5edf8] flex items-center justify-center text-2xl">
          📄
        </div>

        <div>
          <p className="uppercase tracking-[0.2em] text-xs font-bold text-[#6482a3]">
            Step 02
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-[#35495c] mt-1">
            Upload your resume
          </h2>

          <p className="text-[#7b8794] mt-1">
            Upload your latest resume and let PrepMate review it.
          </p>
        </div>

      </div>


      {/* UPLOAD AREA */}

      <label
        htmlFor="resume-upload"
        className="block cursor-pointer"
      >

        <div
          className={`
            rounded-3xl
            border-2
            border-dashed
            transition-all
            duration-200
            p-8 md:p-10
            text-center
            ${
              file
                ? "border-[#91bd9a] bg-[#f0f8f1]"
                : "border-[#cbd8e6] bg-[#f7faff] hover:border-[#91aeca] hover:bg-[#f2f7fc]"
            }
          `}
        >

          {file ? (
            <>
              {/* SELECTED FILE */}

              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#dcefe0] flex items-center justify-center text-3xl mb-4">
                📄
              </div>

              <p className="text-[#47734e] font-bold text-lg break-all">
                {file.name}
              </p>

              <p className="text-[#6d8671] text-sm mt-2">
                ✓ PDF selected successfully
              </p>

              <p className="text-[#91a092] text-xs mt-3">
                Click here to choose a different file
              </p>
            </>
          ) : (
            <>
              {/* EMPTY STATE */}

              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#e7eef8] flex items-center justify-center text-3xl mb-4">
                📁
              </div>

              <p className="text-[#435568] font-bold text-lg">
                Choose your resume
              </p>

              <p className="text-[#7d8997] mt-2">
                Click anywhere here to select your PDF
              </p>

              <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white border border-[#d8e1eb] text-sm text-[#718092]">
                📎 PDF files only
              </div>
            </>
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


      {/* ANALYZE BUTTON */}

      <div className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="text-sm text-[#8b929a]">
          {file ? (
            <span className="text-[#66816c]">
              ✓ Ready to analyze
            </span>
          ) : (
            "Your resume stays connected to your PrepMate profile."
          )}
        </div>


        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className={`
            w-full sm:w-auto
            px-7 py-3.5
            rounded-2xl
            font-bold
            transition-all
            ${
              !file || loading
                ? "bg-[#e5e1dc] text-[#aaa4a0] cursor-not-allowed"
                : "bg-[#7c63b8] hover:bg-[#7056aa] text-white shadow-sm hover:shadow-md"
            }
          `}
        >

          {loading
            ? "⏳ Analyzing resume..."
            : "✨ Analyze Resume"}

        </button>

      </div>

    </section>
  );
}