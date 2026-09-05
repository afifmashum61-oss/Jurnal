import React from 'react';
import { Menu, X, Calendar, Plus, Sun, Moon, Bell, Search } from 'lucide-react';

export default function Header({ 
  activeTab, 
  isSidebarOpen,
  setIsSidebarOpen, 
  onQuickAddJurnal, 
  darkMode, 
  setDarkMode 
}) {
  const titles = {
    dashboard: 'Dashboard Utama',
    jurnal: 'Jurnal Harian Mengajar',
    jadwal: 'Jadwal Mengajar Mingguan',
    presensi: 'Presensi & Kehadiran Siswa',
    catatan: 'Catatan & Evaluasi Siswa',
    laporan: 'Rekap & Cetak Laporan Resmi',
    pengaturan: 'Pengaturan Profil & Sekolah',
  };

  const getFormattedDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('id-ID', options);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
      {/* Left section: Hamburger & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700 shadow-sm"
          title={isSidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
          aria-label={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
        >
          {isSidebarOpen ? <X className="w-6 h-6 text-slate-700 dark:text-slate-200" /> : <Menu className="w-6 h-6 text-slate-700 dark:text-slate-200" />}
        </button>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {titles[activeTab] || 'Jurnal Pegangan Guru'}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{getFormattedDate()}</span>
          </div>
        </div>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Quick Add Jurnal Button */}
        <button
          onClick={onQuickAddJurnal}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-teal-600/20 hover:shadow-lg transition text-xs sm:text-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Isi Jurnal Harian</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
      </div>
    </header>
  );
}
