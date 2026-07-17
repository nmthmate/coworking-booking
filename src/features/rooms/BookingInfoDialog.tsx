import { useEffect } from 'react';
import type { Booking, Room } from '../../types';

interface BookingInfoDialogProps {
  room: Room;
  booking: Booking;
  formattedDate: string;
  onClose: () => void;
}

export function BookingInfoDialog({ room, booking, formattedDate, onClose }: BookingInfoDialogProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-info-title"
    >
      <div
        className="bg-white text-gray-900 rounded-lg shadow-lg max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="booking-info-title" className="font-medium text-lg mb-3">
          Foglalás adatai
        </h3>
        <dl className="text-sm space-y-2 mb-4">
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Terem</dt>
            <dd className="text-gray-900 text-right">{room.name}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Kapacitás</dt>
            <dd className="text-gray-900 text-right">{room.capacity} fő</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Időpont</dt>
            <dd className="text-gray-900 text-right">
              {formattedDate}, {booking.hour}:00
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Tárgy</dt>
            <dd className="text-gray-900 text-right">{booking.subject || '—'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">Foglalta</dt>
            <dd className="text-gray-900 text-right">{booking.userName}</dd>
          </div>
        </dl>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-900 hover:bg-gray-50"
          >
            Bezár
          </button>
        </div>
      </div>
    </div>
  );
}
