import { db } from "../config/db/connection.js";

//todas cryptos
export const getAllCryptos = async () => {
    const query = `SELECT * FROM crypto ORDER BY CASE symbol WHEN 'BTCUSDT' THEN 1 WHEN 'ETHUSDT' THEN 2 ELSE 3 END, price DESC;`
    const [rows] = await db.query(query);
    return rows;
}

//crypto por symbol
export const getCryptoBySymbol = async (symbol) => {
    const query = "SELECT * FROM crypto WHERE symbol = ?;"
    const [rows] = await db.query(query, [symbol]);   
    return rows;
}

//inserir nova crypto
export const insertCrypto = async (symbol, price, name, change_24h, last_update) =>{
    const query = `INSERT INTO crypto (symbol, price, name, change_24h)
    VALUES (?, ?, ?, ?);`
    const [rows] = await db.query(query, [symbol, price, name, change_24h]);
    return rows;
}

//atualizar preços
export const updatePrice = async ( price, symbol) => {
    const query = `UPDATE crypto SET price = ? WHERE symbol = ?`;
    const [rows] = await db.query(query, [price, symbol]);
    return rows;
}