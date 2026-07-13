import { AuthShell } from "@/components/auth/auth-shell";
import { ActualizarForm } from "./actualizar-form";

export default function ActualizarPasswordPage() {
  return (
    <AuthShell
      title="Nueva contraseña"
      subtitle="Elige una contraseña segura para tu cuenta."
    >
      <ActualizarForm />
    </AuthShell>
  );
}
