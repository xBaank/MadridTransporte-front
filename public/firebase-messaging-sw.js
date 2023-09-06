/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

const metroCodMode = 4;
const trainCodMode = 5;
const emtCodMode = 6;
const busCodMode = 8;
const metroLigeroCodMode = 10;

function getStopTimesLinkByMode(codMode, stopCode, originCode) {
    if (codMode === metroCodMode) return `#/stops/metro/${stopCode}/times`;
    if (codMode === metroLigeroCodMode) return `#/stops/tram/${stopCode}/times`;
    if (codMode === trainCodMode) return originCode === null ? `#/stops/train/${stopCode}/destination` : `/stops/train/times/?origin=${originCode}&destination=${stopCode}`;
    if (codMode === emtCodMode) return `#/stops/emt/${stopCode}/times`;
    if (codMode === busCodMode) return `#/stops/bus/${stopCode}/times`;
    return "#"
}

function getIconByCodMode(codMode) {
    if (codMode === metroCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/metro.png";
    if (codMode === trainCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/train.png";
    if (codMode === emtCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/emt.png";
    if (codMode === busCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/interurban.png";
    if (codMode === metroLigeroCodMode) return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/metro_ligero.png";
    return "https://raw.githubusercontent.com/xBaank/bus-tracker-static/main/icons/interurban.png"
}


addEventListener("notificationclick", (event) => {
    const data = event.notification.data;
    event.notification.close();
    const urlToOpen = new URL(getStopTimesLinkByMode(data.codMode, data.simpleStopCode.toString()), self.location.origin).href;
    event.waitUntil(
        clients
            .matchAll({
                type: "window",
            })
            .then((clientList) => {
                if (clients.openWindow) return clients.openWindow(urlToOpen);
            }),
    );

});

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


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
    measurementId: "G-E9RR9MY2TL"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    const stopTime = JSON.parse(payload.data.stopTimes);
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        stopTime
    );
    // Customize notification here
    const notificationTitle = `Parada ${stopTime.stopName} - ${stopTime.arrives[0].line}`;
    const notificationOptions = {
        body: `${new Date(stopTime.arrives[0].estimatedArrives[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${stopTime.arrives[0].destination}`,
        icon: getIconByCodMode(stopTime.codMode),
        data: stopTime,
        tag: stopTime.stopCode + stopTime.arrives[0].line + stopTime.arrives[0].destination,
        renotify: true
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});