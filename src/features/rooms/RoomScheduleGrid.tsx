import { useBookings, useCreateBooking } from '../../hooks/useBookings';
import type { Room } from '../../types';

const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i);

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function RoomScheduleGrid({ room }: { room: Room }) {
  const date = todayISO();
  const { data: bookings, isLoading } = useBookings(room.id, date);
  const createBooking = useCreateBooking();

  const bookingByHour = new Map(bookings?.map((b) => [b.hour, b]));

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <h4 className="font-medium mb-2 text-sm text-gray-700">Mai foglalások ({date})</h4>
      {isLoading ? (
        <p className="text-gray-500 text-sm">Betöltés...</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {HOURS.map((hour) => {
            const booking = bookingByHour.get(hour);
            const isBooked = !!booking;
            return (
              <button
                key={hour}
                disabled={isBooked || createBooking.isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  createBooking.mutate({ roomId: room.id, date, hour });
                }}
                className={
                  isBooked
                    ? 'border border-gray-200 rounded px-2 py-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border border-gray-300 rounded px-2 py-2 text-sm bg-white text-gray-900 hover:bg-gray-50'
                }
              >
                {hour}:00
                {isBooked && <span className="block text-xs truncate">{booking.userName}</span>}
              </button>
            );
          })}
        </div>
      )}
      {createBooking.isError && (
        <p className="text-red-600 text-sm mt-2">Hiba történt a foglaláskor.</p>
      )}
    </div>
  );
}
