import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Portfolio from "../../components/Portfolio/Portfolio";
import MarketList from "../../components/MarketList/MarketList";
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar />
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="flex-1">
            <Portfolio />
          </div>
          <MarketList />
        </div>
        <TransactionsTable />
      </main>
    </div>
  );
}
