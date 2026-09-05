import React, { useState } from 'react';
import { FileText, Plus, Search, Award, ShieldAlert, Trash2, X, Check } from 'lucide-react';

export default function CatatanSiswa({ 
  catatanList, 
  setCatatanList, 
  kelasList,
  showToast 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kelas: kelasList[0]?.id || 'X-1',
    namaSiswa: '',
    jenis: 'Apresiasi / Prestasi',
    catatan: '',
    tindakLanjut: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaSiswa || !formData.catatan) return;

    setCatatanList([
      { ...formData, id: `cat-${Date.now()}` },
      ...catatanList
    ]);
    if (showToast) showToast(`Catatan kejadian siswa (${formData.namaSiswa}) berhasil disimpan!`);
    setIsModalOpen(false);
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      kelas: kelasList[0]?.id || 'X-1',
      namaSiswa: '',
      jenis: 'Apresiasi / Prestasi',
      catatan: '',
      tindakLanjut: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus catatan kejadian siswa ini?')) {
      setCatatanList(catatanList.filter(c => c.id !== id));
      if (showToast) showToast('Catatan siswa berhasil dihapus!', 'Berhasil Dihapus');
    }
  };

  const filteredCatatan = catatanList.filter(c => 
    c.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.catatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama siswa atau catatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Catat Kejadian Siswa</span>
        </button>
      </div>

      {/* Catatan List */}
      <div className="space-y-4">
        {filteredCatatan.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-base">Belum Ada Catatan Kejadian Siswa</h4>
            <p className="text-xs text-slate-400 mt-1">Gunakan fitur ini untuk mencatat apresiasi prestasi maupun pembinaan kedisiplinan siswa.</p>
          </div>
        ) : (
          filteredCatatan.map((c) => {
            const isPrestasi = c.jenis.toLowerCase().includes('apresiasi') || c.jenis.toLowerCase().includes('prestasi');

            return (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isPrestasi ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                    }`}>
                      {isPrestasi ? <Award className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-base">
                        {c.namaSiswa}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-bold text-teal-600 dark:text-teal-400">{c.kelas}</span>
                        <span>• Tanggal: {c.tanggal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                      isPrestasi 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' 
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                    }`}>
                      {c.jenis}
                    </span>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 block mb-0.5">Uraian Kejadian:</span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {c.catatan}
                    </p>
                  </div>

                  {c.tindakLanjut && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700">
                      <span className="font-bold text-teal-700 dark:text-teal-400 block mb-0.5">Tindak Lanjut / Solusi:</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        {c.tindakLanjut}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add Catatan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 bg-teal-700 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Tambah Catatan Kejadian Siswa</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kelas</label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold"
                  >
                    {kelasList.map(k => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Siswa</label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap siswa"
                  value={formData.namaSiswa}
                  onChange={(e) => setFormData({ ...formData, namaSiswa: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori Catatan</label>
                <select
                  value={formData.jenis}
                  onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold"
                >
                  <option value="Apresiasi / Prestasi">Apresiasi / Prestasi Siswa</option>
                  <option value="Kedisiplinan / Ketertiban">Kedisiplinan / Ketertiban</option>
                  <option value="Perkembangan Akademik">Perkembangan Akademik / Remedial</option>
                  <option value="Konseling / Karakter">Konseling & Karakter</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Uraian Kejadian</label>
                <textarea
                  rows="3"
                  placeholder="Tuliskan ulasan kejadian secara obyektif..."
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tindak Lanjut / Solusi</label>
                <input
                  type="text"
                  placeholder="Contoh: Pemberian apresiasi / Konseling wali kelas"
                  value={formData.tindakLanjut}
                  onChange={(e) => setFormData({ ...formData, tindakLanjut: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold shadow"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
