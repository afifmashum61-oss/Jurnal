import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  CalendarDays, 
  UserCheck, 
  FileText, 
  Printer, 
  Settings, 
  GraduationCap,
  Sparkles,
  LogOut,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

export default function SidebarNav({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, profilGuru }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, badge: null },
    { id: 'jurnal', label: 'Jurnal Harian Mengajar', icon: BookOpen, badge: 'Utama' },
    { id: 'jadwal', label: 'Jadwal Mengajar', icon: CalendarDays, badge: null },
    { id: 'presensi', label: 'Presensi Siswa', icon: UserCheck, badge: null },
    { id: 'catatan', label: 'Catatan & Evaluasi', icon: FileText, badge: null },
    { id: 'laporan', label: 'Cetak Laporan Resmi', icon: Printer, badge: 'PDF' },
    { id: 'pengaturan', label: 'Profil & Sekolah', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Branding Section */}
        <div>
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 dark:text-white text-lg tracking-tight leading-tight">
                  Jurnal<span className="text-teal-600 dark:text-teal-400">Guru</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Pegangan Guru Modern</p>
              </div>
            </div>
          </div>

          {/* Teacher Profile Card Mini */}
          <div className="mx-4 my-4 p-3 bg-teal-50/70 dark:bg-slate-800/60 rounded-2xl border border-teal-100/60 dark:border-slate-700/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-2 ring-teal-500/40 flex-shrink-0 bg-teal-700">
              <img 
                src={profilGuru?.foto || '/foto-guru.png'} 
                alt="Foto Profil Guru" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {profilGuru?.nama || 'Guru Pengajar'}
              </p>
              <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium truncate">
                {profilGuru?.nip || '-'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Menu Utama
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                    ${isActive 
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 translate-x-1' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info & School Badge */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 rounded-xl border border-teal-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-1 text-teal-800 dark:text-teal-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{profilGuru?.sekolah || 'SMA Negeri 1'}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              T.A. {profilGuru?.tahunAjaran || '2025/2026'} ({profilGuru?.semester || 'Ganjil'})
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
