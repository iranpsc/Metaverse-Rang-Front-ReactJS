import { useState, useEffect, useCallback } from "react";
import i18n from "../i18n/i18n";

export default function useLanguage() {
  const [currentLang, setCurrentLang] = useState(i18n.language || "fa");

  const isPersian = currentLang === "fa";

  useEffect(() => {
    document.body.dir = i18n.dir();

    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      changeLanguage(savedLang);
    }
  }, []);

  const changeLanguage = useCallback(async (lang) => {
    try {
      if (!i18n.options.supportedLngs.includes(lang)) {
        console.warn(`Unsupported language: ${lang}`);
        return;
      }

      await i18n.changeLanguage(lang);

      document.body.dir = i18n.dir();

      localStorage.setItem("selectedLanguage", lang);
      
      setCurrentLang(lang);

    } catch (error) {
      console.error("Language change error:", error);
    }
  }, []);

  return { currentLang, isPersian, changeLanguage };
}
