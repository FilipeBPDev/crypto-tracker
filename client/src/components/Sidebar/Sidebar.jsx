import logo from "../../assets/img/logo.png"; // ou .svg se for vetorial

export default function Sidebar() {
  return (
    <aside className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg pt-0 px-6 pb-6 mt-6 mb-6 ml-6 h-100 flex flex-col justify-between hover:bg-white/15 transition-all duration-300">
      <div>
        {/* LOGO + TÍTULO */}
        <div className="flex items-start justify-center mb-10">
          <img
            src={logo}
            alt="Crypto Tracker Logo"
            className="w-[130px] h-[130px] object-contain drop-shadow-md"
          />
        </div>

        {/* PERFIL */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div>
            <p className="font-semibold text-light">Name Lastname</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-8 mt-16 text-light">
          <button className="text-left hover:text-light">Dashboard</button>
          <button className="text-left hover:text-light">Transactions</button>
          <button className="text-left hover:text-light">Settings</button>
        </nav>
      </div>

      {/* LOGOUT */}
      <button className="text-sm text-muted hover:text-danger">Log Out</button>
    </aside>
  );
}
