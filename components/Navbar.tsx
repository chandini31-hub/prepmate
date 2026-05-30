export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 border-b">
      <h1 className="text-2xl font-bold text-indigo-600">
        PrepMate
      </h1>

      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
        Login
      </button>
    </nav>
  );
}