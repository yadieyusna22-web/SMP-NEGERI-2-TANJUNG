import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { CLASSES, SCHOOL_INFO } from '../data/mockData';
import { Student } from '../types';
import { ExportPdfModal } from './ExportPdfModal';
import { GoogleSheetsExportModal } from './GoogleSheetsExportModal';
import { 
  AlertTriangle, 
  HeartPulse, 
  Award, 
  Send, 
  TrendingUp, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  PhoneCall, 
  ShieldAlert,
  ChevronRight,
  Sparkles,
  CalendarCheck,
  Search,
  Printer,
  Download,
  FileSpreadsheet
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateToTab: (tab: string, studentId?: string) => void;
  onOpenWhatsAppModal: (student: Student, type: 'absensi_alpa' | 'panggilan_ortu' | 'reward_prestasi') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onNavigateToTab,
  onOpenWhatsAppModal 
}) => {
  const { 
    students, 
    grades,
    topAlpaStudents, 
    topSakitStudents, 
    topIzinStudents, 
    topTeladanStudents,
    selectedClassFilter,
    setSelectedClassFilter,
    getTierForPoints,
    violations,
    rewards,
    currentUser
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'alpa' | 'sakit_izin' | 'teladan'>('alpa');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  // Statistics
  const totalStudents = students.length;
  const filteredStudents = selectedClassFilter === 'Semua' 
    ? students 
    : students.filter(s => s.className === selectedClassFilter);

  const avgAttendance = filteredStudents.length > 0 
    ? Math.round(filteredStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / filteredStudents.length)
    : 0;

  const totalViolationsActive = violations.filter(v => v.status !== 'Selesai / Resolusi').length;
  const totalRewardsGiven = rewards.length;

  // Filter lists based on search
  const filteredAlpa = topAlpaStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nisn.includes(searchQuery)
  );

  const filteredSakit = topSakitStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nisn.includes(searchQuery)
  );

  const filteredIzin = topIzinStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nisn.includes(searchQuery)
  );

  const filteredTeladan = topTeladanStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nisn.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      
      {/* Welcome & Institutional Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white border border-blue-900/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-Time Academic & Character Monitoring Center
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dashboard Pengelolaan Siswa
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mt-1">
              Pantau tingkat kehadiran, deteksi dini siswa rentan alpa, tindak lanjut kesehatan siswa sakit/izin, serta apresiasi teladan karakter di <strong className="text-white">{SCHOOL_INFO.name}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition hover:scale-[1.02]"
              title="Ekspor rekapitulasi data akademik dan absensi ke format PDF resmi ber-Kop Surat"
            >
              <FileText className="w-4 h-4 text-blue-200" />
              <span>Ekspor PDF Bulanan</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSheetsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-md transition hover:scale-[1.02]"
              title="Ekspor dan sinkronisasi data siswa ke Google Sheets & Google Drive"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Google Sheets</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition shadow-sm"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Cetak Layar</span>
            </button>

            <button
              onClick={() => onNavigateToTab('absensi')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition shadow-sm"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Input Presensi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Siswa Aktif</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{filteredStudents.length}</span>
            <span className="text-xs text-slate-500">siswa ({selectedClassFilter})</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Terdaftar di buku induk sekolah</p>
        </div>

        {/* Kehadiran Rata-rata */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rata-rata Presensi</span>
            <div className={`p-2 rounded-lg ${avgAttendance >= 90 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgAttendance}%</span>
            <span className="text-xs text-emerald-600 font-medium">Target ≥ 95%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full ${avgAttendance >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
              style={{ width: `${avgAttendance}%` }}
            ></div>
          </div>
        </div>

        {/* Pelanggaran Aktif */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Kasus BK & Tata Tertib</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{totalViolationsActive}</span>
            <span className="text-xs text-slate-500">kasus dalam bimbingan</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Penanganan bertahap wali kelas & BK</p>
        </div>

        {/* Prestasi & Siswa Teladan */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Prestasi & Reward</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{totalRewardsGiven}</span>
            <span className="text-xs text-slate-500">apresiasi diberikan</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Akademik, Karakter, & Non-Akademik</p>
        </div>
      </div>

      {/* Filter & Sub-Navigation Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Sub-Tabs: Alpa, Sakit & Izin, Siswa Teladan */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveSubTab('alpa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'alpa'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Siswa Paling Banyak Alpa</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeSubTab === 'alpa' ? 'bg-rose-800 text-white' : 'bg-slate-300 text-slate-700'}`}>
              {topAlpaStudents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('sakit_izin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'sakit_izin'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Siswa Sakit & Izin Terbanyak</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeSubTab === 'sakit_izin' ? 'bg-amber-800 text-white' : 'bg-slate-300 text-slate-700'}`}>
              {topSakitStudents.length + topIzinStudents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('teladan')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'teladan'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>🏆 Siswa Teladan / Terbaik</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeSubTab === 'teladan' ? 'bg-emerald-900 text-white' : 'bg-slate-300 text-slate-700'}`}>
              Top 5
            </span>
          </button>
        </div>

        {/* Filters: Class selector + Search bar */}
        <div className="flex items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa / NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-36 sm:w-48"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium">Kelas:</span>
            <select
              aria-label="Filter Berdasarkan Kelas"
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 font-semibold focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua Kelas</option>
              {CLASSES.map(cls => (
                <option key={cls} value={cls}>Kelas {cls}</option>
              ))}
            </select>
          </div>

          {/* Quick Filter Bar Export Buttons */}
          <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-slate-200">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              title="Unduh PDF Laporan Kelas Ini"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition border border-blue-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSheetsModalOpen(true)}
              title="Ekspor Kelas Ini ke Google Sheets"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition border border-emerald-200"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Sheets</span>
            </button>
          </div>
        </div>

      </div>

      {/* Tab 1: Kondisi Siswa Paling Banyak Alpa */}
      {activeSubTab === 'alpa' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                <h3 className="font-bold text-slate-900 text-base">
                  Daftar Peringatan: Siswa Paling Banyak Alpa (Tanpa Keterangan)
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Pemantauan ketat untuk mencegah siswa putus sekolah, membolos, dan menindaklanjuti koordinasi wali kelas bersama orang tua.
              </p>
            </div>
            <div className="text-xs text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full font-medium self-start border border-rose-200">
              Ambivalensi Resiko Tinggi: ≥ 3 Hari Alpa
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Peringkat & Nama Siswa</th>
                  <th className="py-3 px-3">Kelas</th>
                  <th className="py-3 px-3">Wali Kelas</th>
                  <th className="py-3 px-3 text-center">Jumlah Alpa</th>
                  <th className="py-3 px-3 text-center">Persentase Hadir</th>
                  <th className="py-3 px-3">Tingkat Resiko</th>
                  <th className="py-3 px-4 text-center">Tindakan Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAlpa.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Tidak ada catatan siswa yang alpa untuk kriteria filter ini. Kondisi disiplin sangat baik!
                    </td>
                  </tr>
                ) : (
                  filteredAlpa.map((student, idx) => {
                    const isHighRisk = student.totalAlpa >= 5;
                    const isMediumRisk = student.totalAlpa >= 3 && student.totalAlpa < 5;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              idx === 0 ? 'bg-rose-600 text-white' : idx === 1 ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {idx + 1}
                            </span>
                            <div>
                              <button
                                onClick={() => onNavigateToTab('portal_siswa', student.id)}
                                className="font-semibold text-slate-900 hover:text-blue-600 text-left transition"
                              >
                                {student.name}
                              </button>
                              <div className="text-[11px] text-slate-400">NISN: {student.nisn}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{student.className}</td>
                        <td className="py-3 px-3 text-slate-600">{student.homeroomTeacher}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            {student.totalAlpa} Hari
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                            <span>{student.attendancePercentage}%</span>
                            <div className="w-12 bg-slate-200 rounded-full h-1.5">
                              <div 
                                className="bg-rose-500 h-1.5 rounded-full" 
                                style={{ width: `${student.attendancePercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {isHighRisk ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              Bahaya Dropout / Panggilan Ortu
                            </span>
                          ) : isMediumRisk ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              Peringatan Wali Kelas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                              Pemantauan Berkala
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Send WhatsApp */}
                            <button
                              onClick={() => onOpenWhatsAppModal(student, 'absensi_alpa')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
                              title="Kirim Notifikasi WhatsApp Resmi ke Orang Tua"
                            >
                              <Send className="w-3 h-3" />
                              <span>Lapor WA</span>
                            </button>

                            {/* View Details */}
                            <button
                              onClick={() => onNavigateToTab('absensi', student.id)}
                              className="p-1 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition"
                              title="Lihat Rincian Presensi"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Kondisi Siswa Paling Banyak Sakit & Izin */}
      {activeSubTab === 'sakit_izin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Sakit */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-amber-50/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Siswa Paling Banyak Sakit</h3>
                  <p className="text-[11px] text-slate-500">Perlu perhatian kesehatan & surat keterangan dokter</p>
                </div>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
                {filteredSakit.length} Siswa
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {filteredSakit.length === 0 ? (
                <div className="p-6 text-center text-slate-400">Tidak ada data siswa sakit saat ini.</div>
              ) : (
                filteredSakit.map((student, idx) => (
                  <div key={student.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Kelas {student.className} • Wali: {student.homeroomTeacher}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-xs">
                          {student.totalSakit} Hari Sakit
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">Hadir: {student.attendancePercentage}%</div>
                      </div>

                      <button
                        onClick={() => onOpenWhatsAppModal(student, 'absensi_alpa')}
                        className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition"
                        title="Tanya Kabar Orang Tua via WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Izin */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-sky-50/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Siswa Paling Banyak Izin</h3>
                  <p className="text-[11px] text-slate-500">Izin kegiatan resmi, dispensasi lomba, atau urusan keluarga</p>
                </div>
              </div>
              <span className="text-xs bg-sky-100 text-sky-800 font-semibold px-2.5 py-0.5 rounded-full">
                {filteredIzin.length} Siswa
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {filteredIzin.length === 0 ? (
                <div className="p-6 text-center text-slate-400">Tidak ada catatan siswa izin pada filter ini.</div>
              ) : (
                filteredIzin.map((student, idx) => (
                  <div key={student.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold text-[11px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Kelas {student.className} • Orang Tua: {student.parentName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold text-xs">
                          {student.totalIzin} Hari Izin
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">Kehadiran: {student.attendancePercentage}%</div>
                      </div>

                      <button
                        onClick={() => onNavigateToTab('absensi', student.id)}
                        className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition"
                        title="Buka Catatan Izin"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Hall of Fame - Siswa Teladan & Terbaik */}
      {activeSubTab === 'teladan' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold mb-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hall of Fame Siswa Teladan SMP Negeri 2 Tanjung</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Kombinasi komprehensif: <strong>Nilai Akademik Tinggi</strong> + <strong>Poin Reward Karakter & Prestasi</strong> + <strong>Kedisiplinan Presensi (0/Minim Pelanggaran)</strong>.
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('reward')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm transition self-start"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Kelola Reward & Piagam</span>
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredTeladan.slice(0, 3).map((student, idx) => {
              const medalColor = idx === 0 ? 'border-amber-400 bg-amber-50/50' : idx === 1 ? 'border-slate-300 bg-slate-50' : 'border-amber-600/40 bg-orange-50/40';
              const medalBadge = idx === 0 ? '🥇 Juara 1 Teladan' : idx === 1 ? '🥈 Juara 2 Teladan' : '🥉 Juara 3 Teladan';
              
              return (
                <div key={student.id} className={`rounded-xl p-4 border-2 ${medalColor} relative shadow-sm transition hover:shadow-md`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800 bg-white px-2.5 py-1 rounded-full shadow-xs border border-slate-200">
                      {medalBadge}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Kelas {student.className}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-bold text-slate-900 text-base">{student.name}</h4>
                    <p className="text-xs text-slate-500">NISN: {student.nisn}</p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center bg-white/80 p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Rerata Nilai</div>
                      <div className="font-extrabold text-blue-600 text-sm">{student.academicAverage}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Poin Reward</div>
                      <div className="font-extrabold text-emerald-600 text-sm">+{student.totalRewardPoints}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Presensi</div>
                      <div className="font-extrabold text-slate-800 text-sm">{student.attendancePercentage}%</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-[11px] text-slate-600">
                      Pelanggaran: <strong className="text-emerald-600">{student.totalViolationPoints} poin</strong>
                    </div>
                    <button
                      onClick={() => onOpenWhatsAppModal(student, 'reward_prestasi')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg transition"
                    >
                      <Send className="w-3 h-3" />
                      <span>Kirim Apresiasi WA</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table of other top students */}
          <div className="border-t border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Peringkat</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3 text-center">Rerata Nilai</th>
                  <th className="py-2.5 px-3 text-center">Poin Kebaikan</th>
                  <th className="py-2.5 px-3 text-center">Poin Pelanggaran</th>
                  <th className="py-2.5 px-3 text-center">Kehadiran</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeladan.slice(3, 10).map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-700">#{idx + 4}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{student.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{student.className}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-blue-600">{student.academicAverage}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-600">+{student.totalRewardPoints}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-600">{student.totalViolationPoints}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-800">{student.attendancePercentage}%</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-semibold text-[10px]">
                        Teladan Berprestasi
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Role-Based Guidance Callout */}
      <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Anda saat ini login sebagai: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.title}).
            Hak akses data disesuaikan secara real time demi menjamin privasi siswa SMP Negeri 2 Tanjung.
          </span>
        </div>
        <button
          onClick={() => onNavigateToTab('whatsapp')}
          className="text-blue-600 font-semibold hover:underline shrink-0 ml-4"
        >
          Lihat Log WhatsApp Otomatis →
        </button>
      </div>

      {/* Export PDF Laporan Bulanan Modal */}
      <ExportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        students={students}
        grades={grades}
        initialClass={selectedClassFilter}
      />

      {/* Google Sheets Integration & Export Modal */}
      <GoogleSheetsExportModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        students={students}
        grades={grades}
        initialClass={selectedClassFilter}
      />

    </div>
  );
};
