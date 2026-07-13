import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para usar en el navegador (Client Components).
 * Usa la URL pública y la clave anónima (seguras para exponer).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
