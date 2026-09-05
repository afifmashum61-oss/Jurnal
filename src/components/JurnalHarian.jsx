import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit, 
  Eye, 
  X, 
  FileText,
  Users,
  Check,
  Printer
} from 'lucide-react';
import { saveJurnalToFirestore, deleteJurnalFromFirestore } from '../services/firestoreService';

export default function JurnalHarian({ 
  jurnalList, 
  setJurnalList, 
  kelasList, 
  profilGuru,
  isFormOpen,
  setIsFormOpen,
  selectedJurnalForDetail,
  setSelectedJurnalForDetail,
  showToast: globalShowToast
}) {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelasFilter, setSelectedKelasFilter] = useState('semua');
  const [selectedMapelFilter, setSelectedMapelFilter] = useState('semua');

  // Toast Notification State (Fallback local)
  const [localToast, setLocalToast] = useState(null);

  const triggerToast = (msg, title = 'Berhasil Disimpan') => {
    if (globalShowToast) {
      globalShowToast(msg, title);
    } else {
      setLocalToast(msg);
      setTimeout(() => setLocalToast(null), 3500);
    }
  };

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    hari: 'Senin',
    jamKe: '1 - 2',
    kelas: kelasList[0]?.id || 'X-1',
    mapel: profilGuru?.mataPelajaran?.[0] || 'Bahasa Arab',
    materi: '',
    tujuanPembelajaran: '',
    hadir: 30,
    sakit: 0,
    izin: 0,
    alpa: 0,
    siswaAbsenDetail: '',
    catatanKejadian: '',
    statusKetercapaian: 'Selesai Sesuai Target',
    mediaPembelajaran: 'PPT, LKPD, LCD Projector'
  });

  // Calculate day name when date changes
  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const d = new Date(dateVal);
    const dayName = days[d.getDay()] || 'Senin';
    setFormData({
      ...formData,
      tanggal: dateVal,
      hari: dayName
    });
  };

  // Handle open form for NEW entry
  const handleOpenNewForm = () => {
    setEditingId(null);
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      hari: getIndonesianDayName(new Date()),
      jamKe: '1 - 2',
      kelas: kelasList[0]?.id || 'X-1',
      mapel: profilGuru?.mataPelajaran?.[0] || 'Bahasa Arab',
      materi: '',
      tujuanPembelajaran: '',
      hadir: 30,
      sakit: 0,
      izin: 0,
      alpa: 0,
      siswaAbsenDetail: 'Nihil (Hadir Semua)',
      catatanKejadian: '',
      statusKetercapaian: 'Selesai Sesuai Target',
      mediaPembelajaran: 'LKPD & Modul Ajar'
    });
    setIsFormOpen(true);
  };

  // Helper day name
  function getIndonesianDayName(dateObj) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dateObj.getDay()];
  }

  // Handle EDIT form
  const handleEdit = (jur) => {
    setEditingId(jur.id);
    setFormData({ ...jur });
    setIsFormOpen(true);
  };

  // Handle DELETE
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan jurnal harian ini?')) {
      setJurnalList(jurnalList.filter(j => j.id !== id));
      deleteJurnalFromFirestore(id);
      triggerToast('Catatan jurnal harian berhasil dihapus!', 'Berhasil Dihapus');
    }
  };

  // Handle SAVE form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.materi || !formData.tujuanPembelajaran) {
      alert('Mohon isi Materi Pembelajaran dan Tujuan Pembelajaran (TP).');
      return;
    }

    if (editingId) {
      // Update existing
      const updatedItem = { ...formData, id: editingId };
      setJurnalList(jurnalList.map(j => j.id === editingId ? updatedItem : j));
      saveJurnalToFirestore(updatedItem);
      triggerToast('Jurnal harian berhasil diperbarui dan tersimpan ke Cloud Firestore!');
    } else {
      // Create new
      const newEntry = {
        ...formData,
        id: `jur-${Date.now()}`
      };
      setJurnalList([newEntry, ...jurnalList]);
      saveJurnalToFirestore(newEntry);
      triggerToast('Jurnal harian baru berhasil ditambahkan dan tersimpan!');
    }

    setIsFormOpen(false);
  };

  // Filtered List
  const filteredJurnal = jurnalList.filter(j => {
    const matchQuery = 
      j.materi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.tujuanPembelajaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.catatanKejadian.toLowerCase().includes(searchQuery.toLowerCase());

    const matchKelas = selectedKelasFilter === 'semua' || j.kelas === selectedKelasFilter;
    const matchMapel = selectedMapelFilter === 'semua' || j.mapel === selectedMapelFilter;

    return matchQuery && matchKelas && matchMapel;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari materi, TP, atau kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
          />
        </div>

        {/* Filters & Add Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          <select
            value={selectedKelasFilter}
            onChange={(e) => setSelectedKelasFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="semua">Semua Kelas</option>
            {kelasList.map(k => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>

          {/* Mapel Filter */}
          <select
            value={selectedMapelFilter}
            onChange={(e) => setSelectedMapelFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="semua">Semua Mapel</option>
            {profilGuru?.mataPelajaran?.map(mp => (
              <option key={mp} value={mp}>{mp}</option>
            ))}
          </select>

          {/* Add New Button */}
          <button
            onClick={handleOpenNewForm}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Buat Jurnal</span>
          </button>
        </div>
      </div>

      {/* Journal Cards List */}
      <div className="space-y-4">
        {filteredJurnal.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-base">Tidak ada jurnal harian ditemukan</h4>
            <p className="text-xs text-slate-400 mt-1">Coba atur ulang filter pencarian atau buat entri jurnal harian baru.</p>
          </div>
        ) : (
          filteredJurnal.map((jur) => (
            <div
              key={jur.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-extrabold text-xs rounded-lg">
                    {jur.kelas}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs rounded-lg">
                    {jur.mapel}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                    Jam Ke- {jur.jamKe}
                  </span>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {jur.hari}, {jur.tanggal}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedJurnalForDetail(jur)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      title="Lihat Detail Jurnal"
                    >
                      <Eye className="w-4 h-4 text-teal-600" />
                    </button>
                    <button
                      onClick={() => handleEdit(jur)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      title="Edit Jurnal"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(jur.id)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      title="Hapus Jurnal"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
                    {jur.materi}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    <span className="font-bold text-teal-700 dark:text-teal-400">TP / Capaian:</span> {jur.tujuanPembelajaran}
                  </p>
                </div>

                {jur.catatanKejadian && (
                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/50 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-bold">Catatan Kejadian / Perilaku:</span> {jur.catatanKejadian}
                  </div>
                )}

                {/* Footer Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
                    <span>
                      Presensi: <strong className="text-emerald-600 dark:text-emerald-400">{jur.hadir} Hadir</strong>
                      {(jur.sakit > 0 || jur.izin > 0 || jur.alpa > 0) && (
                        <span className="text-rose-500 font-semibold ml-1">
                          ({jur.sakit > 0 ? `${jur.sakit} S` : ''} {jur.izin > 0 ? `${jur.izin} I` : ''} {jur.alpa > 0 ? `${jur.alpa} A` : ''})
                        </span>
                      )}
                    </span>
                    <span>Media: <strong className="text-slate-700 dark:text-slate-300">{jur.mediaPembelajaran}</strong></span>
                  </div>

                  <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                    jur.statusKetercapaian === 'Selesai Sesuai Target'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>
                    {jur.statusKetercapaian}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FORM MODAL: Add / Edit Journal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-teal-700 to-emerald-600 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{editingId ? 'Edit Jurnal Mengajar' : 'Isi Jurnal Harian Mengajar'}</span>
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Row 1: Tanggal & Jam Ke */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hari
                  </label>
                  <input
                    type="text"
                    value={formData.hari}
                    readOnly
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Ke-
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 1 - 2"
                    value={formData.jamKe}
                    onChange={(e) => setFormData({ ...formData, jamKe: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Kelas & Mapel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pilih Kelas
                  </label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 dark:text-white"
                  >
                    {kelasList.map(k => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={formData.mapel}
                    onChange={(e) => setFormData({ ...formData, mapel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 dark:text-white"
                  >
                    {profilGuru?.mataPelajaran?.map(mp => (
                      <option key={mp} value={mp}>{mp}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Materi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Materi / Sub-Materi Pembelajaran
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Operasi Matriks / Algoritma Pemrograman"
                  value={formData.materi}
                  onChange={(e) => setFormData({ ...formData, materi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 dark:text-white"
                  required
                />
              </div>

              {/* Row 4: Tujuan Pembelajaran (TP) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tujuan Pembelajaran (TP / Capaian Pembelajaran)
                </label>
                <textarea
                  rows="2"
                  placeholder="Jelaskan TP atau Indikator Ketercapaian yang diajarkan..."
                  value={formData.tujuanPembelajaran}
                  onChange={(e) => setFormData({ ...formData, tujuanPembelajaran: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 dark:text-white"
                  required
                />
              </div>

              {/* Row 5: Presensi Ringkas */}
              <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-200 dark:border-slate-600 space-y-3">
                <span className="block text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  Ringkasan Presensi Kehadiran Siswa
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Hadir</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.hadir}
                      onChange={(e) => setFormData({ ...formData, hadir: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-700 dark:text-amber-400">Sakit</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sakit}
                      onChange={(e) => setFormData({ ...formData, sakit: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-700 dark:text-blue-400">Izin</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.izin}
                      onChange={(e) => setFormData({ ...formData, izin: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-rose-700 dark:text-rose-400">Alpa</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.alpa}
                      onChange={(e) => setFormData({ ...formData, alpa: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Detail Nama Siswa Absen (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sakit: Aulia. Izin: Bagas (Lomba O2SN)."
                    value={formData.siswaAbsenDetail}
                    onChange={(e) => setFormData({ ...formData, siswaAbsenDetail: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Row 6: Catatan Kejadian & Media */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Kejadian / Perilaku di Kelas
                </label>
                <textarea
                  rows="2"
                  placeholder="Catatan keaktifan siswa, kendala pembelajaran, atau dinamika kelas..."
                  value={formData.catatanKejadian}
                  onChange={(e) => setFormData({ ...formData, catatanKejadian: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Ketercapaian
                  </label>
                  <select
                    value={formData.statusKetercapaian}
                    onChange={(e) => setFormData({ ...formData, statusKetercapaian: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Selesai Sesuai Target">Selesai Sesuai Target</option>
                    <option value="Dilanjutkan Minggu Depan">Dilanjutkan Minggu Depan</option>
                    <option value="Perlu Remedial / Pengayaan">Perlu Remedial / Pengayaan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Media / Alat Peraga
                  </label>
                  <input
                    type="text"
                    placeholder="PPT, Modul Ajar, Quizizz, Proyektor"
                    value={formData.mediaPembelajaran}
                    onChange={(e) => setFormData({ ...formData, mediaPembelajaran: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingId ? 'Simpan Perubahan' : 'Simpan Jurnal'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedJurnalForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 bg-teal-700 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Detail Catatan Jurnal Mengajar</span>
              </h3>
              <button
                onClick={() => setSelectedJurnalForDetail(null)}
                className="p-1 rounded-lg hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-200">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">TANGGAL & HARI</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">
                    {selectedJurnalForDetail.hari}, {selectedJurnalForDetail.tanggal}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">KELAS & JAM</span>
                  <span className="font-extrabold text-sm text-teal-600 dark:text-teal-400">
                    {selectedJurnalForDetail.kelas} ({selectedJurnalForDetail.mapel}) - Jam {selectedJurnalForDetail.jamKe}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-400 block mb-0.5">MATERI PEMBELAJARAN:</span>
                <p className="font-bold text-sm text-slate-800 dark:text-white">{selectedJurnalForDetail.materi}</p>
              </div>

              <div>
                <span className="font-bold text-slate-400 block mb-0.5">TUJUAN PEMBELAJARAN (TP):</span>
                <p className="leading-relaxed bg-slate-50 dark:bg-slate-700/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  {selectedJurnalForDetail.tujuanPembelajaran}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Presensi Siswa</span>
                  <p>Hadir: <strong>{selectedJurnalForDetail.hadir}</strong> | Absen: <strong>{(selectedJurnalForDetail.sakit || 0) + (selectedJurnalForDetail.izin || 0) + (selectedJurnalForDetail.alpa || 0)}</strong></p>
                  <p className="text-[11px] text-slate-500 mt-1">{selectedJurnalForDetail.siswaAbsenDetail}</p>
                </div>

                <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-100 dark:border-teal-900/40">
                  <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">Status & Media</span>
                  <p>Status: <strong>{selectedJurnalForDetail.statusKetercapaian}</strong></p>
                  <p className="text-[11px] text-slate-500 mt-1">Media: {selectedJurnalForDetail.mediaPembelajaran}</p>
                </div>
              </div>

              {selectedJurnalForDetail.catatanKejadian && (
                <div>
                  <span className="font-bold text-amber-800 dark:text-amber-400 block mb-0.5">CATATAN KEJADIAN / PERILAKU:</span>
                  <p className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
                    {selectedJurnalForDetail.catatanKejadian}
                  </p>
                </div>
              )}

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setSelectedJurnalForDetail(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
