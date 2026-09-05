import React, { useState } from 'react';
import { 
  UserCheck, 
  Users, 
  Plus, 
  Check, 
  AlertCircle, 
  Calendar, 
  ArrowRight, 
  UserPlus, 
  Trash2,
  Download,
  Upload,
  FileSpreadsheet,
  FileText,
  X
} from 'lucide-react';

export default function PresensiSiswa({ 
  kelasList, 
  siswaList, 
  setSiswaList, 
  onSendPresensiToJurnal,
  showToast 
}) {
  const [selectedKelas, setSelectedKelas] = useState(kelasList[0]?.id || 'X-1');
  const [tanggalPresensi, setTanggalPresensi] = useState(new Date().toISOString().split('T')[0]);

  // Current active class student list
  const currentSiswaList = siswaList[selectedKelas] || [];

  // Attendance state for each student: { studentId: 'H' | 'S' | 'I' | 'A' }
  const [attendanceMap, setAttendanceMap] = useState({});

  // Add new single student modal state
  const [isAddSiswaOpen, setIsAddSiswaOpen] = useState(false);
  const [newSiswaData, setNewSiswaData] = useState({ nis: '', nama: '', gender: 'L' });

  // Bulk student import modal state
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');

  // Get status for a student (default 'H' = Hadir)
  const getStatus = (studentId) => attendanceMap[studentId] || 'H';

  // Toggle status
  const setStatus = (studentId, status) => {
    setAttendanceMap({
      ...attendanceMap,
      [studentId]: status
    });
  };

  // Set all to Hadir
  const setAllHadir = () => {
    const newMap = {};
    currentSiswaList.forEach(s => {
      newMap[s.id] = 'H';
    });
    setAttendanceMap(newMap);
  };

  // Calculate totals
  let countHadir = 0;
  let countSakit = 0;
  let countIzin = 0;
  let countAlpa = 0;
  const absentDetails = [];

  currentSiswaList.forEach(s => {
    const st = getStatus(s.id);
    if (st === 'H') countHadir++;
    else if (st === 'S') {
      countSakit++;
      absentDetails.push(`Sakit: ${s.nama}`);
    }
    else if (st === 'I') {
      countIzin++;
      absentDetails.push(`Izin: ${s.nama}`);
    }
    else if (st === 'A') {
      countAlpa++;
      absentDetails.push(`Alpa: ${s.nama}`);
    }
  });

  const handleAddSiswa = (e) => {
    e.preventDefault();
    if (!newSiswaData.nama) return;

    const newId = `s-${Date.now()}`;
    const updatedClassList = [
      ...currentSiswaList,
      { id: newId, nis: newSiswaData.nis || `${Date.now()}`.slice(-6), nama: newSiswaData.nama, gender: newSiswaData.gender }
    ];

    setSiswaList({
      ...siswaList,
      [selectedKelas]: updatedClassList
    });

    if (showToast) showToast(`Siswa ${newSiswaData.nama} berhasil ditambahkan!`);
    setNewSiswaData({ nis: '', nama: '', gender: 'L' });
    setIsAddSiswaOpen(false);
  };

  const handleDeleteSiswa = (siswaId) => {
    if (window.confirm('Hapus siswa dari daftar kelas ini?')) {
      const updatedClassList = currentSiswaList.filter(s => s.id !== siswaId);
      setSiswaList({
        ...siswaList,
        [selectedKelas]: updatedClassList
      });
      if (showToast) showToast('Data siswa berhasil dihapus!', 'Berhasil Dihapus');
    }
  };

  // Download CSV Template
  const handleDownloadTemplate = () => {
    const templateCsv = `NIS,Nama Siswa,Gender\n2425101,Ahmad Pratama,L\n2425102,Aulia Rahma,P\n2425103,Bagas Dewantara,L\n2425104,Citra Kirana,P`;
    const blob = new Blob([templateCsv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Template_Impor_Siswa_${selectedKelas}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process Bulk Import Text or File
  const handleProcessBulkImport = (customContent = null) => {
    const content = typeof customContent === 'string' ? customContent : bulkText;
    if (!content.trim()) {
      alert('Mohon tempelkan data teks atau pilih file CSV/TXT terlebih dahulu.');
      return;
    }

    const lines = content.split(/\r?\n/);
    const newStudents = [];
    const baseTime = Date.now();

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Skip header line if present
      if (index === 0 && (trimmed.toLowerCase().includes('nis') || trimmed.toLowerCase().includes('nama'))) {
        return;
      }

      // Split by comma, tab, or semicolon
      const parts = trimmed.split(/,|\t|;/).map(p => p.trim());

      let nis = '';
      let nama = '';
      let gender = 'L';

      if (parts.length >= 3) {
        nis = parts[0];
        nama = parts[1];
        gender = parts[2].toUpperCase().startsWith('P') ? 'P' : 'L';
      } else if (parts.length === 2) {
        nis = parts[0];
        nama = parts[1];
      } else if (parts.length === 1) {
        nama = parts[0];
        nis = `${baseTime + index}`.slice(-6);
      }

      if (nama) {
        newStudents.push({
          id: `s-${baseTime}-${index}`,
          nis: nis || `${baseTime + index}`.slice(-6),
          nama: nama,
          gender: gender
        });
      }
    });

    if (newStudents.length === 0) {
      alert('Tidak ada data siswa valid yang ditemukan.');
      return;
    }

    const updatedClassList = [...currentSiswaList, ...newStudents];
    setSiswaList({
      ...siswaList,
      [selectedKelas]: updatedClassList
    });

    if (showToast) {
      showToast(`Berhasil mengimpor ${newStudents.length} siswa ke kelas ${selectedKelas}!`);
    } else {
      alert(`Berhasil mengimpor ${newStudents.length} siswa baru ke ${selectedKelas}!`);
    }
    setBulkText('');
    setIsBulkImportOpen(false);
  };

  // Handle CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      setBulkText(fileContent);
      handleProcessBulkImport(fileContent);
    };
    reader.readAsText(file);
  };

  const handleCreateJurnalWithPresensi = () => {
    onSendPresensiToJurnal({
      kelas: selectedKelas,
      tanggal: tanggalPresensi,
      hadir: countHadir,
      sakit: countSakit,
      izin: countIzin,
      alpa: countAlpa,
      siswaAbsenDetail: absentDetails.length > 0 ? absentDetails.join('. ') : 'Nihil (Hadir Semua)'
    });
    if (showToast) {
      showToast(`Data Presensi Kelas ${selectedKelas} dialihkan ke Jurnal Harian!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
        
        {/* Class Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {kelasList.map((k) => (
            <button
              key={k.id}
              onClick={() => {
                setSelectedKelas(k.id);
                setAttendanceMap({});
              }}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold transition
                ${selectedKelas === k.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }
              `}
            >
              {k.nama}
            </button>
          ))}
        </div>

        {/* Date Selector, Single Add, & Bulk Import Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={tanggalPresensi}
            onChange={(e) => setTanggalPresensi(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold dark:text-white"
          />

          <button
            onClick={() => setIsAddSiswaOpen(true)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-teal-600" />
            <span>+ 1 Siswa</span>
          </button>

          <button
            onClick={() => setIsBulkImportOpen(true)}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Impor Siswa Massal</span>
          </button>
        </div>

      </div>

      {/* Main Attendance Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-6 shadow-sm space-y-6">
        
        {/* Attendance Summary Banner */}
        <div className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-700/50 dark:to-slate-700/30 rounded-2xl border border-teal-100 dark:border-slate-600 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Total Siswa</span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-white">{currentSiswaList.length} Siswa</span>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-600" />

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold rounded-lg">
                Hadir: {countHadir}
              </span>
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold rounded-lg">
                Sakit: {countSakit}
              </span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold rounded-lg">
                Izin: {countIzin}
              </span>
              <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 font-bold rounded-lg">
                Alpa: {countAlpa}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={setAllHadir}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition"
            >
              Set Semua Hadir
            </button>

            <button
              onClick={handleCreateJurnalWithPresensi}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition"
            >
              <span>Gunakan Data di Jurnal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Student Attendance List Table */}
        <div className="overflow-x-auto">
          {currentSiswaList.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada data siswa di {selectedKelas}. Klik tombol "Impor Siswa Massal" atau "+ 1 Siswa" untuk mengisi daftar siswa.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">NIS</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4 w-16 text-center">L/P</th>
                  <th className="py-3 px-4 text-center">Status Kehadiran</th>
                  <th className="py-3 px-4 w-12 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {currentSiswaList.map((siswa, idx) => {
                  const status = getStatus(siswa.id);
                  return (
                    <tr key={siswa.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition">
                      <td className="py-3 px-4 text-center font-semibold text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">{siswa.nis}</td>
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{siswa.nama}</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-500">{siswa.gender}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Hadir Button */}
                          <button
                            type="button"
                            onClick={() => setStatus(siswa.id, 'H')}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                              status === 'H' 
                                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30' 
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                            }`}
                          >
                            Hadir (H)
                          </button>

                          {/* Sakit Button */}
                          <button
                            type="button"
                            onClick={() => setStatus(siswa.id, 'S')}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                              status === 'S' 
                                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/30' 
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-amber-50 hover:text-amber-600'
                            }`}
                          >
                            Sakit (S)
                          </button>

                          {/* Izin Button */}
                          <button
                            type="button"
                            onClick={() => setStatus(siswa.id, 'I')}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                              status === 'I' 
                                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30' 
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            Izin (I)
                          </button>

                          {/* Alpa Button */}
                          <button
                            type="button"
                            onClick={() => setStatus(siswa.id, 'A')}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                              status === 'A' 
                                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/30' 
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
                            }`}
                          >
                            Alpa (A)
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteSiswa(siswa.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Modal Add Single Student */}
      {isAddSiswaOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-5 py-3.5 bg-teal-700 text-white font-bold text-sm flex items-center justify-between">
              <span>Tambah Siswa ke {selectedKelas}</span>
              <button onClick={() => setIsAddSiswaOpen(false)} className="text-white font-bold">×</button>
            </div>
            <form onSubmit={handleAddSiswa} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">NIS Siswa</label>
                <input
                  type="text"
                  placeholder="2425101"
                  value={newSiswaData.nis}
                  onChange={(e) => setNewSiswaData({ ...newSiswaData, nis: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  placeholder="Nama Siswa"
                  value={newSiswaData.nama}
                  onChange={(e) => setNewSiswaData({ ...newSiswaData, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin</label>
                <select
                  value={newSiswaData.gender}
                  onChange={(e) => setNewSiswaData({ ...newSiswaData, gender: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSiswaOpen(false)}
                  className="px-3 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BULK IMPORT SISWA MASSAL */}
      {isBulkImportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-teal-700 to-emerald-600 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                <span>Impor Siswa Massal ke {selectedKelas}</span>
              </h3>
              <button onClick={() => setIsBulkImportOpen(false)} className="text-white hover:bg-white/20 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-200">
              
              {/* Template Download Option */}
              <div className="p-4 bg-teal-50 dark:bg-slate-700/50 rounded-2xl border border-teal-100 dark:border-slate-600 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-teal-900 dark:text-teal-300 text-xs">Unduh Template Berkas (.CSV)</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Gunakan template ini untuk mengisi daftar NIS, Nama, dan Gender siswa di Excel.
                  </p>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 flex-shrink-0 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Template</span>
                </button>
              </div>

              {/* Upload File Input */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800 dark:text-slate-100">
                  Opsi A: Upload Berkas CSV / Text (.csv, .txt)
                </label>
                <input
                  type="file"
                  accept=".csv, .txt"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-slate-700 dark:file:text-teal-300"
                />
              </div>

              {/* Textarea Paste Option */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 dark:text-slate-100">
                    Opsi B: Tempelkan Teks Data Siswa (Salin dari Excel / Notepad)
                  </label>
                </div>
                <p className="text-[11px] text-slate-400">
                  Format per baris: <code>NIS, Nama Lengkap, L/P</code> atau langsung salin kolom dari Excel.
                </p>
                <textarea
                  rows="6"
                  placeholder={`2425101, Aditya Pratama, L\n2425102, Aulia Rahmawati, P\n2425103, Bagas Dewantara, L`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-teal-500 dark:text-white"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkImportOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleProcessBulkImport()}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Proses & Impor Siswa</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
