import { db } from "../config/db/connection.js";

//todas as transações de um usuario
export const getAllTransactions = async (userId) => {
    const [ rows ] = await db.query('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
};

//transação específica de um usuário
export const getTransactionById = async (id, userId) => {
    const [ rows ] = await db.query('SELECT * FROM transactions WHERE id === ? AND user_id = ?', [id, userId]);
    return rows[0];
}

//criar nova transação
export const addNewTransaction = async (transaction) => {
    const { user_id, crypto_id, type, amount, price_at, total_value } = transaction;
    const [ result ] = await db.query(
        'INSERT INTO transactions (user_id, crypto_id, type, amount, price_at, total_value) VALUES (?, ?, ?, ?, ?, ?)', [user_id, crypto_id, type, amount, price_at, total_value]
    );
    return { id: result.insertId, ...transaction };
}

//deletar transação
export const deleteTransaction = async (id, userId) => {
    const [ result ] = await db.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
}