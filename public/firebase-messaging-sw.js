/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

//Sadly, react have poor support for service workers when working with create-react-app, I couldn't find a way to make it work in localhost whit ts.

const metroCodMode = 4;
const trainCodMode = 5;
const emtCodMode = 6;
const busCodMode = 8;
const metroLigeroCodMode = 10;

function getStopTimesLinkByMode(codMode, stopCode, originCode) {
  if (codMode === trainCodMode && originCode != null)
    return originCode === null
      ? `/stops/train/${stopCode}/destination`
      : `/stops/train/times/?origin=${originCode}&destination=${stopCode}`;

  if (codMode === metroCodMode) return `/stops/metro/${stopCode}/times`;
  if (codMode === metroLigeroCodMode) return `/stops/tram/${stopCode}/times`;
  if (codMode === trainCodMode) return `/stops/train/${stopCode}/times`;
  if (codMode === emtCodMode) return `/stops/emt/${stopCode}/times`;
  if (codMode === busCodMode) return `/stops/bus/${stopCode}/times`;
  return "#";
}

function getIconByCodMode(codMode) {
  if (codMode === metroCodMode) return "/icons/metro.png";
  if (codMode === trainCodMode) return "/icons/train.png";
  if (codMode === emtCodMode) return "/icons/emt.png";
  if (codMode === busCodMode) return "/icons/interurban.png";
  if (codMode === metroLigeroCodMode) return "/icons/metro_ligero.png";
  return "/icons/interurban.png";
}

addEventListener("notificationclick", event => {
  const data = event.notification.data;
  event.notification.close();
  const urlToOpen = new URL(
    getStopTimesLinkByMode(data.codMode, data.simpleStopCode.toString()),
    self.location.origin,
  ).href;
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then(clientList => {
        if (clients.openWindow) return clients.openWindow(urlToOpen);
      }),
  );
});

importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js",
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCGbQIXvZnm7yJWCD0nTC0_sJYMv698hkg",
  authDomain: "bustracker-dev.firebaseapp.com",
  projectId: "bustracker-dev",
  storageBucket: "bustracker-dev.appspot.com",
  messagingSenderId: "79652901486",
  appId: "1:79652901486:web:c5785d18e787d1fb614c7f",
  measurementId: "G-E9RR9MY2TL",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
  const stopTime = JSON.parse(payload.data.stopTimes);
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    stopTime,
  );
  // Customize notification here
  const notifications = stopTime.arrives.map(arrive => {
    const notificationTitle = `Parada ${stopTime.stopName} - ${arrive.line}`;
    const anden = arrive.anden === null ? "" : `Andén ${arrive.anden} - `;
    const minutes = Math.floor(
      (new Date(arrive.estimatedArrives[0]).getTime() - new Date().getTime()) /
      60000,
    );
    //check if minutes is less than 100
    const notificationOptions = {
      body: `${new Date(arrive.estimatedArrives[0]).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} ${minutes < 100 ? `(${minutes} min)` : ""} - ${anden} ${arrive.destination
        }`,
      icon: getIconByCodMode(arrive.codMode),
      data: stopTime,
      tag: stopTime.stopCode + arrive.line + arrive.destination,
      renotify: true,
    };
    return { notificationTitle, notificationOptions };
  });

  notifications.forEach(notification =>
    self.registration.showNotification(
      notification.notificationTitle,
      notification.notificationOptions,
    ),
  );
});
