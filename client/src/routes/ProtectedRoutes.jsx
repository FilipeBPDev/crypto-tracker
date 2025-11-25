import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // enquanto estiver carregando o profile, nao deixa seguir
  if (loading) {
    return <div className="text-white p-4">carregando...</div>;
  }

  // se nao tiver token ou nao tiver user carregado, bloqueia
  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  // se tiver autenticado, libera
  return children;
};

export default ProtectedRoute;
