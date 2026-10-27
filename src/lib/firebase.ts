import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Same Firebase project as the legacy Angular portal (amniportal), so v2 shares
// users, profiles and every module's collections with it during the migration.
// Firebase web config is public by design; env vars allow pointing a deployment
// at another project without a code change.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD48AKNgkTbBb0In2YLxL-88Z8H8zhhAm0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "amniportal.firebaseapp.com",
  databaseURL: "https://amniportal.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "amniportal",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "amniportal.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "108531264682",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:108531264682:web:c65baed49bbd1803fd74d3",
  measurementId: "G-05R032YM5Q",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
