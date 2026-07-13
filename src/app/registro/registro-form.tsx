"use client";

import { useActionState } from "react";
import { registerAction, type AuthState } from "@/lib/actions/auth";
import { Field, SubmitButton, FormAlert } from "@/components/ui/form";

export function RegistroForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    registerAction,
    null,
  );

  return (
    <form action={action}>
      <FormAlert error={state?.error} message={state?.message} />
      <Field
        label="Nombre"
        name="full_name"
        autoComplete="name"
        placeholder="Tu nombre"
        errors={state?.fieldErrors?.full_name}
      />
      <Field
        label="Correo"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="tucorreo@ejemplo.com"
        errors={state?.fieldErrors?.email}
      />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        errors={state?.fieldErrors?.password}
      />
      <SubmitButton pending={pending}>Crear cuenta</SubmitButton>
    </form>
  );
}
