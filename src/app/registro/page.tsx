import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegistroForm } from "./registro-form";

export default function RegistroPage() {
  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Empieza tu proceso de autoconocimiento."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <RegistroForm />
    </AuthShell>
  );
}
