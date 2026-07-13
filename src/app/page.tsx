import Link from "next/link";
import { getUser } from "@/lib/dal";

export default async function Home() {
  const user = await getUser();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 p-8">
      <div className="flex max-w-xl flex-col items-center gap-4 text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
          mi-app
        </span>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Tu espacio para crecer, paso a paso
        </h1>
        <p className="text-balance text-lg text-gray-500 dark:text-gray-400">
          Responde un breve diagnóstico y recibe una ruta personalizada, con el
          acompañamiento de tu coach con IA.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {user ? (
          <Link
            href="/dashboard"
            className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Ir a mi espacio
          </Link>
        ) : (
          <>
            <Link
              href="/registro"
              className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Comenzar ahora
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-black/15 px-6 py-3 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Ya tengo cuenta
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
