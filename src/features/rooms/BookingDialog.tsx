import { useEffect, useRef, useState } from 'react';

interface BookingDialogProps {
  title: string;
  description: string;
  onConfirm: (subject: string) => void;
  onCancel: () => void;
}

export function BookingDialog({ title, description, onConfirm, onCancel }: BookingDialogProps) {
  const [subject, setSubject] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const trimmed = subject.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-dialog-title"
    >
      <div
        className="bg-white text-gray-900 rounded-lg shadow-lg max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="booking-dialog-title" className="font-medium text-lg mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <label htmlFor="booking-subject" className="block text-sm text-gray-700 mb-1">
          Tárgy
        </label>
        <input
          ref={inputRef}
          id="booking-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && trimmed) onConfirm(trimmed);
          }}
          placeholder="pl. Csapatmegbeszélés"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-900 hover:bg-gray-50"
          >
            Mégse
          </button>
          <button
            disabled={!trimmed}
            onClick={() => onConfirm(trimmed)}
            className="bg-indigo-600 text-white rounded px-3 py-2 text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Foglalás
          </button>
        </div>
      </div>
    </div>
  );
}
