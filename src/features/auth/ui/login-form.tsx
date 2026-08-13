"use client"

// features/auth/ui/login-form.tsx
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Input } from "@/shared/ui";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const { isLoading, error, submitCredentials } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submitCredentials({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Contrasena"
        type="password"
        name="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
        Ingresar
      </Button>
      <p className="text-center text-sm text-rufo-text-muted">
        No tenes cuenta?{" "}
        <Link href="/register" className="font-medium text-rufo-primary hover:underline">
          Registrate
        </Link>
      </p>
    </form>
  );
}
