import { createContext, useEffect, useReducer } from "react";

export const WalletContext = createContext({});

export const WalletContextTypes = {
  ADD_WALLET: "ADD_WALLET",
  DELETE_WALLET: "DELETE_WALLET",
  CHANGE_WALLET_VALUE: "CHANGE_WALLET_VALUE",
};

export const WALLET_KEYS = [
  "blue",
  "effect",
  "irr",
  "psc",
  "red",
  "satisfaction",
  "yellow",
];

const reducer = (state, action) => {
  switch (action.type) {
    case WalletContextTypes.ADD_WALLET:
      return action.payload;

    case WalletContextTypes.CHANGE_WALLET_VALUE: {
      const { key, amount, operation } = action.payload;
      if (
        !WALLET_KEYS.includes(key) ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        !["+", "-"].includes(operation)
      ) {
        throw new Error("Invalid wallet value change");
      }

      const currentValue = Number(state[key]);
      const current = Number.isFinite(currentValue) ? currentValue : 0;

      return {
        ...state,
        [key]: operation === "+" ? current + amount : current - amount,
      };
    }

    case WalletContextTypes.DELETE_WALLET:
      return {};

    default:
      return state;
  }
};

export default function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {});
  useEffect(() => {
    if (!children) {
      throw Error("You must use WalletContext provider ...");
    }
  }, [children]);

  return (
    <WalletContext.Provider value={[state, dispatch]}>
      {children}
    </WalletContext.Provider>
  );
}
