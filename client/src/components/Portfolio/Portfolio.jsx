export default function Portfolio() {
  return (
    <div>
      <section className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 hover:bg-white/15 transition-all duration-300">
        <div className="h-40 flex items-end justify-around">
          {[5, 8, 6, 10, 7, 9, 6, 8, 5, 9].map((v, i) => (
            <div
              key={i}
              className="bg-primary rounded w-4"
              style={{ height: `${v * 10}px` }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
