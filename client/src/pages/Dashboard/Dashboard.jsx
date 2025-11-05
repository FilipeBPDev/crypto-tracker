import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Portfolio from "../../components/Portfolio/Portfolio";
import MarketList from "../../components/MarketList/MarketList";
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable";
import MarketChart from "../../components/MarketChart/MarketChart";

export default function Dashboard() {
  return (
    <div className="relative flex flex-col md:flex-row min-h-screen bg-[#0F172A] text-light overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#00121b] via-[#186085] to-[#052f45] opacity-95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />

      {/* sidebar fixa */}
      <Sidebar />

      {/* area principal */}
      <main className="relative flex-1 p-4 md:p-6 z-10">
        <Topbar />

        {/* bloco principal com grafico + lista de mercado */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-4 md:mt-6">
          <div className="flex-1">
            <MarketChart user={null} />{" "}
            {/* trocar para {user} após AuthContext */}
          </div>

          {/* lista de moedas em tempo real */}
          <div className="w-full md:w-auto">
            <MarketList />
          </div>
        </div>

        {/* historico de transações */}
        <div className="mt-4 md:mt-6">
          <TransactionsTable />
        </div>
      </main>
    </div>
  );
}
