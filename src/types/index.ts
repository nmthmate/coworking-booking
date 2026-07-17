export interface Room {
  id: string;
  name: string;
  capacity: number;
  description?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD
  hour: number; // 8-18
  status: 'confirmed' | 'cancelled';
}
