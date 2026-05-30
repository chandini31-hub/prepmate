import Sidebar from "../../components/Sidebar";
import StatsCard from "../../components/StatsCard";

export default function Dashboard() {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-2 gap-6">

          <StatsCard
            title="ATS Score"
            value="82"
          />

          <StatsCard
            title="Skill Match"
            value="76%"
          />

          <StatsCard
            title="Resumes"
            value="3"
          />

          <StatsCard
            title="Interviews"
            value="5"
          />

        </div>

      </main>

    </div>
  );
}