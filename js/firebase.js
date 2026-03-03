// Firebase Configuration for CodeQuiz
// Replace the values below with YOUR Firebase project config.
// Get it from: Firebase Console → Project Settings → General → Your Apps → Web App

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC41_GzeC0TLGIat94gD4Zm_bwfXduPa8Y",
  authDomain: "codequiz-a7c90.firebaseapp.com",
  projectId: "codequiz-a7c90",
  storageBucket: "codequiz-a7c90.firebasestorage.app",
  messagingSenderId: "794731231600",
  appId: "1:794731231600:web:7830829d78b8b6ec0577b5",
  measurementId: "G-6274MY1MN0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
