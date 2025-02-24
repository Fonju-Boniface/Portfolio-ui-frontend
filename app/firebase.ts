// firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getDatabase, Database } from "firebase/database";
import "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADdNv3Qn-6OOWvKnLIAhgvxg4XnlvBg2U",
  authDomain: "locked-portfolio-ui.firebaseapp.com",
  projectId: "locked-portfolio-ui",
  storageBucket: "locked-portfolio-ui.firebasestorage.app",
  messagingSenderId: "52649041761",
  appId: "1:52649041761:web:1e65cd68e1ee9414e86f20",
  measurementId: "G-2GSYFC69MK"

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
