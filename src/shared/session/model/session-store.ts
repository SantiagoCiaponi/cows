// shared/session/model/session-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { Session, SessionState } from "./types";

const INITIAL_STATE: Session = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

// vive en shared (no en entities) porque el http-client (shared/api) necesita
// leer el token fuera de React via getState(), y shared no puede importar de entities.
export const getSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      isAuthenticated: false,
      setSession: (session) => set({ ...session, isAuthenticated: !!session.accessToken }),
      clearSession: () => set({ ...INITIAL_STATE, isAuthenticated: false }),
    }),
    {
      name: "rufo-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export const useSession = () =>
  getSessionStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    }))
  );
