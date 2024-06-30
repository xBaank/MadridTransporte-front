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
          moreInfo: {
            about: {
              title: "About this project",
              body: "This project is not affiliated with any public transport company or any software development company.",
            },
            extraction: {
              title: "Data extraction",
              body: "All data is extracted from Metro de Madrid, EMT Madrid, Renfe, and CRTM.",
            },
            problems: {
              title: "Problems",
              button: "Report",
            },
            sourceCode: {
              title: "Source Code",
              button: "View source code",
            },
            icons: {
              title: "Icons",
              notification: "Notification with the remaining time every minute",
              map: "View stop on the map",
              accessibility: "Accessible stop",
              location: "Bus location on the map",
              incident: "Stop affected by an incident",
              favorites: "Add to favorites",
              delete: "Remove from favorites",
            },
          },
          settings: {
            name: "Settings",
            language: "Language",
            theme: "Light Theme",
            timesDisplay: "Times in minutes",
            updateData: "Update data",
            moreInfo: "More information",
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
          moreInfo: {
            about: {
              title: "Sobre este proyecto",
              body: "Este proyecto no esta afiliado a ninguna empresa de transporte publico, ni a ninguna empresa de desarrollo de software.",
            },
            extraction: {
              title: "Extraccion de datos",
              body: "Todos los datos se extraen de Metro de Madrid, EMT Madrid, Renfe y CRTM.",
            },
            problems: {
              title: "Problemas",
              button: "Reportar",
            },
            sourceCode: {
              title: "Codigo Fuente",
              button: "Ver codigo fuente",
            },
            icons: {
              title: "Iconos",
              notification: "Notificacion con el tiempo restante cada minuto",
              map: "Ver parada en el mapa",
              accessibility: "Parada accesible",
              location: "Ubicacion del autobus en el mapa",
              incident: "Parada afectada por incidencia",
              favorites: "Añadir a favoritos",
              delete: "Borrar de favoritos",
            },
          },
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
