import React, { useState } from 'react';
import { Student, StudentGrades } from '../types';
import { CLASSES, SCHOOL_INFO } from '../data/mockData';
import { 
  downloadMonthlyReportPdf, 
  printMonthlyReportPdf, 
  MonthlyPdfReportOptions 
} from '../utils/pdfExport';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Calendar, 
  Users, 
  BookOpen, 
  AlertTriangle 
} from 'lucide-react';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  grades: Record<string, StudentGrades>;
  initialClass?: string;
}

const MONTHS = [
  'Juli 2024',
  'Agustus 2024',
  'September 2024',
  'Oktober 2024',
  'November 2024',
  'Desember 2024',
  'Januari 2025',
  'Februari 2025',
  'Maret 2025',
  'April 2025',
  'Mei 2025',
  'Juni 2025'
];

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  students,
  grades,
  initialClass = 'Semua'
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2024');
  const [selectedClass, setSelectedClass] = useState<string>(initialClass);
  const [reportType, setReportType] = useState<'all' | 'attendance' | 'academic'>('all');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetStudents = selectedClass === 'Semua'
    ? students
    : students.filter(s => s.className === selectedClass);

  const avgAttendance = targetStudents.length > 0 
    ? Math.round(targetStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / targetStudents.length)
    : 0;

  const highRiskAlpa = targetStudents.filter(s => s.totalAlpa >= 3).length;

  const avgAcademic = targetStudents.length > 0
    ? (targetStudents.reduce((acc, s) => acc + s.academicAverage, 0) / targetStudents.length).toFixed(1)
    : '0';

  const exportOptions: MonthlyPdfReportOptions = {
    month: selectedMonth,
    className: selectedClass,
    reportType,
    students,
    grades
  };

  const handleDownload = () => {
    setIsGenerating(true);
    setSuccessMessage(null);
    try {
      downloadMonthlyReportPdf(exportOptions);
      setSuccessMessage('File PDF berhasil dibuat dan mulai diunduh.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      alert('Terjadi kesalahan saat membuat PDF: ' + (err.message || ''));
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    setIsGenerating(true);
    try {
      printMonthlyReportPdf(exportOptions);
    } catch (err: any) {
      console.error(err);
      alert('Terjadi kesalahan saat membuka print preview: ' + (err.message || ''));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Cetak & Ekspor Laporan Bulanan (PDF)
              </h3>
              <p className="text-xs text-blue-200">
                Format resmi ber-Kop Surat SMP Negeri 2 Tanjung
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pilih Bulan */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Periode Bulan:</span>
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Pilih Kelas */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Pilih Kelas:</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Semua">Semua Kelas (Rekapitulasi Total)</option>
                {CLASSES.map(cls => (
                  <option key={cls} value={cls}>Kelas {cls}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Jenis Laporan */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Cakupan Data yang Diekspor:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setReportType('all')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  reportType === 'all'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                }`}
              >
                <span className="font-bold text-xs flex items-center justify-between">
                  <span>Lengkap</span>
                  {reportType === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">
                  Presensi & Nilai Akademik
                </span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('attendance')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  reportType === 'attendance'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                }`}
              >
                <span className="font-bold text-xs flex items-center justify-between">
                  <span>Presensi Saja</span>
                  {reportType === 'attendance' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">
                  Kehadiran, Alpa & Sakit
                </span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('academic')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  reportType === 'academic'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                }`}
              >
                <span className="font-bold text-xs flex items-center justify-between">
                  <span>Nilai Saja</span>
                  {reportType === 'academic' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">
                  Mata Pelajaran & KKM
                </span>
              </button>
            </div>
          </div>

          {/* Ringkasan Informasi Laporan */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Preview Ringkasan Laporan ({selectedClass}):</span>
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Total Siswa</span>
                <strong className="text-slate-900 text-sm">{targetStudents.length} siswa</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Rerata Presensi</span>
                <strong className="text-blue-600 text-sm">{avgAttendance}%</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Rerata Nilai</span>
                <strong className="text-emerald-600 text-sm">{avgAcademic}</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Resiko Alpa</span>
                <strong className="text-rose-600 text-sm">{highRiskAlpa} siswa</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
              Dokumen PDF resmi mencakup Kop Surat resmi {SCHOOL_INFO.name}, nomor NPSN, status Akreditasi {SCHOOL_INFO.akreditasi}, tabel data berformat landscape/portrait, dan kolom tanda tangan Kepala Sekolah ({SCHOOL_INFO.headmaster}).
            </p>
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl transition"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition shadow-xs disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>Lihat / Cetak Preview</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-md disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Memproses PDF...' : 'Unduh Dokumen PDF'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
