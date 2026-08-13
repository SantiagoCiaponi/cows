import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import appConfig from "@/config/theme.config";
import { QueryProvider } from "@/shared/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rufo — Gestion ganadera",
  description: "Sistema de gestion ganadera integral",
};

// paleta inyectada en runtime desde config/theme.config.ts, sin hardcodear colores en CSS
const themeStyle = `:root {
  --rufo-primary: ${appConfig.colors.primary};
  --rufo-primary-hover: ${appConfig.colors.primaryHover};
  --rufo-primary-pressed: ${appConfig.colors.primaryPressed};
  --rufo-primary-dark: ${appConfig.colors.primaryDark};
  --rufo-primary-dark-hover: ${appConfig.colors.primaryDarkHover};
  --rufo-light-green: ${appConfig.colors.lightGreen};
  --rufo-accent: ${appConfig.colors.accent};
  --rufo-surface: ${appConfig.colors.surface};
  --rufo-background: ${appConfig.colors.background};
  --rufo-topbar: ${appConfig.colors.topbar};
  --rufo-footer: ${appConfig.colors.footer};
  --rufo-border: ${appConfig.colors.border};
  --rufo-divider: ${appConfig.colors.divider};
  --rufo-border-device: ${appConfig.colors.borderDevice};
  --rufo-border-dashed: ${appConfig.colors.borderDashed};
  --rufo-text: ${appConfig.colors.text};
  --rufo-text-muted: ${appConfig.colors.textMuted};
  --rufo-icon-muted: ${appConfig.colors.iconMuted};
  --rufo-destructive: ${appConfig.colors.destructive};
  --rufo-destructive-hover-bg: ${appConfig.colors.destructiveHoverBg};
  --rufo-destructive-on-dark: ${appConfig.colors.destructiveOnDark};
}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
