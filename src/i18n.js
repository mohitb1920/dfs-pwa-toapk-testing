import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { enTranslations } from "./locales/en/translation";
import { hindiTranslations } from "./locales/hindi/translation";
import { getCurrentLanguage } from "./components/Utils";

i18n.use(initReactI18next).init({
  debug: false,
  lng: getCurrentLanguage(), // Default language
  fallbackLng: "en_IN",
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources: {
    en_IN: {
      translation: enTranslations,
    },
    hi_IN: {
      translation: hindiTranslations,
    },
  },
});

export default i18n;
