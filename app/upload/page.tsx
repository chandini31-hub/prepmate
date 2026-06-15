"use client";
import {
  useState,
  useEffect
} from "react";


import {
  Upload,
  Sparkles,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Brain,
  Lightbulb,
} from "lucide-react";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [rewrittenResume, setRewrittenResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] =
  useState("");

const [jobMatchResult, setJobMatchResult] =
  useState<any>(null);

  const [roadmapResult, setRoadmapResult] =
  useState<any>(null);
  const [selectedQuestion,
  setSelectedQuestion] =
  useState("");

const [answer,
  setAnswer] =
  useState("");
  const [interviewResult, setInterviewResult] =
  useState<any>(null);
  const [
  mockInterviewResult,
  setMockInterviewResult
] = useState<any>(null);
const [
  interviewHistory,
  setInterviewHistory
] = useState<any[]>([]);
  useEffect(() => {

    const history =
      JSON.parse(
        localStorage.getItem(
          "interviewHistory"
        ) || "[]"
      );

    setInterviewHistory(
      history
    );

  }, []);
  const [mentorQuestion,
  setMentorQuestion] =
  useState("");

const [mentorResponse,
  setMentorResponse] =
  useState("");
 const [
  resumeText,
  setResumeText
] = useState("");


    

  async function handleUpload() {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log(
  "UPLOAD DATA:",
  data
);

      console.log("Backend Response:", data);
if (data.success) {

  setResult(data.result);

  console.log(
    "UPLOAD DATA:",
    data
  );

  setResumeText(
    data.resumeText || ""
  );

}
      else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }

    setLoading(false);
  };
  const handleRewrite = async () => {
  if (!file) {
    alert("Upload a resume first");
    return;
  }

  const formData = new FormData();
  formData.append("resume", file);

  try {
    const response = await fetch(
      "http://localhost:5001/rewrite",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      setRewrittenResume(data.resume);
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Resume rewrite failed");
  }
};
const handleJobMatch = async () => {
  console.log("JOB MATCH CLICKED");
  if (!file) {
    alert("Upload resume first");
    return;
  }

  if (!jobDescription.trim()) {
    alert("Enter job description");
    return;
  }
  console.log("VALIDATION PASSED");

  const formData = new FormData();

  formData.append("resume", file);
  formData.append(
    "jobDescription",
    jobDescription
  );

  try {
    console.log("SENDING REQUEST");
    const response = await fetch(
      "http://localhost:5001/job-match",
      {
        method: "POST",
        body: formData,
      }
    );
    console.log("RESPONSE RECEIVED");

    const data = await response.json();
    console.log("DATA:",JSON.stringify(data,null,2));

    if (data.success) {
  setJobMatchResult(data.result);
  alert(
    "Match Score: " +
      Math.round(data.result.matchScore * 100) +
      "%"
  );
}
    else {
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
    alert("Job Match Failed");
  }
};

const handleInterviewEvaluation =
  async () => {
    console.log("SUBMIT CLICKED");

    if (!selectedQuestion) {
      alert("Select a question");
      return;
    }

    if (!answer.trim()) {
      alert("Enter your answer");
      return;
    }

    try {

      const response =
        await fetch(
          "http://localhost:5001/mock-interview",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              question:
                selectedQuestion,
              answer,
            }),
          }
        );

      const data =
        await response.json();

      console.log(data);

      if (data.success) {

  setMockInterviewResult(
    data.result
  );

  const history =
    JSON.parse(
      localStorage.getItem(
        "interviewHistory"
      ) || "[]"
    );

  history.push({
    question:
      selectedQuestion,
    score:
      data.result.score,
    timestamp:
      new Date().toISOString(),
  });

  localStorage.setItem(
    "interviewHistory",
    JSON.stringify(history)
  );
}
      else {
        alert(data.error);
      }

    } catch (error) {
      console.error(error);
      alert(
        "Interview Evaluation Failed"
      );
    }

  };


const handleRoadmap = async () => {
  if (!file) {
    alert("Upload resume first");
    return;
  }

  if (!jobDescription.trim()) {
    alert("Enter job description");
    return;
  }

  const formData = new FormData();

  formData.append("resume", file);
  formData.append(
    "jobDescription",
    jobDescription
  );

  try {
    const response = await fetch(
      "http://localhost:5001/roadmap",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      setRoadmapResult(data.result);
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
    alert("Roadmap generation failed");
  }
};

        
const handleInterviewQuestions =
  async () => {
    if (!file) {
      alert("Upload resume first");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Enter job description");
      return;
    }

    const formData =
      new FormData();

    formData.append(
      "resume",
      file
    );

    formData.append(
      "jobDescription",
      jobDescription
    );

    try {
      const response =
        await fetch(
          "http://localhost:5001/interview-questions",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (data.success) {
        console.log(
  "INTERVIEW DATA:"
);

console.log(
  JSON.stringify(
    data.result,
    null,
    2
  )
);
        setInterviewResult(
          data.result
        );
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Interview Generation Failed"
      );
    }
  };
  const handleCareerMentor =
  async () => {
    console.log("QUESTION:", mentorQuestion);
console.log("RESUME:", resumeText);
console.log("JD:", jobDescription);

    try {

      const response =
        await fetch(
          "http://localhost:5001/career-mentor",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              question:
                mentorQuestion,
            }),
          }
        );

      const data =
        await response.json();

      if (data.success) {

        setMentorResponse(
          data.result
        );

      }

    } catch (error) {

      console.error(error);

    }

  };



    
return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Gold Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#D4AF3720,transparent_45%)]"></div>

      {/* Floating Blur */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-yellow-500/10 blur-[140px] rounded-full"></div>

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        {interviewHistory.length > 0 && (
  <div className="
    mt-6
    bg-white/5
    backdrop-blur-xl
    border
    border-yellow-500/20
    rounded-3xl
    p-8
  ">

    <h2 className="
      text-3xl
      font-bold
      text-yellow-400
      mb-6
    ">
      Interview Dashboard
    </h2>

    <h3 className="
      text-2xl
      font-bold
      text-green-400
    ">
      Average Score: {
        (
          interviewHistory.reduce(
            (sum, item) =>
              sum + item.score,
            0
          ) /
          interviewHistory.length
        ).toFixed(1)
      } /10
    </h3>

    <p className="mt-3 text-gray-300">
      Questions Attempted:
      {" "}
      {interviewHistory.length}
    </p>

  </div>
)}

        {/* Header */}
        <div className="text-center">

          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-2 rounded-full">
            <Sparkles size={18} />
            AI Career Intelligence
          </div>

          <h1 className="text-7xl font-black mt-6 bg-linear-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            PrepMate
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            AI-Powered Career Intelligence Platform
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">

            <span className="px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-sm">
              ATS Optimization
            </span>

            <span className="px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-sm">
              Skill Gap Analysis
            </span>

            <span className="px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-sm">
              AI Career Insights
            </span>

          </div>

        </div>
        {/* AI Career Mentor */}

<div className="
  mt-12
  bg-white/5
  backdrop-blur-xl
  border
  border-yellow-500/20
  rounded-3xl
  p-8
">

  <h2 className="
    text-3xl
    font-bold
    text-yellow-400
    mb-6
  ">
    AI Career Mentor
  </h2>

  <textarea
    value={mentorQuestion}
    onChange={(e) =>
      setMentorQuestion(
        e.target.value
      )
    }
    placeholder="Ask your career question..."
    className="
      w-full
      h-40
      bg-black/40
      border
      border-yellow-500/20
      rounded-xl
      p-4
      text-white
    "
  />

  <button
    onClick={handleCareerMentor}
    className="
      mt-4
      px-8
      py-3
      rounded-xl
      font-semibold
      bg-gradient-to-r
      from-yellow-500
      to-amber-600
      text-black
    "
  >
    Ask AI Mentor
  </button>

</div>

{mentorResponse && (
  <div className="
    mt-6
    bg-white/5
    backdrop-blur-xl
    border
    border-yellow-500/20
    rounded-3xl
    p-8
  ">
    <h2 className="
      text-2xl
      font-bold
      text-yellow-400
      mb-4
    ">
      Mentor Advice
    </h2>

    <div className="
      whitespace-pre-wrap
      text-gray-300
      leading-8
    ">
      {mentorResponse}
    </div>

  </div>
)}
{mentorResponse && (

  <div className="
    mt-8
    bg-white/5
    backdrop-blur-xl
    border
    border-yellow-500/20
    rounded-3xl
    p-8
  ">

    <h2 className="
      text-3xl
      font-bold
      text-yellow-400
      mb-6
    ">
      Mentor Advice
    </h2>

    <div className="
      whitespace-pre-wrap
      leading-8
      text-gray-300
    ">
      {mentorResponse}
    </div>

  </div>

)}

{/* Upload Card */}
<div className="mt-14 bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-10">
</div>

        {/* Upload Card */}
        <div className="mt-14 bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-10">

          <div className="flex flex-col items-center">
       <Upload
              size={65}
              className="text-yellow-400"
            />

            <h2 className="text-3xl font-bold mt-5">
              Upload Resume
            </h2>

            <p className="text-gray-400 mt-2">
              Upload your PDF and get instant ATS insights
            </p>

            <input
              type="file"
              accept=".pdf"
              className="mt-6"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] || null
                )
              }
            />

            {file && (
  <div className="flex items-center gap-2 text-green-400 mt-5">
    <FileText size={18} />
    {file.name}
  </div>
)}
<textarea
  value={jobDescription}
  onChange={(e) =>
    setJobDescription(
      e.target.value
    )
  }
  placeholder="Paste job description"


  className="
    mt-6
    w-full
    h-40
    bg-black/40
    border
    border-yellow-500/20
    rounded-xl
    p-4
    text-white
  "
/>

<button
  onClick={handleJobMatch}
  className="
    mt-4
    px-10
    py-4
    rounded-xl
    font-semibold
    bg-linear-to-r
    from-yellow-500
    to-amber-600
    hover:scale-105
    hover:bg-yellow-700
    transition
  "
>
  Analyze Job Match
</button>
<button
  onClick={handleRoadmap}
  className="
    mt-4
    px-10
    py-4
    rounded-xl
    font-semibold
    bg-linear-to-r
  from-yellow-500
  to-amber-600
  hover:scale-105
  transition
  shadow-lg
  shadow-yellow-500/20
  "
>
  Generate Skill Roadmap
</button>
<button
  onClick={handleInterviewQuestions}
  className="
    mt-4
    px-10
    py-4
    rounded-xl
    font-semibold
    bg-linear-to-r
    from-yellow-500
    to-amber-600
    hover:scale-105
    transition
    shadow-lg
    shadow-yellow-500/20
  "
>
  Generate Interview Questions
</button>
<button
  onClick={handleUpload}
  className="
    mt-8
    px-10
    py-4
    rounded-xl
    font-semibold
    bg-linear-to-r
    from-yellow-500
    to-amber-600
    hover:scale-105
    transition
    shadow-lg
    shadow-yellow-500/20
  "
>
  {loading ? "Analyzing..." : "Analyze Resume"}
</button>

<button
  onClick={handleRewrite}
  className="
    mt-4
    px-10
    py-4
    rounded-xl
    font-semibold
    bg-linear-to-r
    from-yellow-500
    to-amber-600
    hover:scale-105
    transition
    shadow-lg
    shadow-yellow-500/20
  "
>
  ✨ Generate Improved Resume
</button>


          </div>

        </div>

        {/* Results */}
        {result && (
          <div className="mt-12 space-y-8">
            {rewrittenResume && (
  <div className="
    mt-10
    bg-white/5
    backdrop-blur-xl
    border
    border-yellow-500/20
    rounded-3xl
    p-8
  ">
    <h2 className="text-2xl font-bold text-yellow-400 mb-4">
      Improved Resume
    </h2>

    <pre className="whitespace-pre-wrap text-gray-300">
  {rewrittenResume}
</pre>

<button
  onClick={async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/download-pdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume: rewrittenResume,
          }),
        }
      );

      const blob = await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;
      a.download =
        "Improved_Resume.pdf";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("PDF Download Failed");
    }
  }}
  className="
    mt-6
    px-6
    py-3
    rounded-xl
    font-semibold
bg-linear-to-r
from-yellow-500
to-amber-600
hover:scale-105
shadow-lg
shadow-yellow-500/20
    transition
  "
>
  Download Improved Resume PDF
</button>
</div>
            )}
{jobMatchResult && (
  <div className="mt-12 bg-white/5 border border-blue-500/20 rounded-3xl p-8">

    <h2 className="text-3xl font-bold text-blue-400 mb-6">
      Job Match Analysis
    </h2>

    <p className="text-4xl font-bold text-green-400 mb-6">
      {jobMatchResult.matchScore}%
    </p>

    <h3 className="text-xl font-semibold mb-3">
      Matching Skills
    </h3>

    <div className="flex flex-wrap gap-2 mb-6">
      {jobMatchResult.matchingSkills?.map(
        (skill: string, index: number) => (
          <span
            key={index}
            className="px-3 py-2 rounded-full bg-green-500/20 text-green-300"
          >
            {skill}
          </span>
        )
      )}
    </div>

    <h3 className="text-xl font-semibold mb-3">
      Missing Skills
    </h3>

    <div className="flex flex-wrap gap-2 mb-6">
      {jobMatchResult.missingSkills?.map(
        (skill: string, index: number) => (
          <span
            key={index}
            className="px-3 py-2 rounded-full bg-red-500/20 text-red-300"
          >
            {skill}
          </span>
        )
      )}
    </div>

    <h3 className="text-xl font-semibold mb-3">
      Suggestions
    </h3>

    <ul className="space-y-2">
      {jobMatchResult.suggestions?.map(
        (item: string, index: number) => (
          <li key={index}>
            💡 {item}
          </li>
        )
      )}
    </ul>

  </div>
    )}
    {roadmapResult && (
  <div className="mt-12 bg-white/5 border border-purple-500/20 rounded-3xl p-8">

    <h2 className="text-3xl font-bold text-purple-400 mb-6">
      Skill Gap Roadmap
    </h2>

    <h3 className="text-xl font-semibold mb-4">
      Missing Skills
    </h3>

    <div className="flex flex-wrap gap-3 mb-8">
      {roadmapResult.missingSkills?.map(
        (skill: string, index: number) => (
          <span
            key={index}
            className="px-4 py-2 rounded-full bg-red-500/20 text-red-300"
          >
            {skill}
          </span>
        )
      )}
    </div>

    {roadmapResult.roadmap?.map(
      (week: any, index: number) => (
        <div
          key={index}
          className="mb-6 p-4 rounded-xl bg-black/30"
        >
          <h4 className="text-lg font-bold text-purple-300 mb-3">
            {week.week}
          </h4>

          <ul className="space-y-2">
            {week.topics?.map(
              (topic: string, i: number) => (
                <li key={i}>
                  📚 {topic}
                </li>
              )
            )}
          </ul>
        </div>
      )
    )}
  </div>
)}
{interviewResult && (
  <div className="
    mt-12
    bg-white/5
    backdrop-blur-xl
    border
    border-yellow-500/20
    rounded-3xl
    p-8
  ">

    <h2 className="
      text-3xl
      font-bold
      text-yellow-400
      mb-8
    ">
      AI Interview Questions
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      <div>
        <h3 className="text-xl font-bold text-yellow-400 mb-4">
          Technical
        </h3>

        <ul className="space-y-2">
          {interviewResult.technical?.map(
  (q: any, i: number) => (
    <li
      key={i}
      onClick={() =>
        setSelectedQuestion(q)
      }
      className="
        cursor-pointer
        hover:text-yellow-400
      "
    >🧠 {q}
      {" "}
      <span className="text-yellow-400">
        ({q.company})
      </span>
    </li>
  )
)}
        </ul>
      </div>
      <div>
  <h3 className="text-xl font-bold text-yellow-400 mb-4">
    DSA
  </h3>

  <ul className="space-y-2">
   {interviewResult.dsa?.map(
  (q: any, i: number) => (
    <li
      key={i}
      onClick={() =>
        setSelectedQuestion(q)
      }
      className="
        cursor-pointer
        hover:text-yellow-400
      "
    >
      🧠 {q}
      {" "}
      <span className="text-yellow-400">
        ({q.company})
      </span>
    </li>
  )
)}
  </ul>
</div>

      <div>
        <h3 className="text-xl font-bold text-yellow-400 mb-4">
          Behavioral
        </h3>

        <ul className="space-y-2">
          {interviewResult.behavioral?.map(
  (q: any, i: number) => (
    <li
      key={i}
      onClick={() =>
        setSelectedQuestion(q)
      }
      className="
        cursor-pointer
        hover:text-yellow-400
      "
    >
      🤝 {q}
      {" "}
      <span className="text-yellow-400">
        ({q.company})
      </span>
    </li>
  )
)}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-bold text-yellow-400 mb-4">
          Project
        </h3>

        <ul className="space-y-2">
          {interviewResult.project?.map(
  (q: any, i: number) => (
    <li
      key={i}
      onClick={() =>
        setSelectedQuestion(q)
      }
      className="
        cursor-pointer
        hover:text-yellow-400
      "
    >
      🚀 {q}
      {" "}
      <span className="text-yellow-400">
        ({q.company})
      </span>
    </li>
  )
)}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-bold text-yellow-400 mb-4">
          HR
        </h3>

        <ul className="space-y-2">{interviewResult.hr?.map(
  (q: any, i: number) => (
    <li
      key={i}
      onClick={() =>
        setSelectedQuestion(q)
      }
      className="
        cursor-pointer
        hover:text-yellow-400
      "
    >
      🏢 {q}
      {" "}
      <span className="text-yellow-400">
        ({q.company})
      </span>
    </li>
  )
)}
        </ul>
      </div>

    </div>

    {selectedQuestion && (
      <div className="
        mt-10
        bg-white/5
        border
        border-yellow-500/20
        rounded-3xl
        p-8
      ">

        <h2 className="
          text-2xl
          font-bold
          text-yellow-400
          mb-4
        ">
          AI Mock Interview
        </h2>

        <p className="mb-4 text-gray-300">
          {selectedQuestion}
        </p>

        <textarea
          value={answer}
          onChange={(e) =>
            setAnswer(e.target.value)
          }
          placeholder="Type your answer here..."
          className="
            w-full
            h-40
            bg-black/40
            border
            border-yellow-500/20
            rounded-xl
            p-4
            text-white
          "
        />

        <button
          onClick={handleInterviewEvaluation}
          className="
            mt-4
            px-8
            py-3
            rounded-xl
            font-semibold
            bg-linear-to-r
            from-yellow-500
            to-amber-600
          "
        >
          Submit Answer
        </button>

      </div>
    )}
    {interviewResult &&
    interviewResult.evaluation && (
      <div className="mt-10 bg-white/5 border border-yellow-500/20 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          Interview Evaluation
        </h2>
        <p className="text-gray-300">
          {interviewResult.evaluation}
        </p>
      </div>
    )}
    {mockInterviewResult && (
  <div className="
    mt-8
    bg-white/5
    border
    border-yellow-500/20
    rounded-3xl
    p-8
  ">

    <h2 className="
      text-3xl
      font-bold
      text-green-400
      mb-6
    ">
      Score:
      {mockInterviewResult.score}/10
    </h2>

    <h3 className="
      text-yellow-400
      font-bold
      mb-3
    ">
      Strengths
    </h3>

    <ul className="space-y-2">
      {mockInterviewResult.strengths?.map(
        (item: string, i: number) => (
          <li key={i}>
            ✅ {item}
          </li>
        )
      )}
    </ul>

    <h3 className="
      mt-6
      text-yellow-400
      font-bold
      mb-3
    ">
      Improvements
    </h3>

    <ul className="space-y-2">
      {mockInterviewResult.improvements?.map(
        (item: string, i: number) => (
          <li key={i}>
            💡 {item}
          </li>
        )
      )}
    </ul>

    <h3 className="
      mt-6
      text-yellow-400
      font-bold
      mb-3
    ">
      AI Feedback
    </h3>

    <p className="text-gray-300">
      {mockInterviewResult.feedback}
    </p>

  </div>
)}

  </div>
)}
  


            {/* ATS Score */}
            <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-10">

              <h2 className="text-center text-yellow-400 text-2xl font-bold mb-8">
                ATS Compatibility Score
              </h2>

              <div className="w-56 h-56 mx-auto">

                <CircularProgressbar
                  value={result.score}
                  text={`${result.score}%`}
                  styles={buildStyles({
                    pathColor: "#D4AF37",
                    textColor: "#FACC15",
                    trailColor: "#27272a",
                  })}
                />

              </div>

              <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 text-center">

                <h3 className="text-yellow-400 font-semibold">
                  AI Verdict
                </h3>

                <p className="text-gray-300 mt-2">
                  Your resume demonstrates
                  strong ATS compatibility and
                  can be further improved with
                  targeted enhancements.
                </p>

              </div>
 
            </div>
            


            {/* Grid Cards */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Strengths */}
              <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6">

                <div className="flex items-center gap-3 mb-5">

                  <ShieldCheck className="text-green-400" />

                  <h3 className="text-xl font-bold text-yellow-400">
                    Strengths
                  </h3>

                </div>

                <ul className="space-y-3">

                  {result.strengths?.map(
                    (
                      item: string,
                      index: number
                    ) => (
                      <li key={index}>
                        ✅ {item}
                      </li>
                    )
                  )}

                </ul>

              </div>

              {/* Weaknesses */}
              <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6">

                <div className="flex items-center gap-3 mb-5">

                  <AlertTriangle className="text-red-400" />

                  <h3 className="text-xl font-bold text-yellow-400">
                    Weaknesses
                  </h3>

                </div>

                <ul className="space-y-3">

                  {result.weaknesses?.map(
                    (
                      item: string,
                      index: number
                    ) => (
                      <li key={index}>
                        ❌ {item}
                      </li>
                    )
                  )}

                </ul>

              </div>

              {/* Missing Skills */}
              <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6">

                <div className="flex items-center gap-3 mb-5">

                  <Brain className="text-yellow-400" />

                  <h3 className="text-xl font-bold text-yellow-400">
                    Missing Skills
                  </h3>

                </div>

                <div className="flex flex-wrap gap-3">

                  {result.missingSkills?.map(
                    (
                      skill: string,
                      index: number
                    ) => (
                      <span
                        key={index}
                        className="
                          px-4
                          py-2
                          rounded-full
                          bg-yellow-500/10
                          border
                          border-yellow-500/20
                        "
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* Suggestions */}
              <div className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-6">

                <div className="flex items-center gap-3 mb-5">

                  <Lightbulb className="text-yellow-400" />

                  <h3 className="text-xl font-bold text-yellow-400">
                    Suggestions
                  </h3>

                </div>

                <ul className="space-y-3">

                  {result.suggestions?.map(
                    (
                      item: string,
                      index: number
                    ) => (
                      <li key={index}>
                        💡 {item}
                      </li>
                    )
                  )}

                </ul>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}