import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_INFO } from '../data/mockData';
import { Role } from '../types';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  HeartHandshake, 
  Users, 
  RotateCcw,
  Clock,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, switchRole, demoUsers, resetAllData } = useSchool();
  const [currentDate] = React.useState(() => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  });

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'admin':
        return { label: 'Kepala Sekolah / Admin', color: 'bg-indigo-600 text-white', icon: ShieldCheck };
      case 'guru':
        return { label: 'Guru / Wali Kelas', color: 'bg-emerald-600 text-white', icon: UserCheck };
      case 'bk':
        return { label: 'Guru BK & Kesiswaan', color: 'bg-amber-600 text-white', icon: HeartHandshake };
      case 'siswa_ortu':
        return { label: 'Portal Siswa & Orang Tua', color: 'bg-sky-600 text-white', icon: Users };
    }
  };

  const currentRoleInfo = getRoleBadge(currentUser.role);
  const CurrentRoleIcon = currentRoleInfo.icon;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-inner font-bold text-xl border border-blue-400/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
                  Sistem Informasi Pengelolaan Siswa
                </span>
                <span className="text-[10px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700/50">
                  NPSN: {SCHOOL_INFO.npsn}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
                {SCHOOL_INFO.name}
              </h1>
            </div>
          </div>

          {/* Right Action / Role Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Clock */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentDate}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">T.A {SCHOOL_INFO.academicYear} ({SCHOOL_INFO.semester})</span>
            </div>

            {/* Quick Role Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <div className="text-xs text-slate-400 px-2 font-medium hidden sm:block">Peran:</div>
              <select
                aria-label="Pilih Peran Pengguna"
                className="bg-slate-900 text-xs text-slate-200 py-1.5 px-2.5 rounded-md border-0 focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                value={currentUser.id}
                onChange={(e) => {
                  const selectedUser = demoUsers.find(u => u.id === e.target.value);
                  if (selectedUser) {
                    switchRole(selectedUser.role, selectedUser.studentId);
                  }
                }}
              >
                {demoUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.role === 'admin' && '👑 Kepala Sekolah (Drs. Suryadi)'}
                    {u.role === 'guru' && '👨‍🏫 Wali Kelas 8A (Budi Santoso)'}
                    {u.role === 'bk' && '🤝 Guru BK & Kesiswaan (Dra. Siti Rohmah)'}
                    {u.role === 'siswa_ortu' && u.studentId === 's-101' && '🎓 Siswa Teladan (Rizky Pratama)'}
                    {u.role === 'siswa_ortu' && u.studentId === 's-105' && '⚠️ Siswa Pantau (Dimas Bagus)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Active User Chip */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${currentRoleInfo.color} shadow-sm`}>
              <CurrentRoleIcon className="w-3.5 h-3.5" />
              <span className="truncate max-w-[130px] sm:max-w-[170px]">{currentUser.name}</span>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                if (confirm('Kembalikan semua data ke pengaturan awal demo SMP Negeri 2 Tanjung?')) {
                  resetAllData();
                }
              }}
              title="Reset Data Demo"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-slate-950/60 border-t border-slate-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 text-xs sm:text-sm font-medium scrollbar-none">
            
            {/* If user is Siswa/Ortu, show Portal Siswa prioritized */}
            {currentUser.role === 'siswa_ortu' ? (
              <>
                <button
                  onClick={() => setActiveTab('portal_siswa')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'portal_siswa'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Portal Siswa & Orang Tua</span>
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>Dashboard Sekolah</span>
                </button>
                <button
                  onClick={() => setActiveTab('tata_tertib')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'tata_tertib'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>Tata Tertib & Sanksi</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>📊 Dashboard & Analitik</span>
                </button>

                <button
                  onClick={() => setActiveTab('absensi')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'absensi'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>📋 Presensi & Absensi</span>
                </button>

                <button
                  onClick={() => setActiveTab('nilai')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'nilai'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>📝 Nilai Akademik & Rapor</span>
                </button>

                <button
                  onClick={() => setActiveTab('karakter')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'karakter'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>🌟 Penilaian Karakter P5</span>
                </button>

                <button
                  onClick={() => setActiveTab('tata_tertib')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'tata_tertib'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>⚖️ Tata Tertib & Poin Pelanggaran</span>
                </button>

                <button
                  onClick={() => setActiveTab('reward')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'reward'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Reward & Siswa Teladan</span>
                </button>

                <button
                  onClick={() => setActiveTab('whatsapp')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'whatsapp'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>💬 Laporan WhatsApp Ortu</span>
                </button>

                <button
                  onClick={() => setActiveTab('portal_siswa')}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'portal_siswa'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>👁️ Preview Portal Siswa</span>
                </button>
              </>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
};
