import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, StudentGrades } from '../types';
import { SCHOOL_INFO, SUBJECTS } from '../data/mockData';

export interface MonthlyPdfReportOptions {
  month: string;
  className: string;
  reportType: 'all' | 'attendance' | 'academic';
  students: Student[];
  grades: Record<string, StudentGrades>;
}

export function generateMonthlyReportPdf(options: MonthlyPdfReportOptions): jsPDF {
  const { month, className, reportType, students, grades } = options;

  // Filter students if specific class selected
  const filteredStudents = className === 'Semua' 
    ? students 
    : students.filter(s => s.className === className);

  // Landscape for rich multi-column tables, portrait if only attendance
  const orientation = reportType === 'attendance' ? 'portrait' : 'landscape';
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper for drawing school letterhead (Kop Surat)
  const drawKopSurat = (startY = 12) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text('PEMERINTAH KABUPATEN LOMBOK UTARA', pageWidth / 2, startY, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('DINAS PENDIDIKAN, KEPEMUDAAN DAN OLAHRAGA', pageWidth / 2, startY + 5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(SCHOOL_INFO.name.toUpperCase(), pageWidth / 2, startY + 12, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `${SCHOOL_INFO.address} | Telp: ${SCHOOL_INFO.phone} | NPSN: ${SCHOOL_INFO.npsn} | Akreditasi: ${SCHOOL_INFO.akreditasi}`,
      pageWidth / 2,
      startY + 17,
      { align: 'center' }
    );
    doc.text(
      `Email: ${SCHOOL_INFO.email} | Motto: "${SCHOOL_INFO.motto}"`,
      pageWidth / 2,
      startY + 21,
      { align: 'center' }
    );

    // Double line divider
    const lineY = startY + 24;
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.8);
    doc.line(15, lineY, pageWidth - 15, lineY);
    doc.setLineWidth(0.2);
    doc.line(15, lineY + 1, pageWidth - 15, lineY + 1);

    return lineY + 5;
  };

  let currentY = drawKopSurat(10);

  // Document Title
  let titleText = 'LAPORAN REKAPITULASI BULANAN PENGELOLAAN SISWA';
  if (reportType === 'attendance') {
    titleText = 'LAPORAN REKAPITULASI PRESENSI & KEHADIRAN SISWA';
  } else if (reportType === 'academic') {
    titleText = 'LAPORAN REKAPITULASI NILAI AKADEMIK & CAPAIAN PEMBELAJARAN';
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(titleText, pageWidth / 2, currentY + 3, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Periode: Bulan ${month} | Tahun Ajaran ${SCHOOL_INFO.academicYear} (${SCHOOL_INFO.semester}) | Target: ${className === 'Semua' ? 'Semua Kelas' : 'Kelas ' + className}`,
    pageWidth / 2,
    currentY + 8,
    { align: 'center' }
  );

  currentY += 14;

  // Metric Summary Box
  const avgAttendance = filteredStudents.length > 0 
    ? Math.round(filteredStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / filteredStudents.length)
    : 0;
  const highRiskAlpa = filteredStudents.filter(s => s.totalAlpa >= 3).length;
  const avgAcademic = filteredStudents.length > 0
    ? (filteredStudents.reduce((acc, s) => acc + s.academicAverage, 0) / filteredStudents.length).toFixed(1)
    : '0';

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, currentY, pageWidth - 30, 12, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const boxY = currentY + 7;
  const colWidth = (pageWidth - 30) / 4;
  doc.text(`Total Siswa: ${filteredStudents.length}`, 18, boxY);
  doc.text(`Rata-rata Presensi: ${avgAttendance}%`, 18 + colWidth, boxY);
  doc.text(`Rerata Akademik: ${avgAcademic}`, 18 + colWidth * 2, boxY);
  doc.text(`Siswa Butuh Bimbingan: ${highRiskAlpa} anak`, 18 + colWidth * 3, boxY);

  currentY += 16;

  // SECTION 1: PRESENSI TABLE
  if (reportType === 'all' || reportType === 'attendance') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('I. Rekapitulasi Presensi dan Kehadiran Siswa', 15, currentY);
    currentY += 3;

    const attendanceHead = [
      ['No', 'NISN', 'Nama Siswa', 'Kelas', 'Wali Kelas', 'Hadir', 'Sakit', 'Izin', 'Alpa', '% Hadir', 'Status']
    ];

    const attendanceBody = filteredStudents.map((s, idx) => {
      let status = 'Baik';
      if (s.totalAlpa >= 5) status = 'Panggilan Ortu';
      else if (s.totalAlpa >= 3) status = 'Perlu Bimbingan';

      return [
        idx + 1,
        s.nisn,
        s.name,
        s.className,
        s.homeroomTeacher,
        `${s.totalHadir} hr`,
        `${s.totalSakit} hr`,
        `${s.totalIzin} hr`,
        `${s.totalAlpa} hr`,
        `${s.attendancePercentage}%`,
        status
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: attendanceHead,
      body: attendanceBody,
      margin: { left: 15, right: 15 },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        textColor: [30, 41, 59]
      },
      headStyles: {
        fillColor: [30, 64, 175], // blue-800
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'center', cellWidth: 22 },
        2: { fontStyle: 'bold' },
        3: { halign: 'center', cellWidth: 14 },
        5: { halign: 'center', cellWidth: 15 },
        6: { halign: 'center', cellWidth: 15 },
        7: { halign: 'center', cellWidth: 15 },
        8: { halign: 'center', cellWidth: 15, fontStyle: 'bold' },
        9: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
        10: { halign: 'center', cellWidth: 26 }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;
  }

  // SECTION 2: AKADEMIK TABLE
  if (reportType === 'all' || reportType === 'academic') {
    // If table won't fit on this page, add a new page
    if (currentY > pageHeight - 80) {
      doc.addPage();
      currentY = 15;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const sectionNum = reportType === 'all' ? 'II' : 'I';
    doc.text(`${sectionNum}. Rekapitulasi Capaian Nilai Akademik & Ketuntasan KKM`, 15, currentY);
    currentY += 3;

    const academicHead = [
      [
        'No',
        'NISN',
        'Nama Siswa',
        'Kelas',
        ...SUBJECTS.map(s => `${s.code} (${s.kkm})`),
        'Rerata',
        'Predikat',
        'Keterangan'
      ]
    ];

    const academicBody = filteredStudents.map((s, idx) => {
      const studentGrades = grades[s.id];
      const gradesMap = new Map(studentGrades?.grades.map(g => [g.subjectId, g.finalScore]) || []);

      const scores = SUBJECTS.map(sub => {
        const sc = gradesMap.get(sub.id);
        return sc !== undefined ? sc : Math.round(s.academicAverage);
      });

      const avg = studentGrades?.averageScore || s.academicAverage;
      let pred = 'B';
      if (avg >= 90) pred = 'A';
      else if (avg >= 80) pred = 'B';
      else if (avg >= 75) pred = 'C';
      else pred = 'D';

      return [
        idx + 1,
        s.nisn,
        s.name,
        s.className,
        ...scores,
        avg.toFixed(1),
        pred,
        avg >= 75 ? 'Tuntas' : 'Remedial'
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: academicHead,
      body: academicBody,
      margin: { left: 15, right: 15 },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        textColor: [30, 41, 59]
      },
      headStyles: {
        fillColor: [15, 118, 110], // teal-700
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'center', cellWidth: 22 },
        2: { fontStyle: 'bold' },
        3: { halign: 'center', cellWidth: 14 },
        // Subject scores
        ...SUBJECTS.reduce((acc: any, _, i) => {
          acc[4 + i] = { halign: 'center' };
          return acc;
        }, {})
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 12;
  }

  // Check space for signature block; if too close to bottom, add page
  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = 20;
  }

  // SIGNATURE BLOCK
  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const signWidth = 70;
  const rightSignX = pageWidth - 15 - signWidth;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Left: Mengetahui Wali Kelas / Admin
  doc.text('Mengetahui / Diverifikasi,', 20, currentY);
  doc.text('Wali Kelas / Koordinator Tata Usaha', 20, currentY + 4);

  doc.text(`Tanjung, ${todayStr}`, rightSignX, currentY);
  doc.text('Kepala Sekolah SMP Negeri 2 Tanjung,', rightSignX, currentY + 4);

  // Signature space
  doc.setFont('helvetica', 'bold');
  doc.text('( ......................................... )', 20, currentY + 22);
  doc.text(SCHOOL_INFO.headmaster, rightSignX, currentY + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`NIP: ${SCHOOL_INFO.nipHeadmaster}`, rightSignX, currentY + 26);

  // Page Numbers Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Resmi Sistem Informasi Siswa SMPN 2 Tanjung | Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  return doc;
}

/**
 * Trigger browser download for the generated PDF
 */
export function downloadMonthlyReportPdf(options: MonthlyPdfReportOptions) {
  const doc = generateMonthlyReportPdf(options);
  const cleanMonth = options.month.replace(/\s+/g, '_');
  const cleanClass = options.className.replace(/\s+/g, '_');
  const fileName = `Laporan_Bulanan_SMPN2Tanjung_${cleanMonth}_Kelas_${cleanClass}.pdf`;
  doc.save(fileName);
}

/**
 * Open PDF in new browser tab for preview or direct printing
 */
export function printMonthlyReportPdf(options: MonthlyPdfReportOptions) {
  const doc = generateMonthlyReportPdf(options);
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(blobUrl);
  if (printWindow) {
    printWindow.focus();
  }
}
