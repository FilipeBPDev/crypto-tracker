export default function Topbar() {
  return (
    <header className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 hover:bg-white/15 transition-all duration-300">
      <h1 className="text-2xl font-bold text-logo"> Crypto Tracker</h1>
      <h2 className="text-xl font-semibold text-dark">Portfolio Overview</h2>
      <div className="text-sm text-muted">Última atualização: agora mesmo</div>
    </header>
  );
}
