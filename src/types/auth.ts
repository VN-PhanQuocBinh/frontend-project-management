export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userData: {
    id: string;
    username: string;
    email: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  login: (user: User, token: string | null) => void;
  logout: () => void;
  register: (user: User, token: string | null) => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;
