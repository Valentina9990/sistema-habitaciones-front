import { User } from './user';

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}
