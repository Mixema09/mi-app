import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback de Supabase Auth (flujo PKCE). Los correos de confirmación y de
 * recuperación de contraseña redirigen aquí con un `code` que intercambiamos
 * por una sesión, y luego enviamos a la usuaria a `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Enlace inválido o expirado.
  return NextResponse.redirect(
    `${origin}/login?error=enlace_invalido`,
  );
}
