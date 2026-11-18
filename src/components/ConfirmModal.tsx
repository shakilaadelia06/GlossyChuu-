import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  details?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  details = [],
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, isLoading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D2230]/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="bubble-card w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FDECF2] text-[#C83E72]">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h3
                id="confirm-modal-title"
                className="font-bubble text-2xl font-semibold text-[#3D2230]"
              >
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#75485D]">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            aria-label="Tutup dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#75485D] transition-colors hover:bg-[#FDECF2] hover:text-[#3D2230] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {details.length > 0 && (
          <div className="bubble-speech mt-4 p-3.5 text-xs text-[#5C3648]">
            <ul className="space-y-1.5">
              {details.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="min-h-[40px] rounded-full border border-[#F3B0C8] bg-white px-5 py-2 text-sm font-semibold text-[#3D2230] transition-colors hover:bg-[#FDECF2] focus-visible:outline-2 focus-visible:outline-[#C83E72] disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="min-h-[40px] rounded-full bg-[#C83E72] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#B02E60] focus-visible:outline-2 focus-visible:outline-[#C83E72] disabled:opacity-60 whitespace-nowrap shrink-0"
          >
            {isLoading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
