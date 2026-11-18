import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  FilePlus2,
  ListChecks,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  appendFollowUpQuestion,
  createConsultationIntakeForm,
  getFormDetails,
  getFormResponses,
  mapFormResponseToDiagnostic,
  WorkspaceFormInfo,
  WorkspaceFormResponseRow,
} from '../lib/workspaceApis';
import { ClientDiagnosticInput } from '../lib/colorAndLipData';
import { getAccessToken } from '../lib/workspaceAuth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { ConfirmModal } from './ConfirmModal';

interface GoogleFormsViewProps {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  onLogin: () => void;
  onAuthExpired: () => void;
  diagnosticInput: ClientDiagnosticInput;
  onApplyClientProfile: (next: ClientDiagnosticInput) => void;
  onNavigateToStudio: () => void;
}

export const GoogleFormsView: React.FC<GoogleFormsViewProps> = ({
  isAuthenticated,
  isLoggingIn,
  onLogin,
  onAuthExpired,
  diagnosticInput,
  onApplyClientProfile,
  onNavigateToStudio,
}) => {
  const [formInfo, setFormInfo] = useState<WorkspaceFormInfo | null>(null);
  const [responses, setResponses] = useState<WorkspaceFormResponseRow[]>([]);
  const [formInputId, setFormInputId] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [newQuestionTitle, setNewQuestionTitle] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const [isMutatingForm, setIsMutatingForm] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);
  const [appliedResponseId, setAppliedResponseId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [confirmAppendOpen, setConfirmAppendOpen] = useState(false);

  const requireToken = async (): Promise<string | null> => {
    const token = await getAccessToken();
    if (!token) {
      onAuthExpired();
      return null;
    }
    return token;
  };

  const handleCreateForm = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    const token = await requireToken();
    if (!token) return;

    setIsCreating(true);
    try {
      const created = await createConsultationIntakeForm(token, customLabel);
      setFormInfo(created);
      setFormInputId(created.formId);
      setResponses([]);
      setStatusMsg(
        `Formulir "${created.title}" berhasil dibuat di Google Forms dengan ${created.questions.length} pertanyaan diagnostik.`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal membuat formulir di Google Forms.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLoadForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputId.trim()) return;
    setErrorMsg(null);
    setStatusMsg(null);
    const token = await requireToken();
    if (!token) return;

    setIsLoadingForm(true);
    try {
      const loaded = await getFormDetails(token, formInputId);
      setFormInfo(loaded);
      setStatusMsg(`Formulir "${loaded.title}" berhasil dimuat.`);
      setIsLoadingResponses(true);
      const rows = await getFormResponses(token, loaded.formId, loaded.questions);
      setResponses(rows);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal memuat Google Form.');
    } finally {
      setIsLoadingForm(false);
      setIsLoadingResponses(false);
    }
  };

  const handleRefreshResponses = async () => {
    if (!formInfo) return;
    setErrorMsg(null);
    const token = await requireToken();
    if (!token) return;

    setIsLoadingResponses(true);
    try {
      const rows = await getFormResponses(
        token,
        formInfo.formId,
        formInfo.questions
      );
      setResponses(rows);
      setStatusMsg(`Ditemukan ${rows.length} jawaban klien pada formulir aktif.`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal mengambil respons dari Google Forms.');
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const handleRequestAppendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInfo || !newQuestionTitle.trim()) return;
    setConfirmAppendOpen(true);
  };

  const handleConfirmAppendQuestion = async () => {
    if (!formInfo || !newQuestionTitle.trim()) return;
    setErrorMsg(null);
    const token = await requireToken();
    if (!token) {
      setConfirmAppendOpen(false);
      return;
    }

    setIsMutatingForm(true);
    try {
      const updated = await appendFollowUpQuestion(
        token,
        formInfo.formId,
        newQuestionTitle,
        formInfo.questions.length
      );
      setFormInfo(updated);
      setNewQuestionTitle('');
      setStatusMsg('Pertanyaan lanjutan berhasil ditambahkan ke Google Form Anda.');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal memperbarui Google Form.');
    } finally {
      setIsMutatingForm(false);
      setConfirmAppendOpen(false);
    }
  };

  const handleCopyLink = async () => {
    if (!formInfo?.responderUri) return;
    try {
      await navigator.clipboard.writeText(formInfo.responderUri);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setErrorMsg('Tidak dapat menyalin tautan otomatis; silakan salin dari kolom.');
    }
  };

  const handleApplyRow = (row: WorkspaceFormResponseRow) => {
    const mapped = mapFormResponseToDiagnostic(row, diagnosticInput);
    onApplyClientProfile(mapped);
    setAppliedResponseId(row.responseId);
    setStatusMsg(
      `Profil "${mapped.clientName}" diterapkan ke Studio Warna & Apotek Bibir.`
    );
  };

  if (!isAuthenticated) {
    return (
      <section className="bubble-card p-8 md:p-10">
        <div className="max-w-xl space-y-4">
          <p className="text-xs font-semibold text-[#9E2656]">
            Integrasi Google Forms · Intake Klien GlossyChuu!
          </p>
          <h1 className="font-bubble text-3xl font-bold text-[#3D2230] sm:text-4xl">
            Hubungkan Google Forms untuk Mengumpulkan Data Kulit &amp; Bibir Klien.
          </h1>
          <p className="text-sm leading-relaxed text-[#75485D]">
            Masuk dengan akun Google Anda agar GlossyChuu! dapat membuat
            formulir kuesioner pra-konsultasi secara langsung dan membaca
            tanggapan klien ke dalam workbench color analysis.
          </p>
          <div className="pt-2">
            <GoogleSignInButton onClick={onLogin} disabled={isLoggingIn} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="border-b border-[#F3B0C8] pb-6">
        <p className="text-xs font-semibold text-[#9E2656]">
          Google Forms API · Formulir Intake Pra-Konsultasi GlossyChuu!
        </p>
        <h1 className="font-bubble mt-1 text-3xl font-bold text-[#3D2230] sm:text-4xl">
          Kuesioner Klien &amp; Impor Jawaban Diagnostik
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#75485D]">
          Buat formulir Google Forms baru berisi 7 pertanyaan pemetaan undertone,
          kedalaman kulit, hidrasi bibir, dan preferensi hasil akhir—atau hubungkan
          ID formulir yang sudah Anda miliki untuk menarik jawaban klien langsung ke
          Studio.
        </p>
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

      {/* Create or Load Form Grid */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Create New Intake Form */}
        <div className="bubble-card flex flex-col justify-between p-6 lg:col-span-6">
          <div>
            <div className="flex items-center gap-2">
              <FilePlus2 className="h-4 w-4 text-[#C83E72]" aria-hidden="true" />
              <h2 className="font-bubble text-2xl font-bold text-[#3D2230]">
                Buat Formulir Intake Baru
              </h2>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#75485D]">
              Membuat dokumen Google Forms baru di akun Anda dengan 7 pertanyaan
              standar konsultasi warna personal &amp; kondisi bibir.
            </p>

            <div className="mt-4">
              <label
                htmlFor="custom-form-label"
                className="block text-xs font-semibold text-[#5C3648]"
              >
                Label Batch / Nama Sesi (Opsional)
              </label>
              <input
                id="custom-form-label"
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="Contoh: Batch Mei 2026"
                className="mt-1.5 w-full rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] px-3.5 py-2 text-sm text-[#3D2230] focus:border-[#C83E72] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleCreateForm}
              disabled={isCreating}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#C83E72] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#B02E60] disabled:opacity-60 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>
                {isCreating ? 'Membuat Formulir...' : 'Buat Google Form Baru'}
              </span>
            </button>
          </div>
        </div>

        {/* Connect Existing Form */}
        <form
          onSubmit={handleLoadForm}
          className="bubble-card flex flex-col justify-between p-6 lg:col-span-6"
        >
          <div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#3D2230]" aria-hidden="true" />
              <h2 className="font-bubble text-2xl font-bold text-[#3D2230]">
                Muat Formulir yang Sudah Ada
              </h2>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#75485D]">
              Tempel URL edit Google Forms atau Form ID Anda untuk membaca daftar
              pertanyaan dan menarik data jawaban klien.
            </p>

            <div className="mt-4">
              <label
                htmlFor="existing-form-id"
                className="block text-xs font-semibold text-[#5C3648]"
              >
                URL atau ID Google Form
              </label>
              <input
                id="existing-form-id"
                type="text"
                value={formInputId}
                onChange={(e) => setFormInputId(e.target.value)}
                placeholder="https://docs.google.com/forms/d/... atau Form ID"
                className="font-mono mt-1.5 w-full rounded-2xl border border-[#F3B0C8] bg-[#FFF8FB] px-3.5 py-2 text-xs text-[#3D2230] focus:border-[#C83E72] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5">
            <button
              type="submit"
              disabled={isLoadingForm || !formInputId.trim()}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#F3B0C8] bg-[#FDECF2] px-5 py-2 text-sm font-semibold text-[#9E2656] transition-colors hover:bg-[#FAD6E4] disabled:opacity-50 whitespace-nowrap"
            >
              <span>
                {isLoadingForm ? 'Memuat...' : 'Hubungkan & Tarik Jawaban'}
              </span>
            </button>
          </div>
        </form>
      </section>

      {/* Active Form Details & Responses */}
      {formInfo ? (
        <section className="space-y-6">
          <div className="bubble-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#FCE4EE] pb-4">
              <div>
                <p className="font-mono text-xs text-[#75485D] tabular-nums">
                  Form ID: {formInfo.formId} · {formInfo.questions.length} Pertanyaan
                </p>
                <h3 className="font-bubble mt-1 text-2xl font-bold text-[#3D2230]">
                  {formInfo.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {formInfo.responderUri && (
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-[#F3B0C8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#3D2230] hover:bg-[#FDECF2] whitespace-nowrap"
                  >
                    {copiedLink ? (
                      <Check className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>
                      {copiedLink ? 'Tautan Disalin' : 'Salin Tautan Klien'}
                    </span>
                  </button>
                )}

                {formInfo.responderUri && (
                  <a
                    href={formInfo.responderUri}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-[#F3B0C8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#3D2230] hover:bg-[#FDECF2] whitespace-nowrap"
                  >
                    <span>Isi Formulir</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}

                <a
                  href={formInfo.editUri}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-[#3D2230] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#523041] whitespace-nowrap"
                >
                  <span>Edit di Google Forms</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Questions List + Append Follow-Up Question */}
            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-[#C83E72]" aria-hidden="true" />
                  <h4 className="text-sm font-semibold text-[#3D2230]">
                    Struktur Pertanyaan Formulir
                  </h4>
                </div>
                <ol className="mt-3 space-y-2 text-xs text-[#5C3648]">
                  {formInfo.questions.map((q, idx) => (
                    <li
                      key={q.questionId}
                      className="flex items-baseline gap-2.5 border-b border-[#FCE4EE] pb-2 last:border-b-0"
                    >
                      <span className="font-mono text-[#75485D] tabular-nums">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span>{q.title}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <form
                onSubmit={handleRequestAppendQuestion}
                className="bubble-speech p-4 lg:col-span-5"
              >
                <label
                  htmlFor="append-question-input"
                  className="block text-xs font-semibold text-[#3D2230]"
                >
                  Tambah Pertanyaan Lanjutan ke Formulir
                </label>
                <p className="mt-1 text-xs text-[#75485D]">
                  Menambahkan item pertanyaan paragraf ke formulir yang terhubung
                  (memerlukan konfirmasi).
                </p>
                <input
                  id="append-question-input"
                  type="text"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="Contoh: Warna lip balm favorit sehari-hari?"
                  className="mt-3 w-full rounded-2xl border border-[#F3B0C8] bg-white px-3.5 py-2 text-xs text-[#3D2230] focus:border-[#C83E72] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newQuestionTitle.trim() || isMutatingForm}
                  className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[#C83E72] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#B02E60] disabled:opacity-50 whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Tambahkan Pertanyaan</span>
                </button>
              </form>
            </div>
          </div>

          {/* Client Responses Table */}
          <div className="bubble-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FCE4EE] pb-4">
              <div>
                <h3 className="font-bubble text-2xl font-bold text-[#3D2230]">
                  Daftar Jawaban Klien ({responses.length})
                </h3>
                <p className="mt-0.5 text-xs text-[#75485D]">
                  Pilih salah satu entri untuk mengisi otomatis Studio Warna dan
                  Apotek Bibir
                </p>
              </div>
              <button
                type="button"
                onClick={handleRefreshResponses}
                disabled={isLoadingResponses}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-[#F3B0C8] bg-white px-4 py-1.5 text-xs font-semibold text-[#3D2230] hover:bg-[#FDECF2] disabled:opacity-50 whitespace-nowrap"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isLoadingResponses ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>
                  {isLoadingResponses ? 'Memuat...' : 'Segarkan Jawaban'}
                </span>
              </button>
            </div>

            {isLoadingResponses ? (
              <div className="mt-4 space-y-2">
                {[1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className="h-11 animate-pulse rounded-2xl bg-[#FDECF2]"
                  />
                ))}
              </div>
            ) : responses.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-semibold text-[#3D2230]">
                  Belum ada tanggapan yang dikirim pada formulir ini.
                </p>
                <p className="mt-1 text-xs text-[#75485D]">
                  Bagikan tautan formulir di atas kepada klien Anda (atau klik &ldquo;Isi
                  Formulir&rdquo; untuk menguji), lalu tekan &ldquo;Segarkan Jawaban&rdquo;.
                </p>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#F3B0C8] text-[#75485D]">
                      <th className="py-2.5 pr-4 font-semibold">Klien</th>
                      <th className="py-2.5 pr-4 font-semibold">Waktu Kirim</th>
                      <th className="py-2.5 pr-4 font-semibold">Ringkasan Jawaban</th>
                      <th className="py-2.5 text-right font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FCE4EE]">
                    {responses.map((row) => {
                      const summaryPairs = Object.entries(row.answers)
                        .slice(0, 3)
                        .map(([k, v]) => `${k.split(' ')[0]}: ${v}`)
                        .join(' · ');
                      const isApplied = appliedResponseId === row.responseId;

                      return (
                        <tr key={row.responseId} className="hover:bg-[#FFF8FB]">
                          <td className="py-3 pr-4 align-top font-semibold text-[#3D2230] whitespace-nowrap">
                            {row.clientName}
                          </td>
                          <td className="font-mono py-3 pr-4 align-top text-[#75485D] tabular-nums whitespace-nowrap">
                            {row.submittedAt ? row.submittedAt.slice(0, 10) : '-'}
                          </td>
                          <td className="py-3 pr-4 align-top text-[#5C3648]">
                            {summaryPairs || 'Jawaban tercatat'}
                          </td>
                          <td className="py-3 text-right align-top whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleApplyRow(row)}
                                className={`min-h-[34px] rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                                  isApplied
                                    ? 'bg-[#166534] text-white'
                                    : 'bg-[#C83E72] text-white hover:bg-[#B02E60]'
                                }`}
                              >
                                {isApplied ? 'Diterapkan' : 'Terapkan ke Studio'}
                              </button>
                              {isApplied && (
                                <button
                                  type="button"
                                  onClick={onNavigateToStudio}
                                  className="min-h-[34px] rounded-full border border-[#F3B0C8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#3D2230] hover:bg-[#FDECF2] whitespace-nowrap"
                                >
                                  Lihat Hasil
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-[#F3B0C8] bg-[#FFF8FB] p-8 text-center">
          <p className="text-sm font-semibold text-[#3D2230]">
            Belum ada formulir Google Forms yang terhubung di sesi ini.
          </p>
          <p className="mt-1 text-xs text-[#75485D]">
            Buat formulir intake baru di sebelah kiri atau tempel URL formulir
            yang sudah ada untuk mulai mengimpor data klien.
          </p>
        </section>
      )}

      <ConfirmModal
        open={confirmAppendOpen}
        title="Tambahkan Pertanyaan ke Google Form?"
        description={`Anda akan mengubah formulir "${formInfo?.title || ''}" dengan menambahkan satu pertanyaan baru di bagian akhir.`}
        details={[
          `Pertanyaan baru: "${newQuestionTitle.trim()}"`,
          `ID Formulir: ${formInfo?.formId || ''}`,
        ]}
        confirmLabel="Ya, Tambahkan Pertanyaan"
        isLoading={isMutatingForm}
        onConfirm={handleConfirmAppendQuestion}
        onCancel={() => setConfirmAppendOpen(false)}
      />
    </div>
  );
};
