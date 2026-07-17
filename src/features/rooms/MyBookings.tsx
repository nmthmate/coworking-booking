import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMyBookings, useCancelBooking } from '../../hooks/useBookings';
import { useRooms } from '../../hooks/useRooms';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Skeleton } from '../../components/Skeleton';
import type { Booking } from '../../types';

function formatBooking(booking: Booking, roomName: string) {
  const date = new Date(booking.date + 'T00:00:00').toLocaleDateString('hu-HU');
  return `${roomName} — ${date}, ${booking.hour}:00`;
}

export function MyBookings() {
  const { user } = useAuth();
  const { data: bookings, isLoading } = useMyBookings(user?.uid);
  const { data: rooms } = useRooms();
  const cancelBooking = useCancelBooking();
  const [pendingCancel, setPendingCancel] = useState<Booking | null>(null);

  const roomNameById = new Map(rooms?.map((r) => [r.id, r.name]));

  const sorted = [...(bookings ?? [])].sort((a, b) =>
    a.date === b.date ? a.hour - b.hour : a.date.localeCompare(b.date),
  );

  return (
    <div className="mb-6">
      <h2 className="font-medium mb-2">Saját foglalásaim</h2>
      {isLoading ? (
        <div className="grid gap-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-3 bg-white flex justify-between items-center"
            >
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-2xl mb-1">🗓️</p>
          <p className="text-sm text-gray-500">Nincs foglalásod.</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {sorted.map((booking) => {
            const roomName = roomNameById.get(booking.roomId) ?? 'Ismeretlen terem';
            return (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-3 bg-white text-gray-900 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-sm">{roomName}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.date + 'T00:00:00').toLocaleDateString('hu-HU')}, {booking.hour}:00
                  </p>
                  {booking.subject && <p className="text-sm text-gray-500 italic">{booking.subject}</p>}
                </div>
                <button
                  onClick={() => setPendingCancel(booking)}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-red-600 hover:bg-red-50"
                >
                  Lemondás
                </button>
              </div>
            );
          })}
        </div>
      )}
      {pendingCancel && (
        <ConfirmDialog
          title="Foglalás lemondása"
          description={formatBooking(
            pendingCancel,
            roomNameById.get(pendingCancel.roomId) ?? 'Ismeretlen terem',
          )}
          confirmLabel="Lemondás"
          variant="danger"
          onCancel={() => setPendingCancel(null)}
          onConfirm={() => {
            cancelBooking.mutate(pendingCancel);
            setPendingCancel(null);
          }}
        />
      )}
    </div>
  );
}
