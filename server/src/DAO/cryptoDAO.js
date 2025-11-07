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
export const insertCrypto = async (symbol, price, name, change_24h) =>{
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

//atualiza o change
export const updateChange = async ( change_24h, symbol ) => {
    const query = `UPDATE crypto SET change_24h = ? WHERE symbol = ?`;
    const [rows] = await db.query(query, [ change_24h, symbol]);
    return rows;
}

//deletar crypto
export const deleteCrypto = async ( symbol ) => {
    const query = `DELETE FROM crypto WHERE symbol = ?`;
    const [rows] = await db.query(query, [symbol]);
    return rows;
}

//function para decidir se salva ou faz update
export const saveOrUpdateCrypto = async (symbol, name, price,  change_24h) => {

    //validar os dados
    const sym = symbol.trim().toUpperCase();
    const cryptoName = name.trim();
    const parsedPrice = parseFloat(price);
    const parsedChange = parseFloat(change_24h);

    if (isNaN(parsedPrice) || isNaN(parsedChange)) {
        throw new Error('Preço ou variação de 24h inválidos. Certifique-se de que são números.');
    }

    const crypto = await getCryptoBySymbol(sym);

    if(!crypto || crypto.length === 0) {
        await insertCrypto(sym, parsedPrice, cryptoName, parsedChange);
        return { action: "inserted", symbol: sym, price: parsedPrice} ;
    } else {
        await updatePrice(parsedPrice, sym);
        await updateChange(parsedChange, sym);
        return { action: "updated", symbol: sym, price: parsedPrice }
    }

}