import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es",
    debug: true,
    supportedLngs: ["en", "es"],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          abono: {
            title: "Transport Card",
            subtitle: "Pass",
            zone: "Zone",
            recharge: "Recharge Date",
            expire: "Expiration Date",
            left: "Remaining Trips",
            firstUseLimit: "First Use Limit Date",
            number: "Card Number",
            activation: "Activation",
            finish: "Expiration",
            locked: "This card is locked",
            unlocked: "This card is not locked",
            hint: "Place your transport card near the phone to check the data",
            errors: {
              read: "There was an error reading the card",
              unsupported: "This card is not supported",
            },
          },
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
            download: {
              title: "Android App",
              button: "Download APK",
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
          favorites: {
            title: "Favorite Stops",
            delete: "Delete _name_ from favorites",
            delete2: "Delete from favorites",
            cancel: "Cancel",
            confirm: "Confirm",
            save: {
              title: "Add to favorites",
              subtitle: "Enter a name to save it.",
              label: "Name",
            },
          },
          settings: {
            loadData: {
              updating: "Updating stops and lines",
              success: "The data has been successfully updated.",
              error: "There has been an error. Restart the application.",
            },
            name: "Settings",
            language: "Language",
            theme: "Light Theme",
            timesDisplay: "Times in minutes",
            updateData: "Update data",
            moreInfo: "More information",
          },
          map: {
            check: "Check stop",
          },
          stops: {
            search: {
              title: "Search Stops",
              label: "Code, stop name or line",
              placeholder: "For example: Atocha",
              stops: "Stops",
              lines: "Lines",
              notFound: "There are no stops or lines with code or name ",
              trains: {
                origin: "Origin: ",
              },
            },
            buttons: {
              staticMap: "Network maps",
              map: "Map",
              nearest: "Nearest stop",
            },
          },
          lines: {
            rute: "Rute",
            to: "To",
            see: "See in map",
            errors: {
              notFound: "The specified line was not found",
              lines: "Error getting the location",
            },
          },
          other: {
            pageNotFound: "Page not found",
            errors: {
              allStops: "Error getting the stops",
              allLines: "Error getting the lines",
              alerts: "Error getting the alerts",
              alertsNotTranslated:
                "The CRTM doesn't provide a translation for alerts, sorry for the inconvenience.",
            },
          },
          subscriptions: {
            title: "Subscriptions",
            errors: {
              subscription: "Error getting the subscriptions",
              unsubscription: "Error unsubscribing",
              limit: "You cannot subscribe to more stops",
            },
          },
          times: {
            affected: "Affected",
            accessibility: "Accessible",
            zone: "Zone",
            alerts: "Alerts",
            platform: "Platform",
            plannedAlert:
              "These times are planned and may not match the actual arrival time.",
            seePlanned: "See planned times",
            seeLive: "See live times",
            noTimes: "No waiting times",
            noPlannedTimes: "No planned times",
            trainsPlanned: {
              line: "Line",
              arrive: "Arrival Time",
              departure: "Departure Time",
              transfer: "Transfer at",
              show: "Show all",
            },
            errors: {
              notFound: "The stop does not exist",
              times: "Error getting the times",
              loading: "Error loading the stop",
              down: "Cannot retrieve the times",
            },
          },
          navbar: {
            search: "Search",
            map: "Map",
            settings: "Settings",
            travelPass: "Travel pass",
          },
        },
      },
      es: {
        translation: {
          abono: {
            title: "Tarjeta Transporte",
            subtitle: "Abono",
            zone: "Zona",
            recharge: "Fecha recarga",
            expire: "Fecha expiración",
            left: "Viajes restantes",
            firstUseLimit: "Fecha limite primer uso",
            number: "Numero tarjeta",
            activation: "Alta",
            finish: "Vencimiento",
            locked: "Esta tarjeta esta bloqueada",
            unlocked: "Esta tarjeta no esta bloqueada",
            hint: "Acerca tu tarjeta transporte al telefono para consultar los datos",
            errors: {
              read: "Ha habido un error al leer la tarjeta",
              unsuppported: "Esta tarjeta no es soportada",
            },
          },
          moreInfo: {
            about: {
              title: "Sobre este proyecto",
              body: "Este proyecto no esta afiliado a ninguna empresa de transporte publico, ni a ninguna empresa de desarrollo de software.",
            },
            extraction: {
              title: "Extraccion de datos",
              body: "Todos los datos se extraen de Metro de Madrid, EMT Madrid, Renfe y CRTM.",
            },
            download: {
              title: "Aplicacion Android",
              button: "Descargar APK",
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
          favorites: {
            title: "Paradas Favoritas",
            delete: "Borrar _name_ de favoritos",
            delete2: "Borrar de favoritos",
            cancel: "Cancelar",
            confirm: "Confirmar",
            save: {
              title: "Añadir a favoritos",
              subtitle: "Pon un nombre para guardarlo.",
              label: "Nombre",
            },
          },
          settings: {
            loadData: {
              updating: "Actualizando paradas y lineas",
              success: "Los datos han sido actualizadas correctamente.",
              error: "Ha habido un error. Reinicia la aplicacion.",
            },
            name: "Ajustes",
            language: "Idioma",
            theme: "Modo claro",
            timesDisplay: "Tiempo en minutos",
            updateData: "Actualizar datos",
            moreInfo: "Mas informacion",
          },
          map: {
            check: "Consultar parada",
          },
          stops: {
            search: {
              title: "Buscar Paradas",
              label: "Codigo, nombre de la parada o linea",
              placeholder: "Por ejemplo: Atocha",
              stops: "Paradas",
              lines: "Lineas",
              notFound: "No hay paradas o lineas con nombre o codigo ",
              trains: {
                origin: "Origen: ",
              },
            },
            buttons: {
              staticMap: "Planos",
              map: "Mapa",
              nearest: "Parada mas cercana",
            },
          },
          lines: {
            rute: "Ruta",
            to: "Hacia",
            see: "Ver en el mapa",
            errors: {
              notFound: "No se ha encontrado la linea especificada",
              lines: "Error al obtener la localizacion",
            },
          },
          other: {
            pageNotFound: "Pagina no encontrada",
            errors: {
              allStops: "Error al obtener las paradas",
              allLines: "Error al obtener las lineas",
              alerts: "Error al obtener las alertas",
            },
          },
          subscriptions: {
            title: "Suscripciones",
            errors: {
              subscription: "Error al obtener las suscripciones",
              unsubscription: "Error al desuscribirse",
              limit: "No puede suscribirse a más paradas",
            },
          },
          times: {
            affected: "Afectada",
            accessibility: "Accesible",
            zone: "Zona",
            alerts: "Avisos",
            platform: "Anden",
            plannedAlert:
              "Estos tiempos son planificados y pueden no corresponder con la hora de llegada real.",
            seePlanned: "Ver tiempos planificados",
            seeLive: "Ver tiempos en directo",
            noTimes: "No hay tiempos de espera",
            noPlannedTimes: "No hay tiempos planeados",
            trainsPlanned: {
              line: "Linea",
              arrive: "Hora de llegada",
              departure: "Hora de salida",
              transfer: "Transbordo en",
              show: "Mostrar todos",
            },
            errors: {
              notFound: "La parada no existe",
              times: "Error al obtener los tiempos",
              loading: "Error al cargar la parada",
              down: "No se pueden recuperar los tiempos",
            },
          },
          navbar: {
            search: "Buscar",
            map: "Mapa",
            settings: "Ajustes",
          },
        },
      },
    },
  });

export default i18n;
