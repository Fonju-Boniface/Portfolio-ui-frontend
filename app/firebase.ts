// firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getDatabase, Database } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1tDESeNbmynIOO4hxBQ1huAR_Hfl8qnk",
  authDomain: "full-portfolio-131da.firebaseapp.com",
  projectId: "full-portfolio-131da",
  storageBucket: "full-portfolio-131da.appspot.com",
  messagingSenderId: "872997496049",
  appId: "1:872997496049:web:271d0868b96f9a6065f550",
  measurementId: "G-BXHW2B382Y",
  databaseURL: "https://full-portfolio-131da-default-rtdb.firebaseio.com", // Add this for Realtime Database
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | undefined = undefined;
let database: Database;

if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);

  if ("measurementId" in firebaseConfig) {
    analytics = getAnalytics(app);
  }

  // Initialize Realtime Database
  database = getDatabase(app);
}

export { app, analytics, database };
