import { 
  Student, 
  RuleViolationMaster, 
  RewardMaster, 
  ConsequenceTier, 
  UserAccount, 
  AcademicSubject,
  AttendanceRecord,
  StudentViolationRecord,
  StudentRewardRecord,
  StudentGrades,
  CharacterAssessment,
  WhatsAppNotificationLog
} from '../types';

export const SCHOOL_INFO = {
  name: 'SMP Negeri 2 Tanjung',
  motto: 'Berakhlak Mulia, Cerdas, Berprestasi, dan Berwawasan Lingkungan',
  address: 'Jl. Pendidikan No. 45, Tanjung',
  npsn: '30201845',
  akreditasi: 'A (Unggul)',
  email: 'info@smpn2tanjung.sch.id',
  phone: '(0370) 612345',
  headmaster: 'Drs. H. Suryadi, M.Pd.',
  nipHeadmaster: '19680512 199303 1 008',
  bkCoordinator: 'Dra. Hj. Siti Rohmah, M.Si.',
  kesiswaan: 'Ahmad Subagio, S.Pd.',
  academicYear: '2024/2025',
  semester: 'Ganjil' as const
};

export const DEMO_USERS: UserAccount[] = [
  {
    id: 'user-kepsek',
    username: 'kepsek',
    name: 'Drs. H. Suryadi, M.Pd.',
    role: 'admin',
    title: 'Kepala Sekolah & Administrator',
  },
  {
    id: 'user-wali8a',
    username: 'guru_budi',
    name: 'Budi Santoso, S.Pd.',
    role: 'guru',
    title: 'Wali Kelas 8A & Guru Matematika',
    assignedClass: '8A'
  },
  {
    id: 'user-bk',
    username: 'guru_bk',
    name: 'Dra. Hj. Siti Rohmah, M.Si.',
    role: 'bk',
    title: 'Guru Bimbingan Konseling & Kesiswaan',
  },
  {
    id: 'user-siswa1',
    username: 'rizky_pratama',
    name: 'Muhammad Rizky Pratama',
    role: 'siswa_ortu',
    title: 'Siswa / Orang Tua Siswa (Kelas 8A)',
    studentId: 's-101',
    assignedClass: '8A'
  },
  {
    id: 'user-siswa2',
    username: 'dimas_bagus',
    name: 'Dimas Bagus Saputra',
    role: 'siswa_ortu',
    title: 'Siswa / Orang Tua Siswa (Kelas 8A - Pemantauan Khusus)',
    studentId: 's-105',
    assignedClass: '8A'
  }
];

export const CLASSES = ['7A', '7B', '8A', '8B', '9A', '9B'];

export const SUBJECTS: AcademicSubject[] = [
  { id: 'sub-mat', name: 'Matematika', code: 'MAT', kkm: 75, teacherName: 'Budi Santoso, S.Pd.' },
  { id: 'sub-indo', name: 'Bahasa Indonesia', code: 'BIN', kkm: 75, teacherName: 'Nurul Hidayati, M.Pd.' },
  { id: 'sub-ipa', name: 'Ilmu Pengetahuan Alam (IPA)', code: 'IPA', kkm: 75, teacherName: 'Hendro Wijaya, S.Si.' },
  { id: 'sub-ing', name: 'Bahasa Inggris', code: 'ING', kkm: 75, teacherName: 'Dina Marlina, S.Pd.' },
  { id: 'sub-pp', name: 'Pendidikan Pancasila', code: 'PPN', kkm: 78, teacherName: 'Ahmad Subagio, S.Pd.' },
  { id: 'sub-pai', name: 'Pendidikan Agama Islam', code: 'PAI', kkm: 80, teacherName: 'Ustadz H. Mansyur, S.Ag.' },
  { id: 'sub-ips', name: 'Ilmu Pengetahuan Sosial (IPS)', code: 'IPS', kkm: 75, teacherName: 'Ratna Dewi, S.Pd.' },
  { id: 'sub-pjok', name: 'PJOK', code: 'PJK', kkm: 75, teacherName: 'Agus Triono, S.Pd.' },
  { id: 'sub-inf', name: 'Informatika', code: 'INF', kkm: 75, teacherName: 'Wahyu Ramadhan, S.Kom.' }
];

export const RULE_VIOLATION_MASTER: RuleViolationMaster[] = [
  {
    id: 'rule-01',
    code: 'TT-01',
    category: 'Kedisiplinan & Waktu',
    title: 'Terlambat Masuk Sekolah (>07.00 WITA)',
    description: 'Datang ke sekolah melebihi batas waktu apel pagi pukul 07.00 tanpa alasan yang sah.',
    points: 5
  },
  {
    id: 'rule-02',
    code: 'TT-02',
    category: 'Kerapian & Seragam',
    title: 'Atribut Seragam Tidak Lengkap',
    description: 'Tidak mengenakan dasi, topi upacara, ikat pinggang standar, atau badge lokasi sekolah.',
    points: 5
  },
  {
    id: 'rule-03',
    code: 'TT-03',
    category: 'Kerapian & Seragam',
    title: 'Rambut Tidak Sesuai Standar / Dicat',
    description: 'Rambut putra panjang menyentuh kerah/telinga, model potongan tidak wajar, atau dicat warna.',
    points: 10
  },
  {
    id: 'rule-04',
    code: 'TT-04',
    category: 'Kedisiplinan & Waktu',
    title: 'Meninggalkan Kelas / KBM Tanpa Izin',
    description: 'Keluar kelas pada saat guru mengajar atau pergantian jam pelajaran tanpa surat izin.',
    points: 10
  },
  {
    id: 'rule-05',
    code: 'TT-05',
    category: 'Kerapian Belajar',
    title: 'Penggunaan Handphone Tanpa Izin Guru',
    description: 'Bermain gim atau media sosial saat jam pembelajaran berlangsung.',
    points: 15
  },
  {
    id: 'rule-06',
    code: 'TT-06',
    category: 'Kedisiplinan & Waktu',
    title: 'Membolos Sekolah / Tidak Masuk Tanpa Izin',
    description: 'Tidak masuk sekolah tanpa surat izin atau nongkrong di luar gerbang berseragam sekolah.',
    points: 15
  },
  {
    id: 'rule-07',
    code: 'TT-07',
    category: 'Perilaku & Etika',
    title: 'Melompati Pagar / Menerobos Gerbang',
    description: 'Keluar atau masuk lingkungan SMP Negeri 2 Tanjung melalui jalur tidak resmi demi menghindari piket.',
    points: 20
  },
  {
    id: 'rule-08',
    code: 'TT-08',
    category: 'Perilaku & Etika',
    title: 'Berperilaku Tidak Sopan Terhadap Guru/Staf',
    description: 'Menentang instruksi pendidik, membentak, atau berkata kotor di depan pendidik dan tenaga kependidikan.',
    points: 25
  },
  {
    id: 'rule-09',
    code: 'TT-09',
    category: 'Pelanggaran Berat',
    title: 'Membawa / Merokok / Vape di Sekolah',
    description: 'Menghisap atau membawa rokok konvensional maupun elektrik di lingkungan atau saat berseragam.',
    points: 35
  },
  {
    id: 'rule-10',
    code: 'TT-10',
    category: 'Pelanggaran Berat',
    title: 'Perundungan / Bullying Fisik atau Verbal',
    description: 'Mengintimidasi, memeras, mengejek fisik, atau menganiaya sesama siswa.',
    points: 40
  },
  {
    id: 'rule-11',
    code: 'TT-11',
    category: 'Pelanggaran Berat',
    title: 'Perkelahian / Tawuran Antar Pelajar',
    description: 'Terlibat perkelahian satu lawan satu atau kelompok baik di dalam maupun di luar sekolah.',
    points: 75
  }
];

export const REWARD_MASTER: RewardMaster[] = [
  {
    id: 'rew-01',
    code: 'PR-01',
    category: 'Akademik',
    title: 'Juara 1 Lomba OSN / Sains Tingkat Kabupaten/Provinsi',
    description: 'Meraih medali emas atau juara 1 lomba olimpiade sains resmi.',
    rewardPoints: 50
  },
  {
    id: 'rew-02',
    code: 'PR-02',
    category: 'Akademik',
    title: 'Juara 2 atau 3 Lomba Akademik Tingkat Kabupaten',
    description: 'Mengharumkan nama sekolah di kompetisi mata pelajaran atau cerdas cermat.',
    rewardPoints: 35
  },
  {
    id: 'rew-03',
    code: 'PR-03',
    category: 'Non-Akademik',
    title: 'Juara 1 O2SN / FLS2N / Olahraga & Seni',
    description: 'Prestasi gemilang pada kejuaraan olahraga atau seni budaya resmi.',
    rewardPoints: 40
  },
  {
    id: 'rew-04',
    code: 'PR-04',
    category: 'Organisasi & Sosial',
    title: 'Pengurus Inti OSIS / Dewan Penggalang Pramuka Aktif',
    description: 'Menunjukkan kepemimpinan teladan dan dedikasi penuh dalam kegiatan kesiswaan.',
    rewardPoints: 25
  },
  {
    id: 'rew-05',
    code: 'PR-05',
    category: 'Karakter & Kejujuran',
    title: 'Aksi Kejujuran Istimewa (Mengembalikan Uang/Barang Berharga)',
    description: 'Menemukan barang atau uang berharga dan menyerahkannya ke guru piket dengan jujur.',
    rewardPoints: 30
  },
  {
    id: 'rew-06',
    code: 'PR-06',
    category: 'Kedisiplinan Teladan',
    title: 'Presensi 100% Hadir Tepat Waktu (Satu Semester)',
    description: 'Tidak pernah terlambat, alpa, maupun absen selama 1 semester penuh.',
    rewardPoints: 30
  },
  {
    id: 'rew-07',
    code: 'PR-07',
    category: 'Karakter & Kejujuran',
    title: 'Keteladanan Gotong Royong & Lingkungan Adiwiyata',
    description: 'Inisiator pelestarian taman sekolah, pemilahan sampah, dan tutor sebaya.',
    rewardPoints: 20
  }
];

export const CONSEQUENCE_TIERS: ConsequenceTier[] = [
  {
    minPoints: 1,
    maxPoints: 15,
    level: 1,
    title: 'Peringatan Lisan & Bimbingan Wali Kelas',
    action: 'Pemberian arahan persuasif, teguran mendidik, dan pencatatan komitmen perbaikan sikap di buku saku siswa.',
    handlingRole: 'Wali Kelas & Guru Piket',
    requiresParentCall: false,
    color: 'emerald'
  },
  {
    minPoints: 16,
    maxPoints: 30,
    level: 2,
    title: 'Peringatan Tertulis I & Tugas Edukatif',
    action: 'Pemberitahuan resmi ke orang tua via WhatsApp, penandatanganan surat pernyataan, serta tugas edukatif kebersihan atau literasi perpustakaan.',
    handlingRole: 'Wali Kelas & Tim Kesiswaan',
    requiresParentCall: false,
    color: 'blue'
  },
  {
    minPoints: 31,
    maxPoints: 50,
    level: 3,
    title: 'Peringatan Tertulis II & Surat Panggilan Orang Tua',
    action: 'Pemanggilan resmi orang tua ke Ruang Bimbingan Konseling (BK), penandatanganan pakta integritas di hadapan Guru BK dan Wali Kelas.',
    handlingRole: 'Guru Bimbingan Konseling (BK)',
    requiresParentCall: true,
    color: 'amber'
  },
  {
    minPoints: 51,
    maxPoints: 75,
    level: 4,
    title: 'Peringatan Keras, Pembinaan Khusus & Skorsing',
    action: 'Surat Panggilan Orang Tua Tahap 2, pembinaan kepribadian intensif, skorsing akademik mandiri di rumah selama 3-5 hari didampingi tugas harian.',
    handlingRole: 'Guru BK, Wakasek Kesiswaan, & Kepala Sekolah',
    requiresParentCall: true,
    color: 'orange'
  },
  {
    minPoints: 76,
    maxPoints: 999,
    level: 5,
    title: 'Konferensi Kasus Terpadu & Evaluasi Kelanjutan Studi',
    action: 'Rapat pleno penanganan kasus bersama Kepala Sekolah, Komite Sekolah, Dinas/Pengawas, Dewan Guru, dan Orang Tua Siswa.',
    handlingRole: 'Kepala Sekolah & Komite Sekolah',
    requiresParentCall: true,
    color: 'rose'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-101',
    nisn: '0098765431',
    nis: '23240801',
    name: 'Muhammad Rizky Pratama',
    gender: 'L',
    className: '8A',
    parentName: 'H. Hendra Pratama, S.T.',
    parentPhone: '6281234567890',
    address: 'Jl. Melati No. 12, Tanjung',
    homeroomTeacher: 'Budi Santoso, S.Pd.',
    totalAlpa: 0,
    totalSakit: 1,
    totalIzin: 0,
    totalHadir: 49,
    attendancePercentage: 98,
    academicAverage: 92.4,
    totalViolationPoints: 0,
    totalRewardPoints: 80,
    netCharacterScore: 80,
    isTeladanCandidate: true,
  },
  {
    id: 's-102',
    nisn: '0098765432',
    nis: '23240802',
    name: 'Siti Nurhaliza Putri',
    gender: 'P',
    className: '8A',
    parentName: 'Rahmat Hidayat',
    parentPhone: '6281345678901',
    address: 'Jl. Kenanga No. 5, Tanjung',
    homeroomTeacher: 'Budi Santoso, S.Pd.',
    totalAlpa: 0,
    totalSakit: 0,
    totalIzin: 1,
    totalHadir: 49,
    attendancePercentage: 98,
    academicAverage: 91.8,
    totalViolationPoints: 0,
    totalRewardPoints: 75,
    netCharacterScore: 75,
    isTeladanCandidate: true,
  },
  {
    id: 's-103',
    nisn: '0098765433',
    nis: '23240803',
    name: 'Anisa Rahmawati',
    gender: 'P',
    className: '8A',
    parentName: 'Subhan Alamsyah',
    parentPhone: '6281987654321',
    address: 'Komplek Griya Indah Blok B-4, Tanjung',
    homeroomTeacher: 'Budi Santoso, S.Pd.',
    totalAlpa: 0,
    totalSakit: 1,
    totalIzin: 1,
    totalHadir: 48,
    attendancePercentage: 96,
    academicAverage: 89.6,
    totalViolationPoints: 5,
    totalRewardPoints: 45,
    netCharacterScore: 40,
    isTeladanCandidate: true,
  },
  {
    id: 's-104',
    nisn: '0098765434',
    nis: '23240804',
    name: 'Ahmad Fauzi Akbar',
    gender: 'L',
    className: '8A',
    parentName: 'Drs. H. Mulyadi',
    parentPhone: '6285234567899',
    address: 'Jl. Flamboyan No. 18, Tanjung',
    homeroomTeacher: 'Budi Santoso, S.Pd.',
    totalAlpa: 1,
    totalSakit: 2,
    totalIzin: 1,
    totalHadir: 46,
    attendancePercentage: 92,
    academicAverage: 84.5,
    totalViolationPoints: 10,
    totalRewardPoints: 20,
    netCharacterScore: 10,
    isTeladanCandidate: false,
  },
  {
    id: 's-105',
    nisn: '0098765435',
    nis: '23240805',
    name: 'Dimas Bagus Saputra',
    gender: 'L',
    className: '8A',
    parentName: 'Suratno Wijaya',
    parentPhone: '6287712345678',
    address: 'Dusun Karang Anyar RT 03/RW 01, Tanjung',
    homeroomTeacher: 'Budi Santoso, S.Pd.',
    totalAlpa: 6, // MOST ALPA IN 8A
    totalSakit: 3,
    totalIzin: 1,
    totalHadir: 40,
    attendancePercentage: 80,
    academicAverage: 71.2,
    totalViolationPoints: 45, // Tier 3 - Panggilan Orang Tua
    totalRewardPoints: 0,
    netCharacterScore: -45,
    isTeladanCandidate: false,
  },
  {
    id: 's-106',
    nisn: '0098765436',
    nis: '23240806',
    name: 'Putri Maharani Lestari',
    gender: 'P',
    className: '8A',
    parentName: 'Dra. Yuliana',
    parentPhone: '6282134567890',
    address: 'Jl. Cempaka No. 8, Tanjung',
    homeroomTeacher: 'Budi Santoso, S.Pd.',
    totalAlpa: 0,
    totalSakit: 8, // MOST SAKIT IN 8A (Kondisi sakit tipus)
    totalIzin: 2,
    totalHadir: 40,
    attendancePercentage: 80,
    academicAverage: 82.0,
    totalViolationPoints: 0,
    totalRewardPoints: 20,
    netCharacterScore: 20,
    isTeladanCandidate: false,
  },
  {
    id: 's-107',
    nisn: '0098765437',
    nis: '23240807',
    name: 'Kevin Aditya Pratama',
    gender: 'L',
    className: '8A',
    parentName: 'Bambang Irawan',
    parentPhone: '6285678901234',
    address: 'Jl. Anggrek No. 34, Tanjung',
    homeroomTeacher: 'Budi Santoso, S.Pd.',
    totalAlpa: 1,
    totalSakit: 1,
    totalIzin: 6, // MOST IZIN IN 8A (Izin lomba taekwondo daerah)
    totalHadir: 42,
    attendancePercentage: 84,
    academicAverage: 85.3,
    totalViolationPoints: 15,
    totalRewardPoints: 40,
    netCharacterScore: 25,
    isTeladanCandidate: false,
  },
  // Class 7A Students
  {
    id: 's-201',
    nisn: '0101234501',
    nis: '24250701',
    name: 'Bilqis Humaira Syakira',
    gender: 'P',
    className: '7A',
    parentName: 'Farhan Maulana',
    parentPhone: '6281398765432',
    address: 'Jl. Seruni No. 2, Tanjung',
    homeroomTeacher: 'Nurul Hidayati, M.Pd.',
    totalAlpa: 0,
    totalSakit: 0,
    totalIzin: 0,
    totalHadir: 50,
    attendancePercentage: 100,
    academicAverage: 94.2,
    totalViolationPoints: 0,
    totalRewardPoints: 90,
    netCharacterScore: 90,
    isTeladanCandidate: true,
  },
  {
    id: 's-202',
    nisn: '0101234502',
    nis: '24250702',
    name: 'Fajar Ramadhan',
    gender: 'L',
    className: '7A',
    parentName: 'Iskandar Zulkarnain',
    parentPhone: '6287890123456',
    address: 'Dusun Barat Kali RT 02, Tanjung',
    homeroomTeacher: 'Nurul Hidayati, M.Pd.',
    totalAlpa: 7, // CRITICAL ALPA
    totalSakit: 2,
    totalIzin: 0,
    totalHadir: 41,
    attendancePercentage: 82,
    academicAverage: 69.5,
    totalViolationPoints: 35,
    totalRewardPoints: 0,
    netCharacterScore: -35,
    isTeladanCandidate: false,
  },
  {
    id: 's-203',
    nisn: '0101234503',
    nis: '24250703',
    name: 'Dewi Ayu Sekarwangi',
    gender: 'P',
    className: '7A',
    parentName: 'Kuswanto',
    parentPhone: '6282245678912',
    address: 'Jl. Diponegoro No. 7, Tanjung',
    homeroomTeacher: 'Nurul Hidayati, M.Pd.',
    totalAlpa: 0,
    totalSakit: 6, // High Sakit
    totalIzin: 3,
    totalHadir: 41,
    attendancePercentage: 82,
    academicAverage: 86.1,
    totalViolationPoints: 0,
    totalRewardPoints: 30,
    netCharacterScore: 30,
    isTeladanCandidate: false,
  },
  // Class 9A Students
  {
    id: 's-301',
    nisn: '0089876501',
    nis: '22230901',
    name: 'Arya Yudha Pratama',
    gender: 'L',
    className: '9A',
    parentName: 'Mayor (Purn) Teguh Yudha',
    parentPhone: '6281123456789',
    address: 'Jl. Pahlawan No. 88, Tanjung',
    homeroomTeacher: 'Hendro Wijaya, S.Si.',
    totalAlpa: 0,
    totalSakit: 0,
    totalIzin: 1,
    totalHadir: 49,
    attendancePercentage: 98,
    academicAverage: 95.0,
    totalViolationPoints: 0,
    totalRewardPoints: 110,
    netCharacterScore: 110,
    isTeladanCandidate: true,
  },
  {
    id: 's-302',
    nisn: '0089876502',
    nis: '22230902',
    name: 'Bayu Arya Pangestu',
    gender: 'L',
    className: '9A',
    parentName: 'Suwandi',
    parentPhone: '6283890123456',
    address: 'Jl. Nelayan RT 05, Tanjung',
    homeroomTeacher: 'Hendro Wijaya, S.Si.',
    totalAlpa: 5,
    totalSakit: 2,
    totalIzin: 1,
    totalHadir: 42,
    attendancePercentage: 84,
    academicAverage: 73.4,
    totalViolationPoints: 55, // Tier 4 - Peringatan Keras & Pembinaan BK
    totalRewardPoints: 0,
    netCharacterScore: -55,
    isTeladanCandidate: false,
  },
  {
    id: 's-303',
    nisn: '0089876503',
    nis: '22230903',
    name: 'Zahra Almira Fitri',
    gender: 'P',
    className: '9A',
    parentName: 'dr. H. Faisal Basri, Sp.A',
    parentPhone: '6281298765000',
    address: 'Jl. Kesehatan Indah No. 1, Tanjung',
    homeroomTeacher: 'Hendro Wijaya, S.Si.',
    totalAlpa: 0,
    totalSakit: 1,
    totalIzin: 5, // High Izin
    totalHadir: 44,
    attendancePercentage: 88,
    academicAverage: 91.5,
    totalViolationPoints: 0,
    totalRewardPoints: 60,
    netCharacterScore: 60,
    isTeladanCandidate: true,
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-01',
    studentId: 's-105',
    date: '2025-02-17',
    status: 'alpa',
    note: 'Tidak hadir tanpa kabar, orang tua belum dapat dihubungi saat bel masuk',
    recordedBy: 'Budi Santoso, S.Pd.',
    period: 'Harian',
    timestamp: '2025-02-17 07:25'
  },
  {
    id: 'att-02',
    studentId: 's-105',
    date: '2025-02-16',
    status: 'alpa',
    note: 'Terlihat di luar warung depan sekolah saat jam KBM',
    recordedBy: 'Budi Santoso, S.Pd.',
    period: 'Harian',
    timestamp: '2025-02-16 07:30'
  },
  {
    id: 'att-03',
    studentId: 's-106',
    date: '2025-02-17',
    status: 'sakit',
    note: 'Surat dokter Puskesmas Tanjung (Gejala tipus)',
    recordedBy: 'Budi Santoso, S.Pd.',
    period: 'Harian',
    timestamp: '2025-02-17 07:15'
  },
  {
    id: 'att-04',
    studentId: 's-107',
    date: '2025-02-17',
    status: 'izin',
    note: 'Dispensasi mengikuti training camp Taekwondo Pra-Porprov',
    recordedBy: 'Budi Santoso, S.Pd.',
    period: 'Harian',
    timestamp: '2025-02-17 07:10'
  },
  {
    id: 'att-05',
    studentId: 's-101',
    date: '2025-02-17',
    status: 'hadir',
    note: 'Tepat waktu, piket kebersihan kelas',
    recordedBy: 'Budi Santoso, S.Pd.',
    period: 'Harian',
    timestamp: '2025-02-17 06:45'
  },
  {
    id: 'att-06',
    studentId: 's-202',
    date: '2025-02-17',
    status: 'alpa',
    note: 'Alpa hari ke-2 berturut-turut minggu ini',
    recordedBy: 'Nurul Hidayati, M.Pd.',
    period: 'Harian',
    timestamp: '2025-02-17 07:30'
  }
];

export const INITIAL_VIOLATIONS: StudentViolationRecord[] = [
  {
    id: 'viol-01',
    studentId: 's-105',
    studentName: 'Dimas Bagus Saputra',
    className: '8A',
    ruleId: 'rule-06',
    ruleTitle: 'Membolos Sekolah / Tidak Masuk Tanpa Izin',
    points: 15,
    date: '2025-02-16',
    location: 'Warung sekitar dermaga Tanjung',
    reportedBy: 'Agus Triono, S.Pd. (Guru Piket)',
    notes: 'Ditemukan bersama 2 siswa saat jam pelajaran ke-3 berlangsung',
    status: 'Dalam Pembinaan BK',
    consequenceAssigned: 'Pemanggilan Orang Tua ke Ruang BK',
    parentNotified: true,
    parentNotificationDate: '2025-02-16 10:15'
  },
  {
    id: 'viol-02',
    studentId: 's-105',
    studentName: 'Dimas Bagus Saputra',
    className: '8A',
    ruleId: 'rule-09',
    ruleTitle: 'Membawa / Merokok / Vape di Sekolah',
    points: 30,
    date: '2025-02-05',
    location: 'Belakang laboratorium IPA',
    reportedBy: 'Hendro Wijaya, S.Si.',
    notes: 'Membawa rokok elektrik dalam saku jaket',
    status: 'Dalam Pembinaan BK',
    consequenceAssigned: 'Peringatan Tertulis II & Sita Barang Bukti',
    parentNotified: true,
    parentNotificationDate: '2025-02-05 13:40'
  },
  {
    id: 'viol-03',
    studentId: 's-302',
    studentName: 'Bayu Arya Pangestu',
    className: '9A',
    ruleId: 'rule-10',
    ruleTitle: 'Perundungan / Bullying Fisik atau Verbal',
    points: 40,
    date: '2025-02-10',
    location: 'Area parkir sepeda belakang musholla',
    reportedBy: 'Dra. Hj. Siti Rohmah, M.Si.',
    notes: 'Mengintimidasi adik kelas 7 meminta uang saku',
    status: 'Dalam Pembinaan BK',
    consequenceAssigned: 'Peringatan Keras & Surat Perjanjian Khusus',
    parentNotified: true,
    parentNotificationDate: '2025-02-10 11:00'
  },
  {
    id: 'viol-04',
    studentId: 's-107',
    studentName: 'Kevin Aditya Pratama',
    className: '8A',
    ruleId: 'rule-05',
    ruleTitle: 'Penggunaan Handphone Tanpa Izin Guru',
    points: 15,
    date: '2025-01-22',
    location: 'Ruang Kelas 8A',
    reportedBy: 'Budi Santoso, S.Pd.',
    notes: 'Main gim mobile saat latihan soal Matematika',
    status: 'Selesai / Resolusi',
    consequenceAssigned: 'Handphone diamankan sampai jam pulang, teguran mendidik',
    parentNotified: true,
    parentNotificationDate: '2025-01-22 14:00'
  },
  {
    id: 'viol-05',
    studentId: 's-202',
    studentName: 'Fajar Ramadhan',
    className: '7A',
    ruleId: 'rule-07',
    ruleTitle: 'Melompati Pagar / Menerobos Gerbang',
    points: 20,
    date: '2025-02-12',
    location: 'Pagar timur lapangan basket',
    reportedBy: 'Wahyu Ramadhan, S.Kom.',
    notes: 'Mencoba kabur sebelum jam istirahat kedua',
    status: 'Dalam Pembinaan BK',
    consequenceAssigned: 'Pembinaan khusus BK & pemanggilan wali murid',
    parentNotified: true,
    parentNotificationDate: '2025-02-12 12:30'
  }
];

export const INITIAL_REWARDS: StudentRewardRecord[] = [
  {
    id: 'rew-rec-01',
    studentId: 's-101',
    studentName: 'Muhammad Rizky Pratama',
    className: '8A',
    rewardId: 'rew-01',
    rewardTitle: 'Juara 1 OSN Matematika Tingkat Kabupaten',
    rewardPoints: 50,
    date: '2025-02-02',
    awardedBy: 'Drs. H. Suryadi, M.Pd.',
    notes: 'Meraih medali emas perwakilan SMPN 2 Tanjung melaju ke tingkat provinsi',
    certificateNumber: '045/PIAGAM/SMPN2-TJG/II/2025'
  },
  {
    id: 'rew-rec-02',
    studentId: 's-101',
    studentName: 'Muhammad Rizky Pratama',
    className: '8A',
    rewardId: 'rew-06',
    rewardTitle: 'Presensi 100% Hadir Tepat Waktu (Satu Semester)',
    rewardPoints: 30,
    date: '2025-01-10',
    awardedBy: 'Budi Santoso, S.Pd.',
    notes: 'Kehadiran sempurna tanpa pernah terlambat maupun alpa',
    certificateNumber: '012/PIAGAM/SMPN2-TJG/I/2025'
  },
  {
    id: 'rew-rec-03',
    studentId: 's-102',
    studentName: 'Siti Nurhaliza Putri',
    className: '8A',
    rewardId: 'rew-03',
    rewardTitle: 'Juara 1 FLS2N Menyanyi Solo Tingkat Kabupaten',
    rewardPoints: 40,
    date: '2025-01-28',
    awardedBy: 'Dina Marlina, S.Pd.',
    notes: 'Penampilan terbaik lagu daerah Tanjung',
    certificateNumber: '028/PIAGAM/SMPN2-TJG/I/2025'
  },
  {
    id: 'rew-rec-04',
    studentId: 's-102',
    studentName: 'Siti Nurhaliza Putri',
    className: '8A',
    rewardId: 'rew-05',
    rewardTitle: 'Aksi Kejujuran Istimewa (Mengembalikan Uang Teman)',
    rewardPoints: 35,
    date: '2025-02-14',
    awardedBy: 'Dra. Hj. Siti Rohmah, M.Si.',
    notes: 'Menemukan dompet berisi uang Rp 350.000 di kantin dan mengembalikannya',
    certificateNumber: '051/PIAGAM/SMPN2-TJG/II/2025'
  },
  {
    id: 'rew-rec-05',
    studentId: 's-301',
    studentName: 'Arya Yudha Pratama',
    className: '9A',
    rewardId: 'rew-01',
    rewardTitle: 'Juara 1 OSN IPA Terpadu & Ketua OSIS Teladan',
    rewardPoints: 50,
    date: '2025-01-15',
    awardedBy: 'Drs. H. Suryadi, M.Pd.',
    notes: 'Prestasi gemilang dan kepemimpinan teladan tingkat sekolah',
    certificateNumber: '018/PIAGAM/SMPN2-TJG/I/2025'
  },
  {
    id: 'rew-rec-06',
    studentId: 's-201',
    studentName: 'Bilqis Humaira Syakira',
    className: '7A',
    rewardId: 'rew-01',
    rewardTitle: 'Juara 1 Lomba Pidato Bahasa Inggris Kabupaten',
    rewardPoints: 50,
    date: '2025-02-08',
    awardedBy: 'Dina Marlina, S.Pd.',
    notes: 'Bakat luar biasa siswa kelas 7',
    certificateNumber: '040/PIAGAM/SMPN2-TJG/II/2025'
  }
];

export const INITIAL_GRADES: Record<string, StudentGrades> = {
  's-101': {
    studentId: 's-101',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    averageScore: 92.4,
    rankInClass: 1,
    grades: [
      { subjectId: 'sub-mat', subjectName: 'Matematika', kkm: 75, tugas: 95, uh: 92, pts: 94, pas: 96, finalScore: 94, predicate: 'A', isPassed: true, notes: 'Penguasaan konsep aljabar dan geometri sangat prima.' },
      { subjectId: 'sub-indo', subjectName: 'Bahasa Indonesia', kkm: 75, tugas: 90, uh: 90, pts: 92, pas: 94, finalScore: 92, predicate: 'A', isPassed: true, notes: 'Kemampuan literasi dan menulis teks eksposisi unggul.' },
      { subjectId: 'sub-ipa', subjectName: 'Ilmu Pengetahuan Alam (IPA)', kkm: 75, tugas: 94, uh: 93, pts: 95, pas: 95, finalScore: 94, predicate: 'A', isPassed: true, notes: 'Daya analisis eksperimen fisika dan biologi sangat tajam.' },
      { subjectId: 'sub-ing', subjectName: 'Bahasa Inggris', kkm: 75, tugas: 90, uh: 88, pts: 92, pas: 90, finalScore: 90, predicate: 'A', isPassed: true, notes: 'Aktif berkomunikasi lisan dan tulisan.' },
      { subjectId: 'sub-pp', subjectName: 'Pendidikan Pancasila', kkm: 78, tugas: 92, uh: 90, pts: 91, pas: 92, finalScore: 91, predicate: 'A', isPassed: true, notes: 'Meneladankan nilai-nilai Pancasila dalam keseharian.' },
      { subjectId: 'sub-pai', subjectName: 'Pendidikan Agama Islam', kkm: 80, tugas: 95, uh: 92, pts: 94, pas: 94, finalScore: 94, predicate: 'A', isPassed: true, notes: 'Fasih membaca Al-Quran dan berakhlak terpuji.' },
      { subjectId: 'sub-ips', subjectName: 'Ilmu Pengetahuan Sosial (IPS)', kkm: 75, tugas: 90, uh: 90, pts: 91, pas: 92, finalScore: 91, predicate: 'A', isPassed: true, notes: 'Memahami interaksi ruang dan ekonomi masyarakat.' },
      { subjectId: 'sub-pjok', subjectName: 'PJOK', kkm: 75, tugas: 90, uh: 90, pts: 92, pas: 90, finalScore: 90, predicate: 'A', isPassed: true, notes: 'Kebugaran jasmani dan sportivitas sangat baik.' },
      { subjectId: 'sub-inf', subjectName: 'Informatika', kkm: 75, tugas: 95, uh: 96, pts: 95, pas: 98, finalScore: 96, predicate: 'A', isPassed: true, notes: 'Logika komputasional dan pemrograman blok sangat mahir.' }
    ]
  },
  's-105': {
    studentId: 's-105',
    semester: 'Ganjil',
    academicYear: '2024/2025',
    averageScore: 71.2,
    rankInClass: 28,
    grades: [
      { subjectId: 'sub-mat', subjectName: 'Matematika', kkm: 75, tugas: 65, uh: 68, pts: 70, pas: 70, finalScore: 68, predicate: 'D', isPassed: false, notes: 'Perlu bimbingan remedial pada materi operasi pecahan dan fungsi.' },
      { subjectId: 'sub-indo', subjectName: 'Bahasa Indonesia', kkm: 75, tugas: 75, uh: 74, pts: 76, pas: 75, finalScore: 75, predicate: 'C', isPassed: true, notes: 'Mencapai batas KKM, perlu meningkatkan ketepatan mengumpulkan tugas.' },
      { subjectId: 'sub-ipa', subjectName: 'Ilmu Pengetahuan Alam (IPA)', kkm: 75, tugas: 68, uh: 70, pts: 72, pas: 70, finalScore: 70, predicate: 'D', isPassed: false, notes: 'Sering tertinggal materi karena alpa.' },
      { subjectId: 'sub-ing', subjectName: 'Bahasa Inggris', kkm: 75, tugas: 72, uh: 70, pts: 74, pas: 72, finalScore: 72, predicate: 'D', isPassed: false, notes: 'Perlu pengayaan kosa kata dasar.' },
      { subjectId: 'sub-pp', subjectName: 'Pendidikan Pancasila', kkm: 78, tugas: 78, uh: 75, pts: 77, pas: 78, finalScore: 77, predicate: 'C', isPassed: false, notes: 'Perlu ditingkatkan disiplin dan ketaatan tata tertib.' },
      { subjectId: 'sub-pai', subjectName: 'Pendidikan Agama Islam', kkm: 80, tugas: 78, uh: 76, pts: 78, pas: 80, finalScore: 78, predicate: 'C', isPassed: false, notes: 'Perlu peningkatan kehadiran sholat dhuha berjamaah.' },
      { subjectId: 'sub-ips', subjectName: 'Ilmu Pengetahuan Sosial (IPS)', kkm: 75, tugas: 75, uh: 76, pts: 75, pas: 76, finalScore: 76, predicate: 'C', isPassed: true, notes: 'Tuntas pada materi kondisi geografis Indonesia.' },
      { subjectId: 'sub-pjok', subjectName: 'PJOK', kkm: 75, tugas: 80, uh: 82, pts: 80, pas: 82, finalScore: 81, predicate: 'B', isPassed: true, notes: 'Bakat motorik baik pada cabang atletik.' },
      { subjectId: 'sub-inf', subjectName: 'Informatika', kkm: 75, tugas: 72, uh: 70, pts: 72, pas: 74, finalScore: 72, predicate: 'D', isPassed: false, notes: 'Perlu fokus saat praktikum di laboratorium.' }
    ]
  }
};

export const INITIAL_CHARACTERS: Record<string, CharacterAssessment> = {
  's-101': {
    studentId: 's-101',
    date: '2025-02-15',
    evaluatorName: 'Budi Santoso, S.Pd. & Guru BK',
    dimensions: [
      { dimension: 'beriman_bertakwa', dimensionLabel: 'Beriman, Bertakwa kepada Tuhan YME & Berakhlak Mulia', score: 'SB', note: 'Selalu istiqomah dalam ibadah harian, sopan tutur katanya kepada guru dan teman.' },
      { dimension: 'gotong_royong', dimensionLabel: 'Gotong Royong', score: 'SB', note: 'Sangat peduli, suka menjadi tutor sebaya bagi teman yang kesulitan Matematika.' },
      { dimension: 'mandiri', dimensionLabel: 'Mandiri', score: 'SB', note: 'Mampu mengatur jadwal belajar mandiri dan bertanggung jawab penuh atas tugas.' },
      { dimension: 'bernalar_kritis', dimensionLabel: 'Bernalar Kritis', score: 'SB', note: 'Kritis bertanya dengan santun dan mampu memecahkan masalah kompleks.' },
      { dimension: 'kreatif', dimensionLabel: 'Kreatif', score: 'SB', note: 'Menghasilkan gagasan orisinal dalam proyek P5 sekolah.' },
      { dimension: 'berkebinekaan_global', dimensionLabel: 'Berkebinekaan Global', score: 'SB', note: 'Menghargai keberagaman budaya dan menjunjung toleransi di kelas.' }
    ],
    generalSummary: 'Ananda Rizky menunjukkan Profil Pelajar Pancasila yang sangat unggul dan layak dijadikan teladan bagi seluruh siswa SMP Negeri 2 Tanjung.'
  },
  's-105': {
    studentId: 's-105',
    date: '2025-02-15',
    evaluatorName: 'Dra. Hj. Siti Rohmah, M.Si. (Guru BK)',
    dimensions: [
      { dimension: 'beriman_bertakwa', dimensionLabel: 'Beriman, Bertakwa kepada Tuhan YME & Berakhlak Mulia', score: 'MB', note: 'Perlu bimbingan pembiasaan ibadah tepat waktu dan etika berbicara kepada teman.' },
      { dimension: 'gotong_royong', dimensionLabel: 'Gotong Royong', score: 'BSH', note: 'Mau bekerja sama saat kerja bakti fisik, namun mudah terdistraksi.' },
      { dimension: 'mandiri', dimensionLabel: 'Mandiri', score: 'PB', note: 'Perlu pengawasan ketat dalam kedisiplinan hadir dan menyelesaikan kewajiban sekolah.' },
      { dimension: 'bernalar_kritis', dimensionLabel: 'Bernalar Kritis', score: 'MB', note: 'Perlu pendampingan untuk menyaring pengaruh negatif dari lingkungan pergaulan.' },
      { dimension: 'kreatif', dimensionLabel: 'Kreatif', score: 'BSH', note: 'Memiliki minat tinggi pada kegiatan prakarya otomotif/teknik sederhana.' },
      { dimension: 'berkebinekaan_global', dimensionLabel: 'Berkebinekaan Global', score: 'MB', note: 'Perlu ditanamkan rasa empati dan saling menghargai antarteman.' }
    ],
    generalSummary: 'Ananda Dimas memerlukan pendampingan intensif dari Bimbingan Konseling dan kerja sama erat dengan orang tua untuk mengembalikan fokus belajar dan kedisiplinan.'
  }
};

export const INITIAL_WHATSAPP_LOGS: WhatsAppNotificationLog[] = [
  {
    id: 'wa-01',
    timestamp: '2025-02-17 08:30',
    studentId: 's-105',
    studentName: 'Dimas Bagus Saputra',
    className: '8A',
    parentName: 'Suratno Wijaya',
    parentPhone: '6287712345678',
    type: 'absensi_alpa',
    subject: 'Pemberitahuan Ketidakhadiran (Alpa) Siswa',
    messageText: 'Yth. Bpk/Ibu Orang Tua/Wali dari Dimas Bagus Saputra (Kelas 8A, SMPN 2 Tanjung). Kami menginformasikan bahwa ananda pada hari ini, Senin 17 Februari 2025 tidak hadir di sekolah tanpa keterangan (Alpa). Mohon konfirmasi atau hubungi Wali Kelas: Budi Santoso, S.Pd.',
    sentBy: 'Sistem Otomatis / Budi Santoso, S.Pd.',
    status: 'Terkirim',
    directUrl: 'https://wa.me/6287712345678?text='
  },
  {
    id: 'wa-02',
    timestamp: '2025-02-16 11:00',
    studentId: 's-105',
    studentName: 'Dimas Bagus Saputra',
    className: '8A',
    parentName: 'Suratno Wijaya',
    parentPhone: '6287712345678',
    type: 'panggilan_ortu',
    subject: 'Surat Undangan Pemanggilan Orang Tua ke Ruang BK',
    messageText: 'Yth. Bpk/Ibu Orang Tua/Wali Dimas Bagus Saputra. Sehubungan dengan akumulasi 45 poin pelanggaran tata tertib sekolah, kami mengundang Bapak/Ibu untuk hadir di Ruang BK SMP Negeri 2 Tanjung pada Rabu, 19 Feb 2025 pukul 09.00 WITA. Kehadiran Bapak/Ibu sangat menentukan kelanjutan pembinaan ananda.',
    sentBy: 'Dra. Hj. Siti Rohmah, M.Si. (BK)',
    status: 'Terkirim',
    directUrl: 'https://wa.me/6287712345678?text='
  },
  {
    id: 'wa-03',
    timestamp: '2025-02-02 14:00',
    studentId: 's-101',
    studentName: 'Muhammad Rizky Pratama',
    className: '8A',
    parentName: 'H. Hendra Pratama, S.T.',
    parentPhone: '6281234567890',
    type: 'reward_prestasi',
    subject: 'Apresiasi Prestasi Siswa Teladan SMP Negeri 2 Tanjung',
    messageText: 'Selamat kepada Bapak/Ibu Hendra Pratama! Ananda Muhammad Rizky Pratama (Kelas 8A) telah meraih JUARA 1 OSN MATEMATIKA KABUPATEN dan memperoleh +50 Poin Penghargaan Siswa Teladan SMPN 2 Tanjung. Terima kasih atas dukungan luar biasa keluarga.',
    sentBy: 'Drs. H. Suryadi, M.Pd. (Kepala Sekolah)',
    status: 'Terkirim',
    directUrl: 'https://wa.me/6281234567890?text='
  }
];
