import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Rutas públicas (accesibles sin sesión). Cualquier otra ruta de la app
 * requiere que la usuaria haya iniciado sesión.
 */
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/registro",
  "/recuperar-password",
  "/actualizar-password",
];

function isPublic(pathname: string) {
  // /auth/* se usa para los callbacks de Supabase (confirmación, reset, etc.)
  if (pathname.startsWith("/auth")) return true;
  return PUBLIC_ROUTES.includes(pathname);
}

/**
 * Refresca la sesión de Supabase en cada request y aplica la protección de
 * rutas. Debe ejecutarse desde `proxy.ts` (antes `middleware.ts` en Next < 16).
 *
 * Es importante devolver SIEMPRE el `supabaseResponse` (o una redirección que
 * copie sus cookies) para no romper el refresco del token.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // NO ejecutar código entre createServerClient y getUser(): evita cierres de
  // sesión aleatorios difíciles de depurar (recomendación de Supabase).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Usuaria sin sesión intentando entrar a una ruta protegida -> login.
  if (!user && !isPublic(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Usuaria con sesión que abre login/registro -> la mandamos al dashboard.
  if (user && (pathname === "/login" || pathname === "/registro")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
