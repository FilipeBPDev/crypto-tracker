import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cryptoRoutes from "../src/routes/cryptosRoutes.js";
import portfolioRoutes from "../src/routes/portfolioRoutes.js";
import transactionRoutes from "../src/routes/transactionsRoutes.js";
import { db } from "./config/db/connection.js";

dotenv.config();
const app = express();

//config corse json
app.use(cors());
app.use(express.json());

//rotas de cryptos
app.use("/api", cryptoRoutes);

//rota de portfolio
app.use("/api", portfolioRoutes);

//rota transactions
app.use("/api", transactionRoutes);




db.query('SELECT 1')
  .then(() => console.log('✅ Conexão com MySQL funcionando!'))
  .catch((err) => console.error('❌ Erro ao conectar com MySQL:', err));









// portas
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server rodando na porta ${PORT}`));

