import React, { useState } from 'react';
import { Settings, Save, Check, RefreshCw, Upload, ShieldCheck, User, Plus, Edit, Trash2, Users, X } from 'lucide-react';

export default function PengaturanSekolah({ 
  profilGuru, 
  setProfilGuru, 
  kelasList = [],
  setKelasList,
  siswaList,
  setSiswaList,
  onResetData,
  showToast 
}) {
  const [formData, setFormData] = useState({ ...profilGuru });
  const [mapelInput, setMapelInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Class management modal state
  const [isAddKelasOpen, setIsAddKelasOpen] = useState(false);
  const [editingKelasId, setEditingKelasId] = useState(null);
  const [kelasForm, setKelasForm] = useState({ id: '', nama: '', jumlahSiswa: 30 });

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfilGuru({ ...formData });
    setIsSaved(true);
    if (showToast) showToast('Profil Guru & Data Sekolah berhasil disimpan ke Cloud & Lokal!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddMapel = () => {
    if (mapelInput.trim() && !formData.mataPelajaran.includes(mapelInput.trim())) {
      setFormData({
        ...formData,
        mataPelajaran: [...formData.mataPelajaran, mapelInput.trim()]
      });
      setMapelInput('');
    }
  };

  const handleRemoveMapel = (mpToRemove) => {
    setFormData({
      ...formData,
      mataPelajaran: formData.mataPelajaran.filter(mp => mp !== mpToRemove)
    });
  };

  // Class Management Handlers
  const handleOpenAddKelas = () => {
    setEditingKelasId(null);
    const nextNum = kelasList.length + 1;
    setKelasForm({ id: `X-${nextNum}`, nama: `Kelas X-${nextNum} (Fase E)`, jumlahSiswa: 30 });
    setIsAddKelasOpen(true);
  };

  const handleOpenEditKelas = (k) => {
    setEditingKelasId(k.id);
    setKelasForm({ id: k.id, nama: k.nama, jumlahSiswa: k.jumlahSiswa || 30 });
    setIsAddKelasOpen(true);
  };

  const handleSaveKelas = (e) => {
    e.preventDefault();
    if (!kelasForm.nama.trim()) return;

    const classId = (kelasForm.id.trim() || kelasForm.nama).replace(/\s+/g, '-').toUpperCase();

    if (editingKelasId) {
      // Edit existing class name/details
      const updatedList = kelasList.map(k => 
        k.id === editingKelasId ? { ...k, id: classId, nama: kelasForm.nama, jumlahSiswa: Number(kelasForm.jumlahSiswa) || 30 } : k
      );
      if (setKelasList) setKelasList(updatedList);

      if (editingKelasId !== classId && setSiswaList && siswaList) {
        const newSiswaList = { ...siswaList };
        newSiswaList[classId] = newSiswaList[editingKelasId] || [];
        delete newSiswaList[editingKelasId];
        setSiswaList(newSiswaList);
      }
      if (showToast) showToast(`Nama kelas ${kelasForm.nama} berhasil diperbarui!`);
    } else {
      // Add new class
      if (kelasList.some(k => k.id === classId)) {
        alert('Kode / ID Kelas ini sudah ada, mohon gunakan nama lain.');
        return;
      }
      const newClass = {
        id: classId,
        nama: kelasForm.nama,
        jumlahSiswa: Number(kelasForm.jumlahSiswa) || 30
      };
      if (setKelasList) setKelasList([...kelasList, newClass]);
      if (setSiswaList && siswaList && !siswaList[classId]) {
        setSiswaList({ ...siswaList, [classId]: [] });
      }
      if (showToast) showToast(`Kelas baru (${kelasForm.nama}) berhasil ditambahkan!`);
    }

    setIsAddKelasOpen(false);
  };

  const handleDeleteKelas = (classId, className) => {
    if (kelasList.length <= 1) {
      alert('Sistem harus memiliki minimal 1 kelas.');
      return;
    }
    if (window.confirm(`Hapus kelas "${className}"? Semua daftar siswa & presensi kelas ini akan terhapus.`)) {
      if (setKelasList) setKelasList(kelasList.filter(k => k.id !== classId));
      if (setSiswaList && siswaList) {
        const newSiswaMap = { ...siswaList };
        delete newSiswaMap[classId];
        setSiswaList(newSiswaMap);
      }
      if (showToast) showToast(`Kelas ${className} berhasil dihapus!`, 'Berhasil Dihapus');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-600" />
            <span>Pengaturan Profil & Administrasi Sekolah</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur data guru, kepala sekolah, dan instansi untuk format laporan resmi.
          </p>
        </div>

        {isSaved && (
          <div className="px-3.5 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 animate-bounce">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Berhasil Disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Profil Guru */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <User className="w-4 h-4 text-teal-600" />
            <span>Informasi Guru Pengajar</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap & Gelar
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                PEG ID / NIP Guru
              </label>
              <input
                type="text"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium dark:text-white"
                required
              />
            </div>
          </div>

          {/* Mata Pelajaran Tags */}
          <div className="text-xs">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mata Pelajaran yang Diampu
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {formData.mataPelajaran?.map(mp => (
                <span
                  key={mp}
                  className="px-3 py-1 bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 font-bold rounded-lg flex items-center gap-1.5"
                >
                  <span>{mp}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMapel(mp)}
                    className="hover:text-rose-600 text-slate-400 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah Mata Pelajaran baru (e.g. Fisika)"
                value={mapelInput}
                onChange={(e) => setMapelInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddMapel}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl"
              >
                + Tambah
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Manajemen Daftar Kelas (Tambah, Edit, Kurangi) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span>Manajemen Daftar Kelas ({kelasList.length} Kelas Aktif)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Ubah nama kelas, klik ikon (+) untuk menambah kelas baru, atau kurangi/hapus kelas yang tidak diampu.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddKelas}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tambah Kelas Baru</span>
            </button>
          </div>

          {/* Classes Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {kelasList.map((k) => (
              <div 
                key={k.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200/80 dark:border-slate-600 flex items-center justify-between group hover:border-teal-500 transition"
              >
                <div>
                  <h5 className="font-extrabold text-xs text-slate-800 dark:text-white">{k.nama}</h5>
                  <span className="text-[11px] font-semibold text-slate-400">Kode: {k.id} | ~{k.jumlahSiswa || 30} Siswa</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditKelas(k)}
                    className="p-1.5 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-slate-500 hover:text-teal-700 rounded-lg transition"
                    title="Edit Nama Kelas"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteKelas(k.id, k.nama)}
                    className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    title="Kurangi / Hapus Kelas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Data Instansi Sekolah */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Identitas Sekolah & Kepala Sekolah</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Sekolah / Instansi
              </label>
              <input
                type="text"
                value={formData.sekolah}
                onChange={(e) => setFormData({ ...formData, sekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Sekolah
              </label>
              <input
                type="text"
                value={formData.alamatSekolah}
                onChange={(e) => setFormData({ ...formData, alamatSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kota / Lokasi Tanda Tangan
              </label>
              <input
                type="text"
                placeholder="Jombang"
                value={formData.kota || 'Jombang'}
                onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tahun Ajaran
              </label>
              <input
                type="text"
                placeholder="2025/2026"
                value={formData.tahunAjaran}
                onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold dark:text-white"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.kepalaSekolah}
                onChange={(e) => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.nipKepalaSekolah}
                onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetData}
            className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/40 text-xs font-bold rounded-xl transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Data Ke Demo Awal</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-600/20 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>

      </form>

      {/* Modal Dialog: Tambah / Edit Kelas */}
      {isAddKelasOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <span>{editingKelasId ? 'Edit Nama Kelas' : 'Tambah Kelas Baru (+)'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddKelasOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKelas} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Kelas (e.g. Kelas X-1 (Fase E))
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kelas X-3 (Fase E)"
                  value={kelasForm.nama}
                  onChange={(e) => setKelasForm({ ...kelasForm, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kode Singkat ID Kelas
                  </label>
                  <input
                    type="text"
                    placeholder="X-3"
                    value={kelasForm.id}
                    onChange={(e) => setKelasForm({ ...kelasForm, id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold dark:text-white uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Estimasi Jumlah Siswa
                  </label>
                  <input
                    type="number"
                    value={kelasForm.jumlahSiswa}
                    onChange={(e) => setKelasForm({ ...kelasForm, jumlahSiswa: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold dark:text-white"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddKelasOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/20"
                >
                  {editingKelasId ? 'Simpan Perubahan' : 'Tambah Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
