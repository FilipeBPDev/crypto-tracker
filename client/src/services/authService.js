// url base da api de autenticacao
const API_URL = "http://localhost:5000/api/auth";

// request de registro
export const registerRequest = async (name, email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "erro ao registrar usuario");
  }

  return data;
};

// request de login
export const loginRequest = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "erro ao fazer login");
  }

  return data;
};

// request para rota protegida -> /profile
export const getProfileRequest = async (token) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "token invalido");
  }

  return data;
};

// atualizar nome e email
export const updateUserRequest = async (name, email, token) => {
  const response = await fetch(`${API_URL}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "erro ao atualizar dados");
  }

  return data;
};

// atualizar senha
export const updatePasswordRequest = async (oldPassword, newPassword, token) => {
  const response = await fetch(`${API_URL}/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "erro ao atualizar senha");
  }

  return data;
};
