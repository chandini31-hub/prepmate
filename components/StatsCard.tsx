type Props = {
  title: string;
  value: string;
};

export default function StatsCard({ title, value }: Props) {
  return (
    <div className="bg-zinc-900 border border-yellow-500/20 rounded-3xl p-6 hover:border-yellow-400 transition-all duration-300 hover:scale-105">

      <p className="text-gray-400 text-lg">
        {title}
      </p>

      <h2 className="text-5xl font-extrabold text-yellow-400 mt-4">
        {value}
      </h2>

      <div className="w-full bg-zinc-800 rounded-full h-2 mt-6">

        <div className="bg-linear-to-r from-yellow-400 to-orange-500 h-2 rounded-full w-3/4"></div>

      </div>

    </div>
  );
}