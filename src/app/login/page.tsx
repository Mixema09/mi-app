import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const { redirectTo } = await searchParams;

  return (
    <AuthShell
      title="Bienvenida de nuevo"
      subtitle="Inicia sesión para continuar tu ruta."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-medium underline">
            Regístrate
          </Link>
        </>
      }
    >
      <LoginForm redirectTo={redirectTo ?? "/dashboard"} />
      <p className="mt-4 text-center text-sm">
        <Link
          href="/recuperar-password"
          className="text-gray-500 underline dark:text-gray-400"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </AuthShell>
  );
}
