import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";

export const savedLanguage = () => {
  let lan = localStorage.getItem("language");
  if (lan === null) lan = saveLanguage("es");
  return lan;
};

export const saveLanguage = (lan: string) => {
  localStorage.setItem("language", lan);
  i18n.changeLanguage(lan);
  return lan;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es",
    debug: true,
    supportedLngs: ["en", "es"],
    lng: savedLanguage(),
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          settings: {
            name: "Settings",
            language: "Language",
            theme: "Light theme",
            timesDisplay: "Time in minutes",
            updateData: "Update data",
            moreInfo: "More info",
          },
          times: {
            affected: "Affected",
            accessibility: "Accessible",
            zone: "Zone",
            alerts: "Alerts",
            platform: "Platform",
          },
        },
      },
      es: {
        translation: {
          settings: {
            name: "Ajustes",
            language: "Idioma",
            theme: "Modo claro",
            timesDisplay: "Tiempo en minutos",
            updateData: "Actualizar datos",
            moreInfo: "Mas informacion",
          },
          times: {
            affected: "Afectada",
            accessibility: "Accesible",
            zone: "Zona",
            alerts: "Avisos",
            platform: "Anden",
          },
        },
      },
    },
  });

export default i18n;
