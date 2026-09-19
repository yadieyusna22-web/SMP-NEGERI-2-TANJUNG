import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Student, StudentGrades } from '../types';
import { CLASSES, SCHOOL_INFO } from '../data/mockData';
import { 
  initAuth, 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken,
  WORKSPACE_SCOPES 
} from '../services/firebaseAuth';
import { 
  createSchoolReportSpreadsheet, 
  appendToExistingSpreadsheet,
  listUserSpreadsheets,
  GoogleSpreadsheetItem,
  ExportResult 
} from '../services/googleSheets';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2, 
  Calendar, 
  Users, 
  LogOut, 
  FolderPlus, 
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface GoogleSheetsExportModalProps {
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

export const GoogleSheetsExportModal: React.FC<GoogleSheetsExportModalProps> = ({
  isOpen,
  onClose,
  students,
  grades,
  initialClass = 'Semua'
}) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form State
  const [exportMode, setExportMode] = useState<'create_new' | 'append_existing'>('create_new');
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2024');
  const [selectedClass, setSelectedClass] = useState<string>(initialClass);
  const [spreadsheetTitle, setSpreadsheetTitle] = useState<string>(
    `Laporan Bulanan SMPN 2 Tanjung - September 2024`
  );
  const [includeAttendance, setIncludeAttendance] = useState<boolean>(true);
  const [includeAcademics, setIncludeAcademics] = useState<boolean>(true);

  // Existing Spreadsheets
  const [existingSheets, setExistingSheets] = useState<GoogleSpreadsheetItem[]>([]);
  const [selectedExistingSheetId, setSelectedExistingSheetId] = useState<string>('');
  const [isLoadingSheets, setIsLoadingSheets] = useState<boolean>(false);

  // Execution & Confirmation State
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<ExportResult | { spreadsheetUrl: string; title: string } | null>(null);

  // Update title automatically when month or class changes
  useEffect(() => {
    const classSuffix = selectedClass !== 'Semua' ? ` Kelas ${selectedClass}` : '';
    setSpreadsheetTitle(`Laporan Bulanan SMPN 2 Tanjung - ${selectedMonth}${classSuffix}`);
  }, [selectedMonth, selectedClass]);

  // Auth initialization
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setHasToken(!!token);
        if (token) {
          fetchRecentSheets();
        }
      },
      () => {
        setCurrentUser(null);
        setHasToken(false);
      }
    );

    // Initial check if token is already in memory
    getAccessToken().then(tok => {
      setHasToken(!!tok);
      if (tok) fetchRecentSheets();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen]);

  const fetchRecentSheets = async () => {
    setIsLoadingSheets(true);
    try {
      const files = await listUserSpreadsheets();
      setExistingSheets(files);
      if (files.length > 0 && !selectedExistingSheetId) {
        setSelectedExistingSheetId(files[0].id);
      }
    } catch (err: any) {
      console.warn('Could not load spreadsheets:', err.message);
    } finally {
      setIsLoadingSheets(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setHasToken(true);
        fetchRecentSheets();
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Gagal masuk dengan akun Google.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setHasToken(false);
    setExistingSheets([]);
    setExportSuccess(null);
  };

  const handleStartExport = () => {
    setExportError(null);
    if (!includeAttendance && !includeAcademics) {
      setExportError('Pilih minimal satu jenis data (Presensi atau Nilai Akademik).');
      return;
    }
    // Per workspace safety guidelines: show confirmation dialog before mutating user files
    setShowConfirmDialog(true);
  };

  const handleConfirmAndExecute = async () => {
    setShowConfirmDialog(false);
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(null);

    try {
      if (exportMode === 'create_new') {
        const result = await createSchoolReportSpreadsheet({
          title: spreadsheetTitle,
          selectedMonth,
          selectedClass,
          students,
          grades,
          includeAttendance,
          includeAcademics
        });
        setExportSuccess(result);
        fetchRecentSheets();
      } else {
        if (!selectedExistingSheetId) {
          throw new Error('Pilih spreadsheet target yang ada terlebih dahulu.');
        }
        const result = await appendToExistingSpreadsheet(selectedExistingSheetId, {
          title: spreadsheetTitle,
          selectedMonth,
          selectedClass,
          students,
          grades,
          includeAttendance,
          includeAcademics
        });
        setExportSuccess({
          spreadsheetUrl: result.spreadsheetUrl,
          title: 'Spreadsheet Terpilih'
        });
      }
    } catch (err: any) {
      console.error(err);
      setExportError(err.message || 'Terjadi kesalahan saat mengekspor data ke Google Sheets.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-inner">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  Integrasi Google Sheets & Drive
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-semibold border border-emerald-400/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Ekspor dan sinkronisasi rekapitulasi data akademik & absensi siswa ke Google Sheets
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">

          {/* Authentication State Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            {!hasToken || !currentUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <h4 className="font-bold text-slate-900 text-xs">
                      Hubungkan Akun Google Anda
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed max-w-md">
                    Masuk dengan akun Google untuk membuat atau mengedit spreadsheet laporan bulanan sekolah langsung di Google Drive Anda.
                  </p>
                </div>

                {/* Official Sign-in with Google Button */}
                <div>
                  <button 
                    type="button" 
                    className="gsi-material-button shadow-sm"
                    onClick={handleSignIn}
                    disabled={isAuthenticating}
                  >
                    <div className="gsi-material-button-state"></div>
                    <div className="gsi-material-button-content-wrapper">
                      <div className="gsi-material-button-icon">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                          <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                      </div>
                      <span className="gsi-material-button-contents font-medium">
                        {isAuthenticating ? 'Menghubungkan...' : 'Sign in with Google'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || ''} 
                      className="w-9 h-9 rounded-full border border-slate-300 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                      {currentUser.displayName ? currentUser.displayName[0] : 'G'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{currentUser.displayName || 'Pengguna Google'}</span>
                      <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Terhubung
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={fetchRecentSheets}
                    disabled={isLoadingSheets}
                    title="Segarkan daftar spreadsheet dari Google Drive"
                    className="p-1.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSheets ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-600 hover:text-rose-600 bg-white border border-slate-300 rounded-lg hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}

            {authError && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
          </div>

          {/* Success Banner */}
          {exportSuccess && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-emerald-900 text-sm">
                    Data Berhasil Diekspor ke Google Sheets!
                  </h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Spreadsheet <strong>"{exportSuccess.title}"</strong> telah tersimpan di Google Drive Anda lengkap dengan format tabel, warna indikator, dan formula rekapitulasi.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href={exportSuccess.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md transition"
                >
                  <span>Buka di Google Sheets</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setExportSuccess(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl"
                >
                  Tutup Notifikasi
                </button>
              </div>
            </div>
          )}

          {exportError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{exportError}</span>
            </div>
          )}

          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setExportMode('create_new')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                exportMode === 'create_new'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Buat Spreadsheet Baru</span>
            </button>

            <button
              type="button"
              onClick={() => setExportMode('append_existing')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                exportMode === 'append_existing'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Tambahkan ke Spreadsheet Yang Ada</span>
            </button>
          </div>

          {/* Destination Form */}
          {exportMode === 'create_new' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Judul Google Spreadsheet:
              </label>
              <input
                type="text"
                value={spreadsheetTitle}
                onChange={(e) => setSpreadsheetTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Contoh: Laporan Bulanan SMPN 2 Tanjung - September 2024"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Akan dibuat di direktori utama Google Drive akun Anda dengan tab terpisah untuk Presensi dan Nilai.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                Pilih Spreadsheet dari Google Drive:
              </label>
              {existingSheets.length > 0 ? (
                <select
                  value={selectedExistingSheetId}
                  onChange={(e) => setSelectedExistingSheetId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {existingSheets.map(file => (
                    <option key={file.id} value={file.id}>
                      {file.name} (Dimodifikasi: {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('id-ID') : 'Baru'})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-xs">
                  {isLoadingSheets ? 'Memuat file Google Sheets...' : 'Tidak ada Google Sheets ditemukan di Drive Anda. Silakan pilih "Buat Spreadsheet Baru" di atas.'}
                </div>
              )}
            </div>
          )}

          {/* Filter Periode & Kelas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Periode Bulan:</span>
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pilih Kelas:</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Semua">Semua Kelas</option>
                {CLASSES.map(cls => (
                  <option key={cls} value={cls}>Kelas {cls}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lembar Kerja yang Dibuat (Tabs) */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 space-y-2">
            <span className="block text-xs font-semibold text-slate-800">
              Pilihan Lembar Kerja (Sheets Tabs):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-emerald-300 transition">
                <input
                  type="checkbox"
                  checked={includeAttendance}
                  onChange={(e) => setIncludeAttendance(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <strong className="block text-xs text-slate-800">Tab 1: Rekapitulasi Presensi</strong>
                  <span className="text-[10px] text-slate-500">
                    Jumlah Hadir, Sakit, Izin, Alpa, % Kehadiran & Status Resiko
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-emerald-300 transition">
                <input
                  type="checkbox"
                  checked={includeAcademics}
                  onChange={(e) => setIncludeAcademics(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <strong className="block text-xs text-slate-800">Tab 2: Rekap Nilai Akademik</strong>
                  <span className="text-[10px] text-slate-500">
                    Daftar nilai mata pelajaran, KKM, rata-rata, predikat & ketuntasan
                  </span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl transition"
          >
            Tutup
          </button>

          {!hasToken ? (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-md disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login Google untuk Melanjutkan</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartExport}
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl transition shadow-md disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengekspor ke Google Sheets...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Mulai Ekspor ke Google Sheets</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

      {/* Confirmation Modal before executing mutation (Mandatory by Workspace Skill) */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/80">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="p-2.5 bg-emerald-100 rounded-xl">
                <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Konfirmasi Ekspor Google Sheets</h4>
                <p className="text-[11px] text-slate-500">Izin perubahan data di Google Drive</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <p>
                Aplikasi akan membuat spreadsheet baru di akun Google Anda:
              </p>
              <p className="font-semibold text-slate-900 bg-white p-2 rounded-lg border border-slate-200">
                "{spreadsheetTitle}"
              </p>
              <p className="text-[11px] text-slate-500">
                Mencakup {selectedClass === 'Semua' ? 'semua siswa' : `siswa kelas ${selectedClass}`} untuk periode {selectedMonth}.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAndExecute}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-md"
              >
                Ya, Lanjutkan Ekspor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
