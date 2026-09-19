import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_INFO, CLASSES } from '../data/mockData';
import { Student, StudentViolationRecord } from '../types';
import { 
  ShieldAlert, 
  BookOpen, 
  PlusCircle, 
  Send, 
  Printer, 
  CheckCircle2, 
  Clock, 
  UserX, 
  FileWarning, 
  HelpCircle,
  Search,
  Filter,
  AlertOctagon
} from 'lucide-react';

interface CodeOfConductModuleProps {
  onOpenWhatsAppModal: (student: Student, type: 'pelanggaran' | 'panggilan_ortu') => void;
}

export const CodeOfConductModule: React.FC<CodeOfConductModuleProps> = ({
  onOpenWhatsAppModal
}) => {
  const { 
    ruleMaster, 
    consequenceTiers, 
    violations, 
    addViolation, 
    updateViolationStatus, 
    students,
    getTierForPoints,
    currentUser
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'log' | 'input' | 'surat' | 'aturan'>('log');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');

  // Input Violation State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedRuleId, setSelectedRuleId] = useState<string>(ruleMaster[0]?.id || '');
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incidentLocation, setIncidentLocation] = useState<string>('Lingkungan SMP Negeri 2 Tanjung');
  const [incidentNotes, setIncidentNotes] = useState<string>('');
  const [consequencePlan, setConsequencePlan] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Selected student for Official Parent Summon Letter (Surat Panggilan)
  const highViolationStudents = students.filter(s => s.totalViolationPoints >= 16);
  const [summonStudentId, setSummonStudentId] = useState<string>(
    highViolationStudents[0]?.id || students[0]?.id || ''
  );
  const summonStudent = students.find(s => s.id === summonStudentId) || students[0];
  const summonTier = getTierForPoints(summonStudent?.totalViolationPoints || 0);

  const handleRuleSelect = (ruleId: string) => {
    setSelectedRuleId(ruleId);
    const r = ruleMaster.find(item => item.id === ruleId);
    if (r) {
      const student = students.find(s => s.id === selectedStudentId);
      const projectedPoints = (student?.totalViolationPoints || 0) + r.points;
      const tier = getTierForPoints(projectedPoints);
      setConsequencePlan(tier.action);
    }
  };

  const handleSubmitViolation = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    addViolation({
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      ruleId: selectedRuleId,
      date: incidentDate,
      location: incidentLocation,
      reportedBy: currentUser.name,
      notes: incidentNotes || 'Tercatat pelanggaran tata tertib sekolah.',
      status: 'Menunggu Tindak Lanjut',
      consequenceAssigned: consequencePlan,
      parentNotified: true,
      parentNotificationDate: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    });

    setSuccessToast(`Pelanggaran ananda ${student.name} berhasil dicatat dan pesan otomatis disiapkan untuk orang tua!`);
    setActiveTab('log');
    setIncidentNotes('');
    setTimeout(() => setSuccessToast(null), 5000);
  };

  // Filtered violations
  const filteredViolations = violations.filter(v => {
    const matchSearch = v.studentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.ruleTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.className.toLowerCase().includes(searchFilter.toLowerCase());
    const matchStatus = statusFilter === 'Semua' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Module Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>Tata Tertib, Poin Pelanggaran & Konsekuensi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standar kedisiplinan dan pembinaan budi pekerti bertahap bagi siswa {SCHOOL_INFO.name}.
          </p>
        </div>

        {/* Sub-nav buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('log')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'log' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log Kasus Pelanggaran ({violations.length})
          </button>
          
          <button
            onClick={() => setActiveTab('input')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'input' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Catat Pelanggaran Baru
          </button>

          <button
            onClick={() => setActiveTab('surat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'surat' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Surat Panggilan Orang Tua
          </button>

          <button
            onClick={() => setActiveTab('aturan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'aturan' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Aturan & Poin
          </button>
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast(null)}>✕</button>
        </div>
      )}

      {/* Hierarchical Consequence Tiers Strip */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <AlertOctagon className="w-4 h-4 text-amber-500" />
          <span>Skala Pembinaan Konsekuensi Bertahap Berdasarkan Akumulasi Poin Pelanggaran</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
          {consequenceTiers.map(tier => (
            <div 
              key={tier.level}
              className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                tier.level === 1 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' :
                tier.level === 2 ? 'bg-blue-50/70 border-blue-200 text-blue-950' :
                tier.level === 3 ? 'bg-amber-50/80 border-amber-300 text-amber-950' :
                tier.level === 4 ? 'bg-orange-50/80 border-orange-300 text-orange-950' :
                'bg-rose-50/80 border-rose-300 text-rose-950'
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <span>Tier {tier.level}</span>
                  <span className="px-1.5 py-0.2 rounded bg-white/80 border shadow-2xs font-extrabold">
                    {tier.minPoints}-{tier.maxPoints} Poin
                  </span>
                </div>
                <h5 className="font-bold text-xs mt-1 leading-tight">{tier.title}</h5>
                <p className="text-[10px] text-slate-600 mt-1 leading-snug">{tier.action}</p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] font-semibold text-slate-500">
                PJ: {tier.handlingRole}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: LOG PELANGGARAN */}
      {activeTab === 'log' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
          
          {/* Controls Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama siswa / pelanggaran..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg w-48 sm:w-60 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Status:</span>
                <select
                  aria-label="Filter Status Pelanggaran"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-300 text-xs rounded-lg px-2.5 py-1.5 font-medium"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Menunggu Tindak Lanjut">Menunggu Tindak Lanjut</option>
                  <option value="Dalam Pembinaan BK">Dalam Pembinaan BK</option>
                  <option value="Selesai / Resolusi">Selesai / Resolusi</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('input')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition self-start"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Kasus</span>
            </button>
          </div>

          {/* Violations Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tanggal & Siswa</th>
                  <th className="py-3 px-3">Pelanggaran Tata Tertib</th>
                  <th className="py-3 px-3 text-center">Poin</th>
                  <th className="py-3 px-3">Pelapor / Lokasi</th>
                  <th className="py-3 px-3">Tindak Lanjut / Konsekuensi</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi / Ortu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredViolations.map(viol => {
                  const student = students.find(s => s.id === viol.studentId);

                  return (
                    <tr key={viol.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{viol.studentName}</div>
                        <div className="text-[11px] text-slate-500">
                          Kelas {viol.className} • Tanggal: {viol.date}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{viol.ruleTitle}</div>
                        <div className="text-[11px] text-slate-500">{viol.notes}</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                          +{viol.points}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-800">{viol.reportedBy}</div>
                        <div className="text-[11px] text-slate-400">{viol.location}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[11px] font-medium text-slate-700">
                          {viol.consequenceAssigned || 'Peringatan & Bimbingan'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <select
                          aria-label={`Ubah Status Pelanggaran ${viol.studentName}`}
                          value={viol.status}
                          onChange={(e) => updateViolationStatus(viol.id, e.target.value as any)}
                          className={`text-[11px] font-bold rounded-lg px-2 py-1 border cursor-pointer ${
                            viol.status === 'Selesai / Resolusi' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                            viol.status === 'Dalam Pembinaan BK' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                            'bg-rose-50 text-rose-700 border-rose-300'
                          }`}
                        >
                          <option value="Menunggu Tindak Lanjut">Menunggu Tindak Lanjut</option>
                          <option value="Dalam Pembinaan BK">Dalam Pembinaan BK</option>
                          <option value="Selesai / Resolusi">Selesai / Resolusi</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {student && (
                          <button
                            onClick={() => onOpenWhatsAppModal(student, 'pelanggaran')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-sm transition"
                            title="Kirim Notifikasi Pelanggaran ke WhatsApp Orang Tua"
                          >
                            <Send className="w-3 h-3" />
                            <span>Lapor WA</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INPUT PELANGGARAN BARU */}
      {activeTab === 'input' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-rose-600" />
            <span>Formulir Pencatatan Pelanggaran Tata Tertib</span>
          </h3>

          <form onSubmit={handleSubmitViolation} className="mt-4 space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pilih Siswa Terlapor:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    handleRuleSelect(selectedRuleId);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Kelas {s.className} • Poin Saat Ini: {s.totalViolationPoints})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tanggal Kejadian:</label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pasal / Jenis Pelanggaran Tata Tertib:</label>
              <select
                value={selectedRuleId}
                onChange={(e) => handleRuleSelect(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
              >
                {ruleMaster.map(r => (
                  <option key={r.id} value={r.id}>
                    [{r.code}] {r.title} — ({r.points} Poin) • Kategori: {r.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lokasi Kejadian:</label>
                <input
                  type="text"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  placeholder="Contoh: Belakang Musholla / Ruang Kelas 8A"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pelapor / Guru Piket:</label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.name} (${currentUser.title})`}
                  className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 text-slate-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kronologi / Catatan Kejadian:</label>
              <textarea
                rows={3}
                value={incidentNotes}
                onChange={(e) => setIncidentNotes(e.target.value)}
                placeholder="Jelaskan secara objektif kronologi kejadian, barang bukti yang ditemukan, atau pengakuan siswa..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
              ></textarea>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Rencana Sanksi / Konsekuensi Edukatif:</label>
              <input
                type="text"
                value={consequencePlan}
                onChange={(e) => setConsequencePlan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('log')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shadow-sm transition"
              >
                Simpan & Siapkan Laporan WA Ortu
              </button>
            </div>

          </form>
        </div>
      )}

      {/* SUB-TAB 3: SURAT PANGGILAN RESMI ORANG TUA */}
      {activeTab === 'surat' && (
        <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 sm:p-8 space-y-6">
          
          {/* Top selection & print button */}
          <div className="flex flex-wrap items-center justify-between gap-3 no-print pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700">Pilih Siswa untuk Surat Pemanggilan:</span>
              <select
                aria-label="Pilih Siswa Surat Pemanggilan"
                value={summonStudent.id}
                onChange={(e) => setSummonStudentId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.className}) — {s.totalViolationPoints} Poin ({getTierForPoints(s.totalViolationPoints).title})
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
                <span>Cetak Surat Resmi</span>
              </button>

              <button
                onClick={() => onOpenWhatsAppModal(summonStudent, 'panggilan_ortu')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Undangan via WA</span>
              </button>
            </div>
          </div>

          {/* KOP RESMI SURAT */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
              Pemerintah Kabupaten Lombok Utara • Dinas Pendidikan dan Kebudayaan
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight mt-0.5">
              {SCHOOL_INFO.name}
            </h3>
            <div className="text-xs font-semibold text-slate-700">
              Unit Bimbingan Konseling (BK) & Tim Kesiswaan
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {SCHOOL_INFO.address} • Telp: {SCHOOL_INFO.phone} • Email: {SCHOOL_INFO.email}
            </p>
          </div>

          {/* Surat Meta */}
          <div className="flex justify-between text-xs text-slate-800">
            <div>
              <div>Nomor : 421.3 / 084 / SMPN2-TJG / BK / 2025</div>
              <div>Lampiran : 1 (Satu) Lembar Rekapitulasi Pelanggaran</div>
              <div>Hal : <strong className="underline">Panggilan Orang Tua / Wali Siswa (Tahap {summonTier.level})</strong></div>
            </div>
            <div className="text-right">
              <div>Tanjung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>

          {/* Kepada Yth */}
          <div className="text-xs text-slate-800">
            <div>Kepada Yth.</div>
            <div className="font-bold text-slate-900">Bapak / Ibu Orang Tua / Wali dari ananda: {summonStudent.name}</div>
            <div>di Tempat</div>
          </div>

          {/* Body Text */}
          <div className="text-xs text-slate-800 space-y-3 leading-relaxed">
            <p>Dengan hormat,</p>
            <p>
              Sehubungan dengan tata tertib sekolah dan perkembangan kedisiplinan siswa di {SCHOOL_INFO.name}, kami menginformasikan bahwa ananda:
            </p>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div><strong>Nama Siswa:</strong> {summonStudent.name}</div>
              <div><strong>Kelas:</strong> {summonStudent.className}</div>
              <div><strong>NISN:</strong> {summonStudent.nisn}</div>
              <div><strong>Wali Kelas:</strong> {summonStudent.homeroomTeacher}</div>
              <div className="col-span-2">
                <strong>Akumulasi Poin Pelanggaran:</strong> <span className="text-rose-600 font-extrabold">{summonStudent.totalViolationPoints} Poin</span> ({summonTier.title})
              </div>
            </div>

            <p>
              Telah mencapai batas poin yang memerlukan penanganan khusus bersama pihak keluarga. Oleh karena itu, kami mengharap kehadiran Bapak/Ibu pada:
            </p>

            <div className="pl-6 space-y-1">
              <div><strong>Hari / Tanggal :</strong> Rabu, 19 Februari 2025</div>
              <div><strong>Waktu :</strong> Pukul 09.00 WITA s.d. Selesai</div>
              <div><strong>Tempat :</strong> Ruang Bimbingan Konseling (BK) {SCHOOL_INFO.name}</div>
              <div><strong>Agenda :</strong> Pembinaan Bersama dan Penandatanganan Pakta Komitmen Edukatif</div>
            </div>

            <p>
              Mengingat pentingnya koordinasi ini demi kelanjutan masa depan pendidikan ananda, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya.
            </p>

            <p>Demikian surat panggilan ini kami sampaikan, atas perhatian dan kerja samanya kami ucapkan terima kasih.</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-center text-xs text-slate-800 pt-6">
            <div>
              <p className="font-semibold text-slate-700">Koordinator Bimbingan Konseling,</p>
              <div className="h-16"></div>
              <p className="font-bold underline">{SCHOOL_INFO.bkCoordinator}</p>
              <p className="text-[10px] text-slate-500">NIP. 19740812 200003 2 004</p>
            </div>

            <div>
              <p className="font-semibold text-slate-700">Mengetahui,</p>
              <p className="font-semibold text-slate-700">Kepala {SCHOOL_INFO.name}</p>
              <div className="h-16"></div>
              <p className="font-bold underline">{SCHOOL_INFO.headmaster}</p>
              <p className="text-[10px] text-slate-500">NIP. {SCHOOL_INFO.nipHeadmaster}</p>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 4: MASTER ATURAN TATA TERTIB */}
      {activeTab === 'aturan' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Katalog Resmi Pasal Tata Tertib SMP Negeri 2 Tanjung
            </h3>
            <span className="text-xs text-slate-500">Total {ruleMaster.length} Aturan Baku</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {ruleMaster.map(r => (
              <div key={r.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-blue-700">{r.code}</span>
                    <span className="font-bold text-slate-900">{r.title}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border">
                      {r.category}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1">{r.description}</p>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-lg font-black text-sm border border-rose-200">
                    +{r.points} Poin
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
