export interface EventDraft {
  title: string;
  city: string;
  venue: string;
  dateTimeInput: string;
  price: number;
  totalSeats: number;
}

export interface SeatSnapshot {
  beforeBooking: number;
  afterBooking: number;
}