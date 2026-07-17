import { useState } from 'react';
import { useBookings, useCreateBooking } from '../../hooks/useBookings';
import type { Room } from '../../types';

const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i);

function toISODate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function todayISO() {
  return toISODate(new Date());
}

function addDays(dateISO: string, days: number) {
  const [y, m, d] = dateISO.split('-').map(Number);
  return toISODate(new Date(y, m - 1, d + days));
}

export function RoomScheduleGrid({ room }: { room: Room }) {
  const today = todayISO();
  const [date, setDate] = useState(today);
  const { data: bookings, isLoading } = useBookings(room.id, date);
  const createBooking = useCreateBooking();

  const bookingByHour = new Map(bookings?.map((b) => [b.hour, b]));
  const isToday = date === today;

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          disabled={isToday}
          onClick={() => setDate((d) => addDays(d, -1))}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ◀
        </button>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900"
        />
        <button
          type="button"
          onClick={() => setDate((d) => addDays(d, 1))}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900"
        >
          ▶
        </button>
        {!isToday && (
          <button
            type="button"
            onClick={() => setDate(today)}
            className="text-sm underline text-gray-600"
          >
            Ma
          </button>
        )}
      </div>
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
                onClick={() => createBooking.mutate({ roomId: room.id, date, hour })}
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
