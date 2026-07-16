export default function StatBar({ stats, dark = true }) {
  return (
    <div className={dark ? "bg-navy" : "bg-white"}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div
              className={`text-2xl md:text-4xl font-display font-extrabold ${
                dark ? "text-orange-500" : "text-orange-600"
              }`}
            >
              {s.value}
            </div>
            <div className={`text-xs md:text-sm mt-1 ${dark ? "text-slate-300" : "text-slate-500"}`}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
