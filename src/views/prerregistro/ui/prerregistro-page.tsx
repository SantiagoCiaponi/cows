"use client"

// views/prerregistro/ui/prerregistro-page.tsx
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/shared/session";
import { useCurrentUser } from "@/entities/user";
import { AppHeader } from "@/widgets/app-header";
import { usePrerregistros, serializePrerregistros } from "@/entities/prerregistro";
import { Button, Card, Input } from "@/shared/ui";
import { ClipboardIcon, DownloadIcon, ScanIcon, TrashIcon, UploadIcon } from "./icons";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function PrerregistroPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useSession();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !isAuthenticated || isLoading || !user) {
    return <div className="flex flex-1 items-center justify-center text-sm text-rufo-text-muted">Cargando...</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader user={user} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-4 sm:px-6 sm:py-10">
        <PrerregistroExplorer />
      </main>
    </div>
  );
}

// modulo local: empareja caravana visual con numero de SENASA leido por lector RFID.
// no pega a la api, todo vive en localStorage del navegador.
export function PrerregistroExplorer() {
  const { items, addPair, removePair, clearAll, importFromJson } = usePrerregistros();
  const [caravana, setCaravana] = useState("");
  const [senasa, setSenasa] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [importFeedback, setImportFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [justCopied, setJustCopied] = useState(false);
  const senasaRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = addPair(caravana, senasa);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError(null);
    setCaravana("");
    setSenasa("");
    senasaRef.current?.focus();
  }

  function handleClearAll() {
    if (items.length === 0) return;
    if (!window.confirm(`Vaciar los ${items.length} pares emparejados?`)) return;
    clearAll();
    setImportFeedback(null);
  }

  function handleExport() {
    const blob = new Blob([serializePrerregistros(items)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prerregistro-caravanas-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(serializePrerregistros(items));
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    } catch {
      setImportFeedback({ type: "error", message: "No se pudo copiar al portapapeles." });
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const text = await file.text();
    const result = importFromJson(text);

    if (result.error) {
      setImportFeedback({ type: "error", message: result.error });
      return;
    }

    const parts = [`${result.added} ${result.added === 1 ? "registro importado" : "registros importados"}`];
    if (result.skipped > 0) parts.push(`${result.skipped} omitidos por duplicados o invalidos`);
    setImportFeedback({ type: "success", message: parts.join(", ") + "." });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-rufo-text">Prerregistro de caravanas</h1>
      <p className="mt-1 text-sm text-rufo-text-muted">
        Emparej&aacute; la caravana visual con el numero de SENASA le&iacute;do por el lector. Se guarda en este
        navegador.
      </p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              ref={senasaRef}
              label="Numero de SENASA (lector)"
              name="senasa"
              autoFocus
              autoComplete="off"
              placeholder="Escane&aacute; con el lector"
              value={senasa}
              onChange={(e) => setSenasa(e.target.value)}
            />
            <Input
              label="Numero de caravana"
              name="caravana"
              autoComplete="off"
              placeholder="Ej: 1234"
              value={caravana}
              onChange={(e) => setCaravana(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-xs text-rufo-text-muted">
              <ScanIcon className="h-3.5 w-3.5" />
              Escane&aacute; con el lector, complet&aacute; la caravana y apret&aacute; Enter para agregar el par.
            </p>
            <Button type="submit">Emparejar</Button>
          </div>
        </form>
      </Card>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-rufo-text-muted">
          {items.length} {items.length === 1 ? "par emparejado" : "pares emparejados"}
        </p>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-1.5 text-xs font-medium text-rufo-primary hover:underline"
          >
            <UploadIcon className="h-3.5 w-3.5" />
            Importar JSON
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={items.length === 0}
            className="flex items-center gap-1.5 text-xs font-medium text-rufo-primary hover:underline disabled:cursor-not-allowed disabled:text-rufo-text-muted disabled:no-underline"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            Exportar JSON
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={items.length === 0}
            className="flex items-center gap-1.5 text-xs font-medium text-rufo-primary hover:underline disabled:cursor-not-allowed disabled:text-rufo-text-muted disabled:no-underline"
          >
            <ClipboardIcon className="h-3.5 w-3.5" />
            {justCopied ? "Copiado" : "Copiar JSON"}
          </button>
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-medium text-red-500 hover:underline"
            >
              Vaciar lista
            </button>
          )}
        </div>
      </div>

      {importFeedback && (
        <p className={`mt-2 text-xs ${importFeedback.type === "error" ? "text-red-500" : "text-rufo-text-muted"}`}>
          {importFeedback.message}
        </p>
      )}

      {items.length === 0 ? (
        <Card className="mt-3 !p-0">
          <p className="px-4 py-6 text-center text-sm text-rufo-text-muted">Todav&iacute;a no emparejaste ninguna caravana.</p>
        </Card>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-rufo-border-device bg-rufo-surface px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-6">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-rufo-text-muted">SENASA</p>
                  <p className="text-sm font-semibold text-rufo-text">{item.senasa}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-rufo-text-muted">Caravana</p>
                  <p className="text-sm font-semibold text-rufo-text">{item.caravana}</p>
                </div>
                <p className="text-xs text-rufo-text-muted">{formatTime(item.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => removePair(item.id)}
                className="rounded-lg p-2 text-rufo-text-muted hover:bg-rufo-border/40 hover:text-red-500"
                aria-label={`Eliminar par ${item.caravana}`}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
