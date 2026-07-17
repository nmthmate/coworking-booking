import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import type { Booking } from '../types';

async function fetchBookings(roomId: string, date: string): Promise<Booking[]> {
  const q = query(
    collection(db, 'bookings'),
    where('roomId', '==', roomId),
    where('date', '==', date),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Booking[];
}

export function useBookings(roomId: string, date: string) {
  return useQuery({
    queryKey: ['bookings', roomId, date],
    queryFn: () => fetchBookings(roomId, date),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, date, hour }: { roomId: string; date: string; hour: number }) => {
      const user = auth.currentUser;
      if (!user) throw new Error('Nincs bejelentkezve.');
      await addDoc(collection(db, 'bookings'), {
        roomId,
        date,
        hour,
        userId: user.uid,
        userName: user.email ?? 'Ismeretlen',
        status: 'confirmed',
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.roomId, variables.date] });
    },
  });
}
