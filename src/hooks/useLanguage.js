import { useState, useEffect, useCallback } from "react";
import i18n from "../i18n/i18n";

export default function useLanguage() {
  const [currentLang, setCurrentLang] = useState(i18n.language || "fa");

  const isPersian = currentLang === "fa";
  const isRtl = i18n.dir(currentLang) === "rtl";

  const changeLanguage = useCallback(async (lang) => {
    try {
      if (typeof lang !== "string" || !lang.trim()) {
        console.warn("Cannot change to an invalid language code:", lang);
        return;
      }

      await i18n.changeLanguage(lang);

      document.body.dir = i18n.dir();
      document.documentElement.lang = lang;

      localStorage.setItem("selectedLanguage", lang);
      setCurrentLang(lang);
    } catch (error) {
      console.error("Language change error:", error);
    }
  }, []);

  useEffect(() => {
    const updateDocumentLanguage = (language) => {
      document.body.dir = i18n.dir(language);
      document.documentElement.lang = language;
      setCurrentLang(language);
    };

    updateDocumentLanguage(i18n.language || "fa");
    i18n.on("languageChanged", updateDocumentLanguage);

    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang && savedLang !== i18n.language) {
      changeLanguage(savedLang);
    }

    return () => i18n.off("languageChanged", updateDocumentLanguage);
  }, [changeLanguage]);

  return { currentLang, isPersian, isRtl, changeLanguage };
}
