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
export const getHistoryBySymbol = async (symbol, limit, since, until, order) => {
  // validação minima e fallback
  const symbolUpper = typeof symbol === "string" ? symbol.trim().toUpperCase() : "";
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 100;

  // define ordenação
  const orderDir = order && order.toUpperCase() === "ASC" ? "ASC" : "DESC";

  // constroi filtros dinamicos
  const where = ["symbol = ?"];
  const params = [symbolUpper];

  if (since instanceof Date) {
    where.push("timestamp >= ?");
    params.push(since);
  }

  if (until instanceof Date) {
    where.push("timestamp <= ?");
    params.push(until);
  }

  //query final com ordenação 
  const query = `
    SELECT symbol, price, change_24h, timestamp
    FROM crypto_history
    WHERE ${where.join(" AND ")}
    ORDER BY timestamp ${orderDir}
    LIMIT ?
  `;

  // adiciona o limite como ultimo parâmetro
  params.push(safeLimit);

  // executa query no banco
  const [rows] = await db.query(query, params);

  return rows.map((r) => ({
    symbol: r.symbol,
    price: Number(r.price),
    change_24h: Number(r.change_24h),
    timestamp: r.timestamp,
  }));
};

//deletar historico antigo  
export const deleteOldRecords = async (days = 7) => {
  if (!Number.isInteger(days) || days <= 0) {
    throw new Error("valor de dias inválido. deve ser um número positivo.");
  }

  const query = `
    DELETE FROM crypto_history
    WHERE timestamp < (NOW() - INTERVAL ? DAY);
  `;

  // aqui 'result' é o nome correto (não 'rows')
  const [result] = await db.query(query, [days]);

  return {
    affectedRows: result.affectedRows || 0,
    message: `foram removidos ${result.affectedRows || 0} registros com mais de ${days} dias.`,
  };
};