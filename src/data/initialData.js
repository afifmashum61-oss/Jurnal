// Data Awal (Initial State) untuk Web Jurnal Pegangan Guru

export const initialProfilGuru = {
  nama: "IVA MAKHMUDAH, S.Pd",
  nip: "PEG ID 20503856195003",
  foto: "/foto-guru.png",
  sekolah: "MA Darussalam Sengon",
  alamatSekolah: "Jl. Darussalam No. 01, Sengon, Jombang",
  kota: "Jombang",
  tahunAjaran: "2025/2026",
  semester: "Ganjil",
  kepalaSekolah: "Dr. Achmad Junaidi, S.Si, M.S.I",
  nipKepalaSekolah: "-",
  mataPelajaran: ["Bahasa Arab", "Sejarah Kebudayaan Islam (SKI)"],
};

export const initialKelas = [
  { id: "X-1", nama: "Kelas X-1 (Fase E)", jumlahSiswa: 32 },
  { id: "X-2", nama: "Kelas X-2 (Fase E)", jumlahSiswa: 30 },
  { id: "XI-IPA1", nama: "Kelas XI IPA 1", jumlahSiswa: 34 },
  { id: "XI-IPA2", nama: "Kelas XI IPA 2", jumlahSiswa: 33 },
  { id: "XII-MIPA", nama: "Kelas XII MIPA 1", jumlahSiswa: 31 },
];

export const initialSiswa = {
  "X-1": [
    { id: "s101", nis: "2425101", nama: "Aditya Pratama", gender: "L" },
    { id: "s102", nis: "2425102", nama: "Aulia Rahma", gender: "P" },
    { id: "s103", nis: "2425103", nama: "Bagas Dewantara", gender: "L" },
    { id: "s104", nis: "2425104", nama: "Citra Kirana", gender: "P" },
    { id: "s105", nis: "2425105", nama: "Daffa Rizky", gender: "L" },
    { id: "s106", nis: "2425106", nama: "Eka Putri", gender: "P" },
    { id: "s107", nis: "2425107", nama: "Farhan Ardiansyah", gender: "L" },
    { id: "s108", nis: "2425108", nama: "Gita Gutawa", gender: "P" },
    { id: "s109", nis: "2425109", nama: "Hafiz Syahputra", gender: "L" },
    { id: "s110", nis: "2425110", nama: "Intan Permata", gender: "P" },
  ],
  "XI-IPA1": [
    { id: "s201", nis: "2324201", nama: "Andi Saputra", gender: "L" },
    { id: "s202", nis: "2324202", nama: "Bella Safira", gender: "P" },
    { id: "s203", nis: "2324203", nama: "Candra Wijaya", gender: "L" },
    { id: "s204", nis: "2324204", nama: "Dina Olivia", gender: "P" },
    { id: "s205", nis: "2324205", nama: "Erwin Santoso", gender: "L" },
  ]
};

export const initialJadwal = [
  { id: "j1", hari: "Senin", jamKe: "1 - 2", waktu: "07.00 - 08.30", kelas: "XI-IPA1", mapel: "Bahasa Arab", ruangan: "R. 101" },
  { id: "j2", hari: "Senin", jamKe: "4 - 5", waktu: "09.45 - 11.15", kelas: "X-1", mapel: "Sejarah Kebudayaan Islam (SKI)", ruangan: "R. 102" },
  { id: "j3", hari: "Selasa", jamKe: "2 - 3", waktu: "07.45 - 09.15", kelas: "XI-IPA2", mapel: "Bahasa Arab", ruangan: "R. 202" },
  { id: "j4", hari: "Selasa", jamKe: "6 - 7", waktu: "12.30 - 14.00", kelas: "X-2", mapel: "Sejarah Kebudayaan Islam (SKI)", ruangan: "R. 103" },
  { id: "j5", hari: "Rabu", jamKe: "1 - 3", waktu: "07.00 - 09.15", kelas: "XII-MIPA", mapel: "Bahasa Arab", ruangan: "R. 301" },
  { id: "j6", hari: "Kamis", jamKe: "3 - 4", waktu: "08.30 - 10.00", kelas: "XI-IPA1", mapel: "Sejarah Kebudayaan Islam (SKI)", ruangan: "R. 201" },
  { id: "j7", hari: "Jumat", jamKe: "1 - 2", waktu: "07.00 - 08.30", kelas: "X-1", mapel: "Bahasa Arab", ruangan: "R. 101" },
];

export const initialJurnal = [
  {
    id: "jur-001",
    tanggal: "2026-09-01",
    hari: "Selasa",
    jamKe: "2 - 3",
    kelas: "XI-IPA1",
    mapel: "Bahasa Arab",
    materi: "Tarkib & Qira'ah - Ad-Darsul Awwal (Al-Hiwar fil Madrosah)",
    tujuanPembelajaran: "Peserta didik mampu memahami teks percakapan dan tata bahasa Arab (Jumlah Ismiyyah & Fi'liyyah) dengan tepat.",
    hadir: 32,
    sakit: 1,
    izin: 1,
    alpa: 0,
    siswaAbsenDetail: "Sakit: Aulia Rahma. Izin: Bagas Dewantara (Lomba O2SN).",
    catatanKejadian: "Diskusi kelompok dan pemutaran audio percakapan bahasa Arab berjalan lancar. Kelompok 3 paling fasih melafalkan hiwar.",
    statusKetercapaian: "Selesai Sesuai Target",
    mediaPembelajaran: "Audio Hiwar, Modul Bahasa Arab, Cards Game"
  },
  {
    id: "jur-002",
    tanggal: "2026-09-03",
    hari: "Kamis",
    jamKe: "3 - 4",
    kelas: "X-1",
    mapel: "Sejarah Kebudayaan Islam (SKI)",
    materi: "Perkembangan Islam pada Masa Khulafaur Rasyidin (Abu Bakar As-Siddiq)",
    tujuanPembelajaran: "Peserta didik dapat menganalisis strategi dakwah dan kepemimpinan Khalifah Abu Bakar As-Siddiq R.A.",
    hadir: 30,
    sakit: 0,
    izin: 0,
    alpa: 0,
    siswaAbsenDetail: "Nihil (Hadir Semua)",
    catatanKejadian: "Siswa antusias membuat peta konsep silsilah kepemimpinan dan peristiwa Kodifikasi Al-Qur'an.",
    statusKetercapaian: "Selesai Sesuai Target",
    mediaPembelajaran: "Peta Konsep, Timeline Digital, Modul SKI"
  },
  {
    id: "jur-003",
    tanggal: "2026-09-04",
    hari: "Jumat",
    jamKe: "1 - 2",
    kelas: "XI-IPA1",
    mapel: "Bahasa Arab",
    materi: "Al-Qira'ah: As-Safar wal Istirahah",
    tujuanPembelajaran: "Siswa mampu menterjemahkan teks bacaan bertema liburan dan menganalisis kosa kata baru (Mufrodat).",
    hadir: 33,
    sakit: 1,
    izin: 0,
    alpa: 0,
    siswaAbsenDetail: "Sakit: Dina Olivia",
    catatanKejadian: "Penilaian menterjemahkan teks Arab dilakukan secara individu.",
    statusKetercapaian: "Selesai Sesuai Target",
    mediaPembelajaran: "Kamus Bahasa Arab, LKPD Mandiri"
  }
];

export const initialCatatanSiswa = [
  {
    id: "cat-1",
    tanggal: "2026-09-01",
    kelas: "XI-IPA1",
    namaSiswa: "Bagas Dewantara",
    jenis: "Apresiasi / Prestasi",
    catatan: "Mewakili sekolah dalam Kejuaraan O2SN Tingkat Kabupaten.",
    tindakLanjut: "Pemberian materi susulan dan dispensasi absensi resmi."
  },
  {
    id: "cat-2",
    tanggal: "2026-09-03",
    kelas: "X-1",
    namaSiswa: "Farhan Ardiansyah",
    jenis: "Kedisiplinan",
    catatan: "Terlambat masuk kelas 15 menit pada jam pelajaran pertama Informatika.",
    tindakLanjut: "Diberikan teguran lisan & konseling ringan tentang disiplin waktu."
  }
];
