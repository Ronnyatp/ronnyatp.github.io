import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUxAFr7MnsFIuV4IPsaqL1zm888axc74o",
  authDomain: "pokernight-b9512.firebaseapp.com",
  projectId: "pokernight-b9512",
  storageBucket: "pokernight-b9512.appspot.com",
  messagingSenderId: "662098273299",
  appId: "1:662098273299:web:55a1081645826d81d2cbe6",
  measurementId: "G-HF6LP2M0C1",
  databaseURL: "https://pokernight-b9512-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
