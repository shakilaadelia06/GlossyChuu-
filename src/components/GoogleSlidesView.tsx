import React, { useState } from 'react';
import {
  ExternalLink,
  Layers,
  Plus,
  Presentation,
  Search,
} from 'lucide-react';
import {
  ClientDiagnosticInput,
  ColorToneProfile,
  LipCarePrescription,
} from '../lib/colorAndLipData';
import {
  appendRoutineUpdateSlide,
  createConsultationDeck,
  getPresentationDetails,
  WorkspaceDeckInfo,
} from '../lib/workspaceApis';
import { getAccessToken } from '../lib/workspaceAuth';
import { ConfirmModal } from './ConfirmModal';
import { GoogleSignInButton } from './GoogleSignInButton';

interface GoogleSlidesViewProps {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  onLogin: () => void;
  onAuthExpired: () => void;
  input: ClientDiagnosticInput;
  toneProfile: ColorToneProfile;
  lipCare: LipCarePrescription;
}

export const GoogleSlidesView: React.FC<GoogleSlidesViewProps> = ({
  isAuthenticated,
  isLoggingIn,
  onLogin,
  onAuthExpired,
  input,
  toneProfile,
  lipCare,
}) => {
  const [activePreviewSlide, setActivePreviewSlide] = useState<number>(0);
  const [createdDecks, setCreatedDecks] = useState<WorkspaceDeckInfo[]>([]);
  const [loadedDeck, setLoadedDeck] = useState<WorkspaceDeckInfo | null>(null);
  const [deckInputId, setDeckInputId] = useState('');

  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingDeck, setIsLoadingDeck] = useState(false);
  const [isAppendingSlide, setIsAppendingSlide] = useState(false);

  const [confirmAppendOpen, setConfirmAppendOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const labelName = input.clientName.trim() || 'Klien GlossyChuu!';

  const requireToken = async (): Promise<string | null> => {
    const token = await getAccessToken();
    if (!token) {
      onAuthExpired();
      return null;
    }
    return token;
  };

  const handleExportDeck = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    const token = await requireToken();
    if (!token) return;

    setIsExporting(true);
    try {
      const deck = await createConsultationDeck(
        token,
        input,
        toneProfile,
        lipCare
      );
      setCreatedDecks((prev) => [deck, ...prev]);
      setLoadedDeck(deck);
      setDeckInputId(deck.presentationId);
      setStatusMsg(
        `Dek Google Slides "${deck.title}" (${deck.slideCount} slide) berhasil dibuat di Google Drive Anda.`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal mengekspor dek ke Google Slides.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleLoadDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckInputId.trim()) return;
    setErrorMsg(null);
    setStatusMsg(null);
    const token = await requireToken();
    if (!token) return;

    setIsLoadingDeck(true);
    try {
      const deck = await getPresentationDetails(token, deckInputId);
      setLoadedDeck(deck);
      setStatusMsg(
        `Presentasi "${deck.title}" (${deck.slideCount} slide) berhasil dimuat.`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal membaca presentasi Google Slides.');
    } finally {
      setIsLoadingDeck(false);
    }
  };

  const handleConfirmAppendSlide = async () => {
    if (!loadedDeck) return;
    setErrorMsg(null);
    const token = await requireToken();
    if (!token) {
      setConfirmAppendOpen(false);
      return;
    }

    setIsAppendingSlide(true);
    try {
      const updated = await appendRoutineUpdateSlide(
        token,
        loadedDeck.presentationId,
        input,
        toneProfile,
        lipCare
      );
      setLoadedDeck(updated);
      setCreatedDecks((prev) =>
        prev.map((d) =>
          d.presentationId === updated.presentationId ? updated : d
        )
      );
      setStatusMsg(
        `Slide pembaruan konsultasi berhasil ditambahkan ke "${updated.title}".`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal menambahkan slide ke presentasi.');
    } finally {
      setIsAppendingSlide(false);
      setConfirmAppendOpen(false);
    }
  };

  const slideTabs = [
    '01. Sampul Klien',
    '02. Palet Warna (6 Swatch)',
    '03. Pilihan Warna Bibir',
    '04. Rutinitas Apotek Bibir',
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F3B0C8] pb-6">
        <div>
          <p className="text-xs font-semibold text-[#9E2656]">
            Google Slides API · Pembuat Lookbook Klien GlossyChuu!
          </p>
          <h1 className="font-bubble mt-1 text-3xl font-bold text-[#3D2230] sm:text-4xl">
            Dek Konsultasi Warna &amp; Perawatan Bibir
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#75485D]">
            Pratinjau 4 slide presentasi yang terisi otomatis dari analisis{' '}
            <strong className="font-semibold text-[#3D2230]">
              {labelName}
            </strong>{' '}
            ({toneProfile.toneName}), lalu ekspor langsung ke Google Slides dengan
            swatch warna dan rekomendasi warna lip balm yang akurat.
          </p>
        </div>

        <div className="shrink-0">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleExportDeck}
              disabled={isExporting}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#C83E72] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B02E60] disabled:opacity-60 whitespace-nowrap"
            >
              <Presentation className="h-4 w-4" aria-hidden="true" />
              <span>
                {isExporting
                  ? 'Membuat Presentasi...'
                  : 'Ekspor Dek ke Google Slides'}
              </span>
            </button>
          ) : (
            <GoogleSignInButton onClick={onLogin} disabled={isLoggingIn} />
          )}
        </div>
      </section>

      {errorMsg && (
        <div
          role="alert"
          className="rounded-2xl border border-[#C83E72]/35 bg-[#FDECF2] px-4 py-3 text-xs font-semibold text-[#9E2656]"
        >
          Peringatan: {errorMsg}
        </div>
      )}

      {statusMsg && (
        <div className="rounded-2xl border border-[#16A34A]/30 bg-[#16A34A]/5 px-4 py-3 text-xs font-semibold text-[#166534]">
          Berhasil: {statusMsg}
        </div>
      )}

      {/* Live 4-Slide Interactive Preview */}
      <section className="bubble-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FCE4EE] pb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#C83E72]" aria-hidden="true" />
            <h2 className="font-bubble text-2xl font-bold text-[#3D2230]">
              Pratinjau Isi Dek Sebelum Ekspor
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-full border border-[#F3B0C8] bg-[#FDECF2] p-1">
            {slideTabs.map((label, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => setActivePreviewSlide(idx)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activePreviewSlide === idx
                    ? 'bg-white text-[#3D2230] shadow-xs'
                    : 'text-[#75485D] hover:text-[#3D2230]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Slide Canvas (16:9 ratio feel) */}
        <div className="mt-5 rounded-3xl border border-[#F3B0C8] bg-[#FFF8FB] p-6 sm:p-8">
          {activePreviewSlide === 0 && (
            <div className="flex min-h-[290px] flex-col justify-between">
              <div>
                <div className="h-1.5 w-12 rounded-full bg-[#C83E72]" />
                <p className="mt-4 text-xs font-semibold text-[#75485D]">
                  {input.consultantName} · Laporan Konsultasi Personal
                </p>
                <h3 className="font-bubble mt-2 text-4xl font-bold text-[#3D2230]">
                  {labelName}
                </h3>
                <p className="font-bubble mt-1 text-2xl font-semibold text-[#9E2656]">
                  {toneProfile.toneName} — {toneProfile.headline}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5C3648]">
                  {toneProfile.description}
                </p>
              </div>
              <p className="font-mono mt-6 border-t border-[#F3B0C8] pt-3 text-xs text-[#75485D] tabular-nums">
                Tanggal Sesi: {input.sessionDate} · Logam Ideal:{' '}
                {toneProfile.jewelryMetal}
              </p>
            </div>
          )}

          {activePreviewSlide === 1 && (
            <div className="min-h-[290px] space-y-5">
              <div>
                <h3 className="font-bubble text-2xl font-bold text-[#3D2230]">
                  Palet Warna Personal: {toneProfile.toneName}
                </h3>
                <p className="mt-1 text-xs text-[#75485D]">
                  Tekstur Kain: {toneProfile.fabricFinish}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {toneProfile.swatches.map((sw) => (
                  <div
                    key={sw.hex}
                    className="overflow-hidden rounded-2xl border border-[#F3B0C8] bg-white"
                  >
                    <div
                      className="h-16 w-full"
                      style={{ backgroundColor: sw.hex }}
                    />
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-[#3D2230]">
                        {sw.name}
                      </p>
                      <p className="font-mono text-[11px] text-[#75485D] tabular-nums">
                        {sw.hex} · {sw.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePreviewSlide === 2 && (
            <div className="min-h-[290px] space-y-5">
              <div>
                <h3 className="font-bubble text-2xl font-bold text-[#3D2230]">
                  Pilihan Warna Lip Balm Alami — {labelName}
                </h3>
                <p className="mt-1 text-xs text-[#75485D]">
                  Undertone {input.undertone.toUpperCase()} · Preferensi:{' '}
                  {input.finishPreference}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {toneProfile.lipShades.map((lip) => (
                  <div
                    key={lip.id}
                    className="flex items-start gap-3.5 rounded-2xl border border-[#F3B0C8] bg-white p-3.5"
                  >
                    <div
                      className="h-14 w-12 shrink-0 rounded-xl border border-black/10"
                      style={{ backgroundColor: lip.hex }}
                    />
                    <div>
                      <p className="font-bubble text-sm font-bold text-[#3D2230]">
                        {lip.name}
                      </p>
                      <p className="font-mono text-[11px] text-[#75485D] tabular-nums">
                        {lip.hex} · {lip.finish}
                      </p>
                      <p className="mt-1 text-xs text-[#5C3648]">
                        {lip.naturalPigment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePreviewSlide === 3 && (
            <div className="min-h-[290px] space-y-4">
              <div>
                <h3 className="font-bubble text-2xl font-bold text-[#3D2230]">
                  Rutinitas Perawatan Bibir Alami GlossyChuu!
                </h3>
                <p className="mt-1 text-xs font-semibold text-[#9E2656]">
                  Status Barrier Bibir: {lipCare.barrierStatus}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#F3B0C8] bg-white p-4">
                  <p className="text-xs font-semibold text-[#3D2230]">
                    Ritual Pagi (AM)
                  </p>
                  <ul className="mt-2 space-y-2 text-xs text-[#5C3648]">
                    {lipCare.amRoutine.map((r) => (
                      <li key={r.step}>
                        <strong className="font-mono text-[#9E2656]">
                          {r.step}.
                        </strong>{' '}
                        {r.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-[#F3B0C8] bg-white p-4">
                  <p className="text-xs font-semibold text-[#3D2230]">
                    Pemulihan Malam (PM)
                  </p>
                  <ul className="mt-2 space-y-2 text-xs text-[#5C3648]">
                    {lipCare.pmRoutine.map((r) => (
                      <li key={r.step}>
                        <strong className="font-mono text-[#9E2656]">
                          {r.step}.
                        </strong>{' '}
                        {r.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-xs text-[#75485D]">
                Mingguan: {lipCare.weeklyRitual}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Load Existing Presentation + Session Decks */}
      {isAuthenticated && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <form
            onSubmit={handleLoadDeck}
            className="bubble-card p-6 lg:col-span-6"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#3D2230]" aria-hidden="true" />
              <h3 className="font-bubble text-2xl font-bold text-[#3D2230]">
                Muat atau Perbarui Dek yang Ada
              </h3>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#75485D]">
              Masukkan URL atau ID presentasi Google Slides untuk melihat struktur
              slide atau menambahkan slide pembaruan catatan klien.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={deckInputId}
                onChange={(e) => setDeckInputId(e.target.value)}
                placeholder="https://docs.google.com/presentation/d/... atau ID"
                className="font-mono flex-1 rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] px-3.5 py-2 text-xs text-[#3D2230] focus:border-[#C83E72] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoadingDeck || !deckInputId.trim()}
                className="min-h-[38px] rounded-full border border-[#F3B0C8] bg-white px-4 py-2 text-xs font-semibold text-[#3D2230] hover:bg-[#FDECF2] disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                {isLoadingDeck ? 'Memuat...' : 'Muat Presentasi'}
              </button>
            </div>

            {loadedDeck && (
              <div className="mt-5 border-t border-[#FCE4EE] pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#3D2230]">
                      {loadedDeck.title}
                    </p>
                    <p className="font-mono text-xs text-[#75485D] tabular-nums">
                      {loadedDeck.slideCount} Slide · ID: {loadedDeck.presentationId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmAppendOpen(true)}
                      disabled={isAppendingSlide}
                      className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full bg-[#C83E72] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#B02E60] disabled:opacity-60 whitespace-nowrap"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Tambah Slide Pembaruan</span>
                    </button>
                    <a
                      href={loadedDeck.editUri}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-[#F3B0C8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#3D2230] hover:bg-[#FDECF2] whitespace-nowrap"
                    >
                      <span>Buka</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                <ul className="mt-3 space-y-1.5 text-xs text-[#75485D]">
                  {loadedDeck.slideSummaries.map((sl, i) => (
                    <li
                      key={sl.objectId}
                      className="truncate border-b border-[#FCE4EE] pb-1.5 last:border-b-0"
                    >
                      <span className="font-mono mr-2 text-[#75485D] tabular-nums">
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      {sl.previewText}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>

          {/* Session Exported Decks */}
          <div className="bubble-card p-6 lg:col-span-6">
            <h3 className="font-bubble text-2xl font-bold text-[#3D2230]">
              Riwayat Dek Sesi Ini ({createdDecks.length})
            </h3>
            <p className="mt-1 text-xs text-[#75485D]">
              Tautan langsung menuju presentasi Google Slides yang dibuat dari
              workbench ini
            </p>

            {createdDecks.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-[#F3B0C8] bg-[#FFF8FB] p-6 text-center">
                <p className="text-xs font-semibold text-[#3D2230]">
                  Belum ada dek yang diekspor pada sesi ini.
                </p>
                <p className="mt-1 text-xs text-[#75485D]">
                  Klik tombol &ldquo;Ekspor Dek ke Google Slides&rdquo; di kanan atas
                  untuk membuat presentasi klien pertama Anda.
                </p>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-[#FCE4EE]">
                {createdDecks.map((deck) => (
                  <li
                    key={deck.presentationId}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#3D2230]">
                        {deck.title}
                      </p>
                      <p className="font-mono text-xs text-[#75485D] tabular-nums">
                        {deck.slideCount} Slide · {deck.presentationId}
                      </p>
                    </div>
                    <a
                      href={deck.editUri}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-full bg-[#3D2230] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#523041] whitespace-nowrap"
                    >
                      <span>Buka Slides</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <ConfirmModal
        open={confirmAppendOpen}
        title="Tambahkan Slide Pembaruan ke Google Slides?"
        description={`Tindakan ini akan memodifikasi presentasi "${loadedDeck?.title || ''}" dengan menyisipkan 1 slide baru berisi ringkasan terbaru untuk ${labelName}.`}
        details={[
          `Presentasi ID: ${loadedDeck?.presentationId || ''}`,
          `Tone Warna & Shade Utama: ${toneProfile.toneName} · ${toneProfile.lipShades[0]?.name || ''}`,
        ]}
        confirmLabel="Ya, Tambahkan Slide"
        isLoading={isAppendingSlide}
        onConfirm={handleConfirmAppendSlide}
        onCancel={() => setConfirmAppendOpen(false)}
      />
    </div>
  );
};
