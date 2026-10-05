export type Role = 'ADMIN' | 'CUSTOMER'
export type MovieStatus = 'UPCOMING' | 'NOW_SHOWING' | 'ENDED'
export type TheatreStatus = 'ACTIVE' | 'INACTIVE'
export type ShowStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type PaymentMethod = 'CARD' | 'CASH' | 'BANK_TRANSFER'
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

export interface User {
  id: number
  fullName: string
  email: string
  role: Role
}

export interface AuthResponse {
  token: string
  email: string
  fullName: string
  role: Role
}

export interface Movie {
  id: number
  title: string
  description: string
  duration: number
  language: string
  genre: string
  releaseDate: string
  status: MovieStatus
}

export interface Theatre {
  id: number
  theatreName: string
  location: string
  capacity: number
  status: TheatreStatus
}

export interface Show {
  id: number
  movieId: number
  theatreId: number
  showDate: string
  showTime: string
  ticketPrice: number
  status: ShowStatus
}

export interface Booking {
  id: number
  userId: number
  showId: number
  seatNumbers: string[]
  numberOfTickets: number
  totalAmount: number
  bookingDate: string
  status: BookingStatus
}

export interface Payment {
  id: number
  bookingId: number
  amount: number
  paymentDate: string | null
  paymentMethod: PaymentMethod
  status: PaymentStatus
}