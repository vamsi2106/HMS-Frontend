// Auth Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  contact_number: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Room Types
export interface Room {
  id: number;
  room_number: string;
  room_type: string;
  price: number;
  capacity: number;
  amenities: string;
  status: 'available' | 'occupied' | 'maintenance';
  image_url?: string;
}

// Reservation Types
export interface Reservation {
  id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'completed';
  created_at: string;
  room_number?: string;
  user_name?: string;
  user_phone?: string;
}

// Payment Types
export interface Payment {
  reservation_id: number;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: 'pending' | 'completed' | 'refunded';
  created_at: string;
}