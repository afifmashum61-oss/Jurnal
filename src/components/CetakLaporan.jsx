import React, { useState } from 'react';
import { Printer, Download, Filter, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CetakLaporan({ profilGuru, jurnalList, kelasList }) {
  const [selectedBulan, setSelectedBulan] = useState('semua');
  const [selectedKelas, setSelectedKelas] = useState('semua');
  const [selectedMapel, setSelectedMapel] = useState('semua');

  const months = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  // Filter journals for report
  const filteredJournals = jurnalList.filter(j => {
    let matchMonth = true;
    if (selectedBulan !== 'semua') {
      const monthStr = j.tanggal.split('-')[1];
      matchMonth = monthStr === selectedBulan;
    }
    const matchKelas = selectedKelas === 'semua' || j.kelas === selectedKelas;
    const matchMapel = selectedMapel === 'semua' || j.mapel === selectedMapel;

    return matchMonth && matchKelas && matchMapel;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jurnalList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Backup_Jurnal_Guru_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Control Bar (Hidden on Print) */}
      <div className="no-print bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <Printer className="w-5 h-5 text-teal-600" />
            <span>Pratinjau & Cetak Laporan Jurnal Mengajar</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan berformat standar kedinasan dengan kolom tanda tangan supervisor/kepala sekolah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Filter */}
          <select
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="semua">Semua Bulan</option>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          {/* Class Filter */}
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            <option value="semua">Semua Kelas</option>
            {kelasList.map(k => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow shadow-teal-600/20 transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen / PDF</span>
          </button>
        </div>
      </div>

      {/* PRINT CONTAINER / PAPER PREVIEW */}
      <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-lg max-w-4xl mx-auto space-y-6">
        
        {/* KOP SURAT SEKOLAH */}
        <div className="text-center border-b-4 border-double border-slate-900 pb-4">
          <h2 className="font-extrabold text-xl tracking-wider uppercase">
            {profilGuru?.sekolah || 'SMA NEGERI 1 NUSANTARA'}
          </h2>
          <p className="text-xs font-medium text-slate-700 mt-1">
            {profilGuru?.alamatSekolah || 'Jl. Darussalam No. 01, Sengon, Jombang'}
          </p>
          <h3 className="font-bold text-sm tracking-wide text-teal-800 uppercase mt-3">
            JURNAL HARIAN KEGIATAN PEMBELAJARAN GURU
          </h3>
          <p className="text-xs text-slate-600 font-semibold">
            Tahun Ajaran: {profilGuru?.tahunAjaran || '2025/2026'} | Semester: {profilGuru?.semester || 'Ganjil'}
          </p>
        </div>

        {/* METADATA GURU */}
        <div className="grid grid-cols-2 text-xs font-semibold gap-y-1">
          <div>
            <span className="inline-block w-32 text-slate-600">Nama Guru</span>
            <span>: <strong>{profilGuru?.nama}</strong></span>
          </div>
          <div>
            <span className="inline-block w-32 text-slate-600">Mata Pelajaran</span>
            <span>: <strong>{selectedMapel === 'semua' ? profilGuru?.mataPelajaran?.join(', ') : selectedMapel}</strong></span>
          </div>
          <div>
            <span className="inline-block w-32 text-slate-600">Identitas / PEG ID</span>
            <span>: {profilGuru?.nip}</span>
          </div>
          <div>
            <span className="inline-block w-32 text-slate-600">Kelas Diampu</span>
            <span>: {selectedKelas === 'semua' ? 'Semua Kelas' : selectedKelas}</span>
          </div>
        </div>

        {/* REKAP TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse border border-slate-800">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-800 text-slate-900 font-bold text-center">
                <th className="border border-slate-800 py-2 px-2 w-8">No</th>
                <th className="border border-slate-800 py-2 px-2 w-24">Hari / Tgl</th>
                <th className="border border-slate-800 py-2 px-2 w-16">Jam Ke</th>
                <th className="border border-slate-800 py-2 px-2 w-16">Kelas</th>
                <th className="border border-slate-800 py-2 px-3">Materi & Tujuan Pembelajaran (TP)</th>
                <th className="border border-slate-800 py-2 px-2 w-28">Presensi Siswa</th>
                <th className="border border-slate-800 py-2 px-2">Catatan Kejadian / Status</th>
                <th className="border border-slate-800 py-2 px-2 w-14">Paraf</th>
              </tr>
            </thead>
            <tbody>
              {filteredJournals.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 border border-slate-800 text-slate-500 italic">
                    Tidak ada catatan jurnal untuk filter periode ini.
                  </td>
                </tr>
              ) : (
                filteredJournals.map((j, idx) => (
                  <tr key={j.id} className="border-b border-slate-800">
                    <td className="border border-slate-800 py-2 px-2 text-center font-medium">{idx + 1}</td>
                    <td className="border border-slate-800 py-2 px-2 font-medium">
                      {j.hari}, <br />{j.tanggal}
                    </td>
                    <td className="border border-slate-800 py-2 px-2 text-center font-bold">{j.jamKe}</td>
                    <td className="border border-slate-800 py-2 px-2 text-center font-bold">{j.kelas}</td>
                    <td className="border border-slate-800 py-2 px-3">
                      <strong className="block text-slate-900">{j.materi}</strong>
                      <span className="text-slate-600 font-normal">TP: {j.tujuanPembelajaran}</span>
                    </td>
                    <td className="border border-slate-800 py-2 px-2">
                      <span className="block font-bold">Hadir: {j.hadir}</span>
                      {j.siswaAbsenDetail && (
                        <span className="block text-[10px] text-slate-700 italic">{j.siswaAbsenDetail}</span>
                      )}
                    </td>
                    <td className="border border-slate-800 py-2 px-2">
                      {j.catatanKejadian && (
                        <span className="block text-slate-800 mb-1">Catatan: {j.catatanKejadian}</span>
                      )}
                      <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold border border-slate-400 rounded">
                        {j.statusKetercapaian}
                      </span>
                    </td>
                    <td className="border border-slate-800 py-2 px-2 text-center">
                      <div className="w-6 h-6 border border-slate-300 rounded-full mx-auto" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* SIGNATURE BLOCK */}
        <div className="pt-8 grid grid-cols-2 text-xs font-semibold text-center print-break-inside-avoid">
          {/* SISI KIRI: Kepala Sekolah (dengan NIP. -) */}
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold text-slate-900">Kepala Sekolah</p>
            <div className="h-20" /> {/* Space for physical signature */}
            <p className="font-extrabold underline text-slate-900">{profilGuru?.kepalaSekolah || 'Dr. Achmad Junaidi, S.Si, M.S.I'}</p>
            <p className="text-slate-600 text-[11px]">NIP. {profilGuru?.nipKepalaSekolah || '-'}</p>
          </div>

          {/* SISI KANAN: Guru Mata Pelajaran */}
          <div>
            <p>{(!profilGuru?.kota || profilGuru?.kota === 'Kota Edukasi') ? 'Jombang' : profilGuru.kota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-bold text-slate-900">Guru Mata Pelajaran</p>
            <div className="h-20" /> {/* Space for physical signature */}
            <p className="font-extrabold underline text-slate-900">{profilGuru?.nama || 'IVA MAKHMUDAH, S.Pd'}</p>
            <p className="text-slate-600 text-[11px]">{profilGuru?.nip || 'PEG ID 20503856195003'}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
