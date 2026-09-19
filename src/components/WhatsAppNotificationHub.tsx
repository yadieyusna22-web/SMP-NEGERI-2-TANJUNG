import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_INFO } from '../data/mockData';
import { Student, WhatsAppNotificationLog } from '../types';
import { 
  Send, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  UserCheck, 
  AlertTriangle, 
  Sparkles, 
  FileText,
  Search,
  Filter
} from 'lucide-react';

interface WhatsAppNotificationHubProps {
  initialStudent?: Student;
  initialType?: 'absensi_alpa' | 'pelanggaran' | 'panggilan_ortu' | 'reward_prestasi' | 'rapor_akademik';
}

export const WhatsAppNotificationHub: React.FC<WhatsAppNotificationHubProps> = ({
  initialStudent,
  initialType = 'absensi_alpa'
}) => {
  const { students, whatsappLogs, sendWhatsAppNotification, getTierForPoints, currentUser } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || students[0]?.id || ''
  );

  const [notificationType, setNotificationType] = useState<
    'absensi_alpa' | 'pelanggaran' | 'panggilan_ortu' | 'reward_prestasi' | 'rapor_akademik'
  >(initialType);

  const [customNote, setCustomNote] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [searchLogQuery, setSearchLogQuery] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState('Semua');

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const studentTier = getTierForPoints(currentStudent?.totalViolationPoints || 0);

  // Generate real template based on type & student data
  const generateMessage = () => {
    if (!currentStudent) return '';
    const dateStr = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    switch (notificationType) {
      case 'absensi_alpa':
        return `*PEMBERITAHUAN KETIDAKHADIRAN (ALPA) SISWA*\n*${SCHOOL_INFO.name.toUpperCase()}*\n\nYth. Bapak/Ibu Orang Tua/Wali dari:\nNama: *${currentStudent.name}*\nNISN: ${currentStudent.nisn}\nKelas: *${currentStudent.className}*\n\nKami menginformasikan bahwa ananda pada hari ini, *${dateStr}*, tercatat *TIDAK HADIR TANPA KETERANGAN (ALPA)* pada jam masuk sekolah.\n\nTotal Akumulasi Alpa Semester Ini: *${currentStudent.totalAlpa} Hari*.\n${customNote ? `Catatan Khusus: ${customNote}\n` : ''}\nMohon kerja sama Bapak/Ibu untuk segera mengonfirmasi kabar ananda kepada Wali Kelas (*${currentStudent.homeroomTeacher}*) demi keselamatan dan kelanjutan proses belajar mengajar.\n\nTerima kasih atas perhatian dan kerja samanya.\n\n_Sistem Informasi Presensi SMP Negeri 2 Tanjung_`;

      case 'pelanggaran':
        return `*LAPORAN CATATAN PELANGGARAN TATA TERTIB*\n*${SCHOOL_INFO.name.toUpperCase()}*\n\nYth. Bapak/Ibu Orang Tua/Wali dari:\nNama: *${currentStudent.name}*\nKelas: *${currentStudent.className}*\n\nBerdasarkan pantauan tim kedisiplinan pada *${dateStr}*, ananda tercatat melakukan pelanggaran tata tertib sekolah.\n\n- Akumulasi Poin Pelanggaran: *${currentStudent.totalViolationPoints} Poin*\n- Status Pembinaan: *${studentTier.title}*\n${customNote ? `- Keterangan: ${customNote}\n` : ''}\nKami mengharapkan bimbingan dan arahan lebih lanjut di lingkungan keluarga agar ananda senantiasa disiplin dan menaati aturan sekolah.\n\n_Tertanda, Tim Kesiswaan & Bimbingan Konseling SMP Negeri 2 Tanjung_`;

      case 'panggilan_ortu':
        return `*UNDANGAN RESMI PEMANGGILAN ORANG TUA KE RUANG BK*\n*${SCHOOL_INFO.name.toUpperCase()}*\n\nNomor: 421.3/084/SMPN2-TJG/BK/2025\n\nKepada Yth.\nBapak/Ibu Orang Tua/Wali dari *${currentStudent.name}* (Kelas ${currentStudent.className})\n\nSehubungan dengan akumulasi poin pelanggaran tata tertib sekolah ananda yang telah mencapai *${currentStudent.totalViolationPoints} Poin* (${studentTier.title}), kami mengundang Bapak/Ibu untuk hadir ke sekolah pada:\n\nHari/Tanggal: *Rabu, 19 Februari 2025*\nWaktu: *09.00 WITA s.d. Selesai*\nTempat: *Ruang BK ${SCHOOL_INFO.name}*\nAgenda: *Koordinasi Pembinaan Bersama Wali Kelas & Guru BK*\n\nKehadiran Bapak/Ibu sangat menentukan kelanjutan pembinaan pendidikan ananda.\n\n_Hormat kami, Koordinator BK ${SCHOOL_INFO.name}_`;

      case 'reward_prestasi':
        return `*APRESIASI PRESTASI & SISWA TELADAN*\n*${SCHOOL_INFO.name.toUpperCase()}*\n\nKabar Membanggakan untuk Bapak/Ibu Orang Tua/Wali dari:\nNama: *${currentStudent.name}*\nKelas: *${currentStudent.className}*\n\nSelamat! Ananda telah menorehkan prestasi dan keteladanan Profil Pelajar Pancasila di ${SCHOOL_INFO.name}:\n- Total Poin Penghargaan: *+${currentStudent.totalRewardPoints} Poin*\n- Rata-rata Nilai Akademik: *${currentStudent.academicAverage}*\n- Presensi Kehadiran: *${currentStudent.attendancePercentage}%*\n${customNote ? `- Catatan: ${customNote}\n` : ''}\nTerima kasih atas doa dan bimbingan luar biasa dari orang tua di rumah. Semoga ananda terus berprestasi dan menjadi inspirasi bagi sesama!\n\n_Salam bangga, Kepala ${SCHOOL_INFO.name}_`;

      case 'rapor_akademik':
        return `*RINGKASAN LAPORAN HASIL BELAJAR (RAPOR)*\n*${SCHOOL_INFO.name.toUpperCase()}*\n\nYth. Bapak/Ibu Orang Tua/Wali dari:\nNama: *${currentStudent.name}*\nKelas: *${currentStudent.className}*\nSemester: ${SCHOOL_INFO.semester} (T.A ${SCHOOL_INFO.academicYear})\n\nBerikut ringkasan capaian belajar ananda:\n- Rata-rata Nilai Akademik: *${currentStudent.academicAverage}*\n- Kehadiran: Hadir (${currentStudent.totalHadir} hari), Sakit (${currentStudent.totalSakit} hari), Izin (${currentStudent.totalIzin} hari), Alpa (${currentStudent.totalAlpa} hari).\n- Poin Prestasi/Reward: +${currentStudent.totalRewardPoints} Poin\n- Poin Pelanggaran: ${currentStudent.totalViolationPoints} Poin\n\nUntuk rincian nilai per mata pelajaran dan catatan karakter lengkap, Bapak/Ibu dapat mengakses portal resmi atau menghubungi Wali Kelas: *${currentStudent.homeroomTeacher}*.\n\n_Hormat kami, Tim Akademik SMP Negeri 2 Tanjung_`;
    }
  };

  const messageText = generateMessage();
  const cleanPhone = currentStudent?.parentPhone.replace(/\D/g, '') || '';
  const directWhatsAppUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(messageText)}`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendAndLog = () => {
    if (!currentStudent) return;
    sendWhatsAppNotification({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      className: currentStudent.className,
      parentName: currentStudent.parentName,
      parentPhone: currentStudent.parentPhone,
      type: notificationType,
      subject: `Notifikasi: ${currentStudent.name} (${notificationType})`,
      messageText,
      sentBy: currentUser.name,
      status: 'Terkirim'
    });

    // Open WhatsApp Web or mobile app in new window safely
    window.open(directWhatsAppUrl, '_blank');
  };

  // Filter logs
  const filteredLogs = whatsappLogs.filter(log => {
    const matchSearch = log.studentName.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      log.parentName.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      log.parentPhone.includes(searchLogQuery);
    const matchType = logTypeFilter === 'Semua' || log.type === logTypeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
              WA
            </span>
            <span>Sistem Pelaporan Otomatis Orang Tua via WhatsApp</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Komunikasi real-time terintegrasi antara pihak sekolah {SCHOOL_INFO.name} dan orang tua/wali murid.
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 self-start">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Gateway WhatsApp Aktif: <strong>Direct Deep-Link Protocol</strong></span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Template Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Konfigurasi Pesan WhatsApp Sekolah</span>
            </h3>

            {/* Student Selector */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pilih Siswa & Kontak Orang Tua:</label>
              <select
                aria-label="Pilih Siswa & Kontak Orang Tua"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.className}) — Ortu: {s.parentName} (+{s.parentPhone})
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Type Selector */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pilih Kategori Pelaporan Resmi:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                
                <button
                  type="button"
                  onClick={() => setNotificationType('absensi_alpa')}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition ${
                    notificationType === 'absensi_alpa'
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <div className="leading-tight">Ketidakhadiran (Alpa)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Pemberitahuan bolos/tanpa kabar</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setNotificationType('pelanggaran')}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition ${
                    notificationType === 'pelanggaran'
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="leading-tight">Catatan Pelanggaran</div>
                    <div className="text-[10px] text-slate-500 font-normal">Laporan poin & tata tertib</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setNotificationType('panggilan_ortu')}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition ${
                    notificationType === 'panggilan_ortu'
                      ? 'bg-orange-50 border-orange-300 text-orange-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-orange-600 shrink-0" />
                  <div>
                    <div className="leading-tight">Panggilan ke Ruang BK</div>
                    <div className="text-[10px] text-slate-500 font-normal">Undangan tatap muka resmi</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setNotificationType('reward_prestasi')}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition ${
                    notificationType === 'reward_prestasi'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="leading-tight">Apresiasi Siswa Teladan</div>
                    <div className="text-[10px] text-slate-500 font-normal">Ucapan selamat & poin prestasi</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setNotificationType('rapor_akademik')}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition sm:col-span-2 ${
                    notificationType === 'rapor_akademik'
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <div className="leading-tight">Ringkasan Laporan Rapor Akademik</div>
                    <div className="text-[10px] text-slate-500 font-normal">Rerata nilai, peringkat, dan catatan wali kelas</div>
                  </div>
                </button>

              </div>
            </div>

            {/* Custom note to append */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Catatan Tambahan Guru (Opsional):</label>
              <textarea
                rows={2}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Tambahkan pesan khusus untuk orang tua..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
              ></textarea>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Teks Tersalin!' : 'Salin Teks Format WA'}</span>
              </button>

              <button
                type="button"
                onClick={handleSendAndLog}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md transition"
              >
                <Send className="w-4 h-4" />
                <span>Buka & Kirim via WhatsApp (+{currentStudent?.parentPhone})</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Live Phone Mockup Preview (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 rounded-3xl p-3 shadow-2xl border-4 border-slate-800 max-w-sm mx-auto">
            
            {/* Phone Speaker & Camera Notch */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-3 bg-slate-800 rounded-full"></div>
            </div>

            {/* WhatsApp App Container */}
            <div className="bg-[#efeae2] rounded-2xl overflow-hidden flex flex-col h-[520px] shadow-inner text-xs border border-slate-300">
              
              {/* WhatsApp Header Bar */}
              <div className="bg-[#075e54] text-white p-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white text-[#075e54] font-bold flex items-center justify-center text-xs shadow-inner">
                    SP
                  </div>
                  <div>
                    <div className="font-bold text-xs leading-tight">{currentStudent?.parentName}</div>
                    <div className="text-[10px] text-emerald-200">
                      Wali dari {currentStudent?.name} ({currentStudent?.className})
                    </div>
                  </div>
                </div>

                <div className="text-[10px] bg-[#128c7e] px-2 py-0.5 rounded-full text-emerald-100">
                  Online
                </div>
              </div>

              {/* Chat Bubble Canvas */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                
                <div className="flex justify-center">
                  <span className="bg-amber-100/90 text-amber-900 text-[10px] px-3 py-1 rounded-full shadow-2xs font-medium">
                    Pesan Resmi Terenkripsi • SMP Negeri 2 Tanjung
                  </span>
                </div>

                {/* Sent Message Bubble */}
                <div className="flex justify-end">
                  <div className="bg-[#d9fdd3] text-slate-900 p-3 rounded-2xl rounded-tr-xs shadow-xs max-w-[90%] space-y-1.5 border border-emerald-200/60">
                    <div className="whitespace-pre-line text-[11px] leading-relaxed font-sans">
                      {messageText}
                    </div>

                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-500 pt-1">
                      <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-blue-600 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Fake WhatsApp Input Bar */}
              <div className="bg-slate-100 p-2 flex items-center gap-2 border-t border-slate-200">
                <div className="flex-1 bg-white px-3 py-1.5 rounded-full text-[11px] text-slate-400 border border-slate-200">
                  Ketik pesan...
                </div>
                <button
                  onClick={handleSendAndLog}
                  className="w-8 h-8 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-xs hover:bg-[#068f70] transition"
                  title="Kirim Sekarang"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Log of Sent WhatsApp Notifications */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Riwayat Pengiriman Notifikasi WhatsApp ke Orang Tua</h3>
            <p className="text-[11px] text-slate-500">Transparansi log komunikasi sekolah untuk evaluasi & arsip kesiswaan</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari log..."
                value={searchLogQuery}
                onChange={(e) => setSearchLogQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-300 rounded-lg w-40"
              />
            </div>

            <select
              aria-label="Filter Tipe Log WhatsApp"
              value={logTypeFilter}
              onChange={(e) => setLogTypeFilter(e.target.value)}
              className="bg-white border border-slate-300 text-xs rounded-lg px-2.5 py-1 font-medium"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="absensi_alpa">Ketidakhadiran (Alpa)</option>
              <option value="pelanggaran">Pelanggaran Tata Tertib</option>
              <option value="panggilan_ortu">Panggilan Orang Tua</option>
              <option value="reward_prestasi">Prestasi / Reward</option>
              <option value="rapor_akademik">Rapor Akademik</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {filteredLogs.length === 0 ? (
            <div className="p-6 text-center text-slate-400">Belum ada log pesan yang sesuai filter.</div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      log.type === 'absensi_alpa' ? 'bg-rose-100 text-rose-800' :
                      log.type === 'pelanggaran' ? 'bg-amber-100 text-amber-800' :
                      log.type === 'panggilan_ortu' ? 'bg-orange-100 text-orange-800' :
                      log.type === 'reward_prestasi' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.type === 'absensi_alpa' ? 'Alpa Presensi' :
                       log.type === 'pelanggaran' ? 'Tata Tertib' :
                       log.type === 'panggilan_ortu' ? 'Panggilan BK' :
                       log.type === 'reward_prestasi' ? 'Apresiasi Prestasi' : 'Rapor'}
                    </span>
                    <span className="font-bold text-slate-900">{log.studentName} ({log.className})</span>
                    <span className="text-[11px] text-slate-400">• Penerima: {log.parentName} (+{log.parentPhone})</span>
                  </div>
                  <p className="text-slate-600 text-xs truncate max-w-xl">{log.messageText.replace(/\*/g, '').slice(0, 140)}...</p>
                  <div className="text-[10px] text-slate-400">Pengirim: {log.sentBy} • Waktu: {log.timestamp}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                    ✓ {log.status}
                  </span>
                  <a
                    href={log.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                    title="Buka kembali di WhatsApp"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
