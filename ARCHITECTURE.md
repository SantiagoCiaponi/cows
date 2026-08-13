# Arquitectura y guía de estilo

Este documento describe **cómo** está escrito este proyecto: organización de carpetas, convenciones de nombres, patrones de código y estilos. No documenta reglas de negocio ni funcionalidades — es una guía de forma, pensada para que cualquier feature nueva se escriba de manera consistente con el resto del código.

Stack base: Next.js (App Router) + React + TypeScript, Zustand para estado global, TanStack Query para estado de servidor, Axios como cliente HTTP, Tailwind CSS v4, Vitest + Testing Library para tests.

---

## 1. Feature-Sliced Design (FSD)

El proyecto sigue **FSD** de forma estricta. Todo el código vive en capas dentro de `src/`, ordenadas de más genérica a más específica:

```
src/
  app/          # Next.js App Router: solo rutas, sin lógica
  views/        # páginas completas (composición de widgets/features)
  widgets/      # bloques de UI grandes y autocontenidos, compuestos por varias features/entities
  features/     # una acción/flujo concreto del usuario (login, alta de 2FA, etc.)
  entities/     # conceptos de dominio (usuario, sesión, turno, receta...) y su acceso a datos
  shared/       # código sin conocimiento de negocio: UI genérica, api client, hooks utilitarios
  config/       # configuración de la app (flags, colores, etc.)
```

### Regla de dependencias (import graph)

Cada capa **solo puede importar de capas iguales o inferiores** en la jerarquía:

```
app  →  views  →  widgets  →  features  →  entities  →  shared
```

- `shared` no importa de nada del proyecto (es la base).
- `entities` puede importar `shared`, pero no `features`/`widgets`/`views`.
- `features` puede importar `entities` y `shared`, pero no otras `features` ni `widgets`.
- `widgets` compone `features` + `entities` + `shared`.
- `views` compone `widgets` (y puede usar `features`/`entities` directamente si no amerita un widget).
- `app` solo enruta: importa una `view` y la renderiza. No contiene JSX de negocio ni fetching.

Ejemplo real de una ruta (`app` no hace nada más que esto):

```tsx
// src/app/home/page.tsx
import { HomePage } from "@/views/home";

export default function Home() {
  return <HomePage />;
}
```

### Slices (carpetas por dominio)

Dentro de `entities/`, `features/`, `widgets/` y `views/`, cada carpeta es un **slice** con nombre en kebab-case correspondiente a un concepto (`entities/user`, `features/auth`, `widgets/credential-card`). Cada slice es internamente segmentado por tipo de responsabilidad:

```
<slice>/
  api/      # llamadas HTTP puras (una función = un endpoint)
  hooks/    # hooks de React que orquestan estado + llamadas a api/
  model/    # tipos TS y stores (zustand) del slice
  lib/      # helpers puros (formatters, parsers) sin estado ni React
  ui/       # componentes React del slice
  index.ts  # barrel: única puerta de entrada pública del slice
```

No todos los segmentos existen siempre — solo los que el slice necesita (ej: `entities/practice` no tiene `ui/`).

### Barrel (`index.ts`) como frontera pública

Cada slice expone su API pública a través de un único `index.ts`, con exports nombrados explícitos (no `export *` salvo para tipos):

```ts
// entities/user/index.ts
export { useCurrentUser } from "./hooks/use-current-user";
export { useUpdateContact } from "./hooks/use-update-contact";
export { useUpdateLocation } from "./hooks/use-update-location";
export { UserCard } from "./ui/user-card";
export { fetchUpdatedUserInfo } from "./api/updated-user-info";
export type { UpdatedUserInfoResponse } from "./model/types";
export * from "./model/types";
export { formatBirth, formatDocument, formatFullName, formatInsurance, getCellphone, getSex } from "./lib/formatters";
```

- Otras capas importan **desde el barrel** (`@/entities/user`), no de archivos internos del slice (`@/entities/user/hooks/use-current-user`), salvo casos puntuales de tests o cuando el propio slice se importa a sí mismo.
- El barrel decide qué es público. Si algo no está exportado ahí, se considera implementación interna del slice.

### Alias de imports

`tsconfig.json` define un único alias:

```json
"paths": { "@/*": ["./src/*"] }
```

Todos los imports entre capas usan `@/...` (nunca rutas relativas largas tipo `../../../shared/api`). Dentro del mismo slice sí se usan relativos cortos (`../api/login`, `./types`).

---

## 2. Convenciones de nombres

| Elemento                     | Convención             | Ejemplo                                  |
|-------------------------------|-------------------------|-------------------------------------------|
| Carpetas / archivos            | kebab-case              | `use-current-user.ts`, `credential-card/` |
| Componentes React              | PascalCase (export)     | `export function CredentialCard()`        |
| Hooks                          | `use-` + kebab-case en archivo, `useXxx` en export | `use-login.ts` → `useLogin()` |
| Funciones de API               | verbo + sustantivo, camelCase | `fetchCurrentUser`, `updatePhones`   |
| Tipos / interfaces             | PascalCase              | `AuthResponse`, `SessionUser`             |
| Stores zustand                 | `use` + sustantivo, o `get` + sustantivo + `Store` si se accede fuera de componentes | `getSessionStore` |
| Tests                          | mismo nombre + `.test.ts(x)` dentro de `__tests__/` junto al código | `hooks/__tests__/use-login.test.ts` |

Los archivos suelen empezar con un comentario de una línea indicando su ruta lógica (`// features/auth/hooks/use-login.ts`), útil cuando el archivo se ve aislado (diffs, code review).

---

## 3. Capa `api/` — acceso a datos

Un archivo por endpoint (o por operación lógica), función `async` que:
1. Recibe parámetros tipados.
2. Llama a `httpClient` (instancia Axios compartida de `shared/api`).
3. Devuelve `response.data` ya tipado — **nunca** devuelve el objeto Axios completo.

```ts
// features/auth/api/login.ts
import { httpClient } from "@/shared/api";
import type { LoginRequest, AuthResponse } from "../model/types";

export async function login(data: LoginRequest, captchaToken: string | null): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>("/api/auth/login", {
    ...data,
    ...(captchaToken && { captchaToken }),
  });
  return response.data;
}
```

No hay manejo de errores dentro de `api/`: los errores se dejan propagar y se interpretan en la capa `hooks/` con `parseApiError`.

## 4. Capa `hooks/` — orquestación

Los hooks son el lugar donde vive el estado de UI (loading, error, pasos de un wizard) y la orquestación de una o más llamadas `api/`. Patrón típico:

```ts
export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitCredentials(username: string, password: string) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login({ username, password }, captchaToken);
      // ...lógica de negocio...
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, submitCredentials };
}
```

Reglas:
- Todo `catch` pasa el error por `parseApiError` (de `@/shared/api`) antes de guardarlo en estado — nunca se muestra `error.message` crudo al usuario.
- El hook devuelve un objeto plano con estado + funciones (no clases, no reducers salvo que la complejidad lo justifique).
- Comentarios cortos en español explican el *por qué* de una decisión no obvia (ver sección 7), no el *qué* hace cada línea.
- Cuando hay datos de servidor "cacheables" (no un flujo transaccional como login), se prefiere TanStack Query (`useQuery`/`useMutation`) en vez de `useState` + `useEffect` manual.

## 5. Capa `model/` — tipos y stores

- `model/types.ts`: interfaces y tipos TS del slice. Sin lógica.
- `model/*-store.ts`: stores de Zustand cuando el slice necesita estado global persistente entre componentes (ej. sesión).

Patrón de store Zustand con persistencia:

```ts
export const getSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setSession: (session) => set({ ...session, isAuthenticated: computeAuth(session.accessToken) }),
      clearSession: () => set(INITIAL_STATE),
    }),
    {
      name: "angel-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ /* solo lo serializable */ }),
    }
  )
);

// selector conveniente, evita over-rendering con useShallow
export const useSession = () =>
  getSessionStore(useShallow((state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })));
```

- El store crudo se llama `getXxxStore` (se usa tanto como hook —`getSessionStore(selector)`— como fuera de componentes —`getSessionStore.getState()`—).
- Se exponen selectores/hooks derivados (`useSession`) para el uso normal en componentes, reservando el acceso directo al store para lógica fuera de React (interceptores HTTP, utilidades).

## 6. Capa `lib/`

Funciones puras, sin React, sin efectos: formatters, parsers, helpers de dominio (`formatFullName`, `getSex`). Se testean directo (input → output) sin mocks de React.

## 7. Componentes (`ui/`)

- `"use client"` como primera línea en cualquier componente con estado, eventos o hooks (Next App Router es server-first por defecto).
- Props tipadas con una interfaz `Props` local al archivo (no exportada salvo que otro slice la necesite).
- Componentes pequeños y auxiliares (subcomponentes de presentación) se declaran en el mismo archivo cuando son de uso exclusivo del componente principal:

```tsx
"use client"

import type { ReactNode } from "react"

interface Props {
  certificateImage: string
  footer?: ReactNode
  bare?: boolean
}

function CardImage({ certificateImage }: { certificateImage: string }) {
  return ( /* ... */ )
}

export function CredentialCard({ certificateImage, footer, bare = false }: Props) {
  // ...
}
```

- Handlers de eventos que Next.js expone como Server Actions o que cruzan el límite server/client llevan el sufijo `Action` en el nombre de la prop (`onSubmitAction`, `onGoToRegisterAction`), convención heredada de las reglas de Next para distinguir props-función serializables.
- Las vistas (`views/`) orquestan features vía composición condicional simple (ternarios/`switch` sobre un "step" de estado), no máquinas de estados externas salvo que la complejidad lo amerite.

## 8. Manejo de errores

Único punto de traducción de errores de API: `shared/api/api-error.ts`.

```ts
export interface ApiError { message: string; status: number; code?: string; }

const MAPPED_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "Credenciales invalidas. Revise los datos e intente nuevamente.",
  // ...
};

export const parseApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    // mapea código de negocio -> mensaje amigable, con fallback al mensaje crudo del back
  }
  if (error instanceof Error) return { message: error.message, status: 0 };
  return { message: "Error desconocido", status: 0 };
};
```

Patrón: mapa de `code` del backend → mensaje amigable en español, con fallback en cascada (código conocido → texto conocido → mensaje crudo → mensaje genérico). Todo hook que llama `api/` pasa el error por esta función antes de guardarlo en estado de UI.

## 9. Cliente HTTP (`shared/api/http-client.ts`)

Instancia única de Axios (`httpClient`) con interceptores:

- **Request**: adjunta `Authorization: Bearer <token>` leyendo el token directo del store de sesión (`getSessionStore.getState()`), sin pasar por React.
- **Response**: en 401, encola requests concurrentes, dispara un único refresh de token (usando una instancia Axios *separada*, sin interceptores, para evitar loops infinitos si el refresh también falla), reintenta la request original y, si el refresh falla, limpia la sesión y redirige a `/login`.

Comentarios explican decisiones de concurrencia (`// si ya hay un refresh en curso, encolar esta request...`) — este es el estilo esperado de comentario: explica una decisión no obvia, no describe la línea siguiente.

## 10. Tests

- Vitest + Testing Library. Un archivo de test por hook/componente, en `__tests__/` junto al código que testea (no en una carpeta `tests/` centralizada).
- `src/test/setup.ts` centraliza mocks globales necesarios en jsdom (ej: `window.grecaptcha`).
- Patrón de test de hooks:
  - Mocks de módulos externos (`next/navigation`, stores, funciones `api/`) con `vi.mock`, usando `vi.hoisted` para closures que el mock necesita.
  - Casos numerados con comentario corto (`// 1 test. verificar estado inicial del hook`) describiendo la intención.
  - `renderHook` + `act` de Testing Library; se testea el objeto devuelto por el hook, no implementación interna.
  - Se cubre: estado inicial, camino feliz, caminos alternativos (ramas de negocio), manejo de error, y transiciones de "vuelta atrás".

```ts
describe("useLogin", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("inicia en step=credentials con isLoading=false y error=null", () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.step).toBe("credentials");
  });
  // ...
});
```

- `npm run test:run` genera reporte JUnit en `reports/junit/`; `npm run test:coverage` corre con cobertura (`@vitest/coverage-v8`).

## 11. Estilos (Tailwind CSS v4)

- Tailwind v4 con configuración **inline en CSS** (`@theme inline`), no `tailwind.config.js` clásico. Las variables de color se definen como custom properties en `:root` y se mapean a tokens de Tailwind:

```css
@import "tailwindcss";

:root {
  --angel-darkblue: #152e45;
  --angel-blue: #284158;
  --angel-accent: #4785b0;
}

@theme inline {
  --color-angel-darkblue: var(--angel-darkblue);
  --color-angel-blue: var(--angel-blue);
  --color-angel-accent: var(--angel-accent);
}
```

- Los colores de marca **no están hardcodeados en CSS**: se inyectan en runtime desde `config/theme.config.ts` vía un `<style>` inline en `app/layout.tsx` (`dangerouslySetInnerHTML`), permitiendo cambiar la paleta por configuración sin tocar CSS.
- Clases utilitarias custom (no Tailwind puro) se declaran en `globals.css` cuando representan un efecto reutilizable transversal (glassmorphism, animaciones de entrada/salida de modales): `.glass-min`, `.glass-item`, `.animate-modal-enter`, etc. Se agrupan por bloque con un comentario de sección (`/* Crystal Glass */`).
- Animaciones: se prefieren `@keyframes` + clase utilitaria (`animate-*`) por sobre librerías externas, con duraciones cortas (180–350ms) y `cubic-bezier` para modales.
- Tipografía responsiva vía `clamp()` en el `html` para pantallas grandes, en vez de breakpoints múltiples.
- Componentes usan casi exclusivamente clases de Tailwind inline (`className="relative w-full rounded-xl overflow-hidden"`); `style={{}}` inline se reserva para valores dinámicos/calculados que Tailwind no puede expresar (ej: `aspectRatio`, `containerType`).

## 12. Configuración centralizada (`config/`)

Toda decisión "activable/desactivable" o dependiente del cliente/deploy vive en `config/theme.config.ts`, como un único objeto `as const` con secciones comentadas: colores, visibilidad de secciones del menú, feature flags (2FA, captcha).

```ts
const appConfig = {
  colors: { /* ... */ },
  sections: { home: true, appointments: true /* ... */ },
  twoFactor: { enabled: true, mandatory: false },
  captcha: { enabled: true, siteKey: "" },
} as const;

export type AppConfig = typeof appConfig;
export default appConfig;
```

Patrón de **kill-switch**: flags booleanos que, si el backend exige una funcionalidad que el frontend tiene apagada por config, cortan el flujo con un error explícito en vez de fallar silenciosamente o simular un estado que no es real (ver comentario en `useLogin` sobre `twoFactor.enabled`).

## 13. Estilo de comentarios

- Idioma: español, informal, sin tildes en muchos casos (consistente con el resto del código, no es un error a corregir).
- Se comenta el **por qué**, no el qué: decisiones de concurrencia, trade-offs, casos borde no obvios a partir del código.
- Comentarios de sección con `// -----` para delimitar bloques dentro de un archivo largo (ver `http-client.ts`, `theme.config.ts`).
- No hay JSDoc extenso en funciones; como mucho una línea arriba del bloque.

## 14. Resumen — checklist al agregar algo nuevo

1. ¿A qué capa pertenece? (`shared` si no sabe nada del dominio; `entities` si es un concepto de datos; `features` si es una acción de usuario; `widgets`/`views` si compone varias features).
2. Crear el slice en kebab-case con solo los segmentos (`api/`, `hooks/`, `model/`, `lib/`, `ui/`) que necesite.
3. Exponer lo público únicamente a través de `index.ts`.
4. Importar siempre con alias `@/...` entre capas.
5. `api/` = fetch tipado y nada más. `hooks/` = estado + orquestación + `parseApiError`. `lib/` = funciones puras. `ui/` = componentes con `"use client"` si tienen interactividad.
6. Agregar test en `__tests__/` junto al hook/componente, cubriendo estado inicial, camino feliz y errores.
7. Estilos con clases Tailwind; si hace falta un efecto reutilizable nuevo, agregarlo a `globals.css` como clase utilitaria con comentario de sección.
8. Si algo debe poder prenderse/apagarse por cliente, va a `config/theme.config.ts`, no hardcodeado.
