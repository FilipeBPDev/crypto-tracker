// Mock temporário (até ter integração real)
export async function fetchGlobalMarketData() {
  return [
    { time: "10:00", avgChange: 0.8 },
    { time: "10:05", avgChange: 1.1 },
    { time: "10:10", avgChange: 0.4 },
    { time: "10:15", avgChange: 1.5 },
  ];
}

export async function fetchUserWalletData(userId) {
  // Simulando crescimento da carteira
  // TODO: implementar integração real com backend usando userId
  void userId; // evita warning de variável não usada

  return [
    { time: "10:00", totalValue: 1550 },
    { time: "10:05", totalValue: 1568 },
    { time: "10:10", totalValue: 1590 },
    { time: "10:15", totalValue: 1578 },
  ];
}
