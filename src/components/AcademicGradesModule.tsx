import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { SUBJECTS, SCHOOL_INFO, CLASSES } from '../data/mockData';
import { Student, SubjectGrade } from '../types';
import { ExportPdfModal } from './ExportPdfModal';
import { GoogleSheetsExportModal } from './GoogleSheetsExportModal';
import { 
  BookOpen, 
  Award, 
  Send, 
  Printer, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Save,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface AcademicGradesModuleProps {
  onOpenWhatsAppModal: (student: Student, type: 'rapor_akademik') => void;
  preselectedStudentId?: string;
}

export const AcademicGradesModule: React.FC<AcademicGradesModuleProps> = ({
  onOpenWhatsAppModal,
  preselectedStudentId
}) => {
  const { students, grades, saveStudentGrades, currentUser } = useSchool();

  const [selectedClass, setSelectedClass] = useState<string>(currentUser.assignedClass || '8A');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const classStudents = students.filter(s => s.className === selectedClass);
  
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    preselectedStudentId || (classStudents[0]?.id || 's-101')
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId) || classStudents[0] || students[0];

  // Default grades if not populated
  const currentStudentGrades = grades[selectedStudent?.id] || {
    studentId: selectedStudent?.id,
    semester: 'Ganjil',
    academicYear: SCHOOL_INFO.academicYear,
    averageScore: selectedStudent?.academicAverage || 85.0,
    grades: SUBJECTS.map(sub => ({
      subjectId: sub.id,
      subjectName: sub.name,
      kkm: sub.kkm,
      tugas: 85,
      uh: 85,
      pts: 85,
      pas: 85,
      finalScore: 85,
      predicate: 'B' as const,
      isPassed: true,
      notes: 'Memenuhi capaian pembelajaran dengan baik.'
    }))
  };

  const [draftGrades, setDraftGrades] = useState<SubjectGrade[]>(currentStudentGrades.grades);
  const [viewMode, setViewMode] = useState<'input' | 'rapor'>('input');
  const [saveNotification, setSaveNotification] = useState(false);

  // Sync draft grades when student changes
  const handleSelectStudent = (sId: string) => {
    setSelectedStudentId(sId);
    const sGrades = grades[sId];
    if (sGrades) {
      setDraftGrades(sGrades.grades);
    } else {
      const student = students.find(s => s.id === sId);
      const baseScore = student?.academicAverage || 80;
      setDraftGrades(SUBJECTS.map(sub => ({
        subjectId: sub.id,
        subjectName: sub.name,
        kkm: sub.kkm,
        tugas: baseScore,
        uh: baseScore,
        pts: baseScore,
        pas: baseScore,
        finalScore: baseScore,
        predicate: baseScore >= 90 ? 'A' : baseScore >= 80 ? 'B' : baseScore >= 75 ? 'C' : 'D',
        isPassed: baseScore >= sub.kkm,
        notes: baseScore >= sub.kkm ? 'Tuntas mencapai KKM' : 'Perlu bimbingan remedial'
      })));
    }
  };

  const handleGradeChange = (index: number, field: 'tugas' | 'uh' | 'pts' | 'pas', value: number) => {
    const validVal = Math.min(100, Math.max(0, isNaN(value) ? 0 : value));
    setDraftGrades(prev => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: validVal };
      // Calculation: Tugas 20%, UH 20%, PTS 30%, PAS 30%
      const finalScore = Math.round((item.tugas * 0.2) + (item.uh * 0.2) + (item.pts * 0.3) + (item.pas * 0.3));
      item.finalScore = finalScore;
      item.isPassed = finalScore >= item.kkm;
      item.predicate = finalScore >= 90 ? 'A' : finalScore >= 80 ? 'B' : finalScore >= 75 ? 'C' : 'D';
      updated[index] = item;
      return updated;
    });
  };

  const handleSaveAllGrades = () => {
    saveStudentGrades(selectedStudent.id, draftGrades);
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 4000);
  };

  const totalScore = draftGrades.reduce((sum, g) => sum + g.finalScore, 0);
  const averageScore = Math.round((totalScore / draftGrades.length) * 10) / 10;
  const passedSubjectsCount = draftGrades.filter(g => g.isPassed).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>📝 Pengelolaan Nilai Akademik & Rapor</span>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-0.5 rounded-full">
              Kurikulum Merdeka & SMPN 2 Tanjung
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Input nilai tugas, ulangan harian, PTS, dan PAS serta pantau ketuntasan KKM siswa secara real-time.
          </p>
        </div>

        {/* View Mode Toggle & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button
              onClick={() => setViewMode('input')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'input'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mode Input Nilai
            </button>
            <button
              onClick={() => setViewMode('rapor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'rapor'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tinjau Lembar Rapor
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPdfModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ekspor PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSheetsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Google Sheets</span>
          </button>
        </div>
      </div>

      {/* Selector Bar: Class & Student */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Kelas:</span>
            <select
              aria-label="Pilih Kelas Nilai Akademik"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                const first = students.filter(s => s.className === e.target.value)[0];
                if (first) handleSelectStudent(first.id);
              }}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg px-3 py-1.5"
            >
              {CLASSES.map(c => (
                <option key={c} value={c}>Kelas {c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Siswa:</span>
            <select
              aria-label="Pilih Siswa Nilai Akademik"
              value={selectedStudent.id}
              onChange={(e) => handleSelectStudent(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg px-3 py-1.5"
            >
              {classStudents.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (NISN: {s.nisn})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Quick Summary */}
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-lg font-semibold border border-blue-200">
            Rerata Nilai: <span className="font-extrabold text-sm">{averageScore}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg font-semibold border border-emerald-200">
            Tuntas KKM: <span className="font-extrabold">{passedSubjectsCount}/{draftGrades.length}</span> Mapel
          </div>
        </div>
      </div>

      {saveNotification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Nilai akademik ananda {selectedStudent.name} berhasil disimpan dan diperbarui di rapor sekolah!</span>
          </div>
        </div>
      )}

      {/* MODE 1: Input Nilai Mapel */}
      {viewMode === 'input' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Daftar Nilai Mata Pelajaran: {selectedStudent.name}
              </h3>
              <p className="text-[11px] text-slate-500">
                Bobot Perhitungan: Tugas (20%) + Ulangan Harian (20%) + PTS (30%) + PAS (30%)
              </p>
            </div>

            <button
              onClick={handleSaveAllGrades}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-sm transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan Nilai</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-3 text-center">KKM</th>
                  <th className="py-3 px-3 text-center">Tugas (20%)</th>
                  <th className="py-3 px-3 text-center">UH (20%)</th>
                  <th className="py-3 px-3 text-center">PTS (30%)</th>
                  <th className="py-3 px-3 text-center">PAS (30%)</th>
                  <th className="py-3 px-3 text-center">Nilai Akhir</th>
                  <th className="py-3 px-3 text-center">Predikat</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {draftGrades.map((grade, index) => {
                  return (
                    <tr key={grade.subjectId} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-center font-bold text-slate-400">{index + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{grade.subjectName}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-600">{grade.kkm}</td>
                      
                      {/* Tugas */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={grade.tugas}
                          onChange={(e) => handleGradeChange(index, 'tugas', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* UH */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={grade.uh}
                          onChange={(e) => handleGradeChange(index, 'uh', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* PTS */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={grade.pts}
                          onChange={(e) => handleGradeChange(index, 'pts', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* PAS */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={grade.pas}
                          onChange={(e) => handleGradeChange(index, 'pas', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* Nilai Akhir */}
                      <td className="py-3 px-3 text-center font-extrabold text-sm text-blue-700">
                        {grade.finalScore}
                      </td>

                      {/* Predikat */}
                      <td className="py-3 px-3 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          grade.predicate === 'A' ? 'bg-emerald-100 text-emerald-800' :
                          grade.predicate === 'B' ? 'bg-blue-100 text-blue-800' :
                          grade.predicate === 'C' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {grade.predicate}
                        </span>
                      </td>

                      {/* Status KKM */}
                      <td className="py-3 px-4 text-center">
                        {grade.isPassed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle className="w-3 h-3" /> Tuntas
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <AlertCircle className="w-3 h-3" /> Remedial
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Rerata Seluruh Mapel: <strong className="text-slate-900">{averageScore}</strong>
            </div>
            <button
              onClick={handleSaveAllGrades}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
            >
              Simpan Perubahan Nilai
            </button>
          </div>

        </div>
      )}

      {/* MODE 2: Lembar Rapor Cetak & Kirim WA */}
      {viewMode === 'rapor' && (
        <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 sm:p-8 space-y-6">
          
          {/* Action buttons (No print) */}
          <div className="flex flex-wrap items-center justify-between gap-3 no-print pb-4 border-b border-slate-200">
            <div className="text-xs font-semibold text-slate-600">
              Pratinjau Lembar Laporan Hasil Belajar (Rapor) SMP Negeri 2 Tanjung
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Rapor (PDF)</span>
              </button>

              <button
                onClick={() => onOpenWhatsAppModal(selectedStudent, 'rapor_akademik')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Ringkasan Rapor via WA Ortu</span>
              </button>
            </div>
          </div>

          {/* KOP SURAT RESMI */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
              Pemerintah Kabupaten Lombok Utara • Dinas Pendidikan Kebudayaan
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight mt-0.5">
              {SCHOOL_INFO.name}
            </h3>
            <p className="text-xs text-slate-700 mt-1">
              {SCHOOL_INFO.address} • Telp: {SCHOOL_INFO.phone} • Email: {SCHOOL_INFO.email}
            </p>
            <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
              NPSN: {SCHOOL_INFO.npsn} • Akreditasi: {SCHOOL_INFO.akreditasi}
            </div>
          </div>

          {/* Student Info Table */}
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <div className="grid grid-cols-3 gap-1">
                <span className="font-semibold text-slate-500">Nama Siswa</span>
                <span className="col-span-2 font-bold text-slate-900">: {selectedStudent.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-1.5">
                <span className="font-semibold text-slate-500">NIS / NISN</span>
                <span className="col-span-2 font-medium">: {selectedStudent.nis} / {selectedStudent.nisn}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-1.5">
                <span className="font-semibold text-slate-500">Kelas</span>
                <span className="col-span-2 font-bold">: {selectedStudent.className}</span>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-1">
                <span className="font-semibold text-slate-500">Semester</span>
                <span className="col-span-2 font-semibold">: {SCHOOL_INFO.semester}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-1.5">
                <span className="font-semibold text-slate-500">Tahun Ajaran</span>
                <span className="col-span-2 font-semibold">: {SCHOOL_INFO.academicYear}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-1.5">
                <span className="font-semibold text-slate-500">Wali Kelas</span>
                <span className="col-span-2 font-bold">: {selectedStudent.homeroomTeacher}</span>
              </div>
            </div>
          </div>

          {/* Grades Table */}
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-800 uppercase font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">Mata Pelajaran</th>
                  <th className="py-2.5 px-2 text-center">KKM</th>
                  <th className="py-2.5 px-2 text-center">Nilai Akhir</th>
                  <th className="py-2.5 px-2 text-center">Predikat</th>
                  <th className="py-2.5 px-3">Deskripsi Capaian Kompetensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {draftGrades.map((g, idx) => (
                  <tr key={g.subjectId}>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{g.subjectName}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-600">{g.kkm}</td>
                    <td className="py-2.5 px-2 text-center font-extrabold text-blue-700">{g.finalScore}</td>
                    <td className="py-2.5 px-2 text-center font-bold">{g.predicate}</td>
                    <td className="py-2.5 px-3 text-slate-700 text-[11px] leading-relaxed">
                      {g.notes || (g.isPassed ? 'Menunjukkan penguasaan yang sangat baik dalam memahami konsep dasar dan penerapannya.' : 'Perlu pendampingan belajar tambahan.')}
                    </td>
                  </tr>
                ))}
                {/* Total & Average Row */}
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                  <td colSpan={3} className="py-2.5 px-3 text-right">Rata-rata Nilai Akademik:</td>
                  <td className="py-2.5 px-2 text-center text-blue-800 text-sm">{averageScore}</td>
                  <td className="py-2.5 px-2 text-center">{averageScore >= 90 ? 'A' : averageScore >= 80 ? 'B' : 'C'}</td>
                  <td className="py-2.5 px-3 text-emerald-700">
                    {passedSubjectsCount === draftGrades.length ? 'Seluruh mata pelajaran mencapai Kriteria Ketuntasan Minimal.' : `${draftGrades.length - passedSubjectsCount} mata pelajaran perlu remedial.`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Attendance and Character in Rapor */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-300 rounded-lg p-3">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Rekapitulasi Ketidakhadiran
              </div>
              <div className="space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>1. Sakit (S)</span>
                  <span className="font-bold">{selectedStudent.totalSakit} hari</span>
                </div>
                <div className="flex justify-between">
                  <span>2. Izin (I)</span>
                  <span className="font-bold">{selectedStudent.totalIzin} hari</span>
                </div>
                <div className="flex justify-between">
                  <span>3. Tanpa Keterangan (Alpa)</span>
                  <span className="font-bold text-rose-600">{selectedStudent.totalAlpa} hari</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-300 rounded-lg p-3">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Catatan Karakter & Kedisiplinan
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Poin Penghargaan: <strong className="text-emerald-600">+{selectedStudent.totalRewardPoints}</strong> • Poin Pelanggaran: <strong className="text-rose-600">{selectedStudent.totalViolationPoints}</strong>.
                {selectedStudent.isTeladanCandidate 
                  ? ' Ananda menunjukkan keteladanan budi pekerti dan prestasi yang sangat membanggakan sekolah.'
                  : ' Ananda diharapkan terus meningkatkan ketepatan hadir dan disiplin belajar.'}
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-slate-800 pt-6">
            <div>
              <p className="text-slate-500">Mengetahui,</p>
              <p className="font-semibold text-slate-700">Orang Tua / Wali Siswa</p>
              <div className="h-16"></div>
              <p className="font-bold underline">{selectedStudent.parentName}</p>
            </div>

            <div>
              <p className="text-slate-500">Tanjung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-semibold text-slate-700">Wali Kelas {selectedStudent.className}</p>
              <div className="h-16"></div>
              <p className="font-bold underline">{selectedStudent.homeroomTeacher}</p>
              <p className="text-[10px] text-slate-500">NIP. 19780415 200501 1 004</p>
            </div>

            <div>
              <p className="text-slate-500">Mengetahui,</p>
              <p className="font-semibold text-slate-700">Kepala {SCHOOL_INFO.name}</p>
              <div className="h-16"></div>
              <p className="font-bold underline">{SCHOOL_INFO.headmaster}</p>
              <p className="text-[10px] text-slate-500">NIP. {SCHOOL_INFO.nipHeadmaster}</p>
            </div>
          </div>

        </div>
      )}

      {/* PDF Export Modal */}
      <ExportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        students={students}
        grades={grades}
        initialClass={selectedClass}
      />

      {/* Google Sheets Export Modal */}
      <GoogleSheetsExportModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        students={students}
        grades={grades}
        initialClass={selectedClass}
      />

    </div>
  );
};
