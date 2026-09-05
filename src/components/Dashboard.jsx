import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowUpRight, 
  Sparkles,
  Calendar,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Award
} from 'lucide-react';

export default function Dashboard({ 
  profilGuru, 
  jurnalList, 
  jadwalList, 
  kelasList, 
  setActiveTab, 
  onQuickAddJurnal,
  onOpenJurnalDetail 
}) {
  // Compute Stats
  const totalJurnal = jurnalList.length;
  
  // Calculate attendance rate
  let totalHadir = 0;
  let totalSiswaSemuaJurnal = 0;
  jurnalList.forEach(j => {
    const totalInJournal = (j.hadir || 0) + (j.sakit || 0) + (j.izin || 0) + (j.alpa || 0);
    totalHadir += (j.hadir || 0);
    totalSiswaSemuaJurnal += totalInJournal;
  });
  const persentaseKehadiran = totalSiswaSemuaJurnal > 0 
    ? ((totalHadir / totalSiswaSemuaJurnal) * 100).toFixed(1) 
    : '96.5';

  // Get current day in Indonesian
  const daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayName = daysMap[new Date().getDay()];

  // Filter today's schedule
  const jadwalHariIni = jadwalList.filter(j => j.hari.toLowerCase() === todayName.toLowerCase());

  // Recent Journals (last 3)
  const recentJournals = [...jurnalList].reverse().slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner (EducateX Modern Theme) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 text-white p-6 sm:p-8 shadow-xl shadow-teal-700/15">
        {/* Background Decorative Rings & Blobs */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-teal-100 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Portal Pegangan Guru • T.A. {profilGuru?.tahunAjaran || '2025/2026'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Selamat Bertugas, <br />
              <span className="text-emerald-200">{profilGuru?.nama || 'Ibu Guru'}</span>! 👋
            </h1>

            <p className="text-teal-100 text-sm leading-relaxed">
              Jurnal harian Anda membantu memantau perkembangan belajar siswa dan memastikan ketercapaian Tujuan Pembelajaran (TP) secara terstruktur.
            </p>

            <div className="pt-2">
              <button
                onClick={onQuickAddJurnal}
                className="px-6 py-3.5 rounded-2xl bg-white text-teal-900 hover:bg-teal-50 font-bold text-sm shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 flex items-center gap-2.5 group"
              >
                <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center group-hover:scale-110 transition">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-teal-800 font-extrabold">Input Jurnal Mengajar</span>
              </button>
            </div>
          </div>

          {/* Teacher Photo Card Showcase (EducateX Inspired) */}
          <div className="relative flex-shrink-0 flex items-center justify-center self-center lg:self-auto pt-2 lg:pt-0">
            <div className="relative">
              {/* Soft Backdrop Aura */}
              <div className="absolute inset-0 rounded-3xl bg-emerald-400/30 blur-lg transform rotate-3" />
              
              {/* Teacher Image Frame */}
              <div className="relative w-48 sm:w-56 h-60 sm:h-64 rounded-3xl overflow-hidden border-4 border-white/40 shadow-2xl bg-gradient-to-b from-teal-600 via-emerald-700 to-teal-900">
                <img
                  src={profilGuru?.foto || '/foto-guru.png'}
                  alt="Foto Guru Pengajar"
                  className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Name Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white">
                  <p className="text-xs font-extrabold truncate text-white leading-tight">
                    {profilGuru?.nama || 'Guru Pengajar'}
                  </p>
                  <p className="text-[10px] text-emerald-200 font-medium truncate">
                    {profilGuru?.nip || '-'}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute -top-2 -right-2 px-3 py-1 bg-white text-teal-800 text-[11px] font-extrabold rounded-full shadow-lg flex items-center gap-1.5 border border-teal-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Guru Pengajar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Jurnal Terisi */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2.5 py-1 rounded-full">
              Terverifikasi
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Jurnal Harian</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{totalJurnal}</span>
            <span className="text-xs text-slate-500">entri dicatat</span>
          </div>
        </div>

        {/* Card 2: Kehadiran Siswa */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Optimal
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-rata Presensi Siswa</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{persentaseKehadiran}%</span>
            <span className="text-xs text-slate-500">kehadiran</span>
          </div>
        </div>

        {/* Card 3: Total Kelas Diampu */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-500">K13 / Merdeka</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kelas Diampu</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{kelasList.length}</span>
            <span className="text-xs text-slate-500">rombongan belajar</span>
          </div>
        </div>

        {/* Card 4: Jam Mengajar */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">
              Mingguan
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Beban Mengajar</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white">18</span>
            <span className="text-xs text-slate-500">Jam Pelajaran / minggu</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Schedule Today & Recent Journal Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols): Recent Jurnal Entries */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 bg-teal-600 rounded-full" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Jurnal Mengajar Terbaru
              </h3>
            </div>

            <button
              onClick={() => setActiveTab('jurnal')}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1"
            >
              <span>Lihat Semua Jurnal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentJournals.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-slate-500 text-sm">Belum ada jurnal harian. Klik tombol di bawah untuk membuat jurnal pertama Anda.</p>
                <button
                  onClick={onQuickAddJurnal}
                  className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
                >
                  + Tambah Jurnal Harian
                </button>
              </div>
            ) : (
              recentJournals.map((jur) => (
                <div
                  key={jur.id}
                  onClick={() => onOpenJurnalDetail(jur)}
                  className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-bold text-xs">
                        {jur.kelas}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs">
                        {jur.mapel}
                      </span>
                      <span className="text-xs text-slate-400">Jam ke: {jur.jamKe}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {jur.tanggal} ({jur.hari})
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:text-teal-600 transition mb-1">
                    {jur.materi}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                    <span className="font-semibold text-slate-500">TP:</span> {jur.tujuanPembelajaran}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Hadir: {jur.hadir}
                      </span>
                      {(jur.sakit > 0 || jur.izin > 0 || jur.alpa > 0) && (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          Absen: {jur.sakit + jur.izin + jur.alpa} siswa
                        </span>
                      )}
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      jur.statusKetercapaian === 'Selesai Sesuai Target'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                      {jur.statusKetercapaian}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (1 col): Schedule Today & Quick Shortcuts */}
        <div className="space-y-6">
          {/* Schedule Today Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>Jadwal Hari Ini ({todayName})</span>
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 font-bold">
                {jadwalHariIni.length} Sesi
              </span>
            </div>

            {jadwalHariIni.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">Tidak ada jadwal mengajar tetap pada hari {todayName}. Gunakan waktu untuk penyusunan modul atau koreksi tugas.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jadwalHariIni.map((j) => (
                  <div key={j.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-teal-700 dark:text-teal-400">{j.kelas}</span>
                      <span className="text-xs text-slate-400 font-mono">{j.waktu}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{j.mapel}</p>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                      <span>Ruangan: {j.ruangan}</span>
                      <span className="font-medium text-teal-600 dark:text-teal-400">Jam Ke- {j.jamKe}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Akses Cepat</span>
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={() => setActiveTab('presensi')}
                className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-semibold flex items-center justify-between"
              >
                <span>Check-in Presensi Siswa</span>
                <ArrowUpRight className="w-4 h-4 text-teal-300" />
              </button>
              <button
                onClick={() => setActiveTab('catatan')}
                className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-semibold flex items-center justify-between"
              >
                <span>Catat Kejadian Khusus Siswa</span>
                <ArrowUpRight className="w-4 h-4 text-teal-300" />
              </button>
              <button
                onClick={() => setActiveTab('laporan')}
                className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-semibold flex items-center justify-between"
              >
                <span>Cetak Rekap Laporan PDF</span>
                <ArrowUpRight className="w-4 h-4 text-teal-300" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
