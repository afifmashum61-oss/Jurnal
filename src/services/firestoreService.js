import { db, isFirebaseConfigured } from "../firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";

// Collection Names
const COL_JURNAL = "jurnal_harian";
const COL_CATATAN = "catatan_siswa";
const COL_PROFIL = "profil_guru";

/**
 * Real-time listener untuk Jurnal Harian Mengajar
 */
export const subscribeJurnal = (onUpdate) => {
  if (!isFirebaseConfigured() || !db) return null;

  try {
    const colRef = collection(db, COL_JURNAL);
    return onSnapshot(colRef, (snapshot) => {
      const journals = [];
      snapshot.forEach((doc) => {
        journals.push({ ...doc.data(), id: doc.id });
      });
      onUpdate(journals);
    });
  } catch (error) {
    console.error("Gagal berlangganan Firestore Jurnal:", error);
    return null;
  }
};

/**
 * Simpan atau perbarui entri Jurnal ke Firestore
 */
export const saveJurnalToFirestore = async (jurnalItem) => {
  if (!isFirebaseConfigured() || !db) return;
  try {
    const docRef = doc(db, COL_JURNAL, jurnalItem.id);
    await setDoc(docRef, jurnalItem, { merge: true });
    console.log("🔥 Jurnal tersimpan di Cloud Firestore:", jurnalItem.id);
  } catch (error) {
    console.error("Gagal menyimpan ke Firestore:", error);
  }
};

/**
 * Hapus entri Jurnal dari Firestore
 */
export const deleteJurnalFromFirestore = async (jurnalId) => {
  if (!isFirebaseConfigured() || !db) return;
  try {
    await deleteDoc(doc(db, COL_JURNAL, jurnalId));
    console.log("🔥 Jurnal terhapus dari Cloud Firestore:", jurnalId);
  } catch (error) {
    console.error("Gagal menghapus dari Firestore:", error);
  }
};

/**
 * Simpan Profil Guru & Sekolah ke Firestore
 */
export const saveProfilToFirestore = async (profilData) => {
  if (!isFirebaseConfigured() || !db) return;
  try {
    await setDoc(doc(db, COL_PROFIL, "utama"), profilData);
    console.log("🔥 Profil tersimpan di Cloud Firestore");
  } catch (error) {
    console.error("Gagal menyimpan profil ke Firestore:", error);
  }
};
