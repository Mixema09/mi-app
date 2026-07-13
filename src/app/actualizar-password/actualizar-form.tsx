"use client";

import { useActionState } from "react";
import { updatePasswordAction, type AuthState } from "@/lib/actions/auth";
import { Field, SubmitButton, FormAlert } from "@/components/ui/form";

export function ActualizarForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    updatePasswordAction,
    null,
  );

  return (
    <form action={action}>
      <FormAlert error={state?.error} message={state?.message} />
      <Field
        label="Nueva contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        errors={state?.fieldErrors?.password}
      />
      <SubmitButton pending={pending}>Guardar contraseña</SubmitButton>
    </form>
  );
}
