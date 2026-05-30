export default function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r p-6">
      <h2 className="text-2xl font-bold mb-8">
        PrepMate
      </h2>

      <ul className="space-y-4">
        <li>Dashboard</li>
        <li>Upload Resume</li>
        <li>Analysis</li>
        <li>Interview</li>
        <li>Settings</li>
      </ul>
    </aside>
  );
}