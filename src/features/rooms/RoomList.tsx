import { useRooms } from '../../hooks/useRooms';

export function RoomList() {
  const { data: rooms, isLoading, error } = useRooms();

  if (isLoading) return <p className="mt-6 text-gray-500">Termek betöltése...</p>;
  if (error) return <p className="mt-6 text-red-600">Hiba történt a termek betöltésekor.</p>;

  return (
    <div className="grid gap-3 mt-6">
      {rooms?.map((room) => (
        <div key={room.id} className="border border-gray-200 rounded-lg p-4 bg-white text-gray-900">
          <h3 className="font-medium">{room.name}</h3>
          <p className="text-sm text-gray-600">{room.description}</p>
          <p className="text-sm text-gray-600">Kapacitás: {room.capacity} fő</p>
        </div>
      ))}
    </div>
  );
}
