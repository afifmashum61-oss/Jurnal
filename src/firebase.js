import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase dari Firebase Console (https://console.firebase.google.com)
// Variabel ini otomatis membaca Vercel Environment Variables di produksi
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jurnal-guru-darussalam.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jurnal-guru-darussalam",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jurnal-guru-darussalam.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123def"
};

let app = null;
let db = null;

// Cek apakah API key sudah diisi
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY";
};

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase Cloud Firestore terhubung secara live!");
  } else {
    console.log("📦 Mode LocalStorage Aktif (Isi firebaseConfig untuk sinkronisasi Cloud Firestore).");
  }
} catch (error) {
  console.warn("Koneksi Firebase gagal, beralih ke LocalStorage fallback:", error);
}

export { db };
