import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, deleteDoc, doc, runTransaction } from 'firebase/firestore';
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

async function fetchMyBookings(userId: string): Promise<Booking[]> {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Booking[];
}

export function useMyBookings(userId: string | undefined) {
  return useQuery({
    queryKey: ['myBookings', userId],
    queryFn: () => fetchMyBookings(userId!),
    enabled: !!userId,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      date,
      hour,
      subject,
    }: {
      roomId: string;
      date: string;
      hour: number;
      subject: string;
    }) => {
      const user = auth.currentUser;
      if (!user) throw new Error('Nincs bejelentkezve.');

      // Deterministic ID turns "is this slot free?" into an atomic
      // create-if-absent via the transaction below, closing the race
      // where two users book the same slot at the same time.
      const bookingRef = doc(db, 'bookings', `${roomId}_${date}_${hour}`);

      await runTransaction(db, async (transaction) => {
        const existing = await transaction.get(bookingRef);
        if (existing.exists()) {
          throw new Error('already-booked');
        }
        transaction.set(bookingRef, {
          roomId,
          date,
          hour,
          subject,
          userId: user.uid,
          userName: user.email ?? 'Ismeretlen',
          status: 'confirmed',
        });
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.roomId, variables.date] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
    onError: (_error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.roomId, variables.date] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: Booking) => {
      await deleteDoc(doc(db, 'bookings', booking.id));
    },
    onSuccess: (_data, booking) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', booking.roomId, booking.date] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
}
