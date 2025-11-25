export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  const value = payload[0].value;

  return (
    <div
      className="
        bg-[rgba(15,23,42,0.7)]
        border border-white/10
        backdrop-blur-md
        px-3 py-2
        rounded-lg
        shadow-lg
        text-gray-200 text-xs
        animate-fade-in
      "
    >
      <p className="font-medium">{label}</p>
      <p className="text-blue-300">{value.toFixed(3)}%</p>
    </div>
  );
}
