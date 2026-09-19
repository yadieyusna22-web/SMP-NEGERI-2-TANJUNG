import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { CLASSES, SCHOOL_INFO } from '../data/mockData';
import { AttendanceStatus, Student } from '../types';
import { 
  Calendar, 
  Check, 
  AlertCircle, 
  Clock, 
  Send, 
  FileText, 
  UserCheck, 
  Filter, 
  Search,
  CheckCheck,
  Save,
  Info
} from 'lucide-react';

interface AttendanceModuleProps {
  onOpenWhatsAppModal: (student: Student, type: 'absensi_alpa') => void;
  preselectedStudentId?: string;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({ 
  onOpenWhatsAppModal,
  preselectedStudentId 
}) => {
  const { 
    students, 
    attendanceRecords, 
    recordAttendance, 
    recordBatchAttendance, 
    currentUser 
  } = useSchool();

  const [selectedClass, setSelectedClass] = useState<string>(() => {
    return currentUser.assignedClass || '8A';
  });

  const [attendanceDate, setAttendanceDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Local draft status for currently displayed class
  const classStudents = students.filter(s => s.className === selectedClass);
  
  const [draftStatuses, setDraftStatuses] = useState<Record<string, { status: AttendanceStatus; note: string }>>(() => {
    const initial: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach(s => {
      initial[s.id] = { status: 'hadir', note: '' };
    });
    return initial;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Update draft status when class changes
  const handleClassChange = (cls: string) => {
    setSelectedClass(cls);
    const newStudents = students.filter(s => s.className === cls);
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    newStudents.forEach(s => {
      // check if today already has record in attendanceRecords
      const existing = attendanceRecords.find(a => a.studentId === s.id && a.date === attendanceDate);
      updated[s.id] = {
        status: existing ? existing.status : 'hadir',
        note: existing?.note || ''
      };
    });
    setDraftStatuses(updated);
  };

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setDraftStatuses(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const setStudentNote = (studentId: string, note: string) => {
    setDraftStatuses(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note
      }
    }));
  };

  const handleSetAllHadir = () => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach(s => {
      updated[s.id] = { status: 'hadir', note: draftStatuses[s.id]?.note || '' };
    });
    setDraftStatuses(updated);
  };

  const handleSaveAttendance = () => {
    const batchItems = classStudents.map(s => {
      const draft = draftStatuses[s.id] || { status: 'hadir', note: '' };
      return {
        studentId: s.id,
        status: draft.status,
        note: draft.note
      };
    });

    recordBatchAttendance(batchItems, attendanceDate);
    setSaveSuccessMsg(`Presensi Kelas ${selectedClass} tanggal ${attendanceDate} berhasil disimpan! Notifikasi otomatis terkirim untuk siswa yang alpa.`);
    setTimeout(() => setSaveSuccessMsg(null), 5000);
  };

  // Filtered by search
  const filteredStudents = classStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nisn.includes(searchQuery)
  );

  // Today summary for selected class
  const totalHadir = Object.values(draftStatuses).filter(d => d.status === 'hadir').length;
  const totalSakit = Object.values(draftStatuses).filter(d => d.status === 'sakit').length;
  const totalIzin = Object.values(draftStatuses).filter(d => d.status === 'izin').length;
  const totalAlpa = Object.values(draftStatuses).filter(d => d.status === 'alpa').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>📋 Presensi & Absensi Siswa</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full">
              Real-Time WhatsApp Integration
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Input kehadiran harian siswa {SCHOOL_INFO.name}. Sistem akan otomatis menyiapkan notifikasi WhatsApp ke orang tua bagi siswa yang Alpa.
          </p>
        </div>

        {/* Controls: Date Picker & Class Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium">
            <Calendar className="w-4 h-4 text-blue-600" />
            <input
              type="date"
              aria-label="Pilih Tanggal Presensi"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="bg-transparent border-0 text-slate-800 font-semibold focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium">
            <span className="text-slate-500">Pilih Kelas:</span>
            <select
              aria-label="Pilih Kelas Presensi"
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              className="bg-transparent border-0 text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              {CLASSES.map(cls => (
                <option key={cls} value={cls}>Kelas {cls}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Class Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-700">Hadir (H)</div>
            <div className="text-xl font-bold text-emerald-900">{totalHadir} Siswa</div>
          </div>
          <span className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs">
            H
          </span>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-amber-700">Sakit (S)</div>
            <div className="text-xl font-bold text-amber-900">{totalSakit} Siswa</div>
          </div>
          <span className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs">
            S
          </span>
        </div>

        <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-sky-700">Izin (I)</div>
            <div className="text-xl font-bold text-sky-900">{totalIzin} Siswa</div>
          </div>
          <span className="w-8 h-8 rounded-full bg-sky-200 text-sky-800 flex items-center justify-center font-bold text-xs">
            I
          </span>
        </div>

        <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-rose-700">Alpa (A)</div>
            <div className="text-xl font-bold text-rose-900">{totalAlpa} Siswa</div>
          </div>
          <span className="w-8 h-8 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center font-bold text-xs">
            A
          </span>
        </div>
      </div>

      {/* Main Attendance Input Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">Daftar Presensi Kelas {selectedClass}</span>
            <span className="text-xs text-slate-500">({classStudents.length} siswa terdaftar)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSetAllHadir}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Set Semua Hadir</span>
            </button>

            <button
              onClick={handleSaveAttendance}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-sm transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Presensi</span>
            </button>
          </div>
        </div>

        {/* Attendance List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa & NISN</th>
                <th className="py-3 px-4 text-center">Status Kehadiran</th>
                <th className="py-3 px-4">Keterangan / Alasan</th>
                <th className="py-3 px-4 text-center">Orang Tua & Notifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student, idx) => {
                const currentDraft = draftStatuses[student.id] || { status: 'hadir', note: '' };

                return (
                  <tr 
                    key={student.id} 
                    className={`hover:bg-slate-50 transition ${
                      currentDraft.status === 'alpa' ? 'bg-rose-50/40' : currentDraft.status === 'sakit' ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                    
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{student.name}</div>
                      <div className="text-[11px] text-slate-400">NISN: {student.nisn} • Presensi: {student.attendancePercentage}%</div>
                    </td>

                    {/* Status Toggle Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200">
                        {/* Hadir */}
                        <button
                          type="button"
                          onClick={() => setStudentStatus(student.id, 'hadir')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                            currentDraft.status === 'hadir'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Hadir
                        </button>

                        {/* Sakit */}
                        <button
                          type="button"
                          onClick={() => setStudentStatus(student.id, 'sakit')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                            currentDraft.status === 'sakit'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Sakit
                        </button>

                        {/* Izin */}
                        <button
                          type="button"
                          onClick={() => setStudentStatus(student.id, 'izin')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                            currentDraft.status === 'izin'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Izin
                        </button>

                        {/* Alpa */}
                        <button
                          type="button"
                          onClick={() => setStudentStatus(student.id, 'alpa')}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                            currentDraft.status === 'alpa'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Alpa
                        </button>
                      </div>
                    </td>

                    {/* Note Input */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder={
                          currentDraft.status === 'sakit' ? 'Contoh: Surat dokter Puskesmas Tanjung' :
                          currentDraft.status === 'izin' ? 'Contoh: Izin acara keluarga / dispensasi' :
                          currentDraft.status === 'alpa' ? 'Alasan: Tanpa keterangan / tidak masuk' : 'Catatan opsional...'
                        }
                        value={currentDraft.note}
                        onChange={(e) => setStudentNote(student.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    {/* WhatsApp Action */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-left hidden sm:block">
                          <div className="text-[11px] font-medium text-slate-800">{student.parentName}</div>
                          <div className="text-[10px] text-slate-400">+{student.parentPhone}</div>
                        </div>

                        {currentDraft.status === 'alpa' ? (
                          <button
                            onClick={() => onOpenWhatsAppModal(student, 'absensi_alpa')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold rounded-lg shadow-sm transition"
                            title="Kirim Pesan WhatsApp Alpa ke Orang Tua"
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim WA</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenWhatsAppModal(student, 'absensi_alpa')}
                            className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                            title="Hubungi Orang Tua Siswa"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Setiap perubahan status Alpa otomatis tercatat di rekapitulasi resiko dropout pada Dashboard Sekolah.</span>
          </div>
          <button
            onClick={handleSaveAttendance}
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Simpan Perubahan Presensi →
          </button>
        </div>

      </div>

    </div>
  );
};
