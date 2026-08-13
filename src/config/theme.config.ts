// config/theme.config.ts
// Toda decision activable/desactivable o dependiente del cliente/deploy vive aca.

export interface ModuleNavItem {
  id: string;
  order: number;
  name: string;
  description: string;
  href: string;
  enabled: boolean;
}

const appConfig = {
  colors: {
    primary: "#2f6d4f",
    primaryHover: "#25583f",
    primaryPressed: "#1d4632",
    primaryDark: "#123726",
    primaryDarkHover: "#16412c",
    lightGreen: "#7cd9a4",
    accent: "#e0a44e",
    surface: "#ffffff",
    background: "#e9ece8",
    topbar: "#f2f5f1",
    footer: "#f7faf6",
    text: "#0e1a13",
    textMuted: "#4d5a51",
    iconMuted: "#7b8a7f",
    border: "#c9d3c9",
    divider: "#e3e9e3",
    borderDevice: "#b6c2b7",
    borderDashed: "#c3cec5",
    destructive: "#b04a4a",
    destructiveHoverBg: "#f6e9e9",
    destructiveOnDark: "#f0b4b4",
  },
  // los 8 modulos de negocio se listan siempre en el home (da contexto del producto completo);
  // en el MVP solo el Modulo 1 esta habilitado para navegar, el resto se muestra bloqueado
  modules: [
    {
      id: "campos-rodeos-trazabilidad",
      order: 1,
      name: "Campos, Rodeos y Trazabilidad",
      description: "Alta de campos, rodeos y ficha individual del animal.",
      href: "/campos",
      enabled: true,
    },
    {
      id: "corral-manga",
      order: 2,
      name: "Corral y Manga",
      description: "Operacion en manga, offline-first.",
      href: "/corral-manga",
      enabled: false,
    },
    {
      id: "sanidad-stock-veterinario",
      order: 3,
      name: "Sanidad y Stock Veterinario",
      description: "Planes sanitarios, aplicaciones y stock.",
      href: "/sanidad",
      enabled: false,
    },
    {
      id: "reproduccion-genetica",
      order: 4,
      name: "Reproduccion y Genetica",
      description: "Servicios, prenez y seguimiento genetico.",
      href: "/reproduccion",
      enabled: false,
    },
    {
      id: "nutricion-feedlot",
      order: 5,
      name: "Nutricion y Feedlot",
      description: "Dietas, raciones y engorde a corral.",
      href: "/nutricion",
      enabled: false,
    },
    {
      id: "documentacion-comercial-senasa",
      order: 6,
      name: "Documentacion Comercial y SENASA",
      description: "DTE, guias, romaneos y tramites SENASA.",
      href: "/documentacion",
      enabled: false,
    },
    {
      id: "costos-finanzas-bi",
      order: 7,
      name: "Costos, Finanzas y BI",
      description: "Costeo, resultados y tablero de control.",
      href: "/finanzas",
      enabled: false,
    },
    {
      id: "administracion-sistema",
      order: 8,
      name: "Administracion del Sistema",
      description: "Usuarios, roles y configuracion general.",
      href: "/administracion",
      enabled: false,
    },
  ] satisfies ModuleNavItem[],
} as const;

export type AppConfig = typeof appConfig;
export default appConfig;
