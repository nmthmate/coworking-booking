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
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'cancelled';
}
