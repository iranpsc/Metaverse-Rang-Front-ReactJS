// Suitable for: i18n setup with a custom backend that loads translations from the admin API and caches them in localStorage.
// Used in: app entry (imported once, e.g. in main.jsx).
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";
const isDevelopment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.startsWith("dev-");
const TRANSLATIONS_API = isDevelopment
  ? "https://dev-admin.metarang.com/api/translations?active=true"
  : "https://admin.metarang.com/api/translations?active=true";

const CACHE_PREFIX = "i18n_cache_";
const META_KEY = `${CACHE_PREFIX}meta`;

let languagesMeta = [];
const languageMetaListeners = new Set();

export const getLanguagesMeta = () => languagesMeta;

export const subscribeLanguagesMeta = (listener) => {
  languageMetaListeners.add(listener);
  return () => languageMetaListeners.delete(listener);
};

const setLanguagesMeta = (list) => {
  languagesMeta = list;
  languageMetaListeners.forEach((listener) => listener());
};

const readJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

const normalizeTranslations = (payload) => {
  if (!payload || typeof payload !== "object") return {};
  if (payload.modals || payload.translation?.modals) return payload;
  if (
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
  ) {
    return payload.data;
  }
  return payload;
};

const customBackend = {
  type: "backend",
  init: () => {},

  read: async (language, namespace, callback) => {
    const cacheKey = `${CACHE_PREFIX}${language}`;
    const versionKey = `${cacheKey}_version`;

    const cachedTranslations = readJSON(cacheKey);
    const cachedMeta = readJSON(META_KEY);
    const hasCache = Boolean(cachedTranslations && cachedMeta);

    // serve from cache immediately, no waiting for the network
    if (hasCache) {
      setLanguagesMeta(cachedMeta);
      callback(null, cachedTranslations);
    }

    try {
      const { data } = await axios.get(TRANSLATIONS_API);
      const metaList = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

      setLanguagesMeta(metaList);
      localStorage.setItem(META_KEY, JSON.stringify(metaList));

      const langInfo = metaList.find((lang) => lang.code === language);
      if (!langInfo) throw new Error(`Language ${language} not found`);

      // cache is up to date
      if (
        hasCache &&
        localStorage.getItem(versionKey) === String(langInfo.version)
      )
        return;

      const response = await axios.get(langInfo.file_url);
      const translations = normalizeTranslations(response.data);

      localStorage.setItem(cacheKey, JSON.stringify(translations));
      localStorage.setItem(versionKey, String(langInfo.version));

      if (hasCache) {
        // new version arrived: swap it in without a reload
        i18n.addResourceBundle(language, namespace, translations, true, true);
      } else {
        callback(null, translations);
      }
    } catch (error) {
      console.error("Error loading translations:", error);
      if (!hasCache) callback(error, null);
    }
  },
};

i18n
  .use(customBackend)
  .use(initReactI18next)
  .init({
    supportedLngs: false,
    fallbackLng: "fa",
    react: {
      useSuspense: true,
      bindI18nStore: "added", // re-render when a new version is swapped in
    },
  });

export default i18n;
