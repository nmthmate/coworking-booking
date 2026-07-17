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
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white text-gray-900 rounded-lg shadow-lg max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
        <div className="flex justify-end gap-2">
          <button
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
