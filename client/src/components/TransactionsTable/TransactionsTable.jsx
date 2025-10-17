export default function TransactionsTable() {
  const mockTransactions = [
    { date: "2025-10-12", crypto: "BTC", type: "Buy", amount: "0.0021" },
    { date: "2025-10-13", crypto: "ETH", type: "Sell", amount: "0.05" },
  ];

  return (
    <section className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 mt-6 hover:bg-white/15 transition-all duration-300">
      <h3 className="font-semibold text-dark mb-4">Transactions History</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-muted">
            <th className="pb-2">DATE</th>
            <th className="pb-2">CRYPTO</th>
            <th className="pb-2">TYPE</th>
            <th className="pb-2">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {mockTransactions.map((t, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-2">{t.date}</td>
              <td>{t.crypto}</td>
              <td className={t.type === "Buy" ? "text-success" : "text-danger"}>
                {t.type}
              </td>
              <td>{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
