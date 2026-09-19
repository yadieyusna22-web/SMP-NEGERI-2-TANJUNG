export type Role = 'admin' | 'guru' | 'bk' | 'siswa_ortu';

export type AttendanceStatus = 'hadir' | 'sakit' | 'izin' | 'alpa';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
  recordedBy: string; // Teacher name
  period?: string; // e.g. "Harian", "Jam 1-2"
  timestamp: string;
}

export interface AcademicSubject {
  id: string;
  name: string; // e.g., Matematika, Bahasa Indonesia
  code: string;
  kkm: number; // e.g., 75
  teacherName: string;
}

export interface SubjectGrade {
  subjectId: string;
  subjectName: string;
  kkm: number;
  tugas: number; // 0-100
  uh: number; // Ulangan Harian 0-100
  pts: number; // Penilaian Tengah Semester 0-100
  pas: number; // Penilaian Akhir Semester 0-100
  finalScore: number;
  predicate: 'A' | 'B' | 'C' | 'D';
  isPassed: boolean;
  notes?: string;
}

export interface StudentGrades {
  studentId: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string; // "2024/2025"
  grades: SubjectGrade[];
  averageScore: number;
  rankInClass?: number;
}

export type CharacterDimension = 
  | 'beriman_bertakwa'
  | 'gotong_royong'
  | 'mandiri'
  | 'bernalar_kritis'
  | 'kreatif'
  | 'berkebinekaan_global';

export type CharacterScore = 'SB' | 'BSH' | 'MB' | 'PB'; // Sangat Baik, Berkembang Sesuai Harapan, Mulai Berkembang, Perlu Bimbingan

export interface CharacterAssessment {
  studentId: string;
  date: string;
  evaluatorName: string;
  dimensions: {
    dimension: CharacterDimension;
    dimensionLabel: string;
    score: CharacterScore;
    note: string;
  }[];
  generalSummary: string;
}

export interface RuleViolationMaster {
  id: string;
  code: string;
  category: 'Kedisiplinan & Waktu' | 'Kerapian & Seragam' | 'Perilaku & Etika' | 'Kerapian Belajar' | 'Pelanggaran Berat';
  title: string;
  description: string;
  points: number;
}

export interface StudentViolationRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  ruleId: string;
  ruleTitle: string;
  points: number;
  date: string;
  location: string;
  reportedBy: string;
  notes: string;
  status: 'Menunggu Tindak Lanjut' | 'Dalam Pembinaan BK' | 'Selesai / Resolusi';
  consequenceAssigned?: string;
  parentNotified: boolean;
  parentNotificationDate?: string;
}

export interface RewardMaster {
  id: string;
  code: string;
  category: 'Akademik' | 'Non-Akademik' | 'Karakter & Kejujuran' | 'Organisasi & Sosial' | 'Kedisiplinan Teladan';
  title: string;
  description: string;
  rewardPoints: number;
}

export interface StudentRewardRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  rewardId: string;
  rewardTitle: string;
  rewardPoints: number;
  date: string;
  awardedBy: string;
  notes: string;
  certificateNumber?: string;
}

export interface ConsequenceTier {
  minPoints: number;
  maxPoints: number;
  level: number;
  title: string;
  action: string;
  handlingRole: string;
  requiresParentCall: boolean;
  color: string;
}

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  name: string;
  gender: 'L' | 'P';
  className: string; // "7A", "7B", "8A", "8B", "9A", "9B"
  avatarUrl?: string;
  parentName: string;
  parentPhone: string; // WhatsApp number
  address: string;
  homeroomTeacher: string;
  // Computed / aggregated
  totalAlpa: number;
  totalSakit: number;
  totalIzin: number;
  totalHadir: number;
  attendancePercentage: number;
  academicAverage: number;
  totalViolationPoints: number;
  totalRewardPoints: number;
  netCharacterScore: number;
  isTeladanCandidate: boolean;
}

export interface WhatsAppNotificationLog {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  className: string;
  parentName: string;
  parentPhone: string;
  type: 'absensi_alpa' | 'absensi_sakit' | 'pelanggaran' | 'panggilan_ortu' | 'reward_prestasi' | 'rapor_akademik';
  subject: string;
  messageText: string;
  sentBy: string;
  status: 'Terkirim' | 'Menunggu' | 'Gagal';
  directUrl: string;
}

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: Role;
  title: string; // e.g. "Kepala Sekolah", "Guru BK", "Wali Kelas 8A", "Siswa & Orang Tua"
  assignedClass?: string; // For homeroom teachers
  studentId?: string; // If role is siswa_ortu
}
