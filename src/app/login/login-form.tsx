"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { Field, SubmitButton, FormAlert } from "@/components/ui/form";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    loginAction,
    null,
  );

  return (
    <form action={action}>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <FormAlert error={state?.error} message={state?.message} />
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
        autoComplete="current-password"
        errors={state?.fieldErrors?.password}
      />
      <SubmitButton pending={pending}>Iniciar sesión</SubmitButton>
    </form>
  );
}
