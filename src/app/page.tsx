export default function Home() {
  const supabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          mi-app
        </h1>
        <p className="text-balance text-lg text-gray-500 dark:text-gray-400">
          Aplicación web con Next.js + Supabase
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-black/10 px-5 py-3 dark:border-white/15">
        <span
          className={`h-3 w-3 rounded-full ${
            supabaseConfigured ? "bg-green-500" : "bg-amber-500"
          }`}
          aria-hidden
        />
        <span className="text-sm font-medium">
          {supabaseConfigured
            ? "Supabase configurado correctamente"
            : "Falta configurar las variables de Supabase en .env.local"}
        </span>
      </div>

      <ol className="max-w-md list-inside list-decimal space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <li>
          Rellena <code className="font-mono">.env.local</code> con tus claves
          de Supabase.
        </li>
        <li>
          Edita <code className="font-mono">src/app/page.tsx</code> para
          construir tu interfaz.
        </li>
        <li>
          Usa los helpers de{" "}
          <code className="font-mono">src/lib/supabase/</code> para hablar con
          la base de datos.
        </li>
      </ol>
    </main>
  );
}
