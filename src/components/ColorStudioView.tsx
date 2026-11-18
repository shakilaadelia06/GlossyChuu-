import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Heart,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import {
  ClientDiagnosticInput,
  COLOR_ANALYSIS_QUIZ,
  ColorQuizAnswers,
  ColorToneProfile,
  ContrastLevel,
  LIP_SHADE_SHOWCASE,
  LipFinishPreference,
  scoreColorAnalysisQuiz,
  ShowcaseFilter,
  ShowcaseShadeItem,
  SkinDepth,
  STUDIO_IMAGES,
  Undertone,
} from '../lib/colorAndLipData';
import { ResilientImage } from './ResilientImage';

interface ColorStudioViewProps {
  input: ClientDiagnosticInput;
  toneProfile: ColorToneProfile;
  hasCompletedAnalysis: boolean;
  onCompleteAnalysis: () => void;
  onResetAnalysis: () => void;
  onChangeInput: (patch: Partial<ClientDiagnosticInput>) => void;
  onNavigateTab: (tab: 'studio' | 'apothecary' | 'forms' | 'slides') => void;
}

export const ColorStudioView: React.FC<ColorStudioViewProps> = ({
  input,
  toneProfile,
  hasCompletedAnalysis,
  onCompleteAnalysis,
  onResetAnalysis,
  onChangeInput,
  onNavigateTab,
}) => {
  const [workbenchMode, setWorkbenchMode] = useState<'quiz' | 'manual'>('quiz');
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<ColorQuizAnswers>({});

  const [showcaseFilter, setShowcaseFilter] = useState<ShowcaseFilter | 'matched'>('all');
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState<number>(0);

  const [activeDrapeHex, setActiveDrapeHex] = useState<string>(
    toneProfile.swatches[0]?.hex || '#DF9DA7'
  );
  const [drapeCategory, setDrapeCategory] = useState<'ideal' | 'avoid'>('ideal');
  const [selectedLipId, setSelectedLipId] = useState<string>(
    toneProfile.lipShades[0]?.id || ''
  );

  const activeLip =
    toneProfile.lipShades.find((l) => l.id === selectedLipId) ||
    toneProfile.lipShades[0];

  const undertoneDisplayLabel =
    input.undertone === 'warm'
      ? 'Warm Tone'
      : input.undertone === 'cool'
      ? 'Cool Tone'
      : 'Neutral Tone';

  const showcaseItems: ShowcaseShadeItem[] =
    showcaseFilter === 'matched'
      ? toneProfile.lipShades.map((lip) => ({
          undertoneLabel: undertoneDisplayLabel,
          undertone: input.undertone,
          depth: input.depth,
          contrast: input.contrast,
          lipShade: lip,
        }))
      : LIP_SHADE_SHOWCASE[showcaseFilter];

  const activeBarIndex =
    showcaseFilter === 'matched'
      ? Math.max(
          0,
          toneProfile.lipShades.findIndex((l) => l.id === activeLip?.id)
        )
      : activeShowcaseIdx;

  const currentDrapeHex =
    drapeCategory === 'ideal'
      ? toneProfile.swatches.some((s) => s.hex === activeDrapeHex)
        ? activeDrapeHex
        : toneProfile.swatches[0].hex
      : toneProfile.avoidSwatches.some((s) => s.hex === activeDrapeHex)
      ? activeDrapeHex
      : toneProfile.avoidSwatches[0].hex;

  const currentDrapeLabel =
    drapeCategory === 'ideal'
      ? toneProfile.swatches.find((s) => s.hex === currentDrapeHex)?.name ||
        toneProfile.swatches[0].name
      : toneProfile.avoidSwatches.find((s) => s.hex === currentDrapeHex)?.name ||
        toneProfile.avoidSwatches[0].name;

  const currentQuestion = COLOR_ANALYSIS_QUIZ[quizStep];
  const allQuizAnswered = COLOR_ANALYSIS_QUIZ.every((q) => Boolean(quizAnswers[q.id]));

  const scrollToEl = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectQuizOption = (
    questionId: keyof ColorQuizAnswers,
    optionId: string
  ) => {
    const nextAnswers = { ...quizAnswers, [questionId]: optionId };
    setQuizAnswers(nextAnswers);
    if (quizStep < COLOR_ANALYSIS_QUIZ.length - 1) {
      setQuizStep(quizStep + 1);
    }
  };

  const handleFinishQuiz = () => {
    const scored = scoreColorAnalysisQuiz(quizAnswers, input);
    onChangeInput(scored);
    onCompleteAnalysis();
    setShowcaseFilter('matched');
    scrollToEl('hasil-color-analysis');
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizStep(0);
    setShowcaseFilter('all');
    onResetAnalysis();
  };

  const handleSelectShowcaseShade = (item: ShowcaseShadeItem, idx: number) => {
    setActiveShowcaseIdx(idx);
    onChangeInput({
      undertone: item.undertone,
      depth: item.depth,
      contrast: item.contrast,
    });
    setSelectedLipId(item.lipShade.id);
    onCompleteAnalysis();
    scrollToEl('hasil-color-analysis');
  };

  const undertoneOptions: { value: Undertone; label: string; hint: string }[] = [
    { value: 'warm', label: 'Warm Golden', hint: 'Nadi kehijauan · cocok emas' },
    { value: 'cool', label: 'Cool Rosy', hint: 'Nadi biru/ungu · cocok perak' },
    { value: 'neutral', label: 'Neutral Olive', hint: 'Seimbang · emas & perak' },
  ];

  const depthOptions: { value: SkinDepth; label: string }[] = [
    { value: 'light', label: 'Fair-Light' },
    { value: 'medium', label: 'Medium' },
    { value: 'deep', label: 'Tan-Deep' },
  ];

  const contrastOptions: { value: ContrastLevel; label: string }[] = [
    { value: 'soft', label: 'Soft Muted' },
    { value: 'clear', label: 'Clear Bright' },
    { value: 'rich', label: 'Rich Deep' },
  ];

  const finishOptions: { value: LipFinishPreference; label: string }[] = [
    { value: 'sheer-balm', label: 'Sheer Balm' },
    { value: 'satin-tint', label: 'Satin Mineral' },
    { value: 'velvet-balm', label: 'Velvet Balm' },
  ];

  const clientDisplayName = input.clientName.trim();

  return (
    <div className="space-y-16">
      {/* SECTION 1: Editorial Hero matching soft pink & white reference */}
      <section className="space-y-7">
        <div className="overflow-hidden rounded-[28px] border-2 border-[#F3B0C8] bg-[#FFF8FB] shadow-[0_10px_30px_-14px_rgba(200,62,114,0.2)]">
          <ResilientImage
            src={STUDIO_IMAGES.heroAtelier}
            alt="Dua squeeze tube lip balm matte lembut GlossyChuu! berwarna baby pink dan peach blush di atas marmer putih bersama pita satin pink, mutiara, dan swatch gloss berbentuk hati"
            className="h-[260px] w-full object-cover object-center sm:h-[360px] lg:h-[400px]"
            fallbackTitle="GlossyChuu! Studio"
          />
        </div>

        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
          <div className="space-y-4 md:col-span-6">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#9E2656]">
                Natural Lip Care &amp; Personal Color Consultant
              </p>
              <h1 className="font-bubble mt-1 text-4xl font-bold leading-none text-[#3D2230] sm:text-5xl">
                GlossyChuu!
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setWorkbenchMode('quiz');
                  scrollToEl('diagnostic-workbench');
                }}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#F09BB9] bg-[#FDECF2] px-6 py-2 text-sm font-semibold text-[#9E2656] transition-colors hover:bg-[#FAD6E4] focus-visible:outline-2 focus-visible:outline-[#C83E72] whitespace-nowrap shrink-0"
              >
                <span>Mulai Tes Color Analysis</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('forms')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#F3B0C8] bg-white px-5 py-2 text-sm font-semibold text-[#5C3648] transition-colors hover:bg-[#FFF8FB] whitespace-nowrap shrink-0"
              >
                Formulir Google Forms
              </button>
            </div>
          </div>

          <div className="md:col-span-6 md:text-right">
            <p className="font-bubble inline-block max-w-md text-xl italic leading-snug text-[#C85A82] sm:text-2xl md:-rotate-1">
              &ldquo;Warna lip balm yang selaras &amp; bibir sehat alami — kunci
              tampil percaya diri setiap hari&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: 4-Card Lip Color Showcase Strip ("Pilihan Warna") with Cool, Warm, and Neutral switcher */}
      <section aria-label="Pilihan Warna Lip Balm" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#75485D]">
              Pilihan Warna Lip Balm · Cool, Warm &amp; Neutral
            </p>
            <p className="mt-0.5 text-xs text-[#75485D]">
              Pilih kategori undertone atau klik salah satu warna untuk simulasi drape
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-full border border-[#F3B0C8] bg-[#FDECF2] p-1">
            {(
              [
                { id: 'all', label: 'Cool & Warm' },
                { id: 'cool', label: 'Cool Tone' },
                { id: 'warm', label: 'Warm Tone' },
                { id: 'neutral', label: 'Neutral Tone' },
                ...(hasCompletedAnalysis
                  ? [{ id: 'matched' as const, label: 'Hasil Tes' }]
                  : []),
              ] as const
            ).map((tab) => {
              const active = showcaseFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setShowcaseFilter(tab.id);
                    setActiveShowcaseIdx(0);
                  }}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#C83E72] text-white'
                      : 'text-[#75485D] hover:text-[#3D2230]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {showcaseItems.map((item, idx) => {
            const lip = item.lipShade;
            const isSelected = activeLip?.id === lip.id && hasCompletedAnalysis;
            return (
              <button
                key={`${showcaseFilter}-${lip.id}`}
                type="button"
                onClick={() => handleSelectShowcaseShade(item, idx)}
                className={`group flex flex-col overflow-hidden rounded-[22px] border-2 bg-white p-2.5 text-left transition-all duration-150 ${
                  isSelected
                    ? 'border-[#C83E72] shadow-[0_8px_20px_-10px_rgba(200,62,114,0.35)]'
                    : 'border-[#F3B0C8] hover:border-[#E384A6]'
                }`}
              >
                <div
                  className="relative flex h-36 w-full items-end justify-between rounded-[14px] p-3 transition-transform duration-150 group-hover:scale-[0.99]"
                  style={{ backgroundColor: lip.hex }}
                >
                  <span className="font-mono rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-[#3D2230] tabular-nums">
                    {lip.hex}
                  </span>
                </div>
                <div className="px-1 pt-3 pb-1">
                  <p className="text-[11px] font-bold text-[#9E2656]">
                    {item.undertoneLabel}
                  </p>
                  <h2 className="font-bubble mt-0.5 text-base font-bold text-[#3D2230]">
                    {lip.name}
                  </h2>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#75485D]">
                    {lip.finish}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Thin Pink Progress Track & Centered Pill Button */}
        <div className="space-y-5 pt-1">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#FCE0EC]">
            <div
              className="h-full w-1/4 rounded-full bg-[#D86A93] transition-transform duration-200"
              style={{ transform: `translateX(${activeBarIndex * 100}%)` }}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => scrollToEl('diagnostic-workbench')}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#D86A93] px-7 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#C83E72] whitespace-nowrap"
            >
              <span>Coba Tes &amp; Simulasi Warna</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: Soft Cotton-Candy Pink Band with Flowing Looped SVG Ribbon & 3 Tilted Bubble Cards */}
      <section
        aria-label="Layanan Studio GlossyChuu!"
        className="relative overflow-hidden rounded-[32px] border border-[#F3B0C8] bg-[#FBD8E5] px-6 py-12 sm:px-10 sm:py-14"
      >
        {/* Decorative Flowing Looped Pink Ribbon SVG */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1100 420"
          fill="none"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
        >
          <path
            d="M -60 110 C 120 20, 260 280, 170 360 C 90 420, 40 280, 210 210 C 370 140, 490 360, 660 290 C 820 220, 740 40, 880 80 C 1020 120, 960 330, 1160 260"
            stroke="#F4AFC8"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 320 420 C 360 290, 520 320, 560 170 C 590 60, 490 20, 430 95"
            stroke="#F4AFC8"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative z-10 space-y-8">
          <h2 className="font-bubble text-3xl font-bold text-[#3D2230] sm:text-4xl">
            Layanan Studio
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
            {/* Card 1 */}
            <article className="rounded-[24px] border-2 border-[#F3B0C8] bg-white p-6 shadow-sm transition-transform duration-200 md:-rotate-2 hover:rotate-0">
              <h3 className="font-bubble text-xl font-bold text-[#3D2230]">
                Tes Color Analysis
              </h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#5C3648]">
                <li>&ndash; Analisis undertone &amp; kontras wajah</li>
                <li>&ndash; Kuis diagnostik interaktif 5 langkah</li>
                <li>&ndash; Pemetaan karakter tone &amp; logam ideal</li>
              </ul>
              <button
                type="button"
                onClick={() => {
                  setWorkbenchMode('quiz');
                  scrollToEl('diagnostic-workbench');
                }}
                className="mt-5 text-xs font-bold text-[#C83E72] hover:underline"
              >
                Mulai kuis 5 langkah &rarr;
              </button>
            </article>

            {/* Card 2 */}
            <article className="rounded-[24px] border-2 border-[#F3B0C8] bg-white p-6 shadow-sm transition-transform duration-200 md:translate-y-3 md:rotate-2 hover:rotate-0">
              <h3 className="font-bubble text-xl font-bold text-[#3D2230]">
                Pilihan Warna Lip Balm
              </h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#5C3648]">
                <li>&ndash; 4 shade lembut sesuai hasil tes personal</li>
                <li>&ndash; Simulasi kain drape real-time</li>
                <li>&ndash; Pilihan hasil sheer, satin, hingga velvet</li>
              </ul>
              <button
                type="button"
                onClick={() => scrollToEl('hasil-color-analysis')}
                className="mt-5 text-xs font-bold text-[#C83E72] hover:underline"
              >
                Uji pada simulasi drape &rarr;
              </button>
            </article>

            {/* Card 3 */}
            <article className="rounded-[24px] border-2 border-[#F3B0C8] bg-white p-6 shadow-sm transition-transform duration-200 md:-rotate-1 hover:rotate-0">
              <h3 className="font-bubble text-xl font-bold text-[#3D2230]">
                Apotek Bibir &amp; Google Dek
              </h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#5C3648]">
                <li>&ndash; Rutinitas perawatan bibir alami AM / PM</li>
                <li>&ndash; Impor formulir kuesioner Google Forms</li>
                <li>&ndash; Ekspor presentasi ke Google Slides</li>
              </ul>
              <button
                type="button"
                onClick={() => onNavigateTab('apothecary')}
                className="mt-5 text-xs font-bold text-[#C83E72] hover:underline"
              >
                Buka apotek bibir &rarr;
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 4: Interactive Color Analysis Workbench & Live Drape Result */}
      <section
        id="diagnostic-workbench"
        className="grid grid-cols-1 gap-8 lg:grid-cols-12"
      >
        {/* Left: Interactive 5-Step Quiz or Manual Parameter Mode */}
        <div className="bubble-card space-y-6 p-6 lg:col-span-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FCE4EE] pb-4">
            <div>
              <h2 className="font-bubble text-2xl font-bold text-[#3D2230]">
                01. Tes Color Analysis
              </h2>
              <p className="mt-0.5 text-xs text-[#75485D]">
                Jawab 5 pertanyaan singkat atau atur parameter warna secara manual
              </p>
            </div>
            <SlidersHorizontal
              className="h-4 w-4 text-[#C83E72]"
              aria-hidden="true"
            />
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 rounded-full border border-[#F3B0C8] bg-[#FDECF2] p-1">
            <button
              type="button"
              onClick={() => setWorkbenchMode('quiz')}
              className={`min-h-[36px] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                workbenchMode === 'quiz'
                  ? 'bg-[#C83E72] text-white'
                  : 'text-[#75485D] hover:text-[#3D2230]'
              }`}
            >
              Tes 5 Langkah
            </button>
            <button
              type="button"
              onClick={() => setWorkbenchMode('manual')}
              className={`min-h-[36px] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                workbenchMode === 'manual'
                  ? 'bg-white text-[#3D2230] shadow-xs'
                  : 'text-[#75485D] hover:text-[#3D2230]'
              }`}
            >
              Parameter Manual
            </button>
          </div>

          {/* Optional Client Name & Session Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="client-name-input"
                className="block text-xs font-semibold text-[#5C3648]"
              >
                Nama (Opsional)
              </label>
              <input
                id="client-name-input"
                type="text"
                value={input.clientName}
                onChange={(e) => onChangeInput({ clientName: e.target.value })}
                placeholder="Nama kamu (opsional)"
                className="mt-1.5 w-full rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] px-3.5 py-2 text-sm text-[#3D2230] focus:border-[#C83E72] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="session-date-input"
                className="block text-xs font-semibold text-[#5C3648]"
              >
                Tanggal Sesi
              </label>
              <input
                id="session-date-input"
                type="date"
                value={input.sessionDate}
                onChange={(e) => onChangeInput({ sessionDate: e.target.value })}
                className="font-mono mt-1.5 w-full rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] px-3.5 py-2 text-sm text-[#3D2230] tabular-nums focus:border-[#C83E72] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {workbenchMode === 'quiz' ? (
            <div className="space-y-5">
              {/* Step Indicator */}
              <div className="flex items-center justify-between text-xs text-[#75485D]">
                <span className="font-mono font-semibold text-[#9E2656] tabular-nums">
                  Langkah {currentQuestion.stepNumber} / 05
                </span>
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#75485D] hover:text-[#3D2230]"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>Ulangi Tes</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {COLOR_ANALYSIS_QUIZ.map((q, idx) => {
                  const answered = Boolean(quizAnswers[q.id]);
                  const active = idx === quizStep;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setQuizStep(idx)}
                      aria-label={`Langkah ${idx + 1}`}
                      className={`h-2 rounded-full transition-colors ${
                        active
                          ? 'bg-[#C83E72]'
                          : answered
                          ? 'bg-[#3D2230]'
                          : 'bg-[#F3B0C8]'
                      }`}
                    />
                  );
                })}
              </div>

              <div>
                <div className="bubble-speech p-4">
                  <h3 className="font-bubble text-base font-semibold leading-snug text-[#3D2230]">
                    {currentQuestion.question}
                  </h3>
                  <p className="mt-1 text-xs text-[#75485D]">
                    {currentQuestion.helper}
                  </p>
                </div>

                <div className="mt-3 space-y-2.5">
                  {currentQuestion.options.map((opt) => {
                    const selected = quizAnswers[currentQuestion.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          handleSelectQuizOption(currentQuestion.id, opt.id)
                        }
                        className={`flex w-full items-start justify-between gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
                          selected
                            ? 'border-[#C83E72] bg-[#FDECF2] text-[#3D2230]'
                            : 'border-[#F3B0C8] bg-white text-[#5C3648] hover:border-[#E384A6]'
                        }`}
                      >
                        <div>
                          <span className="block text-xs font-semibold text-[#3D2230]">
                            {opt.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-[#75485D]">
                            {opt.detail}
                          </span>
                        </div>
                        {selected && (
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#C83E72]"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[#FCE4EE] pt-4">
                <button
                  type="button"
                  onClick={() => setQuizStep((s) => Math.max(0, s - 1))}
                  disabled={quizStep === 0}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-[#F3B0C8] bg-white px-4 py-1.5 text-xs font-semibold text-[#3D2230] hover:bg-[#FDECF2] disabled:opacity-40 whitespace-nowrap"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Sebelumnya</span>
                </button>

                {quizStep < COLOR_ANALYSIS_QUIZ.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setQuizStep((s) =>
                        Math.min(COLOR_ANALYSIS_QUIZ.length - 1, s + 1)
                      )
                    }
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#3D2230] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#523041] whitespace-nowrap"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishQuiz}
                    disabled={!allQuizAnswered}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#C83E72] px-5 py-1.5 text-xs font-semibold text-white hover:bg-[#B02E60] disabled:opacity-50 whitespace-nowrap"
                  >
                    <span>Lihat Hasil Color Analysis</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Undertone */}
              <div>
                <span className="block text-xs font-semibold text-[#5C3648]">
                  Undertone Kulit Dasar
                </span>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {undertoneOptions.map((opt) => {
                    const active = input.undertone === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onChangeInput({ undertone: opt.value });
                          onCompleteAnalysis();
                        }}
                        className={`flex min-h-[44px] items-center justify-between rounded-2xl border px-3.5 py-2 text-left transition-colors ${
                          active
                            ? 'border-[#C83E72] bg-[#FDECF2] text-[#3D2230]'
                            : 'border-[#F3B0C8] bg-[#FFF8FB] text-[#5C3648] hover:border-[#E384A6]'
                        }`}
                      >
                        <div>
                          <span className="block text-sm font-semibold">
                            {opt.label}
                          </span>
                          <span className="block text-xs text-[#75485D]">
                            {opt.hint}
                          </span>
                        </div>
                        {active && (
                          <Check
                            className="h-4 w-4 text-[#C83E72]"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Depth & Contrast */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <span className="block text-xs font-semibold text-[#5C3648]">
                    Kedalaman Kulit
                  </span>
                  <div className="mt-2 flex flex-col gap-1.5 rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] p-1.5">
                    {depthOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onChangeInput({ depth: opt.value });
                          onCompleteAnalysis();
                        }}
                        className={`min-h-[36px] rounded-xl px-3 py-1.5 text-left text-xs font-semibold transition-colors whitespace-nowrap ${
                          input.depth === opt.value
                            ? 'border border-[#F3B0C8] bg-white text-[#3D2230] shadow-xs'
                            : 'text-[#75485D] hover:text-[#3D2230]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-[#5C3648]">
                    Tingkat Kontras Wajah
                  </span>
                  <div className="mt-2 flex flex-col gap-1.5 rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] p-1.5">
                    {contrastOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onChangeInput({ contrast: opt.value });
                          onCompleteAnalysis();
                        }}
                        className={`min-h-[36px] rounded-xl px-3 py-1.5 text-left text-xs font-semibold transition-colors whitespace-nowrap ${
                          input.contrast === opt.value
                            ? 'border border-[#F3B0C8] bg-white text-[#3D2230] shadow-xs'
                            : 'text-[#75485D] hover:text-[#3D2230]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Finish Preference */}
              <div>
                <span className="block text-xs font-semibold text-[#5C3648]">
                  Preferensi Tekstur Lip Balm
                </span>
                <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-full border border-[#F3B0C8] bg-[#FFF8FB] p-1">
                  {finishOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChangeInput({ finishPreference: opt.value });
                        onCompleteAnalysis();
                      }}
                      className={`min-h-[38px] rounded-full px-2 py-1.5 text-center text-xs font-semibold transition-colors whitespace-nowrap truncate ${
                        input.finishPreference === opt.value
                          ? 'bg-[#C83E72] text-white'
                          : 'text-[#75485D] hover:text-[#3D2230]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="consultant-notes"
                  className="block text-xs font-semibold text-[#5C3648]"
                >
                  Catatan Konsultasi
                </label>
                <textarea
                  id="consultant-notes"
                  rows={2}
                  value={input.notes}
                  onChange={(e) => onChangeInput({ notes: e.target.value })}
                  placeholder="Catatan tambahan kondisi kulit atau preferensi shade..."
                  className="mt-1.5 w-full rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] px-3.5 py-2 text-xs leading-relaxed text-[#3D2230] focus:border-[#C83E72] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Color Tone Result, Interactive Draping Simulator & Post-Test Matched Lip Balm Shades */}
        <div
          id="hasil-color-analysis"
          className="bubble-card space-y-6 p-6 lg:col-span-7"
        >
          {!hasCompletedAnalysis ? (
            <div className="flex h-full min-h-[420px] flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#F3B0C8] bg-[#FDECF2] px-4 py-1.5 text-xs font-semibold text-[#9E2656]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Menunggu Hasil Tes Color Analysis</span>
                </div>

                <h2 className="font-bubble text-3xl font-bold leading-snug text-[#3D2230]">
                  Temukan Karakter Warna Personal &amp; 4 Pilihan Warna Lip Balm
                  yang Paling Cocok Setelah Tes.
                </h2>

                <p className="text-sm leading-relaxed text-[#75485D]">
                  Selesaikan 5 langkah kuis di sebelah kiri untuk membuka profil
                  undertone, simulasi kain draping digital, dan pilihan warna lip
                  balm alami yang disesuaikan khusus untuk wajahmu. Atau pilih
                  mode <strong>Parameter Manual</strong> jika sudah mengetahui
                  undertone kulitmu.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bubble-speech p-4">
                  <p className="font-bubble text-base font-bold text-[#3D2230]">
                    Yang Kamu Dapatkan
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-[#5C3648]">
                    <li>&ndash; Profil undertone &amp; karakter kontras wajah</li>
                    <li>&ndash; 6 palet warna kain harmonis &amp; logam ideal</li>
                    <li>&ndash; 4 pilihan shade lip balm alami siap uji drape</li>
                  </ul>
                </div>

                <div className="flex flex-col justify-between rounded-[22px] border border-[#F3B0C8] bg-[#FFF8FB] p-4">
                  <div>
                    <p className="font-bubble text-base font-bold text-[#3D2230]">
                      Coba Simulasi Cool vs Warm?
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#75485D]">
                      Buka panel simulasi drape sekarang untuk membandingkan
                      warna Cool Tone dan Warm Tone secara langsung.
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onChangeInput({ undertone: 'cool', depth: 'light', contrast: 'soft' });
                        setWorkbenchMode('manual');
                        onCompleteAnalysis();
                      }}
                      className="inline-flex min-h-[36px] flex-1 items-center justify-center rounded-full border border-[#F09BB9] bg-[#FDECF2] px-3 py-1.5 text-xs font-semibold text-[#9E2656] transition-colors hover:bg-[#FAD6E4] whitespace-nowrap"
                    >
                      Coba Cool Tone
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeInput({ undertone: 'warm', depth: 'medium', contrast: 'clear' });
                        setWorkbenchMode('manual');
                        onCompleteAnalysis();
                      }}
                      className="inline-flex min-h-[36px] flex-1 items-center justify-center rounded-full bg-[#C83E72] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#B02E60] whitespace-nowrap"
                    >
                      Coba Warm Tone
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bubble-speech flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs font-semibold text-[#9E2656]">
                <span>
                  Hasil Color Analysis{clientDisplayName ? ` untuk ${clientDisplayName}` : ''}:{' '}
                  <strong>
                    {toneProfile.toneName} ({undertoneDisplayLabel})
                  </strong>
                </span>
                <div className="flex items-center gap-1 rounded-full border border-[#F3B0C8] bg-white p-0.5">
                  {(['cool', 'warm', 'neutral'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => onChangeInput({ undertone: u })}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize transition-colors ${
                        input.undertone === u
                          ? 'bg-[#C83E72] text-white'
                          : 'text-[#75485D] hover:text-[#3D2230]'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#FCE4EE] pb-4">
                <div>
                  <p className="text-xs font-semibold text-[#75485D]">
                    Profil Tone Warna · {undertoneDisplayLabel} · {toneProfile.toneFamily}
                  </p>
                  <h2 className="font-bubble mt-1 text-3xl font-bold text-[#3D2230]">
                    {toneProfile.toneName} — {toneProfile.headline}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('slides')}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#3D2230] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#523041] whitespace-nowrap shrink-0"
                >
                  <span>Ekspor Google Slides</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <p className="text-sm leading-relaxed text-[#5C3648]">
                {toneProfile.description}
              </p>

              <div className="grid grid-cols-1 gap-4 border-y border-[#FCE4EE] py-4 text-xs sm:grid-cols-2">
                <div>
                  <span className="block font-semibold text-[#75485D]">
                    Aksesori Logam Paling Mencerahkan
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-[#3D2230]">
                    {toneProfile.jewelryMetal}
                  </span>
                </div>
                <div>
                  <span className="block font-semibold text-[#75485D]">
                    Tekstur Bahan Busana Ideal
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-[#3D2230]">
                    {toneProfile.fabricFinish}
                  </span>
                </div>
              </div>

              {/* Interactive Digital Drape Comparator */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-[#C83E72]" aria-hidden="true" />
                    <h3 className="font-bubble text-xl font-bold text-[#3D2230]">
                      Simulasi Kain Draping &amp; Lip Balm
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 rounded-full border border-[#F3B0C8] bg-[#FDECF2] p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDrapeCategory('ideal');
                        setActiveDrapeHex(toneProfile.swatches[0].hex);
                      }}
                      className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                        drapeCategory === 'ideal'
                          ? 'bg-white text-[#3D2230] shadow-xs'
                          : 'text-[#75485D] hover:text-[#3D2230]'
                      }`}
                    >
                      Palet Harmonis (6)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDrapeCategory('avoid');
                        setActiveDrapeHex(toneProfile.avoidSwatches[0].hex);
                      }}
                      className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                        drapeCategory === 'avoid'
                          ? 'bg-white text-[#3D2230] shadow-xs'
                          : 'text-[#75485D] hover:text-[#3D2230]'
                      }`}
                    >
                      Warna Dihindari (3)
                    </button>
                  </div>
                </div>

                {/* Drape Stage */}
                <div
                  className="mt-4 flex flex-col justify-between rounded-3xl border border-[#F3B0C8] p-6 transition-colors duration-200 sm:flex-row sm:items-center"
                  style={{ backgroundColor: currentDrapeHex }}
                >
                  <div className="rounded-2xl bg-white/95 p-4 backdrop-blur-xs sm:max-w-xs">
                    <p className="text-xs font-semibold text-[#75485D]">
                      {drapeCategory === 'ideal'
                        ? 'Drape Harmonis Aktif'
                        : 'Drape Pembanding'}
                    </p>
                    <p className="font-bubble mt-1 text-base font-bold text-[#3D2230]">
                      {currentDrapeLabel}
                    </p>
                    <p className="font-mono mt-0.5 text-xs text-[#75485D] tabular-nums">
                      {currentDrapeHex}
                    </p>
                    {drapeCategory === 'avoid' && (
                      <p className="mt-2 text-xs leading-relaxed text-[#9E2656]">
                        {
                          toneProfile.avoidSwatches.find(
                            (s) => s.hex === currentDrapeHex
                          )?.reason
                        }
                      </p>
                    )}
                  </div>

                  {activeLip && (
                    <div className="mt-4 flex items-center gap-3.5 rounded-2xl bg-white/95 p-3.5 backdrop-blur-xs sm:mt-0">
                      <div
                        className="h-12 w-12 shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: activeLip.hex }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-[11px] font-semibold text-[#75485D]">
                          Pilihan Warna Lip Balm
                        </p>
                        <p className="font-bubble text-sm font-bold text-[#3D2230]">
                          {activeLip.name}
                        </p>
                        <p className="font-mono text-[11px] text-[#75485D] tabular-nums">
                          {activeLip.hex} · {activeLip.finish}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Swatch Selector Grid */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {drapeCategory === 'ideal'
                    ? toneProfile.swatches.map((sw) => {
                        const isSelected = sw.hex === currentDrapeHex;
                        return (
                          <button
                            key={sw.hex}
                            type="button"
                            onClick={() => setActiveDrapeHex(sw.hex)}
                            className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors ${
                              isSelected
                                ? 'border-[#C83E72] bg-[#FDECF2]'
                                : 'border-[#F3B0C8] bg-white hover:border-[#E384A6]'
                            }`}
                          >
                            <span
                              className="h-8 w-8 shrink-0 rounded-xl border border-black/10"
                              style={{ backgroundColor: sw.hex }}
                              aria-hidden="true"
                            />
                            <div className="min-w-0">
                              <span className="block truncate text-xs font-semibold text-[#3D2230]">
                                {sw.name}
                              </span>
                              <span className="font-mono block text-[11px] text-[#75485D] tabular-nums">
                                {sw.hex} · {sw.role}
                              </span>
                            </div>
                          </button>
                        );
                      })
                    : toneProfile.avoidSwatches.map((sw) => {
                        const isSelected = sw.hex === currentDrapeHex;
                        return (
                          <button
                            key={sw.hex}
                            type="button"
                            onClick={() => setActiveDrapeHex(sw.hex)}
                            className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors ${
                              isSelected
                                ? 'border-[#C83E72] bg-[#FDECF2]'
                                : 'border-[#F3B0C8] bg-white hover:border-[#E384A6]'
                            }`}
                          >
                            <span
                              className="h-8 w-8 shrink-0 rounded-xl border border-black/10"
                              style={{ backgroundColor: sw.hex }}
                              aria-hidden="true"
                            />
                            <div className="min-w-0">
                              <span className="block truncate text-xs font-semibold text-[#3D2230]">
                                {sw.name}
                              </span>
                              <span className="font-mono block text-[11px] text-[#75485D] tabular-nums">
                                {sw.hex}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                </div>
              </div>

              {/* Post-Test Matched Lip Balm Color Choices */}
              <div className="border-t border-[#FCE4EE] pt-5">
                <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h3 className="font-bubble text-2xl font-bold text-[#3D2230]">
                      02. Pilihan Warna Lip Balm yang Cocok Setelah Tes
                    </h3>
                    <p className="mt-0.5 text-xs text-[#75485D]">
                      Klik shade untuk membandingkannya di papan draping di atas
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {toneProfile.lipShades.map((lip) => {
                    const isSelected = activeLip?.id === lip.id;
                    return (
                      <button
                        key={lip.id}
                        type="button"
                        onClick={() => setSelectedLipId(lip.id)}
                        className={`flex flex-col justify-between rounded-3xl border p-4 text-left transition-all duration-150 ${
                          isSelected
                            ? 'border-[#C83E72] bg-[#FDECF2] shadow-xs'
                            : 'border-[#F3B0C8] bg-white hover:border-[#E384A6]'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="h-10 w-10 shrink-0 rounded-full border border-black/10"
                                style={{ backgroundColor: lip.hex }}
                                aria-hidden="true"
                              />
                              <div>
                                <h4 className="font-bubble text-sm font-bold text-[#3D2230]">
                                  {lip.name}
                                </h4>
                                <p className="font-mono text-[11px] text-[#75485D] tabular-nums">
                                  {lip.hex} · {lip.occasion}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <span className="text-[11px] font-semibold text-[#9E2656]">
                                Dipilih
                              </span>
                            )}
                          </div>

                          <p className="mt-2.5 text-xs leading-relaxed text-[#5C3648]">
                            {lip.coverageNote}
                          </p>
                        </div>

                        <div className="mt-3 border-t border-[#FCE4EE] pt-2.5 text-[11px] text-[#75485D]">
                          <span className="font-semibold text-[#3D2230]">
                            {lip.finish}
                          </span>
                          <span aria-hidden="true"> · </span>
                          <span>{lip.naturalPigment}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECTION 5: Editorial 2-Column About Block with Square Pink-Bordered Photo & Cute SVG Heart */}
      <section className="grid grid-cols-1 items-center gap-10 border-t border-[#FCE4EE] pt-12 md:grid-cols-12">
        <div className="relative mx-auto w-full max-w-sm md:col-span-5 md:max-w-none">
          <div className="overflow-hidden rounded-[26px] border-2 border-[#F3B0C8] bg-white p-2 shadow-sm">
            <ResilientImage
              src={STUDIO_IMAGES.mineralPigments}
              alt="Empat squeeze tube lip balm matte lembut GlossyChuu! berjajar dalam empat warna — sakura pink, warm peach, strawberry rose, dan berry plum dengan swatch berbentuk hati"
              className="aspect-square w-full rounded-[18px] object-cover"
              fallbackTitle="Pilihan Warna GlossyChuu!"
            />
          </div>
          {/* Hand-drawn Pink SVG Heart Accent at Bottom-Left Corner */}
          <div
            aria-hidden="true"
            className="pointer-events-none -bottom-5 -left-4 hidden sm:block sm:absolute"
          >
            <Heart
              className="h-14 w-14 -rotate-12 text-[#F39AB8]"
              strokeWidth={1.8}
            />
          </div>
        </div>

        <div className="space-y-4 md:col-span-7">
          <h2 className="font-bubble text-3xl font-bold text-[#3D2230] sm:text-4xl">
            Tentang GlossyChuu!
          </h2>
          <p className="text-sm leading-relaxed text-[#5C3648] sm:text-base">
            Filosofi GlossyChuu! memadukan perawatan bibir alami dengan personal
            color analysis — memastikan setiap sapuan lip balm tidak hanya
            merawat barrier bibir dari kekeringan, tetapi juga selaras dengan
            rona kulit alami Anda.
          </p>
          <p className="text-sm leading-relaxed text-[#75485D]">
            Diformulasikan menggunakan cold-pressed rosehip seed oil, unrefined
            shea butter, dan pigmen mineral lembut bebas pewangi sintetis agar
            nyaman untuk pemakaian harian maupun perawatan malam hari.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateTab('apothecary')}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#F09BB9] bg-[#FDECF2] px-6 py-2 text-sm font-semibold text-[#9E2656] transition-colors hover:bg-[#FAD6E4] whitespace-nowrap"
            >
              <span>Buka Apotek Perawatan Bibir</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
