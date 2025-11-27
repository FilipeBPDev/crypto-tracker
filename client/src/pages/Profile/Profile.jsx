import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";

export default function Profile() {
  const { user, updateUser, updatePassword } = useAuth();

  // estados locais dos inputs
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // mensagens de feedback
  const [msg, setMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // loaders locais (sem mexer no auth global)
  const [savingUser, setSavingUser] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // atualizar dados do usuario
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setSavingUser(true);
    setMsg(null);
    setErrorMsg(null);

    try {
      await updateUser(name, email);
      setMsg("dados atualizados com sucesso.");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSavingUser(false);
    }
  };

  // alterar senha
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setMsg(null);
    setErrorMsg(null);

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setSavingPassword(false);
      setErrorMsg("preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSavingPassword(false);
      setErrorMsg("as senhas não conferem.");
      return;
    }

    try {
      await updatePassword(oldPassword, newPassword);
      setMsg("senha atualizada com sucesso.");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen bg-[#0F172A] text-light overflow-hidden">
      {/* fundo do dashboard */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00121b] via-[#186085] to-[#052f45] opacity-95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-10%,rgba(37,99,235,0.08),transparent_70%)] pointer-events-none" />

      {/* sidebar */}
      <Sidebar />

      {/* conteudo principal */}
      <main className="relative flex-1 p-4 md:p-6 z-10">
        <Topbar />

        <h1 className="text-xl md:text-2xl font-semibold text-white mt-4">
          Configurações da conta
        </h1>

        <p className="text-blue-300 text-sm mb-6">
          Gerencie suas informações e segurança
        </p>

        {/* mensagens */}
        {msg && (
          <p className="text-green-400 text-sm mb-4 animate-fade-in">{msg}</p>
        )}

        {errorMsg && (
          <p className="text-red-400 text-sm mb-4 animate-fade-in">
            {errorMsg}
          </p>
        )}

        {/* container com dois cards */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* card -> dados do usuario */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white mb-4">
              Dados pessoais
            </h2>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nome:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingUser}
                className="
                  w-full py-2 mt-2 text-sm font-medium rounded-lg text-white
                  bg-[#186085]
                  hover:bg-[#1f8fc9]
                  active:bg-[#166b94]
                  disabled:bg-[#186085]/50
                  disabled:cursor-not-allowed
                  transition-colors duration-200 shadow-lg shadow-[#186085]/30
                "
              >
                {savingUser ? "Salvando..." : "Salvar alterações"}
              </button>
            </form>
          </div>

          {/* card -> alterar senha */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white mb-4">
              Alterar senha
            </h2>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Senha atual</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Nova senha</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Confirmar nova senha
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="
                  w-full py-2 mt-2 text-sm font-medium rounded-lg text-white
                  bg-[#186085]
                  hover:bg-[#1f8fc9]
                  active:bg-[#166b94]
                  disabled:bg-[#186085]/50
                  disabled:cursor-not-allowed
                  transition-colors duration-200 shadow-lg shadow-[#186085]/30
                "
              >
                {savingPassword ? "Atualizando..." : "Atualizar senha"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
