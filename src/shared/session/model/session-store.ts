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
      hasHydrated: false,
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
      // isAuthenticated no esta en partialize (queda afuera del snapshot persistido), asi que
      // sin recalcularlo aca el merge de rehidratacion lo deja en su default (false) aunque
      // accessToken si se restaure. `merge` es una funcion pura (no una funcion que capture
      // `getSessionStore` por closure): la rehidratacion de un sessionStorage vacio corre en
      // forma sincronica dentro del propio create(), antes de que termine de asignarse el
      // export getSessionStore, asi que referenciarlo desde aca (como hace onRehydrateStorage)
      // revienta con un ReferenceError de TDZ y la hidratacion nunca termina (bug del F5).
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<Session> | undefined;
        return {
          ...currentState,
          ...persisted,
          isAuthenticated: !!persisted?.accessToken,
          hasHydrated: true,
        };
      },
    }
  )
);

export const useSession = () =>
  getSessionStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      hasHydrated: state.hasHydrated,
    }))
  );
