import { useContext } from "react";
import { ScrollDirectionContext } from "../services/reducers/ScrollDirectionContext";

export const useScrollDirectionContext = () => {
  const context = useContext(ScrollDirectionContext);
  if (!context)
    throw new Error(
      "useScrollDirectionContext must be used within ScrollDirectionProvider",
    );
  return context;
};
