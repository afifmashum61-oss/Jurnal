import React, { useState, useEffect } from 'react';
import SidebarNav from './components/SidebarNav';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import JurnalHarian from './components/JurnalHarian';
import JadwalMengajar from './components/JadwalMengajar';
import PresensiSiswa from './components/PresensiSiswa';
import CatatanSiswa from './components/CatatanSiswa';
import CetakLaporan from './components/CetakLaporan';
import PengaturanSekolah from './components/PengaturanSekolah';

import { CheckCircle2, X } from 'lucide-react';
import { 
  initialProfilGuru, 
  initialKelas, 
  initialSiswa, 
  initialJadwal, 
  initialJurnal, 
  initialCatatanSiswa 
} from './data/initialData';

import { 
  subscribeJurnal, 
  saveJurnalToFirestore, 
  deleteJurnalFromFirestore, 
  saveProfilToFirestore 
} from './services/firestoreService';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Global Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', title: 'Berhasil Disimpan' });

  const showToast = (message, title = 'Berhasil Disimpan') => {
    setToast({ show: true, message, title });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // App Master Data States (Persisted in LocalStorage)
  const [profilGuru, setProfilGuru] = useState(() => {
    const targetMapel = ["Bahasa Arab", "Sejarah Kebudayaan Islam (SKI)"];
    const saved = localStorage.getItem('jpg_profilGuru');
    let data = saved ? JSON.parse(saved) : { ...initialProfilGuru };

    // Force overwrite legacy/cached values
    data.nama = 'IVA MAKHMUDAH, S.Pd';
    data.nip = 'PEG ID 20503856195003';
    data.sekolah = 'MA Darussalam Sengon';
    if (!data.kota || data.kota === 'Kota Edukasi') data.kota = 'Jombang';
    if (!data.alamatSekolah || data.alamatSekolah.includes('Kota Edukasi') || data.alamatSekolah.includes('Pendidikan')) {
      data.alamatSekolah = 'Jl. Darussalam No. 01, Sengon, Jombang';
    }
    if (!data.kepalaSekolah || data.kepalaSekolah.includes('Ahmad Dahlan') || data.kepalaSekolah.includes('Bambang Gunawan')) {
      data.kepalaSekolah = 'Dr. Achmad Junaidi, S.Si, M.S.I';
    }
    if (!data.nipKepalaSekolah || data.nipKepalaSekolah.startsWith('19')) {
      data.nipKepalaSekolah = '-';
    }
    if (!data.mataPelajaran || !data.mataPelajaran.includes('Bahasa Arab')) {
      data.mataPelajaran = targetMapel;
    }

    localStorage.setItem('jpg_profilGuru', JSON.stringify(data));
    return data;
  });

  const [kelasList, setKelasList] = useState(() => {
    const saved = localStorage.getItem('jpg_kelasList');
    return saved ? JSON.parse(saved) : initialKelas;
  });

  const [siswaList, setSiswaList] = useState(() => {
    const saved = localStorage.getItem('jpg_siswaList');
    return saved ? JSON.parse(saved) : initialSiswa;
  });

  const [jadwalList, setJadwalList] = useState(() => {
    const saved = localStorage.getItem('jpg_jadwalList');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.some(j => j.mapel === 'Matematika' || j.mapel === 'Informatika')) {
        localStorage.setItem('jpg_jadwalList', JSON.stringify(initialJadwal));
        return initialJadwal;
      }
      return parsed;
    }
    return initialJadwal;
  });

  const [jurnalList, setJurnalList] = useState(() => {
    const saved = localStorage.getItem('jpg_jurnalList');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.some(j => j.mapel === 'Matematika' || j.mapel === 'Informatika')) {
        localStorage.setItem('jpg_jurnalList', JSON.stringify(initialJurnal));
        return initialJurnal;
      }
      return parsed;
    }
    return initialJurnal;
  });

  const [catatanList, setCatatanList] = useState(() => {
    const saved = localStorage.getItem('jpg_catatanList');
    return saved ? JSON.parse(saved) : initialCatatanSiswa;
  });

  // Modal Controllers
  const [isJurnalFormOpen, setIsJurnalFormOpen] = useState(false);
  const [selectedJurnalForDetail, setSelectedJurnalForDetail] = useState(null);

  // Sync state changes to localStorage & Firebase Firestore
  useEffect(() => {
    localStorage.setItem('jpg_profilGuru', JSON.stringify(profilGuru));
    saveProfilToFirestore(profilGuru);
  }, [profilGuru]);

  useEffect(() => {
    localStorage.setItem('jpg_kelasList', JSON.stringify(kelasList));
  }, [kelasList]);

  useEffect(() => {
    localStorage.setItem('jpg_siswaList', JSON.stringify(siswaList));
  }, [siswaList]);

  useEffect(() => {
    localStorage.setItem('jpg_jadwalList', JSON.stringify(jadwalList));
  }, [jadwalList]);

  useEffect(() => {
    localStorage.setItem('jpg_jurnalList', JSON.stringify(jurnalList));
  }, [jurnalList]);

  useEffect(() => {
    localStorage.setItem('jpg_catatanList', JSON.stringify(catatanList));
  }, [catatanList]);

  // Real-time Firebase Firestore Subscription Listener
  useEffect(() => {
    const unsubscribe = subscribeJurnal((cloudJournals) => {
      if (cloudJournals && cloudJournals.length > 0) {
        setJurnalList(cloudJournals);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Dark Mode Class Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Quick Action Handler: Open Journal Form
  const handleQuickAddJurnal = () => {
    setActiveTab('jurnal');
    setIsJurnalFormOpen(true);
  };

  // Handler: Pre-fill Jurnal with Presensi Data
  const handleSendPresensiToJurnal = (presensiData) => {
    setActiveTab('jurnal');
    setIsJurnalFormOpen(true);
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm('Reset semua data ke data demo awal?')) {
      localStorage.clear();
      setProfilGuru(initialProfilGuru);
      setKelasList(initialKelas);
      setSiswaList(initialSiswa);
      setJadwalList(initialJadwal);
      setJurnalList(initialJurnal);
      setCatatanList(initialCatatanSiswa);
      alert('Data telah direset ke versi demo awal.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors">
      
      {/* Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        profilGuru={profilGuru}
      />

      {/* Main Content Area */}
      <div className={`flex-1 ${isSidebarOpen ? 'lg:pl-72' : 'pl-0'} flex flex-col min-w-0 transition-all duration-300`}>
        
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onQuickAddJurnal={handleQuickAddJurnal}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Dynamic Tab Body */}
        <main className="p-4 sm:p-8 flex-1">
          {activeTab === 'dashboard' && (
            <Dashboard
              profilGuru={profilGuru}
              jurnalList={jurnalList}
              jadwalList={jadwalList}
              kelasList={kelasList}
              setActiveTab={setActiveTab}
              onQuickAddJurnal={handleQuickAddJurnal}
              onOpenJurnalDetail={setSelectedJurnalForDetail}
            />
          )}

          {activeTab === 'jurnal' && (
            <JurnalHarian
              jurnalList={jurnalList}
              setJurnalList={setJurnalList}
              kelasList={kelasList}
              profilGuru={profilGuru}
              isFormOpen={isJurnalFormOpen}
              setIsFormOpen={setIsJurnalFormOpen}
              selectedJurnalForDetail={selectedJurnalForDetail}
              setSelectedJurnalForDetail={setSelectedJurnalForDetail}
              showToast={showToast}
            />
          )}

          {activeTab === 'jadwal' && (
            <JadwalMengajar
              jadwalList={jadwalList}
              setJadwalList={setJadwalList}
              kelasList={kelasList}
              profilGuru={profilGuru}
              showToast={showToast}
            />
          )}

          {activeTab === 'presensi' && (
            <PresensiSiswa
              kelasList={kelasList}
              setKelasList={setKelasList}
              siswaList={siswaList}
              setSiswaList={setSiswaList}
              onSendPresensiToJurnal={handleSendPresensiToJurnal}
              showToast={showToast}
            />
          )}

          {activeTab === 'catatan' && (
            <CatatanSiswa
              catatanList={catatanList}
              setCatatanList={setCatatanList}
              kelasList={kelasList}
              showToast={showToast}
            />
          )}

          {activeTab === 'laporan' && (
            <CetakLaporan
              profilGuru={profilGuru}
              jurnalList={jurnalList}
              kelasList={kelasList}
            />
          )}

          {activeTab === 'pengaturan' && (
            <PengaturanSekolah
              profilGuru={profilGuru}
              setProfilGuru={setProfilGuru}
              kelasList={kelasList}
              setKelasList={setKelasList}
              siswaList={siswaList}
              setSiswaList={setSiswaList}
              onResetData={handleResetData}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global Toast Notification Popup */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3.5 bg-emerald-600 dark:bg-emerald-700 text-white shadow-2xl rounded-2xl border border-emerald-400/40 transform transition-all duration-300">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h5 className="font-extrabold text-[10px] tracking-wider uppercase opacity-90">{toast.title}</h5>
            <p className="text-xs sm:text-sm font-bold mt-0.5">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="ml-3 p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

    </div>
  );
}
