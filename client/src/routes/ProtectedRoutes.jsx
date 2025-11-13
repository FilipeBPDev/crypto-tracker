import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // se nao estiver autenticado, redireciona para login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // se estiver autenticado, renderiza o conteudo
  return children;
};

export default ProtectedRoute;
