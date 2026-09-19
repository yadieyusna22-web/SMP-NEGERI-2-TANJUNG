import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, 
  RuleViolationMaster, 
  RewardMaster, 
  ConsequenceTier, 
  UserAccount, 
  AttendanceRecord,
  AttendanceStatus,
  StudentViolationRecord,
  StudentRewardRecord,
  StudentGrades,
  CharacterAssessment,
  WhatsAppNotificationLog,
  Role,
  SubjectGrade
} from '../types';
import { 
  INITIAL_STUDENTS, 
  RULE_VIOLATION_MASTER, 
  REWARD_MASTER, 
  CONSEQUENCE_TIERS, 
  DEMO_USERS, 
  INITIAL_ATTENDANCE, 
  INITIAL_VIOLATIONS, 
  INITIAL_REWARDS, 
  INITIAL_GRADES, 
  INITIAL_CHARACTERS, 
  INITIAL_WHATSAPP_LOGS,
  SCHOOL_INFO,
  SUBJECTS
} from '../data/mockData';

interface SchoolContextType {
  currentUser: UserAccount;
  setCurrentUser: (user: UserAccount) => void;
  demoUsers: UserAccount[];
  switchRole: (role: Role, studentId?: string) => void;
  
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  violations: StudentViolationRecord[];
  rewards: StudentRewardRecord[];
  ruleMaster: RuleViolationMaster[];
  rewardMaster: RewardMaster[];
  consequenceTiers: ConsequenceTier[];
  grades: Record<string, StudentGrades>;
  characterAssessments: Record<string, CharacterAssessment>;
  whatsappLogs: WhatsAppNotificationLog[];
  
  // Actions
  recordAttendance: (studentId: string, status: AttendanceStatus, note?: string, date?: string) => void;
  recordBatchAttendance: (items: { studentId: string; status: AttendanceStatus; note?: string }[], date: string) => void;
  addViolation: (violation: Omit<StudentViolationRecord, 'id' | 'points' | 'ruleTitle'>) => void;
  updateViolationStatus: (id: string, status: StudentViolationRecord['status'], notes?: string) => void;
  addReward: (reward: Omit<StudentRewardRecord, 'id' | 'rewardPoints' | 'rewardTitle'>) => void;
  saveStudentGrades: (studentId: string, updatedGrades: SubjectGrade[]) => void;
  saveCharacterAssessment: (assessment: CharacterAssessment) => void;
  sendWhatsAppNotification: (log: Omit<WhatsAppNotificationLog, 'id' | 'timestamp' | 'directUrl'>) => WhatsAppNotificationLog;
  
  // Quick Queries / Analytics
  getStudentById: (id: string) => Student | undefined;
  topAlpaStudents: Student[];
  topSakitStudents: Student[];
  topIzinStudents: Student[];
  topTeladanStudents: Student[];
  getTierForPoints: (points: number) => ConsequenceTier;
  
  // Active Filter
  selectedClassFilter: string;
  setSelectedClassFilter: (cls: string) => void;
  
  // Reset demo data
  resetAllData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'smpn2_current_user',
  STUDENTS: 'smpn2_students',
  ATTENDANCE: 'smpn2_attendance',
  VIOLATIONS: 'smpn2_violations',
  REWARDS: 'smpn2_rewards',
  GRADES: 'smpn2_grades',
  CHARACTERS: 'smpn2_characters',
  WHATSAPP_LOGS: 'smpn2_wa_logs'
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEMO_USERS[0]; // default: Kepsek/Admin
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_STUDENTS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ATTENDANCE;
  });

  const [violations, setViolations] = useState<StudentViolationRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIOLATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_VIOLATIONS;
  });

  const [rewards, setRewards] = useState<StudentRewardRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REWARDS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_REWARDS;
  });

  const [grades, setGrades] = useState<Record<string, StudentGrades>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRADES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_GRADES;
  });

  const [characterAssessments, setCharacterAssessments] = useState<Record<string, CharacterAssessment>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CHARACTERS;
  });

  const [whatsappLogs, setWhatsappLogs] = useState<WhatsAppNotificationLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WHATSAPP_LOGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_WHATSAPP_LOGS;
  });

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Semua');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIOLATIONS, JSON.stringify(violations));
  }, [violations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characterAssessments));
  }, [characterAssessments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WHATSAPP_LOGS, JSON.stringify(whatsappLogs));
  }, [whatsappLogs]);

  // Recalculate student totals
  const recalculateStudentStats = (studentId: string) => {
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id !== studentId) return student;

        const studentAtt = attendanceRecords.filter(a => a.studentId === studentId);
        const alpaCount = studentAtt.filter(a => a.status === 'alpa').length + (student.totalAlpa > 0 && studentAtt.length === 0 ? student.totalAlpa : 0);
        const sakitCount = studentAtt.filter(a => a.status === 'sakit').length + (student.totalSakit > 0 && studentAtt.length === 0 ? student.totalSakit : 0);
        const izinCount = studentAtt.filter(a => a.status === 'izin').length + (student.totalIzin > 0 && studentAtt.length === 0 ? student.totalIzin : 0);
        const hadirCount = studentAtt.filter(a => a.status === 'hadir').length + (student.totalHadir > 0 && studentAtt.length === 0 ? student.totalHadir : 0);

        const totalRecorded = alpaCount + sakitCount + izinCount + hadirCount;
        const attendancePercentage = totalRecorded > 0 ? Math.round((hadirCount / totalRecorded) * 100) : student.attendancePercentage;

        const studentViolations = violations.filter(v => v.studentId === studentId);
        const totalViolationPoints = studentViolations.reduce((sum, v) => sum + v.points, 0);

        const studentRewards = rewards.filter(r => r.studentId === studentId);
        const totalRewardPoints = studentRewards.reduce((sum, r) => sum + r.rewardPoints, 0);

        const netCharacterScore = totalRewardPoints - totalViolationPoints;
        const isTeladanCandidate = netCharacterScore >= 30 && totalViolationPoints <= 5 && attendancePercentage >= 95;

        return {
          ...student,
          totalAlpa: Math.max(student.totalAlpa, alpaCount),
          totalSakit: Math.max(student.totalSakit, sakitCount),
          totalIzin: Math.max(student.totalIzin, izinCount),
          totalHadir: Math.max(student.totalHadir, hadirCount),
          attendancePercentage,
          totalViolationPoints,
          totalRewardPoints,
          netCharacterScore,
          isTeladanCandidate
        };
      });
    });
  };

  const getTierForPoints = (points: number): ConsequenceTier => {
    const tier = CONSEQUENCE_TIERS.find(t => points >= t.minPoints && points <= t.maxPoints);
    return tier || CONSEQUENCE_TIERS[CONSEQUENCE_TIERS.length - 1];
  };

  const sendWhatsAppNotification = (logData: Omit<WhatsAppNotificationLog, 'id' | 'timestamp' | 'directUrl'>): WhatsAppNotificationLog => {
    const cleanPhone = logData.parentPhone.replace(/\D/g, '');
    const encodedText = encodeURIComponent(logData.messageText);
    const directUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;

    const newLog: WhatsAppNotificationLog = {
      ...logData,
      id: `wa-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      directUrl
    };

    setWhatsappLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const recordAttendance = (studentId: string, status: AttendanceStatus, note = '', date = new Date().toISOString().split('T')[0]) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentId,
      date,
      status,
      note,
      recordedBy: currentUser.name,
      period: 'Harian',
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);

    // Update student counters
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const totalAlpa = s.totalAlpa + (status === 'alpa' ? 1 : 0);
      const totalSakit = s.totalSakit + (status === 'sakit' ? 1 : 0);
      const totalIzin = s.totalIzin + (status === 'izin' ? 1 : 0);
      const totalHadir = s.totalHadir + (status === 'hadir' ? 1 : 0);
      const totalDays = totalAlpa + totalSakit + totalIzin + totalHadir;
      const attPct = totalDays > 0 ? Math.round((totalHadir / totalDays) * 100) : 100;
      return {
        ...s,
        totalAlpa,
        totalSakit,
        totalIzin,
        totalHadir,
        attendancePercentage: attPct
      };
    }));

    // Auto-generate WhatsApp notification draft for Alpa or Sakit
    if (status === 'alpa') {
      const msg = `*PEMBERITAHUAN KETIDAKHADIRAN SISWA*\n${SCHOOL_INFO.name}\n\nYth. Bpk/Ibu Orang Tua/Wali dari *${student.name}* (Kelas ${student.className})\n\nKami menginformasikan bahwa ananda pada hari ini, *${date}*, *TIDAK HADIR* di sekolah tanpa keterangan (*ALPA*).\n\nMohon konfirmasi atau hubungi Wali Kelas (${student.homeroomTeacher}) untuk klarifikasi demi kelancaran kegiatan belajar ananda.\n\n_Pesan otomatis Sistem Informasi Akademik SMP Negeri 2 Tanjung_`;
      sendWhatsAppNotification({
        studentId: student.id,
        studentName: student.name,
        className: student.className,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        type: 'absensi_alpa',
        subject: `Pemberitahuan Alpa: ${student.name} (${date})`,
        messageText: msg,
        sentBy: currentUser.name,
        status: 'Terkirim'
      });
    }
  };

  const recordBatchAttendance = (items: { studentId: string; status: AttendanceStatus; note?: string }[], date: string) => {
    items.forEach(item => {
      recordAttendance(item.studentId, item.status, item.note, date);
    });
  };

  const addViolation = (violationData: Omit<StudentViolationRecord, 'id' | 'points' | 'ruleTitle'>) => {
    const rule = RULE_VIOLATION_MASTER.find(r => r.id === violationData.ruleId);
    if (!rule) return;

    const newViolation: StudentViolationRecord = {
      ...violationData,
      id: `viol-${Date.now()}`,
      points: rule.points,
      ruleTitle: rule.title
    };

    setViolations(prev => [newViolation, ...prev]);

    // Update student points and tier
    setStudents(prev => prev.map(s => {
      if (s.id !== violationData.studentId) return s;
      const newViolationPoints = s.totalViolationPoints + rule.points;
      const netCharacterScore = s.totalRewardPoints - newViolationPoints;
      return {
        ...s,
        totalViolationPoints: newViolationPoints,
        netCharacterScore,
        isTeladanCandidate: false
      };
    }));

    // Auto WhatsApp alert for Parent
    const student = students.find(s => s.id === violationData.studentId);
    if (student) {
      const newTotalPoints = student.totalViolationPoints + rule.points;
      const tier = getTierForPoints(newTotalPoints);

      const msg = `*LAPORAN PELANGGARAN TATA TERTIB*\n${SCHOOL_INFO.name}\n\nYth. Bpk/Ibu *${student.parentName}*, Orang Tua/Wali dari:\nNama: *${student.name}*\nKelas: *${student.className}*\n\nTercatat melakukan pelanggaran:\n- Jenis: *${rule.title}*\n- Kategori: ${rule.category}\n- Poin Pelanggaran: +${rule.points} poin\n- Akumulasi Poin Siswa Saat Ini: *${newTotalPoints} Poin*\n- Status Konsekuensi: *${tier.title}*\n\n${tier.requiresParentCall ? '⚠️ *PERHATIAN:* Ananda telah mencapai batas poin pemanggilan orang tua ke sekolah. Surat pemanggilan resmi akan segera diserahkan.' : 'Mohon bimbingan dan pendampingan di rumah agar ananda senantiasa mematuhi tata tertib sekolah.'}\n\n_Tertanda, Tim Kesiswaan & Guru BK SMP Negeri 2 Tanjung_`;

      sendWhatsAppNotification({
        studentId: student.id,
        studentName: student.name,
        className: student.className,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        type: tier.requiresParentCall ? 'panggilan_ortu' : 'pelanggaran',
        subject: `Laporan Pelanggaran Tata Tertib: ${student.name}`,
        messageText: msg,
        sentBy: currentUser.name,
        status: 'Terkirim'
      });
    }
  };

  const updateViolationStatus = (id: string, status: StudentViolationRecord['status'], notes?: string) => {
    setViolations(prev => prev.map(v => {
      if (v.id !== id) return v;
      return {
        ...v,
        status,
        notes: notes ? `${v.notes} [Resolusi: ${notes}]` : v.notes
      };
    }));
  };

  const addReward = (rewardData: Omit<StudentRewardRecord, 'id' | 'rewardPoints' | 'rewardTitle'>) => {
    const rewardMasterItem = REWARD_MASTER.find(r => r.id === rewardData.rewardId);
    if (!rewardMasterItem) return;

    const newReward: StudentRewardRecord = {
      ...rewardData,
      id: `rew-rec-${Date.now()}`,
      rewardPoints: rewardMasterItem.rewardPoints,
      rewardTitle: rewardMasterItem.title
    };

    setRewards(prev => [newReward, ...prev]);

    // Update student points
    setStudents(prev => prev.map(s => {
      if (s.id !== rewardData.studentId) return s;
      const newRewardPoints = s.totalRewardPoints + rewardMasterItem.rewardPoints;
      const netCharacterScore = newRewardPoints - s.totalViolationPoints;
      const isTeladanCandidate = netCharacterScore >= 30 && s.totalViolationPoints <= 5 && s.attendancePercentage >= 95;
      return {
        ...s,
        totalRewardPoints: newRewardPoints,
        netCharacterScore,
        isTeladanCandidate
      };
    }));

    // WhatsApp Appreciation to Parents
    const student = students.find(s => s.id === rewardData.studentId);
    if (student) {
      const msg = `*APRESIASI PRESTASI & SISWA TELADAN*\n${SCHOOL_INFO.name}\n\nSelamat kepada Bpk/Ibu *${student.parentName}*!\n\nAnanda *${student.name}* (Kelas ${student.className}) berhasil meraih prestasi / apresiasi karakter:\n🏆 *${rewardMasterItem.title}*\n⭐ Poin Penghargaan: *+${rewardMasterItem.rewardPoints} Poin*\nKeterangan: ${rewardData.notes || 'Penghargaan resmi dari sekolah'}\n\nTerima kasih atas bimbingan dan doa orang tua. Semoga ananda terus berprestasi dan menginspirasi seluruh siswa di SMP Negeri 2 Tanjung!\n\n_Salam hormat, Kepala Sekolah SMP Negeri 2 Tanjung_`;

      sendWhatsAppNotification({
        studentId: student.id,
        studentName: student.name,
        className: student.className,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        type: 'reward_prestasi',
        subject: `Apresiasi Prestasi: ${student.name}`,
        messageText: msg,
        sentBy: currentUser.name,
        status: 'Terkirim'
      });
    }
  };

  const saveStudentGrades = (studentId: string, updatedGrades: SubjectGrade[]) => {
    const totalScore = updatedGrades.reduce((sum, g) => sum + g.finalScore, 0);
    const averageScore = Math.round((totalScore / updatedGrades.length) * 10) / 10;

    const existingGrade = grades[studentId] || {
      studentId,
      semester: 'Ganjil',
      academicYear: SCHOOL_INFO.academicYear,
      grades: updatedGrades,
      averageScore
    };

    const newGradeObj: StudentGrades = {
      ...existingGrade,
      grades: updatedGrades,
      averageScore
    };

    setGrades(prev => ({
      ...prev,
      [studentId]: newGradeObj
    }));

    // Update student academic average
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        academicAverage: averageScore
      };
    }));
  };

  const saveCharacterAssessment = (assessment: CharacterAssessment) => {
    setCharacterAssessments(prev => ({
      ...prev,
      [assessment.studentId]: assessment
    }));
  };

  const switchRole = (role: Role, studentId?: string) => {
    const targetUser = DEMO_USERS.find(u => {
      if (role === 'siswa_ortu' && studentId) {
        return u.studentId === studentId;
      }
      return u.role === role;
    }) || DEMO_USERS[0];

    setCurrentUser(targetUser);
  };

  const getStudentById = (id: string) => students.find(s => s.id === id);

  // Filtered lists
  const filteredStudents = selectedClassFilter === 'Semua' 
    ? students 
    : students.filter(s => s.className === selectedClassFilter);

  // Top Alpa (descending)
  const topAlpaStudents = [...filteredStudents]
    .filter(s => s.totalAlpa > 0)
    .sort((a, b) => b.totalAlpa - a.totalAlpa);

  // Top Sakit (descending)
  const topSakitStudents = [...filteredStudents]
    .filter(s => s.totalSakit > 0)
    .sort((a, b) => b.totalSakit - a.totalSakit);

  // Top Izin (descending)
  const topIzinStudents = [...filteredStudents]
    .filter(s => s.totalIzin > 0)
    .sort((a, b) => b.totalIzin - a.totalIzin);

  // Top Siswa Terbaik / Teladan (High Net Character Score, High Academic Average, Attendance >= 90)
  const topTeladanStudents = [...filteredStudents]
    .sort((a, b) => {
      const scoreA = (a.academicAverage * 0.4) + (a.netCharacterScore * 0.4) + (a.attendancePercentage * 0.2);
      const scoreB = (b.academicAverage * 0.4) + (b.netCharacterScore * 0.4) + (b.attendancePercentage * 0.2);
      return scoreB - scoreA;
    });

  const resetAllData = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setViolations(INITIAL_VIOLATIONS);
    setRewards(INITIAL_REWARDS);
    setGrades(INITIAL_GRADES);
    setCharacterAssessments(INITIAL_CHARACTERS);
    setWhatsappLogs(INITIAL_WHATSAPP_LOGS);
    setCurrentUser(DEMO_USERS[0]);
  };

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        demoUsers: DEMO_USERS,
        switchRole,
        students,
        attendanceRecords,
        violations,
        rewards,
        ruleMaster: RULE_VIOLATION_MASTER,
        rewardMaster: REWARD_MASTER,
        consequenceTiers: CONSEQUENCE_TIERS,
        grades,
        characterAssessments,
        whatsappLogs,
        recordAttendance,
        recordBatchAttendance,
        addViolation,
        updateViolationStatus,
        addReward,
        saveStudentGrades,
        saveCharacterAssessment,
        sendWhatsAppNotification,
        getStudentById,
        topAlpaStudents,
        topSakitStudents,
        topIzinStudents,
        topTeladanStudents,
        getTierForPoints,
        selectedClassFilter,
        setSelectedClassFilter,
        resetAllData
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
