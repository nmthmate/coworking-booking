import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Igen',
  cancelLabel = 'Mégse',
  variant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="bg-white text-gray-900 rounded-lg shadow-lg max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-dialog-title" className="font-medium text-lg mb-2">
          {title}
        </h3>
        {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
        <div className="flex justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-900 hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={
              variant === 'danger'
                ? 'bg-red-600 text-white rounded px-3 py-2 text-sm hover:bg-red-700'
                : 'bg-indigo-600 text-white rounded px-3 py-2 text-sm hover:bg-indigo-700'
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
