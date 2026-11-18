import React from 'react';
import { ArrowRight, Droplets, Moon, ShieldAlert, Sun } from 'lucide-react';
import {
  ClientDiagnosticInput,
  LipCarePrescription,
  LipEnvironment,
  LipHydration,
  LipPigmentation,
  LipSensitivity,
  STUDIO_IMAGES,
} from '../lib/colorAndLipData';
import { ResilientImage } from './ResilientImage';

interface LipApothecaryViewProps {
  input: ClientDiagnosticInput;
  lipCare: LipCarePrescription;
  onChangeInput: (patch: Partial<ClientDiagnosticInput>) => void;
  onNavigateTab: (tab: 'studio' | 'apothecary' | 'forms' | 'slides') => void;
}

export const LipApothecaryView: React.FC<LipApothecaryViewProps> = ({
  input,
  lipCare,
  onChangeInput,
  onNavigateTab,
}) => {
  const hydrationOptions: { value: LipHydration; label: string }[] = [
    { value: 'dehydrated', label: 'Dehidrasi / Mengelupas' },
    { value: 'balanced', label: 'Normal Terkendali' },
    { value: 'plump', label: 'Lembap Optimal' },
  ];

  const pigmentationOptions: { value: LipPigmentation; label: string }[] = [
    { value: 'two-tone', label: 'Two-Tone / Tepi Gelap' },
    { value: 'even', label: 'Merata Alami' },
    { value: 'pale', label: 'Cenderung Pucat' },
  ];

  const sensitivityOptions: { value: LipSensitivity; label: string }[] = [
    { value: 'sensitive', label: 'Sensitif (Bebas Pewangi)' },
    { value: 'normal', label: 'Toleransi Normal' },
  ];

  const environmentOptions: { value: LipEnvironment; label: string }[] = [
    { value: 'ac-indoor', label: 'Dominan Ruangan AC' },
    { value: 'uv-outdoor', label: 'Aktivitas Luar Ruangan / UV' },
  ];

  const clientDisplayName = input.clientName.trim();

  return (
    <div className="space-y-10">
      {/* Header & Natural Care Visual Pair */}
      <section className="grid grid-cols-1 items-stretch gap-8 border-b border-[#F3B0C8] pb-10 lg:grid-cols-12">
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#9E2656]">
              Apotek Bibir Alami GlossyChuu!
              {clientDisplayName ? ` · Klien: ${clientDisplayName}` : ''}
            </p>
            <h1 className="font-bubble text-balance mt-2 text-4xl font-bold leading-tight text-[#3D2230]">
              Pemulihan Barrier &amp; Rutinitas Perawatan Bibir Alami.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#75485D]">
              Kulit bibir hanya memiliki 3 hingga 5 lapis sel stratum korneum tanpa
              kelenjar minyak pelindung. Evaluasi kondisi hidrasi dan sensitivitas
              untuk menyusun protokol perawatan pagi, malam, dan bahan aktif alami
              yang aman.
            </p>
          </div>

          <div className="bubble-speech mt-6 p-5">
            <div className="flex items-start gap-3">
              <Droplets
                className="mt-0.5 h-5 w-5 shrink-0 text-[#C83E72]"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold text-[#75485D]">
                  Diagnosis Barrier Bibir Saat Ini
                </p>
                <p className="font-bubble mt-0.5 text-lg font-bold text-[#3D2230]">
                  {lipCare.barrierStatus}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#5C3648]">
                  {lipCare.barrierSummary}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bubble-card h-full overflow-hidden">
            <ResilientImage
              src={STUDIO_IMAGES.naturalOils}
              alt="Minyak biji rosehip cold-pressed, shea butter mentah di mangkuk keramik, dan kelopak mawar kering"
              className="h-64 w-full object-cover lg:h-full"
              fallbackTitle="Apotek Bibir Alami GlossyChuu!"
            />
          </div>
        </div>
      </section>

      {/* Diagnostic Controls & AM/PM Routine */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="bubble-card space-y-5 p-6 lg:col-span-5">
          <h2 className="font-bubble border-b border-[#FCE4EE] pb-3 text-2xl font-bold text-[#3D2230]">
            01. Parameter Kondisi Bibir
          </h2>

          <div>
            <span className="block text-xs font-semibold text-[#5C3648]">
              Tingkat Hidrasi &amp; Tekstur
            </span>
            <div className="mt-2 flex flex-col gap-1.5 rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] p-1.5">
              {hydrationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeInput({ hydration: opt.value })}
                  className={`min-h-[38px] rounded-xl px-3 py-1.5 text-left text-xs font-semibold transition-colors ${
                    input.hydration === opt.value
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
              Distribusi Pigmen Alami Bibir
            </span>
            <div className="mt-2 flex flex-col gap-1.5 rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] p-1.5">
              {pigmentationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeInput({ pigmentation: opt.value })}
                  className={`min-h-[38px] rounded-xl px-3 py-1.5 text-left text-xs font-semibold transition-colors ${
                    input.pigmentation === opt.value
                      ? 'border border-[#F3B0C8] bg-white text-[#3D2230] shadow-xs'
                      : 'text-[#75485D] hover:text-[#3D2230]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="block text-xs font-semibold text-[#5C3648]">
                Sensitivitas Bahan
              </span>
              <div className="mt-2 flex flex-col gap-1.5 rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] p-1.5">
                {sensitivityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChangeInput({ sensitivity: opt.value })}
                    className={`min-h-[38px] rounded-xl px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${
                      input.sensitivity === opt.value
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
              <span className="block text-xs font-semibold text-[#5C3648]">
                Lingkungan Harian
              </span>
              <div className="mt-2 flex flex-col gap-1.5 rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] p-1.5">
                {environmentOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChangeInput({ environment: opt.value })}
                    className={`min-h-[38px] rounded-xl px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${
                      input.environment === opt.value
                        ? 'bg-[#C83E72] text-white'
                        : 'text-[#75485D] hover:text-[#3D2230]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AM & PM Protocol */}
        <div className="space-y-6 lg:col-span-7">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* AM */}
            <div className="bubble-card p-6">
              <div className="flex items-center gap-2 border-b border-[#FCE4EE] pb-3">
                <Sun className="h-4 w-4 text-[#C83E72]" aria-hidden="true" />
                <h3 className="font-bubble text-2xl font-bold text-[#3D2230]">
                  Ritual Pagi (AM)
                </h3>
              </div>
              <ol className="mt-4 space-y-4">
                {lipCare.amRoutine.map((item) => (
                  <li key={item.step} className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-semibold text-[#9E2656] tabular-nums">
                        {item.step}
                      </span>
                      <span className="text-sm font-semibold text-[#3D2230]">
                        {item.title}
                      </span>
                    </div>
                    <p className="pl-6 text-xs leading-relaxed text-[#75485D]">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* PM */}
            <div className="bubble-card p-6">
              <div className="flex items-center gap-2 border-b border-[#FCE4EE] pb-3">
                <Moon className="h-4 w-4 text-[#3D2230]" aria-hidden="true" />
                <h3 className="font-bubble text-2xl font-bold text-[#3D2230]">
                  Pemulihan Malam (PM)
                </h3>
              </div>
              <ol className="mt-4 space-y-4">
                {lipCare.pmRoutine.map((item) => (
                  <li key={item.step} className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-semibold text-[#9E2656] tabular-nums">
                        {item.step}
                      </span>
                      <span className="text-sm font-semibold text-[#3D2230]">
                        {item.title}
                      </span>
                    </div>
                    <p className="pl-6 text-xs leading-relaxed text-[#75485D]">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Weekly Ritual & CTA */}
          <div className="bubble-card flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold text-[#75485D]">
                Ritual Mingguan Tanpa Iritasi
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#3D2230]">
                {lipCare.weeklyRitual}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('slides')}
              className="inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full bg-[#C83E72] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B02E60] whitespace-nowrap"
            >
              <span>Sertakan di Dek Slides</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Active Ingredients Table & Avoid Protocol */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="bubble-card p-6 lg:col-span-7">
          <h2 className="font-bubble text-2xl font-bold text-[#3D2230]">
            02. Bahan Aktif Alami Rekomendasi
          </h2>
          <p className="mt-1 text-xs text-[#75485D]">
            Konsentrasi aman untuk pemakaian harian maupun masker malam
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#F3B0C8] text-[#75485D]">
                  <th className="py-2.5 pr-4 font-semibold">Bahan Alami</th>
                  <th className="py-2.5 pr-4 font-semibold">Konsentrasi</th>
                  <th className="py-2.5 font-semibold">Fungsi Barrier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FCE4EE]">
                {lipCare.actives.map((act) => (
                  <tr key={act.name}>
                    <td className="py-3 pr-4 align-top">
                      <span className="block font-semibold text-[#3D2230]">
                        {act.name}
                      </span>
                      <span className="mt-0.5 block leading-relaxed text-[#75485D]">
                        {act.detail}
                      </span>
                    </td>
                    <td className="font-mono py-3 pr-4 align-top text-[#3D2230] tabular-nums whitespace-nowrap">
                      {act.concentration}
                    </td>
                    <td className="py-3 align-top text-[#5C3648]">
                      {act.functionLabel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bubble-card flex flex-col justify-between p-6 lg:col-span-5">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#C83E72]" aria-hidden="true" />
              <h2 className="font-bubble text-2xl font-bold text-[#3D2230]">
                Daftar Bahan yang Dihindari
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#75485D]">
              Komponen umum pada pelembap bibir komersial yang memicu
              ketergantungan kering
            </p>

            <ul className="mt-5 space-y-4">
              {lipCare.avoidIngredients.map((item) => (
                <li
                  key={item.name}
                  className="border-b border-[#FCE4EE] pb-3.5 last:border-b-0 last:pb-0"
                >
                  <p className="text-sm font-semibold text-[#3D2230]">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#75485D]">
                    {item.reason}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#F3B0C8]">
            <ResilientImage
              src={STUDIO_IMAGES.drapingSwatches}
              alt="Kain swatch warna personal di meja konsultasi GlossyChuu!"
              className="h-36 w-full object-cover"
              fallbackTitle="Meja Konsultasi GlossyChuu!"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
