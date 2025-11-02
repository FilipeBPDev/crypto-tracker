import { CryptoIcon } from "@ledgerhq/crypto-icons";
import { FaCoins } from "react-icons/fa";

export const CRYPTO_ICONS = {
  BTCUSDT: (
    <div className="w-6 h-6 flex items-center justify-center">
      <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={20} />
    </div>
  ),
  ETHUSDT: (
    <div className="w-6 h-6 flex items-center justify-center">
      <CryptoIcon ledgerId="ethereum" ticker="ETH" size={20} />
    </div>
  ),
  SOLUSDT: (
    <div className="w-6 h-6 flex items-center justify-center">
      <CryptoIcon ledgerId="solana" ticker="SOL" size={20} />
    </div>
  ),
  XRPUSDT: (
    <div className="w-6 h-6 flex items-center justify-center">
      <CryptoIcon ledgerId="ripple" ticker="XRP" size={20} />
    </div>
  ),
  DOTUSDT: (
    <div className="w-6 h-6 flex items-center justify-center">
      <CryptoIcon ledgerId="polkadot" ticker="DOT" size={20} />
    </div>
  ),
  DEFAULT: <FaCoins size={16} className="text-gray-400" />,
};
