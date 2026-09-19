import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { CLASSES, SCHOOL_INFO } from '../data/mockData';
import { CharacterAssessment, CharacterDimension, CharacterScore, Student } from '../types';
import { 
  HeartHandshake, 
  Sparkles, 
  ShieldCheck, 
  Lightbulb, 
  Users, 
  Globe2, 
  Compass, 
  Save, 
  CheckCircle,
  Award
} from 'lucide-react';

interface CharacterAssessmentModuleProps {
  onOpenWhatsAppModal: (student: Student, type: 'reward_prestasi') => void;
  preselectedStudentId?: string;
}

const DIMENSIONS: { id: CharacterDimension; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: 'beriman_bertakwa',
    label: 'Beriman, Bertakwa kepada Tuhan YME & Berakhlak Mulia',
    icon: Compass,
    description: 'Ketaatan beribadah, kejujuran, sopan santun, serta budi pekerti luhur di sekolah.'
  },
  {
    id: 'gotong_royong',
    label: 'Gotong Royong',
    icon: Users,
    description: 'Kepedulian terhadap sesama, kesediaan berbagi, dan kolaborasi aktif dalam kerja tim.'
  },
  {
    id: 'mandiri',
    label: 'Kemandirian',
    icon: ShieldCheck,
    description: 'Tanggung jawab terhadap pembelajaran pribadi, disiplin diri, dan ketahanan dalam mengatasi tantangan.'
  },
  {
    id: 'bernalar_kritis',
    label: 'Bernalar Kritis',
    icon: Lightbulb,
    description: 'Mampu memproses informasi secara objektif, menganalisis masalah, dan mengambil keputusan bertanggung jawab.'
  },
  {
    id: 'kreatif',
    label: 'Kreativitas',
    icon: Sparkles,
    description: 'Menghasilkan gagasan orisinal, karya inovatif, dan alternatif solusi dalam kegiatan belajar.'
  },
  {
    id: 'berkebinekaan_global',
    label: 'Berkebinekaan Global',
    icon: Globe2,
    description: 'Menghargai keragaman budaya, toleransi antarteman, dan keterbukaan berpikiran.'
  }
];

export const CharacterAssessmentModule: React.FC<CharacterAssessmentModuleProps> = ({
  preselectedStudentId
}) => {
  const { students, characterAssessments, saveCharacterAssessment, currentUser } = useSchool();

  const [selectedClass, setSelectedClass] = useState<string>(currentUser.assignedClass || '8A');
  const classStudents = students.filter(s => s.className === selectedClass);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    preselectedStudentId || (classStudents[0]?.id || 's-101')
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId) || classStudents[0] || students[0];

  // Current assessment state
  const currentSaved = characterAssessments[selectedStudent?.id];

  const [dimensionsData, setDimensionsData] = useState(() => {
    return DIMENSIONS.map(dim => {
      const match = currentSaved?.dimensions.find(d => d.dimension === dim.id);
      return {
        dimension: dim.id,
        dimensionLabel: dim.label,
        score: (match?.score || 'BSH') as CharacterScore,
        note: match?.note || 'Menunjukkan perkembangan karakter yang baik dan aktif dalam kegiatan sekolah.'
      };
    });
  });

  const [generalSummary, setGeneralSummary] = useState(
    currentSaved?.generalSummary || 'Ananda senantiasa menunjukkan sikap yang santun dan menjunjung tinggi Profil Pelajar Pancasila di lingkungan SMP Negeri 2 Tanjung.'
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStudentChange = (sId: string) => {
    setSelectedStudentId(sId);
    const assessment = characterAssessments[sId];
    if (assessment) {
      setDimensionsData(assessment.dimensions);
      setGeneralSummary(assessment.generalSummary);
    } else {
      setDimensionsData(DIMENSIONS.map(dim => ({
        dimension: dim.id,
        dimensionLabel: dim.label,
        score: 'BSH' as CharacterScore,
        note: 'Menunjukkan perkembangan karakter yang baik dan aktif dalam kegiatan sekolah.'
      })));
      setGeneralSummary('Ananda senantiasa menunjukkan sikap yang santun dan menjunjung tinggi Profil Pelajar Pancasila di lingkungan SMP Negeri 2 Tanjung.');
    }
  };

  const handleScoreChange = (dimId: CharacterDimension, score: CharacterScore) => {
    setDimensionsData(prev => prev.map(d => d.dimension === dimId ? { ...d, score } : d));
  };

  const handleNoteChange = (dimId: CharacterDimension, note: string) => {
    setDimensionsData(prev => prev.map(d => d.dimension === dimId ? { ...d, note } : d));
  };

  const handleSave = () => {
    const payload: CharacterAssessment = {
      studentId: selectedStudent.id,
      date: new Date().toISOString().split('T')[0],
      evaluatorName: currentUser.name,
      dimensions: dimensionsData,
      generalSummary
    };
    saveCharacterAssessment(payload);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>🌟 Penilaian Karakter & Profil Pelajar Pancasila</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              Holistik & Budi Pekerti
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Instrumen observasi sikap dan karakter budi pekerti 6 dimensi Profil Pelajar Pancasila di {SCHOOL_INFO.name}.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm transition self-start"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Catatan Karakter</span>
        </button>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Kelas:</span>
            <select
              aria-label="Pilih Kelas Penilaian Karakter"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                const first = students.filter(s => s.className === e.target.value)[0];
                if (first) handleStudentChange(first.id);
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
              aria-label="Pilih Siswa Penilaian Karakter"
              value={selectedStudent.id}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg px-3 py-1.5"
            >
              {classStudents.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (Poin Reward: +{s.totalRewardPoints} | Poin Pelanggaran: {s.totalViolationPoints})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">SB: Sangat Baik</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">BSH: Berkembang Sesuai Harapan</span>
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded">MB: Mulai Berkembang</span>
          <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded">PB: Perlu Bimbingan</span>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Penilaian karakter ananda {selectedStudent.name} berhasil disimpan dan diperbarui!</span>
        </div>
      )}

      {/* 6 Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DIMENSIONS.map(dim => {
          const DimIcon = dim.icon;
          const currentDimData = dimensionsData.find(d => d.dimension === dim.id) || {
            dimension: dim.id,
            dimensionLabel: dim.label,
            score: 'BSH' as CharacterScore,
            note: ''
          };

          return (
            <div key={dim.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <DimIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">{dim.label}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{dim.description}</p>
                  </div>
                </div>

                {/* Score Selector */}
                <div className="inline-flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200 shrink-0">
                  {(['SB', 'BSH', 'MB', 'PB'] as CharacterScore[]).map(scoreOption => (
                    <button
                      key={scoreOption}
                      type="button"
                      onClick={() => handleScoreChange(dim.id, scoreOption)}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                        currentDimData.score === scoreOption
                          ? scoreOption === 'SB' ? 'bg-emerald-600 text-white shadow-xs' :
                            scoreOption === 'BSH' ? 'bg-blue-600 text-white shadow-xs' :
                            scoreOption === 'MB' ? 'bg-amber-600 text-white shadow-xs' : 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {scoreOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Observation Note */}
              <div className="mt-3">
                <textarea
                  rows={2}
                  value={currentDimData.note}
                  onChange={(e) => handleNoteChange(dim.id, e.target.value)}
                  placeholder="Catatan observasi perilaku nyata siswa di kelas/sekolah..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                ></textarea>
              </div>
            </div>
          );
        })}
      </div>

      {/* General Summary by Teacher/BK */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span>Kesimpulan Perkembangan Kepribadian Siswa</span>
          <span className="text-xs text-slate-400 font-normal">
            (Ditampilkan pada Rapor Karakter & Komunikasi Orang Tua)
          </span>
        </h4>
        <textarea
          rows={3}
          value={generalSummary}
          onChange={(e) => setGeneralSummary(e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
          placeholder="Tuliskan catatan umum perkembangan kepribadian, pencapaian keteladanan, atau rekomendasi perbaikan..."
        ></textarea>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            Penilai: <strong className="text-slate-800">{currentUser.name}</strong> • Tanggal: {new Date().toLocaleDateString('id-ID')}
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition shadow-sm"
          >
            Simpan Catatan Karakter
          </button>
        </div>
      </div>

    </div>
  );
};
