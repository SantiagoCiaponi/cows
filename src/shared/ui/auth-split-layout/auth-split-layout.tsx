// shared/ui/auth-split-layout/auth-split-layout.tsx
import Image from "next/image";
import type { ReactNode } from "react";

interface Props {
  title?: string;
  subtitle: string;
  children: ReactNode;
  formClassName?: string;
}

const WAVES_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='240'%3E%3Cpath d='M-40 40 Q 20 0 80 40 T 200 40 T 320 40 T 440 40 T 560 40' fill='none' stroke='%2320402c' stroke-opacity='0.05' stroke-width='1.5'/%3E%3Cpath d='M-40 120 Q 20 80 80 120 T 200 120 T 320 120 T 440 120 T 560 120' fill='none' stroke='%2320402c' stroke-opacity='0.04' stroke-width='1.5'/%3E%3Cpath d='M-40 200 Q 20 160 80 200 T 200 200 T 320 200 T 440 200 T 560 200' fill='none' stroke='%2320402c' stroke-opacity='0.05' stroke-width='1.5'/%3E%3C/svg%3E\")";

export function AuthSplitLayout({ title, subtitle, children, formClassName = "max-w-sm" }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#16231a] p-3 sm:p-6 lg:items-stretch lg:justify-start lg:bg-transparent lg:p-0">
      <div className="relative flex w-full max-w-md flex-col gap-10 overflow-hidden rounded-3xl bg-rufo-background px-4 py-8 shadow-xl sm:px-8 sm:py-10 lg:max-w-none lg:w-[30%] lg:justify-between lg:gap-0 lg:rounded-none lg:px-12 lg:shadow-none">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ backgroundImage: WAVES_BG, backgroundRepeat: "repeat" }}
          aria-hidden
        />

        <div className="hidden lg:block" />

        <div className={`mx-auto flex w-full flex-col gap-8 ${formClassName}`}>
          <div>
            <Image src="/logo.png" alt="Rufo" width={1973} height={725} className="h-9 w-auto" priority />
            {title && <h1 className="mt-4 text-2xl font-bold text-rufo-text">{title}</h1>}
            <p className="mt-1 text-sm text-rufo-text-muted">{subtitle}</p>
          </div>
          {children}
        </div>

        <p className="text-xs font-medium tracking-wide text-rufo-text-muted">
          CST SERVICIOS TECNOLOGICOS
        </p>
      </div>

      <div className="relative hidden lg:block lg:w-[70%]">
        <Image
          src="/IMG_20200506_104104.jpg"
          alt="Campo y ganado"
          fill
          priority
          sizes="70vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-2xl font-semibold">Todo el campo en un solo lugar.</p>
          <p className="mt-1 text-sm text-white/85">Rodeo, sanidad, pasturas y faena, al dia.</p>
        </div>
      </div>
    </div>
  );
}
