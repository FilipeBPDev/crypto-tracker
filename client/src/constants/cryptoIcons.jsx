import { CryptoIcon } from "@ledgerhq/crypto-icons";
import { FaCoins } from "react-icons/fa";

const DynamicCryptoIcon = ({ symbol, name }) => {
  // normaliza os valores
  const ticker = symbol?.replace("USDT", "").toUpperCase();
  const ledgerId = name?.toLowerCase() || ticker.toLowerCase();

  // ledgerId's
  const supported = [
    "bitcoin",
    "ethereum",
    "solana",
    "binancecoin",
    "ripple",
    "cardano",
    "dogecoin",
    "polkadot",
    "tron",
    "chainlink",
    "toncoin",
  ];

  const isSupported = supported.includes(ledgerId);

  if (isSupported) {
    return (
      <div className="w-6 h-6 flex items-center justify-center transition-transform duration-300 hover:scale-125">
        <CryptoIcon ledgerId={ledgerId} ticker={ticker} />
      </div>
    );
  }

  // fallback caso nao tenha o icone na lib
  return (
    <div className="flex items-center justify-center">
      <FaCoins className="text-gray-400" />
    </div>
  );
};

export default DynamicCryptoIcon;
