import { db } from "../config/db/connection.js";

//procurar usuario por email
export const getUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = ?;`;
    const [rows] = await db.query(query, [email]);
    return rows[0];
}

//procurar usuario por id
export const getUserById = async (id) => {
    const query = `SELECT * FROM users WHERE id = ?;`
    const [rows] = await db.query(query, [id]);
    return rows[0];
}

//criar usuario
export const createUser = async (name, email, hashedPassword) => {
    const query = `INSERT INTO users (name, email, password)
    VALUES (
    ?, ?, ?);`
    const [rows] = await db.query(query, [name, email, hashedPassword]);
    return { id: rows.insertId, name, email };

}

//atualizar user
export const updateUser = async (name, email, id) => {
    const query = `UPDATE users SET name = ?, email = ? WHERE id = ?;`
    const [rows] = await db.query(query, [name, email, id]);
    return rows.affectedRows > 0;
}

//deletar usuario
export const deleteUser = async (id) => {
    const query = `DELETE FROM users WHERE id = ?;`;
    const [rows] = await db.query(query, [id]);
    return rows.affectedRows > 0;
}



