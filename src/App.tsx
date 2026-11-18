import React, { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import { LogOut } from 'lucide-react';
import {
  buildLipCarePrescription,
  ClientDiagnosticInput,
  DEFAULT_CLIENT_INPUT,
  resolveColorToneProfile,
} from './lib/colorAndLipData';
import { googleSignIn, initAuth, logout } from './lib/workspaceAuth';
import { ColorStudioView } from './components/ColorStudioView';
import { LipApothecaryView } from './components/LipApothecaryView';
import { GoogleFormsView } from './components/GoogleFormsView';
import { GoogleSlidesView } from './components/GoogleSlidesView';
import { GoogleSignInButton } from './components/GoogleSignInButton';

type WorkspaceTab = 'studio' | 'apothecary' | 'forms' | 'slides';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('studio');
  const [diagnosticInput, setDiagnosticInput] = useState<ClientDiagnosticInput>(
    DEFAULT_CLIENT_INPUT
  );
  const [hasCompletedAnalysis, setHasCompletedAnalysis] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser) => {
        setUser(authedUser);
        setNeedsAuth(false);
        setAuthError(null);
      },
      (existingUser) => {
        setUser(existingUser);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      setUser(result.user);
      setNeedsAuth(false);
    } catch (err: any) {
      setAuthError(
        err?.message ||
          'Proses masuk Google dibatalkan atau gagal. Silakan coba lagi.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setNeedsAuth(true);
  };

  const handlePatchInput = (patch: Partial<ClientDiagnosticInput>) => {
    setDiagnosticInput((prev) => ({ ...prev, ...patch }));
  };

  const toneProfile = useMemo(
    () =>
      resolveColorToneProfile(
        diagnosticInput.undertone,
        diagnosticInput.depth,
        diagnosticInput.contrast
      ),
    [diagnosticInput.undertone, diagnosticInput.depth, diagnosticInput.contrast]
  );

  const lipCare = useMemo(
    () => buildLipCarePrescription(diagnosticInput),
    [diagnosticInput]
  );

  const navItems: { id: WorkspaceTab; label: string }[] = [
    { id: 'studio', label: 'Studio Warna' },
    { id: 'apothecary', label: 'Apotek Bibir' },
    { id: 'forms', label: 'Formulir Klien' },
    { id: 'slides', label: 'Dek Konsultasi' },
  ];

  const isAuthenticated = !needsAuth && user !== null;

  return (
    <div className="min-h-screen bg-white text-[#3D2230]">
      {/* Strictly 3-zone Top Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-[#F3B0C8] bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-8 px-6 py-3.5">
          {/* Zone 1: Single text element bubbly wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className="font-bubble text-left text-2xl font-bold tracking-tight text-[#C83E72] whitespace-nowrap shrink-0"
          >
            GlossyChuu!
          </button>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden items-center gap-7 md:flex"
          >
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`border-b-2 py-1 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-[#C83E72] text-[#9E2656]'
                      : 'border-transparent text-[#75485D] hover:text-[#3D2230]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="shrink-0">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setActiveTab('slides')}
                className="min-h-[40px] rounded-full bg-[#C83E72] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B02E60] whitespace-nowrap shrink-0"
              >
                Ekspor Slides
              </button>
            ) : (
              <GoogleSignInButton onClick={handleLogin} disabled={isLoggingIn} />
            )}
          </div>
        </div>

        {/* Mobile Tab Strip (visible < md) */}
        <div className="flex items-center gap-4 overflow-x-auto border-t border-[#FCE4EE] px-6 py-2 md:hidden">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`py-1 text-xs font-semibold whitespace-nowrap shrink-0 ${
                  active
                    ? 'text-[#9E2656] underline underline-offset-4'
                    : 'text-[#75485D]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Minimal Authenticated Account Bar (shown only when connected) */}
      {isAuthenticated && user && (
        <div className="border-b border-[#FCE4EE] bg-[#FFF8FB]">
          <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-3 px-6 py-2 text-xs text-[#75485D]">
            <span>
              Terhubung ke Google Workspace sebagai{' '}
              <strong className="font-semibold text-[#3D2230]">
                {user.displayName || user.email}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#75485D] hover:text-[#9E2656] whitespace-nowrap"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}

      {authError && (
        <div className="mx-auto mt-4 max-w-[1160px] px-6">
          <div
            role="alert"
            className="rounded-2xl border border-[#C83E72]/35 bg-[#FDECF2] px-4 py-3 text-xs font-semibold text-[#9E2656]"
          >
            {authError}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-[1160px] px-6 py-8 sm:py-10">
        {activeTab === 'studio' && (
          <ColorStudioView
            input={diagnosticInput}
            toneProfile={toneProfile}
            hasCompletedAnalysis={hasCompletedAnalysis}
            onCompleteAnalysis={() => setHasCompletedAnalysis(true)}
            onResetAnalysis={() => setHasCompletedAnalysis(false)}
            onChangeInput={handlePatchInput}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'apothecary' && (
          <LipApothecaryView
            input={diagnosticInput}
            lipCare={lipCare}
            onChangeInput={handlePatchInput}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'forms' && (
          <GoogleFormsView
            isAuthenticated={isAuthenticated}
            isLoggingIn={isLoggingIn}
            onLogin={handleLogin}
            onAuthExpired={() => setNeedsAuth(true)}
            diagnosticInput={diagnosticInput}
            onApplyClientProfile={(next) => {
              setDiagnosticInput(next);
              setHasCompletedAnalysis(true);
            }}
            onNavigateToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'slides' && (
          <GoogleSlidesView
            isAuthenticated={isAuthenticated}
            isLoggingIn={isLoggingIn}
            onLogin={handleLogin}
            onAuthExpired={() => setNeedsAuth(true)}
            input={diagnosticInput}
            toneProfile={toneProfile}
            lipCare={lipCare}
          />
        )}
      </main>

      {/* Soft Cotton-Candy Pink Footer matching visual reference */}
      <footer className="mt-16 border-t border-[#F3B0C8] bg-[#FBD8E5]">
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-8 px-6 py-10 text-xs text-[#5C3648] sm:grid-cols-3">
          <div>
            <p className="font-bubble text-2xl font-bold text-[#3D2230]">
              GlossyChuu!
            </p>
            <p className="mt-2 leading-relaxed">
              Natural Lip Care &amp; Personal Color Consultant — membantu Anda
              menemukan harmoni warna personal dan pilihan warna lip balm alami.
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#3D2230]">Navigasi Studio</p>
            <ul className="mt-2.5 space-y-1.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#9E2656] hover:underline"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-[#3D2230]">Google Workspace</p>
            <p className="mt-2.5 leading-relaxed">
              Terhubung dengan Google Forms untuk kuesioner klien dan Google
              Slides untuk ekspor hasil konsultasi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
