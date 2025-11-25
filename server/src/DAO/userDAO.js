import { db } from "../config/db/connection.js";

// buscar usuário por email
export const getUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = ?;";
  const [rows] = await db.query(query, [email]);
  return rows[0];
};

// buscar usuário por id
export const getUserById = async (id) => {
  const query = "SELECT * FROM users WHERE id = ?;";
  const [rows] = await db.query(query, [id]);
  return rows[0];
};

//criar usuário
export const createUser = async (name, email, hashedPassword) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?);
  `;

  const [rows] = await db.query(query, [name, email, hashedPassword]);

  return await getUserById(rows.insertId);
};

// atualizar nome e email
export const updateUserById = async (id, { name, email }) => {
  const query = `
    UPDATE users 
    SET name = ?, email = ?
    WHERE id = ?
  `;

  const [rows] = await db.query(query, [name, email, id]);

  if (rows.affectedRows === 0) return null;

  return await getUserById(id);
};

//atualizar senha
export const updatePasswordById = async (id, hashedPassword) => {
  const query = `
    UPDATE users
    SET password = ?
    WHERE id = ?
  `;

  const [rows] = await db.query(query, [hashedPassword, id]);
  return rows.affectedRows > 0;
};

//deletar usuário
export const deleteUser = async (id) => {
  const query = "DELETE FROM users WHERE id = ?;";
  const [rows] = await db.query(query, [id]);
  return rows.affectedRows > 0;
};
