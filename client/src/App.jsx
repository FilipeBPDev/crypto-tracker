import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import MarketHistory from "./pages/MarketHistory/MarketHistory";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./routes/ProtectedRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {/* pagina de login */}
        <Route path="/login" element={<Login />} />

        {/* pagina inicial protegida (dashboard) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* pagina de historico por simbolo (por enquanto sem protecao) */}
        <Route
          path="/history/:symbol"
          element={
            <ProtectedRoute>
              <MarketHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
