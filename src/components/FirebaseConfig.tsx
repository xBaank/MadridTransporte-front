import { initializeApp } from "firebase/app";

export const firebaseApp = getFirebaseApp()

function getFirebaseApp() {
    const firebaseConfig = {
        apiKey: "AIzaSyCGbQIXvZnm7yJWCD0nTC0_sJYMv698hkg",
        authDomain: "bustracker-dev.firebaseapp.com",
        projectId: "bustracker-dev",
        storageBucket: "bustracker-dev.appspot.com",
        messagingSenderId: "79652901486",
        appId: "1:79652901486:web:c5785d18e787d1fb614c7f",
        measurementId: "G-E9RR9MY2TL"
    };
    return initializeApp(firebaseConfig)
}