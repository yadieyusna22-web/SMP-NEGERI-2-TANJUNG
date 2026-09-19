import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_INFO } from '../data/mockData';
import { Student } from '../types';
import { 
  ShieldCheck, 
  User, 
  Calendar, 
  BookOpen, 
  Award, 
  AlertTriangle, 
  Send, 
  FileText, 
  HeartHandshake, 
  Lock,
  Phone,
  CheckCircle2,
  Trophy
} from 'lucide-react';

interface StudentParentPortalProps {
  selectedStudentId?: string;
  onOpenWhatsAppModal: (student: Student, type: 'rapor_akademik') => void;
}

export const StudentParentPortal: React.FC<StudentParentPortalProps> = ({
  selectedStudentId,
  onOpenWhatsAppModal
}) => {
  const { 
    currentUser, 
    students, 
    grades, 
    characterAssessments, 
    violations, 
    rewards, 
    getTierForPoints,
    switchRole
  } = useSchool();

  // If currentUser is siswa_ortu and has studentId, enforce it for privacy!
  const effectiveStudentId = (currentUser.role === 'siswa_ortu' && currentUser.studentId)
    ? currentUser.studentId
    : (selectedStudentId || currentUser.studentId || 's-101');

  const student = students.find(s => s.id === effectiveStudentId) || students[0];
  const studentGrades = grades[student.id];
  const studentCharacter = characterAssessments[student.id];
  const studentViolations = violations.filter(v => v.studentId === student.id);
  const studentRewards = rewards.filter(r => r.studentId === student.id);
  const studentTier = getTierForPoints(student.totalViolationPoints);

  const [activeTab, setActiveTab] = useState<'ringkasan' | 'nilai' | 'karakter' | 'disiplin'>('ringkasan');

  return (
    <div className="space-y-6">
      
      {/* Privacy & Security Banner */}
      <div className="bg-sky-900 text-white rounded-2xl p-6 border border-sky-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/60 border border-blue-400/40 flex items-center justify-center text-white shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-sky-800 text-sky-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-sky-700">
                  Data Privacy & Student Security Enforced
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                Portal Informasi Siswa & Orang Tua Terpadu
              </h2>
              <p className="text-xs text-sky-200 mt-0.5">
                Menampilkan data pribadi ananda secara privat dan transparan tanpa mengekspos catatan siswa lain.
              </p>
            </div>
          </div>

          {/* Quick Demo Student Switcher for reviewers */}
          <div className="bg-sky-950/80 p-2.5 rounded-xl border border-sky-800 text-xs self-start">
            <span className="text-[11px] text-sky-300 block mb-1 font-semibold">Simulasi Pandangan Siswa:</span>
            <div className="flex gap-2">
              <button
                onClick={() => switchRole('siswa_ortu', 's-101')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  student.id === 's-101' ? 'bg-blue-500 text-white' : 'bg-sky-800 text-sky-200 hover:bg-sky-700'
                }`}
              >
                M. Rizky (Teladan)
              </button>
              <button
                onClick={() => switchRole('siswa_ortu', 's-105')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  student.id === 's-105' ? 'bg-amber-500 text-white' : 'bg-sky-800 text-sky-200 hover:bg-sky-700'
                }`}
              >
                Dimas Bagus (Pantau)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-md">
            {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Kelas {student.className}
              </span>
              {student.isTeladanCandidate && (
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                  <Trophy className="w-3 h-3 text-amber-600" />
                  Kandidat Siswa Teladan
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
              <span>NISN: <strong className="text-slate-700">{student.nisn}</strong></span>
              <span>NIS: <strong className="text-slate-700">{student.nis}</strong></span>
              <span>Orang Tua: <strong className="text-slate-700">{student.parentName}</strong></span>
              <span>Wali Kelas: <strong className="text-slate-700">{student.homeroomTeacher}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Halo Bapak/Ibu Wali Kelas ${student.homeroomTeacher}, saya orang tua dari ${student.name} (Kelas ${student.className}) ingin berkonsultasi mengenai perkembangan ananda di SMP Negeri 2 Tanjung.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Hubungi Wali Kelas</span>
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white rounded-xl p-1.5 border border-slate-200 shadow-sm gap-1 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('ringkasan')}
          className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'ringkasan' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📊 Ringkasan Perkembangan
        </button>

        <button
          onClick={() => setActiveTab('nilai')}
          className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'nilai' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📝 Rapor Hasil Belajar
        </button>

        <button
          onClick={() => setActiveTab('karakter')}
          className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'karakter' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🌟 Catatan Karakter P5
        </button>

        <button
          onClick={() => setActiveTab('disiplin')}
          className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'disiplin' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ⚖️ Rekam Disiplin & Prestasi
        </button>
      </div>

      {/* SUB-TAB 1: RINGKASAN PERKEMBANGAN */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-4">
          
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Presensi */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Tingkat Presensi</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{student.attendancePercentage}%</div>
              <div className="text-[11px] text-slate-600 mt-2 space-y-0.5">
                <div>Hadir: <strong className="text-emerald-600">{student.totalHadir}</strong> hari</div>
                <div>Sakit / Izin: <strong>{student.totalSakit + student.totalIzin}</strong> hari</div>
                <div>Alpa: <strong className={student.totalAlpa > 0 ? 'text-rose-600' : 'text-slate-600'}>{student.totalAlpa}</strong> hari</div>
              </div>
            </div>

            {/* Akademik */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Rerata Nilai Rapor</div>
              <div className="text-2xl font-black text-blue-700 mt-1">{student.academicAverage}</div>
              <p className="text-[11px] text-slate-500 mt-2">
                {student.academicAverage >= 85 ? 'Capaian akademik sangat memuaskan' : 'Perlu bimbingan dan peningkatan belajar'}
              </p>
            </div>

            {/* Poin Kebaikan */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Poin Penghargaan (Reward)</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">+{student.totalRewardPoints}</div>
              <p className="text-[11px] text-slate-500 mt-2">
                {studentRewards.length} catatan prestasi & keteladanan budi pekerti
              </p>
            </div>

            {/* Poin Pelanggaran */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Poin Pelanggaran Tata Tertib</div>
              <div className={`text-2xl font-black mt-1 ${student.totalViolationPoints > 15 ? 'text-rose-600' : 'text-slate-800'}`}>
                {student.totalViolationPoints} Poin
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Status: <strong className="text-slate-800">{studentTier.title}</strong>
              </p>
            </div>

          </div>

          {/* Advice & Guidance Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-blue-600" />
              <span>Pesan dan Catatan untuk Orang Tua / Wali Siswa</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              SMP Negeri 2 Tanjung berkomitmen mewujudkan pendidikan bermutu yang mengedepankan kolaborasi erat antara sekolah dan keluarga. Anda dapat memantau presensi setiap hari secara real time serta menerima notifikasi WhatsApp otomatis apabila ananda berhalangan hadir atau memperoleh apresiasi prestasi.
            </p>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: RAPOR HASIL BELAJAR */}
      {activeTab === 'nilai' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Transkrip Nilai Akademik Semester {SCHOOL_INFO.semester}</h4>
              <p className="text-[11px] text-slate-500">Tahun Ajaran {SCHOOL_INFO.academicYear}</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              Rerata: {student.academicAverage}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">Mata Pelajaran</th>
                  <th className="py-2.5 px-2 text-center">KKM</th>
                  <th className="py-2.5 px-2 text-center">Nilai Akhir</th>
                  <th className="py-2.5 px-2 text-center">Predikat</th>
                  <th className="py-2.5 px-3">Capaian Kompetensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentGrades?.grades.map((g, idx) => (
                  <tr key={g.subjectId} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-center text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{g.subjectName}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-600">{g.kkm}</td>
                    <td className="py-2.5 px-2 text-center font-black text-blue-700">{g.finalScore}</td>
                    <td className="py-2.5 px-2 text-center font-bold">{g.predicate}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">{g.notes || 'Memenuhi kriteria ketuntasan.'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CATATAN KARAKTER */}
      {activeTab === 'karakter' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h4 className="font-bold text-slate-900 text-sm">Observasi Profil Pelajar Pancasila</h4>
            <p className="text-xs text-slate-500 mt-0.5">Penilaian sikap budi pekerti, ketaatan beribadah, dan etika sosial</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {studentCharacter?.dimensions.map(dim => (
              <div key={dim.dimension} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{dim.dimensionLabel}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    dim.score === 'SB' ? 'bg-emerald-100 text-emerald-800' :
                    dim.score === 'BSH' ? 'bg-blue-100 text-blue-800' :
                    dim.score === 'MB' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {dim.score}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{dim.note}</p>
              </div>
            ))}
          </div>

          {studentCharacter?.generalSummary && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">Kesimpulan Pendidik / Guru BK:</span>
              <p className="text-emerald-800 leading-relaxed">{studentCharacter.generalSummary}</p>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: REKAM DISIPLIN & PRESTASI */}
      {activeTab === 'disiplin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Rewards Column */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
              <span className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-600" />
                Catatan Prestasi & Poin Reward (+{student.totalRewardPoints})
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs p-2">
              {studentRewards.length === 0 ? (
                <div className="p-6 text-center text-slate-400">Belum ada catatan reward.</div>
              ) : (
                studentRewards.map(r => (
                  <div key={r.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{r.rewardTitle}</span>
                      <span className="font-black text-emerald-600">+{r.rewardPoints} Poin</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">{r.notes}</p>
                    <div className="text-[10px] text-slate-400 mt-1">Tanggal: {r.date}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Violations Column */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
              <span className="font-bold text-rose-950 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Catatan Pelanggaran ({student.totalViolationPoints} Poin)
              </span>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                {studentTier.title}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs p-2">
              {studentViolations.length === 0 ? (
                <div className="p-6 text-center text-emerald-600 font-medium">
                  Alhamdulillah! Tidak ada catatan pelanggaran tata tertib. Pertahankan kedisiplinan!
                </div>
              ) : (
                studentViolations.map(v => (
                  <div key={v.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{v.ruleTitle}</span>
                      <span className="font-black text-rose-600">+{v.points} Poin</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">{v.notes}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>Tanggal: {v.date}</span>
                      <span className="font-semibold text-slate-700">Status: {v.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
