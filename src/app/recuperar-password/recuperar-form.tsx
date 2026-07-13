"use client";

import { useActionState } from "react";
import {
  requestPasswordResetAction,
  type AuthState,
} from "@/lib/actions/auth";
import { Field, SubmitButton, FormAlert } from "@/components/ui/form";

export function RecuperarForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    requestPasswordResetAction,
    null,
  );

  return (
    <form action={action}>
      <FormAlert error={state?.error} message={state?.message} />
      <Field
        label="Correo"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="tucorreo@ejemplo.com"
        errors={state?.fieldErrors?.email}
      />
      <SubmitButton pending={pending}>Enviar enlace</SubmitButton>
    </form>
  );
}
