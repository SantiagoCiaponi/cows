// shared/session/model/types.ts

export interface SessionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cuit: string | null;
  phone: string | null;
  role: "USER" | "ADMIN";
}

export interface Session {
  user: SessionUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface SessionState extends Session {
  isAuthenticated: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
}
