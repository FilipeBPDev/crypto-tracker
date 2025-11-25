// src/components/Sidebar/Sidebar.jsx

import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Home,
  LineChart,
  Settings,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/img/logo.png";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // atalhos úteis
  const isActive = (route) => location.pathname === route;

  const baseStyle =
    "flex items-center gap-3 text-left text-gray-300 transition-all duration-200";
  const hoverStyle =
    "hover:text-white hover:translate-x-1 hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]";
  const activeStyle =
    "text-white translate-x-1 drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]";

  const goTo = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      {/* seta mobile */}
      <button
        className={`fixed top-5 left-3 z-50 md:hidden text-white/70 hover:text-white transition-transform duration-300 ${
          open ? "translate-x-[250px]" : "translate-x-0"
        }`}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ChevronLeft size={26} strokeWidth={2.5} />
        ) : (
          <ChevronRight size={26} strokeWidth={2.5} />
        )}
      </button>

      {/* overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* sidebar desktop */}
      <aside className="hidden md:flex bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg pt-0 px-6 pb-6 mt-6 mb-6 ml-6 h-[calc(100vh-3rem)] flex-col justify-between transition-all duration-300">
        <div>
          <div className="flex items-start justify-center mb-10">
            <img
              src={logo}
              alt="crypto tracker logo"
              className="w-[130px] h-[130px] object-contain drop-shadow-md"
            />
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div>
              <p className="font-semibold text-light text-sm">
                {user?.name || "usuário"}
              </p>
              <p className="text-xs text-gray-400">{user?.email || ""}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-8 mt-16 text-light">
            {/* dashboard */}
            <button
              onClick={() => goTo("/")}
              className={`${baseStyle} ${hoverStyle} ${
                isActive("/") ? activeStyle : ""
              }`}
            >
              <Home size={18} />
              Dashboard
            </button>

            {/* grafico mercado */}
            <button
              onClick={() => goTo("/history")}
              className={`${baseStyle} ${hoverStyle} ${
                isActive("/history") ? activeStyle : ""
              }`}
            >
              <LineChart size={18} />
              Análise de Mercado
            </button>

            {/* config */}
            <button
              onClick={() => goTo("/profile")}
              className={`${baseStyle} ${hoverStyle} ${
                isActive("/profile") ? activeStyle : ""
              }`}
            >
              <Settings size={18} />
              Configurações
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-muted hover:text-danger transition"
        >
          log out
        </button>
      </aside>

      {/* sidebar mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[rgba(255,255,255,0.08)] backdrop-blur-2xl border-r border-white/10 rounded-r-2xl shadow-lg md:hidden z-40 transform transition-transform duration-500 ease-in-out ${
          open ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0"
        }`}
      >
        <div className="flex flex-col justify-between h-full p-6">
          <div>
            <div className="flex items-center justify-between mb-8">
              <img
                src={logo}
                alt="crypto tracker logo"
                className="w-[100px] object-contain drop-shadow-md"
              />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-gray-300" />
              <div>
                <p className="font-semibold text-light text-sm">
                  {user?.name || "usuário"}
                </p>
                <p className="text-xs text-gray-400">{user?.email || ""}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-6 text-light">
              <button
                onClick={() => goTo("/")}
                className={`${baseStyle} ${hoverStyle} ${
                  isActive("/") ? activeStyle : ""
                }`}
              >
                <Home size={18} />
                Dashboard
              </button>

              <button
                onClick={() => goTo("/history")}
                className={`${baseStyle} ${hoverStyle} ${
                  isActive("/history") ? activeStyle : ""
                }`}
              >
                <LineChart size={18} />
                Análise de Mercado
              </button>

              <button
                onClick={() => goTo("/profile")}
                className={`${baseStyle} ${hoverStyle} ${
                  isActive("/profile") ? activeStyle : ""
                }`}
              >
                <Settings size={18} />
                Configurações
              </button>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-muted hover:text-danger mt-6"
          >
            log out
          </button>
        </div>
      </div>
    </>
  );
}
