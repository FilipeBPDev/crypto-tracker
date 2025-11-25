import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import MarketHistory from "./pages/MarketHistory/MarketHistory";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { AuthProvider } from "./context/AuthProvider"; // <-- importante

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* pagina de login */}
          <Route path="/login" element={<Login />} />

          {/* pagina de registro */}
          <Route path="/register" element={<Register />} />

          {/* pagina inicial protegida (dashboard) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* pagina de histórico por símbolo (protegida) */}
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
