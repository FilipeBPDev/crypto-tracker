import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/img/logo.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [localError, setLocalError] = useState(null);

  const { register, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // se o usuario ja esta logado -> manda para dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // submit do formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    // validações locais
    if (!password || !confirmPassword) {
      setLocalError("preencha os dois campos de senha");
      return;
    }

    if (password.length < 6) {
      setLocalError("a senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("as senhas não conferem");
      return;
    }

    setLocalError(null);

    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      console.log("erro no registro:", err.message);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#0F172A] text-gray-100 overflow-hidden">
      {/* gradiente igual ao login */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00121b] via-[#186085] to-[#052f45] opacity-95 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none"></div>

      {/* card principal */}
      <div className="relative z-10 w-[90%] max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 py-10 shadow-2xl backdrop-blur-md">
        {/* logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="logo cryptotracker"
            className="w-44 h-44 object-contain drop-shadow-xl"
          />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-1 drop-shadow-sm">
          Criar sua conta
        </h1>

        <p className="text-center text-blue-300 text-sm mb-6 mt-6">
          Registre-se para acompanhar suas Criptos
        </p>

        {/* formulario */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input
              type="text"
              className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input
              type="password"
              className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="crie uma senha segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Confirmar Senha</label>
            <input
              type="password"
              className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="repita sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* erros */}
          {localError && (
            <p className="text-red-400 text-center text-sm">{localError}</p>
          )}

          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          {/* botao */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2 mt-3 text-sm font-medium rounded-lg text-white
              bg-[#186085]
              hover:bg-[#1f8fc9]
              active:bg-[#166b94]
              disabled:bg-[#186085]/50
              disabled:cursor-not-allowed
              transition-colors duration-200 shadow-lg shadow-[#186085]/30
            "
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        {/* link para login */}
        <p className="text-center text-sm text-blue-300 mt-6">
          Já tem uma conta?{" "}
          <span
            className="text-blue-400 underline cursor-pointer hover:text-blue-300"
            onClick={() => navigate("/login")}
          >
            Fazer Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
