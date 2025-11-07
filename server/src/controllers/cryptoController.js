import { deleteCrypto, getAllCryptos, insertCrypto, updateChange, updatePrice, getCryptoBySymbol, saveOrUpdateCrypto } from "../DAO/cryptoDAO.js";


//pegar todas as cryptos
export const getAllCryptosControl = async (req, res) => {
  try{
    const cryptos = await getAllCryptos();
    res.status(200).json(cryptos);
  } catch (error) {
    console.error("Erro ao buscar criptos:", error);
    res.status(500).json({ error: "Erro ao buscar criptos" });
  }
};

//selecionar cryptos por simbolo
export const getCryptoBySymbolControl = async (req, res) => {
  try {
    const {symbol} = req.params;
    const crypto = await getCryptoBySymbol(symbol);
    res.status(200).json(crypto);
  } catch (error) {
    console.error("Erro ao buscar cripto:", error);
    res.status(500).json({ error: "Erro ao buscar cripto" });
  }
};

export const instertCryptoControl = async (req, res) => {
  try {
    const {symbol, price, name, change_24h} = req.body;
    const newCrypto = await insertCrypto(symbol, price, name, change_24h);
    res.status(201).json({ message: "Cripto inserida com sucesso", data: newCrypto });
  } catch (error) {
    console.error("Erro ao cadastrar cripto:", error);
  res.status(500).json({ error: "Erro ao cadastrar cripto"}); 
  }
}

export const updatePriceController = async (req, res) => {
  try {
    const { symbol, price } = req.body;

    const result = await updatePrice(price, symbol);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cripto não encontrada para atualização" });
    }

    res.status(200).json({ message: "Preço atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar preço:", error);
    res.status(500).json({ error: "Erro interno ao atualizar preço" });
  }
};

export const updateChangeController = async (req, res) => {
  try {
    const { change_24h, symbol } = req.body;

    const result = await updateChange( change_24h, symbol );
  
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cripto não encontrada para atualização" });
    }
    res.status(200).json({ message: "Variação atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar variação:", error);
    res.status(500).json({ error: "Erro interno ao atualizar variação" });
  }
}

export const deleteCryptoController = async (req, res) => {
  try {
    const {symbol} = req.params;

    const result = await deleteCrypto(symbol);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cripto não encontrada para deletar." });
    }

    res.status(200).json({ message: "Cripto deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar cripto:", error);
    res.status(500).json({ error: "Erro interno ao deletar cripto." });
  }
}

export const saveOrUpdateCryptoController = async (req, res) => {
  try {
    const {symbol, name, price,  change_24h } = req.body;
    const result = await saveOrUpdateCrypto(symbol, name, price, change_24h);
    if(!result) {
      return res.status(404).json({ message: "Dados de cripto inválidos"});
    }
    
    res.status(200).json({ 
      message: 
      result.action === "inserted" ? "Cripto adicionada com sucesso!" : "Cripto atualizada com sucesso",
      data: result
    });
  } catch (error ) {
    console.error("Erro ao inserir cripto:", error);
    res.status(500).json({ error: "Erro interno ao inserir cripto." });

  }
}
