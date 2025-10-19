import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cryptoRoutes from "../routes/cryptosRoutes.js";
import portfolioRoutes from "../routes/portfolioRoutes.js";

dotenv.config();
const app = express();

//config corse json
app.use(cors());
app.use(express.json());

//rotas de cryptos
app.use("/api", cryptoRoutes);

//rota de portfolio
app.use("/api", portfolioRoutes);











// portas
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server rodando na porta ${PORT}`));

