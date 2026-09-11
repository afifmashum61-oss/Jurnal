import { db, isFirebaseConfigured } from "../firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";

// Collection Names
const COL_JURNAL = "jurnal_harian";
const COL_CATATAN = "catatan_siswa";
const COL_JADWAL = "jadwal_mengajar";
const COL_KELAS = "daftar_kelas";
const COL_SISWA = "daftar_siswa";
const COL_PROFIL = "profil_guru";

/**
 * --- JURNAL HARIAN ---
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
    }, (error) => {
      console.warn("⚠️ Firestore Listener Error (Jurnal):", error.message);
    });
  } catch (error) {
    console.error("Gagal berlangganan Firestore Jurnal:", error);
    return null;
  }
};

export const saveJurnalToFirestore = async (jurnalItem) => {
  if (!isFirebaseConfigured() || !db) return false;
  try {
    const docRef = doc(db, COL_JURNAL, String(jurnalItem.id));
    await setDoc(docRef, jurnalItem, { merge: true });
    console.log("🔥 Jurnal tersimpan di Cloud Firestore:", jurnalItem.id);
    return true;
  } catch (error) {
    console.error("❌ Gagal menyimpan Jurnal ke Firestore:", error);
    return false;
  }
};

export const deleteJurnalFromFirestore = async (jurnalId) => {
  if (!isFirebaseConfigured() || !db) return false;
  try {
    await deleteDoc(doc(db, COL_JURNAL, String(jurnalId)));
    console.log("🔥 Jurnal terhapus dari Cloud Firestore:", jurnalId);
    return true;
  } catch (error) {
    console.error("❌ Gagal menghapus Jurnal dari Firestore:", error);
    return false;
  }
};

/**
 * --- CATATAN SISWA ---
 */
export const subscribeCatatan = (onUpdate) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const colRef = collection(db, COL_CATATAN);
    return onSnapshot(colRef, (snapshot) => {
      const catatans = [];
      snapshot.forEach((doc) => {
        catatans.push({ ...doc.data(), id: doc.id });
      });
      onUpdate(catatans);
    }, (error) => {
      console.warn("⚠️ Firestore Listener Error (Catatan):", error.message);
    });
  } catch (error) {
    console.error("Gagal berlangganan Firestore Catatan:", error);
    return null;
  }
};

export const saveCatatanToFirestore = async (catatanItem) => {
  if (!isFirebaseConfigured() || !db) return false;
  try {
    const docRef = doc(db, COL_CATATAN, String(catatanItem.id));
    await setDoc(docRef, catatanItem, { merge: true });
    console.log("🔥 Catatan tersimpan di Cloud Firestore:", catatanItem.id);
    return true;
  } catch (error) {
    console.error("❌ Gagal menyimpan Catatan ke Firestore:", error);
    return false;
  }
};

export const deleteCatatanFromFirestore = async (catatanId) => {
  if (!isFirebaseConfigured() || !db) return false;
  try {
    await deleteDoc(doc(db, COL_CATATAN, String(catatanId)));
    console.log("🔥 Catatan terhapus dari Cloud Firestore:", catatanId);
    return true;
  } catch (error) {
    console.error("❌ Gagal menghapus Catatan dari Firestore:", error);
    return false;
  }
};

/**
 * --- PROFIL GURU & SEKOLAH ---
 */
export const subscribeProfil = (onUpdate) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, COL_PROFIL, "utama");
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data());
      }
    }, (error) => {
      console.warn("⚠️ Firestore Listener Error (Profil):", error.message);
    });
  } catch (error) {
    console.error("Gagal berlangganan Firestore Profil:", error);
    return null;
  }
};

export const saveProfilToFirestore = async (profilData) => {
  if (!isFirebaseConfigured() || !db) return false;
  try {
    await setDoc(doc(db, COL_PROFIL, "utama"), profilData, { merge: true });
    console.log("🔥 Profil tersimpan di Cloud Firestore");
    return true;
  } catch (error) {
    console.error("❌ Gagal menyimpan profil ke Firestore:", error);
    return false;
  }
};

/**
 * --- JADWAL MENGAJAR ---
 */
export const saveJadwalToFirestore = async (jadwalList) => {
  if (!isFirebaseConfigured() || !db) return false;
  try {
    await setDoc(doc(db, COL_JADWAL, "utama"), { list: jadwalList }, { merge: true });
    console.log("🔥 Jadwal tersimpan di Cloud Firestore");
    return true;
  } catch (error) {
    console.error("❌ Gagal menyimpan Jadwal ke Firestore:", error);
    return false;
  }
};

export const subscribeJadwal = (onUpdate) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, COL_JADWAL, "utama");
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data()?.list) {
        onUpdate(docSnap.data().list);
      }
    }, (error) => {
      console.warn("⚠️ Firestore Listener Error (Jadwal):", error.message);
    });
  } catch (error) {
    console.error("Gagal berlangganan Firestore Jadwal:", error);
    return null;
  }
};

/**
 * --- DAFTAR KELAS & SISWA ---
 */
export const saveKelasToFirestore = async (kelasList) => {
  if (!isFirebaseConfigured() || !db) return false;
  try {
    await setDoc(doc(db, COL_KELAS, "utama"), { list: kelasList }, { merge: true });
    return true;
  } catch (error) {
    console.error("❌ Gagal menyimpan Kelas ke Firestore:", error);
    return false;
  }
};

export const subscribeKelas = (onUpdate) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, COL_KELAS, "utama");
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data()?.list) {
        onUpdate(docSnap.data().list);
      }
    }, (error) => {
      console.warn("⚠️ Firestore Listener Error (Kelas):", error.message);
    });
  } catch (error) {
    return null;
  }
};

export const saveSiswaToFirestore = async (siswaMap) => {
  if (!isFirebaseConfigured() || !db) return false;
  try {
    await setDoc(doc(db, COL_SISWA, "utama"), { map: siswaMap }, { merge: true });
    return true;
  } catch (error) {
    console.error("❌ Gagal menyimpan Siswa ke Firestore:", error);
    return false;
  }
};

export const subscribeSiswa = (onUpdate) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, COL_SISWA, "utama");
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data()?.map) {
        onUpdate(docSnap.data().map);
      }
    }, (error) => {
      console.warn("⚠️ Firestore Listener Error (Siswa):", error.message);
    });
  } catch (error) {
    return null;
  }
};
