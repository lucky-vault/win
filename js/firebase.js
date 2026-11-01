import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBssEUk-mnino0IZMID9o7O1CR26YE00Rk",
  authDomain: "lucky-vaultwin.firebaseapp.com",
  projectId: "lucky-vaultwin",
  storageBucket: "lucky-vaultwin.firebasestorage.app",
  messagingSenderId: "1005208085522",
  appId: "1:1005208085522:web:463f4270070b59e68ce4cb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;