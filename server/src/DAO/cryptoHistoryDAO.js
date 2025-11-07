import { db } from "../config/db/connection.js";

//gravar preço
export const insertRecord = async (symbol, price, change_24h) => {
    const sym = symbol.trim().toUpperCase();
    const parsedPrice = parseFloat(price);
    const parsedChange= parseFloat(change_24h);

    if(isNaN(parsedPrice) || isNaN(parsedChange)) {
        throw new Error('Preço ou variação de 24h inválidos. Certifique-se de que são números.');
    }

        if(!sym || parsedPrice < 0 ) {
        throw new Error('Preço ou symbolo inválidos. Certifique-se de que são números.');
    }

    const query = `INSERT INTO crypto_history (symbol, price, change_24h) 
    VALUES (?, ?, ?);`
    const [rows] = await db.query(query, [sym, parsedPrice, parsedChange]);
    return rows;
} 

//puxar historico da cripto
export const getHistoryBySymbol = async (symbol, limit) => {
}

//deletar historico antigo  
export const deleteOldRecords = async (days) => {
}