import { useContext } from "react";
import { LanguageContext } from "../services/reducers/LanguageContext";

export const useLanguage = () => useContext(LanguageContext);
