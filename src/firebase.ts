import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAEro_B2A7_D-Bsm_Z7oncgcYObSq0TwTs",
    authDomain: "student-time-management-25256.firebaseapp.com",
    projectId: "student-time-management-25256",
    storageBucket: "student-time-management-25256.firebasestorage.app",
    messagingSenderId: "969808470482",
    appId: "1:969808470482:web:2ee9d4acb080e2fad5280b",
    measurementId: "G-S5QQPGJPJD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);