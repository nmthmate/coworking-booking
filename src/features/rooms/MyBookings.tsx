import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMyBookings, useCancelBooking } from '../../hooks/useBookings';
import { useRooms } from '../../hooks/useRooms';
import { ConfirmDialog } from '../../components/ConfirmDialog';
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
        <p className="text-sm text-gray-500">Betöltés...</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-gray-500">Nincs foglalásod.</p>
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
