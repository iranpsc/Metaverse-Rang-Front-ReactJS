import { createContext, useContext } from "react";
import { useTranslation } from "react-i18next";

export const LanguageContext = createContext({
  isPersian: false,
  isRtl: false,
});

export const useLanguage = () => useContext(LanguageContext).isPersian;

export const useIsRtl = () => useContext(LanguageContext).isRtl;

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();

  const isPersian = i18n.language === "fa";
  const isRtl = i18n.dir() === "rtl";

  return (
    <LanguageContext.Provider value={{ isPersian, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};
