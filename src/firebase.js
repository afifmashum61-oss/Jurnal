import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase resmi untuk MA Darussalam Sengon / Jurnal Web
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBLDHGMUhtg49_J1ZrIfCmH_OEEJTBrpaM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jurnal-2b42d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jurnal-2b42d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jurnal-2b42d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "907672932005",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:907672932005:web:a9dc09973b0d823359c74c"
};

export const isFirebaseConfigured = () => true;

let app = null;
let db = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("🔥 Firebase Cloud Firestore terhubung secara live ke projek jurnal-2b42d!");
} catch (error) {
  console.warn("Koneksi Firebase gagal, beralih ke LocalStorage fallback:", error);
}

export { db };
