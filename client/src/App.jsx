import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import MarketHistory from "./pages/MarketHistory/MarketHistory";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { AuthProvider } from "./context/AuthProvider"; // <-- importante

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* página de login */}
          <Route path="/login" element={<Login />} />

          {/* página inicial protegida (dashboard) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* página de histórico por símbolo (protegida) */}
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
    </AuthProvider>
  );
}

export default App;
