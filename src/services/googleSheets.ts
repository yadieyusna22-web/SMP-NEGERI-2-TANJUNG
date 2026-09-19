import { getAccessToken } from './firebaseAuth';
import { Student, StudentGrades } from '../types';
import { SCHOOL_INFO, SUBJECTS } from '../data/mockData';

export interface GoogleSpreadsheetItem {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface ExportToSheetsOptions {
  title: string;
  selectedMonth: string;
  selectedClass: string;
  students: Student[];
  grades: Record<string, StudentGrades>;
  includeAttendance: boolean;
  includeAcademics: boolean;
}

export interface ExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  sheetsCreated: string[];
}

/**
 * Fetch existing spreadsheets from Google Drive
 */
export async function listUserSpreadsheets(): Promise<GoogleSpreadsheetItem[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Belum terautentikasi dengan akun Google. Silakan login terlebih dahulu.');
  }

  const query = encodeURIComponent("mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false");
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,webViewLink)&orderBy=modifiedTime desc&pageSize=15`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Gagal memuat daftar Google Sheets dari Google Drive.');
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Create a new formatted Google Spreadsheet with academic and attendance reports
 */
export async function createSchoolReportSpreadsheet(
  options: ExportToSheetsOptions
): Promise<ExportResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Belum terautentikasi dengan akun Google. Silakan login terlebih dahulu.');
  }

  const sheetsToCreate: any[] = [];
  const sheetsNames: string[] = [];

  if (options.includeAttendance) {
    const sheetTitle = `Presensi ${options.selectedMonth} ${options.selectedClass !== 'Semua' ? 'Kls ' + options.selectedClass : ''}`.trim();
    sheetsToCreate.push({
      properties: {
        title: sheetTitle,
        gridProperties: {
          frozenRowCount: 4
        }
      }
    });
    sheetsNames.push(sheetTitle);
  }

  if (options.includeAcademics) {
    const sheetTitle = `Nilai Akademik ${options.selectedClass !== 'Semua' ? 'Kls ' + options.selectedClass : 'Semua'}`.trim();
    sheetsToCreate.push({
      properties: {
        title: sheetTitle,
        gridProperties: {
          frozenRowCount: 4
        }
      }
    });
    sheetsNames.push(sheetTitle);
  }

  // Fallback if neither was selected
  if (sheetsToCreate.length === 0) {
    sheetsToCreate.push({
      properties: {
        title: 'Laporan Sekolah'
      }
    });
    sheetsNames.push('Laporan Sekolah');
  }

  // 1. Create Spreadsheet
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: options.title
      },
      sheets: sheetsToCreate
    })
  });

  if (!createResponse.ok) {
    const err = await createResponse.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat Google Spreadsheet baru.');
  }

  const createdData = await createResponse.json();
  const spreadsheetId = createdData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Filter students if class is selected
  const studentsToExport = options.selectedClass === 'Semua'
    ? options.students
    : options.students.filter(s => s.className === options.selectedClass);

  // 2. Populate Sheets Data
  const valueRanges: any[] = [];

  // Data for Attendance Sheet
  if (options.includeAttendance) {
    const attendanceSheetName = sheetsNames[0];
    const attendanceValues: any[][] = [
      // Title row
      [`${SCHOOL_INFO.name.toUpperCase()} - REKAPITULASI PRESENSI SISWA BULAN ${options.selectedMonth.toUpperCase()}`],
      [`Tahun Ajaran: ${SCHOOL_INFO.academicYear} | Semester: ${SCHOOL_INFO.semester} | Kelas: ${options.selectedClass} | NPSN: ${SCHOOL_INFO.npsn}`],
      [],
      // Headers
      [
        'No',
        'NISN',
        'Nama Lengkap Siswa',
        'Kelas',
        'Wali Kelas',
        'Hadir (Hari)',
        'Sakit (Hari)',
        'Izin (Hari)',
        'Alpa (Hari)',
        'Persentase Kehadiran',
        'Status Resiko Disiplin'
      ]
    ];

    studentsToExport.forEach((student, index) => {
      let riskStatus = 'Disiplin Baik';
      if (student.totalAlpa >= 5) riskStatus = 'PERINGATAN TINGGI (Surat Panggilan)';
      else if (student.totalAlpa >= 3) riskStatus = 'Waspada (Bimbingan BK)';

      attendanceValues.push([
        index + 1,
        student.nisn,
        student.name,
        student.className,
        student.homeroomTeacher,
        student.totalHadir,
        student.totalSakit,
        student.totalIzin,
        student.totalAlpa,
        `${student.attendancePercentage}%`,
        riskStatus
      ]);
    });

    // Summary footer row
    const avgHadir = studentsToExport.length > 0 
      ? Math.round(studentsToExport.reduce((acc, s) => acc + s.attendancePercentage, 0) / studentsToExport.length)
      : 0;
    attendanceValues.push([]);
    attendanceValues.push([
      '',
      '',
      `RATA-RATA KEHADIRAN KELAS: ${avgHadir}%`,
      '',
      '',
      '',
      '',
      '',
      `Dicetak otomatis dari Sistem Informasi Siswa pada ${new Date().toLocaleDateString('id-ID')}`
    ]);

    valueRanges.push({
      range: `'${attendanceSheetName}'!A1`,
      values: attendanceValues
    });
  }

  // Data for Academic Sheet
  if (options.includeAcademics) {
    const academicSheetIndex = options.includeAttendance ? 1 : 0;
    const academicSheetName = sheetsNames[academicSheetIndex];

    const academicHeaders = [
      'No',
      'NISN',
      'Nama Siswa',
      'Kelas',
      ...SUBJECTS.map(s => `${s.name} (KKM ${s.kkm})`),
      'Rerata Nilai',
      'Predikat',
      'Status Kelulusan KKM'
    ];

    const academicValues: any[][] = [
      [`${SCHOOL_INFO.name.toUpperCase()} - DAFTAR KUMPULAN NILAI AKADEMIK & RAPOR`],
      [`Tahun Ajaran: ${SCHOOL_INFO.academicYear} | Semester: ${SCHOOL_INFO.semester} | Kelas: ${options.selectedClass} | Akreditasi: ${SCHOOL_INFO.akreditasi}`],
      [],
      academicHeaders
    ];

    studentsToExport.forEach((student, index) => {
      const studentGrades = options.grades[student.id];
      const gradesMap = new Map(studentGrades?.grades.map(g => [g.subjectId, g.finalScore]) || []);

      const subjectScores = SUBJECTS.map(sub => {
        const score = gradesMap.get(sub.id);
        return score !== undefined ? score : Math.round(student.academicAverage);
      });

      const avgScore = studentGrades?.averageScore || student.academicAverage;
      let predicate = 'B';
      if (avgScore >= 90) predicate = 'A (Sangat Baik)';
      else if (avgScore >= 80) predicate = 'B (Baik)';
      else if (avgScore >= 75) predicate = 'C (Cukup)';
      else predicate = 'D (Perlu Remedial)';

      const isPassed = avgScore >= 75;

      academicValues.push([
        index + 1,
        student.nisn,
        student.name,
        student.className,
        ...subjectScores,
        avgScore,
        predicate,
        isPassed ? 'Tuntas KKM' : 'Belum Tuntas'
      ]);
    });

    valueRanges.push({
      range: `'${academicSheetName}'!A1`,
      values: academicValues
    });
  }

  // 3. Update values via batchUpdate
  if (valueRanges.length > 0) {
    const batchUpdateValuesRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: valueRanges
        })
      }
    );

    if (!batchUpdateValuesRes.ok) {
      console.warn('Batch update values warning:', await batchUpdateValuesRes.text());
    }
  }

  // 4. Format sheets with header styles (bold, background color)
  try {
    const requests: any[] = [];

    // Format first sheet
    if (createdData.sheets && createdData.sheets[0]) {
      const sheetId0 = createdData.sheets[0].properties.sheetId;
      requests.push({
        repeatCell: {
          range: {
            sheetId: sheetId0,
            startRowIndex: 0,
            endRowIndex: 1
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.1, green: 0.35, blue: 0.75 },
              textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 13 }
            }
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)'
        }
      });
      // Header row
      requests.push({
        repeatCell: {
          range: {
            sheetId: sheetId0,
            startRowIndex: 3,
            endRowIndex: 4
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.9, green: 0.93, blue: 0.98 },
              textFormat: { bold: true, fontSize: 10 }
            }
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)'
        }
      });
    }

    // Format second sheet if present
    if (createdData.sheets && createdData.sheets[1]) {
      const sheetId1 = createdData.sheets[1].properties.sheetId;
      requests.push({
        repeatCell: {
          range: {
            sheetId: sheetId1,
            startRowIndex: 0,
            endRowIndex: 1
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.05, green: 0.45, blue: 0.3 },
              textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 13 }
            }
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)'
        }
      });
      requests.push({
        repeatCell: {
          range: {
            sheetId: sheetId1,
            startRowIndex: 3,
            endRowIndex: 4
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.9, green: 0.96, blue: 0.92 },
              textFormat: { bold: true, fontSize: 10 }
            }
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)'
        }
      });
    }

    if (requests.length > 0) {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
      });
    }
  } catch (fmtError) {
    console.warn('Formatting spreadsheet warning (optional step):', fmtError);
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    title: options.title,
    sheetsCreated: sheetsNames
  };
}

/**
 * Append or update data into an existing Google Spreadsheet
 */
export async function appendToExistingSpreadsheet(
  spreadsheetId: string,
  options: ExportToSheetsOptions
): Promise<{ success: boolean; spreadsheetUrl: string }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Belum terautentikasi dengan akun Google.');
  }

  // Check spreadsheet metadata to find existing sheet names
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!metaRes.ok) {
    throw new Error('Tidak dapat menemukan spreadsheet target atau izin ditolak.');
  }

  const metadata = await metaRes.json();
  const existingSheetTitles: string[] = metadata.sheets.map((s: any) => s.properties.title);
  const targetSheetName = existingSheetTitles[0] || 'Sheet1';

  const studentsToExport = options.selectedClass === 'Semua'
    ? options.students
    : options.students.filter(s => s.className === options.selectedClass);

  const newRows: any[][] = [
    [],
    [`--- EKSPOR BARU: ${options.selectedMonth} (Kelas ${options.selectedClass}) [${new Date().toLocaleString('id-ID')}] ---`],
    ['No', 'NISN', 'Nama Siswa', 'Kelas', 'Kehadiran (%)', 'Alpa', 'Sakit', 'Izin', 'Rerata Akademik']
  ];

  studentsToExport.forEach((s, i) => {
    newRows.push([
      i + 1,
      s.nisn,
      s.name,
      s.className,
      `${s.attendancePercentage}%`,
      s.totalAlpa,
      s.totalSakit,
      s.totalIzin,
      s.academicAverage
    ]);
  });

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${targetSheetName}'!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: newRows
      })
    }
  );

  if (!appendRes.ok) {
    const err = await appendRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal menambahkan baris ke spreadsheet.');
  }

  return {
    success: true,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  };
}
