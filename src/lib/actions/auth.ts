"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getOrigin } from "@/lib/dal";

export type AuthState = {
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

const emailField = z.string().trim().email({ message: "Correo no válido." });
const passwordField = z
  .string()
  .min(8, { message: "La contraseña debe tener al menos 8 caracteres." });

const RegisterSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, { message: "Ingresa tu nombre." }),
  email: emailField,
  password: passwordField,
});

const LoginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { message: "Ingresa tu contraseña." }),
});

/** Registro con Supabase Auth. Crea la usuaria y (si hay sesión) entra al flujo. */
export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = RegisterSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { full_name, email, password } = parsed.data;
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Si el proyecto NO exige confirmación de correo, ya hay sesión activa.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/onboarding");
  }

  // Si exige confirmación, no hay sesión todavía.
  return {
    message:
      "Te enviamos un correo para confirmar tu cuenta. Ábrelo para continuar.",
  };
}

/** Inicio de sesión con email + contraseña. */
export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

/** Cierre de sesión. */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/** Solicita el correo de recuperación de contraseña. */
export async function requestPasswordResetAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = emailField.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { fieldErrors: { email: parsed.error.flatten().formErrors } };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${origin}/auth/callback?next=/actualizar-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    message:
      "Si el correo existe, te enviamos un enlace para restablecer tu contraseña.",
  };
}

/** Actualiza la contraseña (usuaria ya autenticada por el enlace de recuperación). */
export async function updatePasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = passwordField.safeParse(formData.get("password"));
  if (!parsed.success) {
    return { fieldErrors: { password: parsed.error.flatten().formErrors } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
