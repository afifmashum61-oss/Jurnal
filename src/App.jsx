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

  // App Master Data States (Persisted in LocalStorage)
  const [profilGuru, setProfilGuru] = useState(() => {
    const saved = localStorage.getItem('jpg_profilGuru');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.nama !== 'IVA MAKHMUDAH, S.Pd') {
        const updated = {
          ...parsed,
          nama: 'IVA MAKHMUDAH, S.Pd',
          nip: 'PEG ID 20503856195003',
          sekolah: 'MA Darussalam Sengon'
        };
        localStorage.setItem('jpg_profilGuru', JSON.stringify(updated));
        return updated;
      }
      return parsed;
    }
    return initialProfilGuru;
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
    return saved ? JSON.parse(saved) : initialJadwal;
  });

  const [jurnalList, setJurnalList] = useState(() => {
    const saved = localStorage.getItem('jpg_jurnalList');
    return saved ? JSON.parse(saved) : initialJurnal;
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
            />
          )}

          {activeTab === 'jadwal' && (
            <JadwalMengajar
              jadwalList={jadwalList}
              setJadwalList={setJadwalList}
              kelasList={kelasList}
              profilGuru={profilGuru}
            />
          )}

          {activeTab === 'presensi' && (
            <PresensiSiswa
              kelasList={kelasList}
              siswaList={siswaList}
              setSiswaList={setSiswaList}
              onSendPresensiToJurnal={handleSendPresensiToJurnal}
            />
          )}

          {activeTab === 'catatan' && (
            <CatatanSiswa
              catatanList={catatanList}
              setCatatanList={setCatatanList}
              kelasList={kelasList}
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
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

    </div>
  );
}
