// تابع توسعه داده شده برای کم یا زیاد کردن مقادیر کیف پول

import { useCallback, useContext } from "react";
import {
  WALLET_KEYS,
  WalletContext,
  WalletContextTypes,
} from "../services/reducers/WalletContext.jsx";

const walletKeys = new Set(WALLET_KEYS);
const operations = new Set(["+", "-"]);

export default function useWalletUpdate() {
  const [, dispatch] = useContext(WalletContext);

  return useCallback(
    (key, amount, operation = "+") => {
      if (!walletKeys.has(key)) {
        throw new Error(`Unknown wallet key: ${key}`);
      }

      if (!Number.isFinite(amount) || amount < 0) {
        throw new Error("Wallet change amount must be a non-negative number");
      }

      if (!operations.has(operation)) {
        throw new Error(`Unsupported wallet operation: ${operation}`);
      }

      dispatch({
        type: WalletContextTypes.CHANGE_WALLET_VALUE,
        payload: { key, amount, operation },
      });
    },
    [dispatch],
  );
}
