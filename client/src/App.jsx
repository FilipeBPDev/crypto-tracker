import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Páginas
import Dashboard from "./pages/Dashboard/Dashboard";
import MarketHistory from "./pages/MarketHistory/MarketHistory";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<Dashboard />} />

        {/* Página de histórico (por símbolo) */}
        <Route path="/history/:symbol" element={<MarketHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
