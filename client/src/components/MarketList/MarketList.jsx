export default function MarketList() {
  const mockData = [
    { name: "BTC/USDT", icon: "₿" },
    { name: "ETH/USDT", icon: "Ξ" },
    { name: "SOL/USDT", icon: "◎" },
    { name: "XRP/USDT", icon: "✦" },
    { name: "ADA/USDT", icon: "⬡" },
  ];

  return (
    <aside className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg py-4 px-6 w-full md:w-1/3 hover:bg-white/15 transition-all duration-300">
      <h3 className="font-semibold text-dark mb-2">Market</h3>
      <ul className="divide-y divide-gray-200">
        {mockData.map((item) => (
          <li
            key={item.name}
            className="py-3 flex items-center justify-between hover:text-primary"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-dark font-medium">{item.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
