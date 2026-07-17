import { useState } from 'react';
import { useBookings, useCreateBooking } from '../../hooks/useBookings';
import { BookingDialog } from './BookingDialog';
import { BookingInfoDialog } from './BookingInfoDialog';
import { Skeleton } from '../../components/Skeleton';
import type { Booking, Room } from '../../types';

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
  const [pendingHour, setPendingHour] = useState<number | null>(null);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const { data: bookings, isLoading } = useBookings(room.id, date);
  const createBooking = useCreateBooking();

  const bookingByHour = new Map(bookings?.map((b) => [b.hour, b]));
  const isToday = date === today;
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('hu-HU');

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
            className="text-sm underline text-indigo-600 hover:text-indigo-700"
          >
            Ma
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {HOURS.map((hour) => (
            <Skeleton key={hour} className="h-10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {HOURS.map((hour) => {
            const booking = bookingByHour.get(hour);
            const isBooked = !!booking;
            return (
              <button
                key={hour}
                disabled={createBooking.isPending}
                onClick={() => (isBooked ? setViewingBooking(booking) : setPendingHour(hour))}
                className={
                  isBooked
                    ? 'border border-gray-200 rounded px-2 py-2 text-sm bg-gray-100 text-gray-500 hover:bg-gray-200'
                    : 'border border-gray-300 rounded px-2 py-2 text-sm bg-white text-gray-900 hover:bg-indigo-50 hover:border-indigo-300'
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
        <p className="text-red-600 text-sm mt-2">
          {createBooking.error instanceof Error && createBooking.error.message === 'already-booked'
            ? 'Ezt az időpontot időközben már lefoglalta valaki más.'
            : 'Hiba történt a foglaláskor.'}
        </p>
      )}
      {pendingHour !== null && (
        <BookingDialog
          title="Foglalás megerősítése"
          description={`${room.name} — ${formattedDate}, ${pendingHour}:00`}
          onCancel={() => setPendingHour(null)}
          onConfirm={(subject) => {
            createBooking.mutate({ roomId: room.id, date, hour: pendingHour, subject });
            setPendingHour(null);
          }}
        />
      )}
      {viewingBooking && (
        <BookingInfoDialog
          room={room}
          booking={viewingBooking}
          formattedDate={formattedDate}
          onClose={() => setViewingBooking(null)}
        />
      )}
    </div>
  );
}
