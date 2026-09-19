import React, { useState, useEffect } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { AttendanceModule } from './components/AttendanceModule';
import { AcademicGradesModule } from './components/AcademicGradesModule';
import { CharacterAssessmentModule } from './components/CharacterAssessmentModule';
import { CodeOfConductModule } from './components/CodeOfConductModule';
import { RewardSiswaTeladanModule } from './components/RewardSiswaTeladanModule';
import { WhatsAppNotificationHub } from './components/WhatsAppNotificationHub';
import { StudentParentPortal } from './components/StudentParentPortal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { SCHOOL_INFO } from './data/mockData';
import { Student } from './types';
import { 
  ShieldCheck, 
  School, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle, 
  Sparkles,
  Lock
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, students } = useSchool();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<string | undefined>(undefined);

  // Automatically adjust view if user switches to student/parent role
  useEffect(() => {
    if (currentUser.role === 'siswa_ortu') {
      setActiveTab('portal_siswa');
    }
  }, [currentUser.role]);

  // Global WhatsApp Modal State
  const [whatsAppModal, setWhatsAppModal] = useState<{
    isOpen: boolean;
    student: Student | null;
    type: 'absensi_alpa' | 'pelanggaran' | 'panggilan_ortu' | 'reward_prestasi' | 'rapor_akademik';
  }>({
    isOpen: false,
    student: null,
    type: 'absensi_alpa'
  });

  const handleOpenWhatsApp = (
    student: Student,
    type: 'absensi_alpa' | 'pelanggaran' | 'panggilan_ortu' | 'reward_prestasi' | 'rapor_akademik'
  ) => {
    setWhatsAppModal({
      isOpen: true,
      student,
      type
    });
  };

  const handleNavigate = (tab: string, studentId?: string) => {
    setActiveTab(tab);
    if (studentId) {
      setSelectedStudentForDetail(studentId);
    }
  };

  const activeStudentObject = selectedStudentForDetail 
    ? students.find(s => s.id === selectedStudentForDetail) 
    : undefined;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation & Role Switcher */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            onNavigateToTab={handleNavigate}
            onOpenWhatsAppModal={handleOpenWhatsApp}
          />
        )}

        {activeTab === 'absensi' && (
          <AttendanceModule
            onOpenWhatsAppModal={handleOpenWhatsApp}
            preselectedStudentId={selectedStudentForDetail}
          />
        )}

        {activeTab === 'nilai' && (
          <AcademicGradesModule
            onOpenWhatsAppModal={handleOpenWhatsApp}
            preselectedStudentId={selectedStudentForDetail}
          />
        )}

        {activeTab === 'karakter' && (
          <CharacterAssessmentModule
            onOpenWhatsAppModal={handleOpenWhatsApp}
            preselectedStudentId={selectedStudentForDetail}
          />
        )}

        {activeTab === 'tata_tertib' && (
          <CodeOfConductModule
            onOpenWhatsAppModal={handleOpenWhatsApp}
          />
        )}

        {activeTab === 'reward' && (
          <RewardSiswaTeladanModule
            onOpenWhatsAppModal={handleOpenWhatsApp}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppNotificationHub
            initialStudent={activeStudentObject}
          />
        )}

        {activeTab === 'portal_siswa' && (
          <StudentParentPortal
            selectedStudentId={selectedStudentForDetail}
            onOpenWhatsAppModal={handleOpenWhatsApp}
          />
        )}
      </main>

      {/* WhatsApp Modal Dialog (Global) */}
      <WhatsAppModal
        isOpen={whatsAppModal.isOpen}
        onClose={() => setWhatsAppModal(prev => ({ ...prev, isOpen: false }))}
        student={whatsAppModal.student}
        initialType={whatsAppModal.type}
      />

      {/* Official Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 mt-12 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <School className="w-5 h-5 text-blue-400" />
              <span>{SCHOOL_INFO.name}</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-lg">
              Sistem Informasi Pengelolaan Siswa Terpadu mencakup Presensi Harian, Penilaian Akademik Kurikulum Merdeka, Observasi Karakter Profil Pelajar Pancasila, Penegakan Tata Tertib Edukatif, Apresiasi Siswa Teladan, dan Pelaporan Otomatis WhatsApp Orang Tua.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Sistem Akses Berbasis Peran & Enkripsi Data Sesuai UU Perlindungan Data Pribadi</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Kontak & Lokasi</h4>
            <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {SCHOOL_INFO.address}</p>
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500" /> {SCHOOL_INFO.phone}</p>
            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500" /> {SCHOOL_INFO.email}</p>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Informasi Lembaga</h4>
            <p>NPSN: <strong className="text-slate-200">{SCHOOL_INFO.npsn}</strong></p>
            <p>Akreditasi: <strong className="text-emerald-400">{SCHOOL_INFO.akreditasi}</strong></p>
            <p>Kepala Sekolah: <strong className="text-slate-200">{SCHOOL_INFO.headmaster}</strong></p>
            <p className="text-[11px] text-slate-500 pt-2">
              © {new Date().getFullYear()} {SCHOOL_INFO.name}. Hak Cipta Dilindungi Undang-Undang.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
