/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
addEventListener("notificationclick", (event) => {
    const data = event.notification.data;
    event.notification.close();
    const urlToOpen = new URL(`/stop/${data.stopId}`, self.location.origin).href;
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
    const notificationTitle = `Parada ${stopTime.stopName}`;
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png',
        data: stopTime
    };

    self.registration.showNotification(notificationTitle, notificationOptions);

});