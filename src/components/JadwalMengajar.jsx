import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, BookOpen, Trash2, Edit, X, Check } from 'lucide-react';

export default function JadwalMengajar({ 
  jadwalList, 
  setJadwalList, 
  kelasList, 
  profilGuru 
}) {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    hari: 'Senin',
    jamKe: '1 - 2',
    waktu: '07.00 - 08.30',
    kelas: kelasList[0]?.id || 'X-1',
    mapel: profilGuru?.mataPelajaran?.[0] || 'Matematika',
    ruangan: 'R. 101'
  });

  const handleOpenAdd = (day = 'Senin') => {
    setEditingId(null);
    setFormData({
      hari: day,
      jamKe: '1 - 2',
      waktu: '07.00 - 08.30',
      kelas: kelasList[0]?.id || 'X-1',
      mapel: profilGuru?.mataPelajaran?.[0] || 'Matematika',
      ruangan: 'R. 101'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (j) => {
    setEditingId(j.id);
    setFormData({ ...j });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal mengajar ini?')) {
      setJadwalList(jadwalList.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setJadwalList(jadwalList.map(j => j.id === editingId ? { ...formData, id: editingId } : j));
    } else {
      setJadwalList([...jadwalList, { ...formData, id: `jadwal-${Date.now()}` }]);
    }
    setIsModalOpen(false);
  };

  // Get current day name
  const currentDayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
        <div>
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <span>Matriks Jadwal Mengajar Mingguan</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            T.A. {profilGuru?.tahunAjaran || '2025/2026'} ({profilGuru?.semester || 'Ganjil'})
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd('Senin')}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Sesi Jadwal</span>
        </button>
      </div>

      {/* Days Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => {
          const isToday = day.toLowerCase() === currentDayName.toLowerCase();
          const dayItems = jadwalList.filter(j => j.hari.toLowerCase() === day.toLowerCase());

          return (
            <div 
              key={day}
              className={`
                bg-white dark:bg-slate-800 rounded-2xl border transition-all flex flex-col justify-between overflow-hidden
                ${isToday 
                  ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-lg' 
                  : 'border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md'
                }
              `}
            >
              {/* Day Card Header */}
              <div className={`
                p-4 border-b flex items-center justify-between
                ${isToday 
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-600' 
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-white'
                }
              `}>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight">{day}</span>
                  {isToday && (
                    <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Hari Ini
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleOpenAdd(day)}
                  className={`p-1.5 rounded-lg transition ${
                    isToday ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500'
                  }`}
                  title={`Tambah Sesi pada hari ${day}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Day Items List */}
              <div className="p-4 space-y-3 flex-1">
                {dayItems.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl">
                    <p className="text-xs text-slate-400 font-medium">Tidak ada jadwal mengajar</p>
                  </div>
                ) : (
                  dayItems.map((j) => (
                    <div 
                      key={j.id} 
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-700/80 relative group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 font-extrabold text-xs">
                          {j.kelas}
                        </span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={() => handleEdit(j)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(j.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
                        {j.mapel}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-600/50">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-teal-600" />
                          {j.waktu} (Jam {j.jamKe})
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          {j.ruangan}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 bg-teal-700 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{editingId ? 'Edit Jadwal Mengajar' : 'Tambah Jadwal Mengajar'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hari
                </label>
                <select
                  value={formData.hari}
                  onChange={(e) => setFormData({ ...formData, hari: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold dark:text-white"
                >
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Ke-
                  </label>
                  <input
                    type="text"
                    placeholder="1 - 2"
                    value={formData.jamKe}
                    onChange={(e) => setFormData({ ...formData, jamKe: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Waktu Jam
                  </label>
                  <input
                    type="text"
                    placeholder="07.00 - 08.30"
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas
                  </label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold dark:text-white"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold dark:text-white"
                  >
                    {profilGuru?.mataPelajaran?.map(mp => (
                      <option key={mp} value={mp}>{mp}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ruangan / Lokasi
                </label>
                <input
                  type="text"
                  placeholder="Ruang 101 / Lab Komputer 1"
                  value={formData.ruangan}
                  onChange={(e) => setFormData({ ...formData, ruangan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium dark:text-white"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow"
                >
                  Simpan Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
