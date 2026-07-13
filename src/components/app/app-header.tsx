import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { getProfile } from "@/lib/dal";

/** Cabecera para las pantallas autenticadas. */
export async function AppHeader() {
  const profile = await getProfile();
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          mi-app
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {firstName && (
            <span className="text-gray-500 dark:text-gray-400">
              Hola, {firstName}
            </span>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-gray-500 underline hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
