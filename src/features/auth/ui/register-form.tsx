"use client"

// features/auth/ui/register-form.tsx
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Input } from "@/shared/ui";
import { useRegister } from "../hooks/use-register";
import type { RegisterRequest } from "../model/types";

const INITIAL_FORM: RegisterRequest = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  cuit: "",
  phone: "",
};

export function RegisterForm() {
  const { isLoading, error, submitRegistration } = useRegister();
  const [form, setForm] = useState<RegisterRequest>(INITIAL_FORM);

  function handleChange(field: keyof RegisterRequest, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submitRegistration(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre"
        name="firstName"
        required
        value={form.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
      />
      <Input
        label="Apellido"
        name="lastName"
        required
        value={form.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
      />
      <Input
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <Input
        label="Contrasena"
        type="password"
        name="password"
        autoComplete="new-password"
        required
        minLength={8}
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="CUIT (opcional)"
          name="cuit"
          value={form.cuit}
          onChange={(e) => handleChange("cuit", e.target.value)}
        />
        <Input
          label="Telefono (opcional)"
          name="phone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
        Crear cuenta
      </Button>
      <p className="text-center text-sm text-rufo-text-muted">
        Ya tenes cuenta?{" "}
        <Link href="/login" className="font-medium text-rufo-primary hover:underline">
          Inicia sesion
        </Link>
      </p>
    </form>
  );
}
