export interface AuthLoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  username: string;
  message: string;
  jwt: string;
  status: boolean;
  roles: string[];  // Make roles required
}
