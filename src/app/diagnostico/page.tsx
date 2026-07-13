import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { ScoreBars } from "@/components/app/score-bars";
import { PathCard } from "@/components/app/path-card";
import { requireUser } from "@/lib/dal";
import { getOrCreateDiagnosis } from "@/lib/diagnosis-service";
import { primaryAreaLabel } from "@/lib/diagnosis";

export default async function DiagnosticoPage() {
  const user = await requireUser();
  const bundle = await getOrCreateDiagnosis(user.id);

  // Sin respuestas de onboarding todavía.
  if (!bundle) redirect("/onboarding");

  const { result, path } = bundle;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <div className="mb-8 text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-gray-400">
            Tu diagnóstico
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            Tu foco ahora: {primaryAreaLabel(result)}
          </h1>
          {result.summary && (
            <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-gray-600 dark:text-gray-300">
              {result.summary}
            </p>
          )}
        </div>

        <section className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Tus áreas de bienestar
          </h2>
          <ScoreBars scores={result.scores} primaryArea={result.primary_area} />
        </section>

        {path && (
          <section className="mt-6 rounded-2xl border border-black/10 p-6 dark:border-white/10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Tu ruta personalizada
            </h2>
            <PathCard path={path} />
          </section>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard"
            className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Ir a mi espacio
          </Link>
        </div>
      </div>
    </div>
  );
}
