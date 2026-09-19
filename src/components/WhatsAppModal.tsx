import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Student } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import { X, Send, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  initialType?: 'absensi_alpa' | 'pelanggaran' | 'panggilan_ortu' | 'reward_prestasi' | 'rapor_akademik';
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  student,
  initialType = 'absensi_alpa'
}) => {
  const { sendWhatsAppNotification, currentUser, getTierForPoints } = useSchool();
  const [notifType, setNotifType] = useState(initialType);
  const [customNote, setCustomNote] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialType) setNotifType(initialType);
  }, [initialType, isOpen]);

  if (!isOpen || !student) return null;

  const tier = getTierForPoints(student.totalViolationPoints);
  const dateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const getMessageContent = () => {
    switch (notifType) {
      case 'absensi_alpa':
        return `*PEMBERITAHUAN KETIDAKHADIRAN (ALPA) SISWA*\n*${SCHOOL_INFO.name.toUpperCase()}*\n\nYth. Bapak/Ibu ${student.parentName} (Orang Tua/Wali dari ${student.name} - Kelas ${student.className}):\n\nKami menginformasikan bahwa ananda pada hari ini, *${dateStr}*, tercatat *TIDAK HADIR TANPA KETERANGAN (ALPA)*.\n\nTotal Akumulasi Alpa: *${student.totalAlpa} Hari*.\n${customNote ? `Catatan: ${customNote}\n` : ''}\nMohon konfirmasi ananda kepada Wali Kelas (*${student.homeroomTeacher}*) demi keselamatan dan proses belajar mengajar.\n\n_Sistem Informasi Terpadu SMP Negeri 2 Tanjung_`;

      case 'pelanggaran':
        return `*LAPORAN CATATAN PELANGGARAN TATA TERTIB*\n*${SCHOOL_INFO.name.toUpperCase()}*\n\nYth. Bapak/Ibu ${student.parentName}:\n\nKami menginformasikan perkembangan kedisiplinan ananda *${student.name}* (Kelas ${student.className}):\n- Akumulasi Poin Pelanggaran: *${student.totalViolationPoints} Poin*\n- Status Tindak Lanjut: *${tier.title}*\n${customNote ? `- Keterangan: ${customNote}\n` : ''}\nMohon bimbingan bersama di rumah agar ananda senantiasa mematuhi tata tertib sekolah demi masa depannya.\n\n_Tertanda, Tim Kedisiplinan & BK SMP Negeri 2 Tanjung_`;

      case 'panggilan_ortu':
        return `*SURAT UNDANGAN PEMANGGILAN ORANG TUA KE RUANG BK*\n*${SCHOOL_INFO.name.toUpperCase()}*\n\nNomor: 421.3/084/SMPN2-TJG/BK/2025\n\nKepada Yth.\nBapak/Ibu ${student.parentName} (Orang Tua/Wali dari ${student.name}):\n\nSehubungan dengan akumulasi pelanggaran ananda mencapai *${student.totalViolationPoints} Poin* (${tier.title}), kami mengharap kehadiran Bapak/Ibu ke sekolah:\n\nHari/Tanggal: *Rabu, 19 Februari 2025*\nWaktu: *09.00 WITA*\nTempat: *Ruang BK ${SCHOOL_INFO.name}*\nAgenda: *Koordinasi Pembinaan Edukatif Bersama*\n\nKehadiran Bapak/Ibu sangat berarti bagi ananda.\n\n_Koordinator BK ${SCHOOL_INFO.name}_`;

      case 'reward_prestasi':
        return `*APRESIASI PRESTASI & SISWA TELADAN*\n*${SCHOOL_INFO.name.toUpperCase()}*\n\nKabar Membanggakan untuk Bapak/Ibu ${student.parentName}:\n\nSelamat! Ananda *${student.name}* (Kelas ${student.className}) menorehkan prestasi membanggakan dengan *+${student.totalRewardPoints} Poin Penghargaan* dan rata-rata akademik *${student.academicAverage}*.\n\nTerima kasih atas bimbingan luar biasa Bapak/Ibu di rumah!\n\n_Salam bangga, Keluarga Besar ${SCHOOL_INFO.name}_`;

      case 'rapor_akademik':
        return `*RINGKASAN LAPORAN HASIL BELAJAR (RAPOR)*\n*${SCHOOL_INFO.name.toUpperCase()}*\n\nYth. Bapak/Ibu ${student.parentName}:\n\nBerikut ringkasan capaian ananda *${student.name}* (Kelas ${student.className}):\n- Rata-rata Nilai: *${student.academicAverage}*\n- Presensi Kehadiran: *${student.attendancePercentage}%*\n- Poin Reward: +${student.totalRewardPoints} | Poin Pelanggaran: ${student.totalViolationPoints}\n\nUntuk konsultasi lebih lanjut, silakan hubungi Wali Kelas: ${student.homeroomTeacher}.\n\n_SMP Negeri 2 Tanjung_`;
    }
  };

  const messageText = getMessageContent();
  const cleanPhone = student.parentPhone.replace(/\D/g, '');
  const directWhatsAppUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(messageText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSend = () => {
    sendWhatsAppNotification({
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      type: notifType,
      subject: `Notifikasi WA: ${student.name} (${notifType})`,
      messageText,
      sentBy: currentUser.name,
      status: 'Terkirim'
    });

    window.open(directWhatsAppUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-xs">
              WA
            </span>
            <div>
              <h3 className="font-bold text-sm">Kirim Laporan Otomatis WhatsApp</h3>
              <p className="text-[11px] text-emerald-100">
                Tujuan: {student.parentName} (+{student.parentPhone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-emerald-600 rounded-lg text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Student Banner */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">{student.name} (Kelas {student.className})</div>
              <div className="text-slate-500 text-[11px]">NISN: {student.nisn} • Wali Kelas: {student.homeroomTeacher}</div>
            </div>
            <div className="text-right text-[11px]">
              <div>Alpa: <strong className="text-rose-600">{student.totalAlpa}</strong> | Hadir: <strong>{student.attendancePercentage}%</strong></div>
              <div>Poin Plg: <strong className="text-rose-600">{student.totalViolationPoints}</strong> | Reward: <strong className="text-emerald-600">+{student.totalRewardPoints}</strong></div>
            </div>
          </div>

          {/* Type Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Jenis Notifikasi:</label>
            <select
              aria-label="Pilih Jenis Notifikasi WhatsApp"
              value={notifType}
              onChange={(e) => setNotifType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-900"
            >
              <option value="absensi_alpa">Ketidakhadiran (Alpa / Bolos)</option>
              <option value="pelanggaran">Catatan Pelanggaran Tata Tertib</option>
              <option value="panggilan_ortu">Surat Panggilan Orang Tua ke BK</option>
              <option value="reward_prestasi">Apresiasi Prestasi / Siswa Teladan</option>
              <option value="rapor_akademik">Ringkasan Nilai Rapor Siswa</option>
            </select>
          </div>

          {/* Custom Note */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Catatan Tambahan (Opsional):</label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Misal: Sudah dihubungi via telepon namun tidak tersambung..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
            />
          </div>

          {/* Message Preview */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Pratinjau Format Pesan:</label>
            <div className="bg-[#efeae2] p-3 rounded-xl border border-slate-300 max-h-48 overflow-y-auto">
              <div className="bg-[#d9fdd3] p-3 rounded-xl border border-emerald-200 text-slate-900 whitespace-pre-line text-[11px] leading-relaxed shadow-xs">
                {messageText}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin' : 'Salin Format'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSend}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition"
            >
              <Send className="w-4 h-4" />
              <span>Buka & Kirim WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
