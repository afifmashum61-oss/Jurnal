// Data Awal (Initial State) untuk Web Jurnal Pegangan Guru

export const initialProfilGuru = {
  nama: "IVA MAKHMUDAH, S.Pd",
  nip: "PEG ID 20503856195003",
  foto: "/foto-guru.png",
  sekolah: "MA Darussalam Sengon",
  alamatSekolah: "Jl. Darussalam No. 01, Sengon",
  tahunAjaran: "2025/2026",
  semester: "Ganjil",
  kepalaSekolah: "Drs. H. Ahmad Dahlan, M.Pd.",
  nipKepalaSekolah: "19750310 199903 1 004",
  mataPelajaran: ["Matematika", "Informatika", "IPA Terpadu"],
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
  { id: "j1", hari: "Senin", jamKe: "1 - 2", waktu: "07.00 - 08.30", kelas: "XI-IPA1", mapel: "Matematika", ruangan: "Lab Komp 1" },
  { id: "j2", hari: "Senin", jamKe: "4 - 5", waktu: "09.45 - 11.15", kelas: "X-1", mapel: "Informatika", ruangan: "R. 101" },
  { id: "j3", hari: "Selasa", jamKe: "2 - 3", waktu: "07.45 - 09.15", kelas: "XI-IPA2", mapel: "Matematika", ruangan: "R. 202" },
  { id: "j4", hari: "Selasa", jamKe: "6 - 7", waktu: "12.30 - 14.00", kelas: "X-2", mapel: "Informatika", ruangan: "Lab Komp 2" },
  { id: "j5", hari: "Rabu", jamKe: "1 - 3", waktu: "07.00 - 09.15", kelas: "XII-MIPA", mapel: "Fisika Dasar", ruangan: "Lab Fisika" },
  { id: "j6", hari: "Kamis", jamKe: "3 - 4", waktu: "08.30 - 10.00", kelas: "XI-IPA1", mapel: "Matematika", ruangan: "R. 201" },
  { id: "j7", hari: "Jumat", jamKe: "1 - 2", waktu: "07.00 - 08.30", kelas: "X-1", mapel: "Informatika", ruangan: "R. 101" },
];

export const initialJurnal = [
  {
    id: "jur-001",
    tanggal: "2026-09-01",
    hari: "Selasa",
    jamKe: "2 - 3",
    kelas: "XI-IPA1",
    mapel: "Matematika",
    materi: "Matriks dan Operasi Perkalian Matriks",
    tujuanPembelajaran: "Siswa mampu mengalikan dua matriks berordo 2x2 dan 3x3 dengan teliti.",
    hadir: 32,
    sakit: 1,
    izin: 1,
    alpa: 0,
    siswaAbsenDetail: "Sakit: Aulia Rahma. Izin: Bagas Dewantara (Lomba O2SN).",
    catatanKejadian: "Diskusi kelompok berjalan sangat aktif. Kelompok 3 tercepat menyelesaikan tantangan soal HOTS.",
    statusKetercapaian: "Selesai Sesuai Target",
    mediaPembelajaran: "PPT Interaktif, LKPD Kelompok, Quizizz"
  },
  {
    id: "jur-002",
    tanggal: "2026-09-03",
    hari: "Kamis",
    jamKe: "3 - 4",
    kelas: "X-1",
    mapel: "Informatika",
    materi: "Algoritma Pemrograman & Flowchart",
    tujuanPembelajaran: "Peserta didik dapat merancang alur logika algoritma cabang (IF-ELSE) menggunakan simbol flowchart.",
    hadir: 30,
    sakit: 0,
    izin: 0,
    alpa: 0,
    siswaAbsenDetail: "Nihil (Hadir Semua)",
    catatanKejadian: "Beberapa siswa masih terkendala membedakan simbol jajar genjang (Input/Output) dan belah ketupat (Kondisi). Perlu latihan tambahan.",
    statusKetercapaian: "Dilanjutkan Minggu Depan",
    mediaPembelajaran: "Draw.io, Whiteboard, LKPD Mandiri"
  },
  {
    id: "jur-003",
    tanggal: "2026-09-04",
    hari: "Jumat",
    jamKe: "1 - 2",
    kelas: "XI-IPA1",
    mapel: "Matematika",
    materi: "Determinant & Invers Matriks 2x2",
    tujuanPembelajaran: "Peserta didik menentukan nilai determinan matriks dan rumus invers.",
    hadir: 33,
    sakit: 1,
    izin: 0,
    alpa: 0,
    siswaAbsenDetail: "Sakit: Dina Olivia",
    catatanKejadian: "Kuis singkat 15 menit terlaksana lancar, rerata nilai kuis 85.",
    statusKetercapaian: "Selesai Sesuai Target",
    mediaPembelajaran: "Slide Presentasi, Modul Ajar"
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
