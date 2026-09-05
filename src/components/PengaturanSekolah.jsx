import React, { useState } from 'react';
import { Settings, Save, Check, RefreshCw, Upload, ShieldCheck, User } from 'lucide-react';

export default function PengaturanSekolah({ 
  profilGuru, 
  setProfilGuru, 
  onResetData,
  showToast 
}) {
  const [formData, setFormData] = useState({ ...profilGuru });
  const [mapelInput, setMapelInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

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

        {/* Section 2: Data Instansi Sekolah */}
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
    </div>
  );
}
