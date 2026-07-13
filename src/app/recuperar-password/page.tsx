import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RecuperarForm } from "./recuperar-form";

export default function RecuperarPasswordPage() {
  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para crear una nueva."
      footer={
        <Link href="/login" className="font-medium underline">
          Volver a iniciar sesión
        </Link>
      }
    >
      <RecuperarForm />
    </AuthShell>
  );
}
