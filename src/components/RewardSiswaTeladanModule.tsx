import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_INFO, CLASSES } from '../data/mockData';
import { Student } from '../types';
import { 
  Sparkles, 
  Award, 
  PlusCircle, 
  Send, 
  Printer, 
  Medal, 
  Trophy, 
  CheckCircle,
  Star,
  Search
} from 'lucide-react';

interface RewardSiswaTeladanModuleProps {
  onOpenWhatsAppModal: (student: Student, type: 'reward_prestasi') => void;
}

export const RewardSiswaTeladanModule: React.FC<RewardSiswaTeladanModuleProps> = ({
  onOpenWhatsAppModal
}) => {
  const { 
    rewardMaster, 
    rewards, 
    addReward, 
    students, 
    topTeladanStudents,
    currentUser 
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'log' | 'input' | 'piagam'>('leaderboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedRewardId, setSelectedRewardId] = useState<string>(rewardMaster[0]?.id || '');
  const [rewardDate, setRewardDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [rewardNotes, setRewardNotes] = useState<string>('');
  const [certificateNum, setCertificateNum] = useState<string>(`0${Math.floor(Math.random() * 80 + 10)}/PIAGAM/SMPN2-TJG/II/2025`);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Selected student for printing Piagam
  const [piagamStudentId, setPiagamStudentId] = useState<string>(topTeladanStudents[0]?.id || students[0]?.id || '');
  const piagamStudent = students.find(s => s.id === piagamStudentId) || topTeladanStudents[0] || students[0];

  const handleAddRewardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    addReward({
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      rewardId: selectedRewardId,
      date: rewardDate,
      awardedBy: currentUser.name,
      notes: rewardNotes || 'Penghargaan resmi sekolah atas dedikasi dan prestasi.',
      certificateNumber: certificateNum
    });

    setToastMsg(`Apresiasi untuk ananda ${student.name} berhasil ditambahkan! Poin penghargaan ditambahkan dan pesan WhatsApp telah disiapkan.`);
    setActiveTab('leaderboard');
    setRewardNotes('');
    setTimeout(() => setToastMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>Reward & Siswa Teladan SMP Negeri 2 Tanjung</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sistem apresiasi prestasi akademik, non-akademik, akhlak terpuji, dan kedisiplinan berkarakter.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'leaderboard' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏆 Leaderboard Siswa Teladan
          </button>

          <button
            onClick={() => setActiveTab('log')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'log' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat Apresiasi ({rewards.length})
          </button>

          <button
            onClick={() => setActiveTab('input')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'input' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Berikan Reward
          </button>

          <button
            onClick={() => setActiveTab('piagam')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'piagam' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Piagam Penghargaan
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)}>✕</button>
        </div>
      )}

      {/* TAB 1: LEADERBOARD TELADAN */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topTeladanStudents.slice(0, 3).map((student, idx) => {
              const rankColor = idx === 0 ? 'border-amber-400 bg-amber-50/70' : idx === 1 ? 'border-slate-300 bg-slate-50' : 'border-amber-600/40 bg-orange-50/50';
              const rankIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
              const title = idx === 0 ? 'Bintang Teladan Utama' : idx === 1 ? 'Siswa Berprestasi II' : 'Siswa Berprestasi III';

              return (
                <div key={student.id} className={`rounded-2xl p-5 border-2 ${rankColor} shadow-sm relative overflow-hidden flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">{rankIcon}</span>
                      <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200 text-emerald-800">
                        Kelas {student.className}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="text-[11px] font-bold tracking-wider text-amber-700 uppercase">{title}</div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-tight mt-0.5">{student.name}</h3>
                      <p className="text-xs text-slate-500">NISN: {student.nisn}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 bg-white/90 p-3 rounded-xl border border-slate-200 text-center">
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold">Akademik</div>
                        <div className="text-sm font-black text-blue-700">{student.academicAverage}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold">Poin Reward</div>
                        <div className="text-sm font-black text-emerald-600">+{student.totalRewardPoints}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold">Kehadiran</div>
                        <div className="text-sm font-black text-slate-800">{student.attendancePercentage}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setPiagamStudentId(student.id);
                        setActiveTab('piagam');
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Cetak Piagam →
                    </button>
                    <button
                      onClick={() => onOpenWhatsAppModal(student, 'reward_prestasi')}
                      className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-xs transition"
                    >
                      <Send className="w-3 h-3" />
                      <span>Kirim WA</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Ranking Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                Peringkat Akumulasi Siswa Berprestasi & Teladan
              </h3>
              <span className="text-xs text-slate-500">
                Kriteria: Nilai Akademik (40%) + Poin Karakter (40%) + Kehadiran (20%)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-14 text-center">Rank</th>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-3">Kelas</th>
                    <th className="py-3 px-3 text-center">Rerata Nilai</th>
                    <th className="py-3 px-3 text-center">Poin Penghargaan</th>
                    <th className="py-3 px-3 text-center">Poin Pelanggaran</th>
                    <th className="py-3 px-3 text-center">Net Score</th>
                    <th className="py-3 px-3 text-center">Kehadiran</th>
                    <th className="py-3 px-4 text-center">Apresiasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topTeladanStudents.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-center font-bold">
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs ${
                          idx === 0 ? 'bg-amber-400 text-white font-extrabold' :
                          idx === 1 ? 'bg-slate-300 text-slate-800' :
                          idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-400">NISN: {s.nisn}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{s.className}</td>
                      <td className="py-3 px-3 text-center font-black text-blue-700">{s.academicAverage}</td>
                      <td className="py-3 px-3 text-center font-black text-emerald-600">+{s.totalRewardPoints}</td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-500">{s.totalViolationPoints}</td>
                      <td className="py-3 px-3 text-center font-extrabold text-slate-900">{s.netCharacterScore}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">{s.attendancePercentage}%</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onOpenWhatsAppModal(s, 'reward_prestasi')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-xs transition"
                        >
                          <Send className="w-3 h-3" />
                          <span>Kirim WA</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: RIWAYAT APRESIASI */}
      {activeTab === 'log' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Daftar Rekam Jejak Prestasi & Apresiasi Siswa</h3>
            <button
              onClick={() => setActiveTab('input')}
              className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold"
            >
              + Berikan Reward Baru
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {rewards.map(r => (
              <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{r.studentName}</span>
                    <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.2 rounded-full text-[10px]">
                      Kelas {r.className}
                    </span>
                    <span className="text-[11px] text-slate-400">({r.date})</span>
                  </div>
                  <h4 className="font-bold text-emerald-800 mt-1 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                    <span>{r.rewardTitle}</span>
                  </h4>
                  <p className="text-slate-600 text-xs mt-0.5">{r.notes}</p>
                  {r.certificateNumber && (
                    <div className="text-[10px] text-slate-400 mt-1">No. Piagam: {r.certificateNumber} • Diberikan oleh: {r.awardedBy}</div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black text-sm rounded-lg border border-emerald-200">
                    +{r.rewardPoints} Poin
                  </span>

                  <button
                    onClick={() => {
                      setPiagamStudentId(r.studentId);
                      setActiveTab('piagam');
                    }}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                    title="Cetak Piagam"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INPUT REWARD BARU */}
      {activeTab === 'input' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <span>Formulir Pemberian Penghargaan & Siswa Teladan</span>
          </h3>

          <form onSubmit={handleAddRewardSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pilih Siswa Penerima:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Kelas {s.className} • Poin Kebaikan: +{s.totalRewardPoints})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kategori & Jenis Penghargaan:</label>
              <select
                value={selectedRewardId}
                onChange={(e) => setSelectedRewardId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
              >
                {rewardMaster.map(r => (
                  <option key={r.id} value={r.id}>
                    [{r.code}] {r.title} — (+{r.rewardPoints} Poin) • {r.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tanggal Pemberian:</label>
                <input
                  type="date"
                  value={rewardDate}
                  onChange={(e) => setRewardDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nomor Piagam / Sertifikat:</label>
                <input
                  type="text"
                  value={certificateNum}
                  onChange={(e) => setCertificateNum(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Keterangan / Deskripsi Prestasi:</label>
              <textarea
                rows={3}
                value={rewardNotes}
                onChange={(e) => setRewardNotes(e.target.value)}
                placeholder="Tuliskan detail kejuaraan, nama lomba, atau wujud perilaku budi pekerti luar biasa yang ditunjukkan siswa..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('leaderboard')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold shadow-sm transition"
              >
                Simpan & Siapkan Ucapan WA Ortu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: PIAGAM PENGHARGAAN RESMI */}
      {activeTab === 'piagam' && (
        <div className="bg-white rounded-2xl border-4 border-amber-500/40 p-8 sm:p-12 shadow-xl space-y-6 relative overflow-hidden">
          
          {/* Certificate Header Bar (No print) */}
          <div className="flex flex-wrap items-center justify-between gap-3 no-print pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700">Pilih Siswa untuk Piagam:</span>
              <select
                aria-label="Pilih Siswa Piagam Penghargaan"
                value={piagamStudent.id}
                onChange={(e) => setPiagamStudentId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.className}) — Reward: +{s.totalRewardPoints} Poin
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Piagam Resmi (PDF)</span>
              </button>

              <button
                onClick={() => onOpenWhatsAppModal(piagamStudent, 'reward_prestasi')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Ucapan WA ke Ortu</span>
              </button>
            </div>
          </div>

          {/* Golden Certificate Frame Inside */}
          <div className="border-2 border-dashed border-amber-600/50 p-6 sm:p-10 rounded-xl bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20 text-center space-y-4">
            
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Trophy className="w-8 h-8" />
              </div>
            </div>

            <div className="uppercase tracking-widest text-xs font-black text-amber-800">
              Pemerintah Kabupaten Lombok Utara • Dinas Pendidikan dan Kebudayaan
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              {SCHOOL_INFO.name}
            </h2>

            <div className="py-2">
              <span className="text-xs font-bold uppercase tracking-widest bg-amber-100 text-amber-900 px-4 py-1 rounded-full border border-amber-300">
                PIAGAM PENGHARGAAN SISWA TELADAN & BERPRESTASI
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Nomor: 045/PIAGAM/SMPN2-TJG/II/2025</p>
            </div>

            <p className="text-sm text-slate-600">Diberikan dengan bangga kepada:</p>

            <div className="text-2xl sm:text-4xl font-extrabold text-blue-950 font-serif tracking-wide underline decoration-amber-400">
              {piagamStudent.name}
            </div>

            <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
              NISN: <strong>{piagamStudent.nisn}</strong> • Kelas: <strong>{piagamStudent.className}</strong>
              <br />
              Atas dedikasi, integritas budi pekerti luhur, dan keteladanan Profil Pelajar Pancasila dengan akumulasi <strong className="text-emerald-700">+{piagamStudent.totalRewardPoints} Poin Penghargaan</strong> serta rata-rata nilai akademik <strong className="text-blue-700">{piagamStudent.academicAverage}</strong>.
            </p>

            <div className="grid grid-cols-2 gap-8 text-center text-xs text-slate-800 pt-8 max-w-lg mx-auto">
              <div>
                <p className="text-slate-500">Wali Kelas {piagamStudent.className}</p>
                <div className="h-16"></div>
                <p className="font-bold underline">{piagamStudent.homeroomTeacher}</p>
                <p className="text-[10px] text-slate-500">NIP. 19780415 200501 1 004</p>
              </div>

              <div>
                <p className="text-slate-500">Tanjung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-semibold text-slate-700">Kepala {SCHOOL_INFO.name}</p>
                <div className="h-16"></div>
                <p className="font-bold underline">{SCHOOL_INFO.headmaster}</p>
                <p className="text-[10px] text-slate-500">NIP. {SCHOOL_INFO.nipHeadmaster}</p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
