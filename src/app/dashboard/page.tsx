import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { ScoreBars } from "@/components/app/score-bars";
import { PathCard } from "@/components/app/path-card";
import { requireUser, getProfile } from "@/lib/dal";
import { getOrCreateDiagnosis } from "@/lib/diagnosis-service";
import { primaryAreaLabel } from "@/lib/diagnosis";

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await getProfile();

  // Enrutamiento por progreso: cada etapa lleva a la siguiente.
  if (!profile?.onboarding_completed) redirect("/onboarding");
  if (!profile?.diagnosis_completed) redirect("/diagnostico");

  const bundle = await getOrCreateDiagnosis(user.id);
  if (!bundle) redirect("/onboarding");
  const { result, path } = bundle;

  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            {firstName ? `Hola, ${firstName}` : "Tu espacio"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tu foco de trabajo ahora es{" "}
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {primaryAreaLabel(result)}
            </span>
            .
          </p>
        </div>

        {/* Acceso al chat con IA */}
        <Link
          href="/chat"
          className="mb-6 flex items-center justify-between rounded-2xl border border-black/10 p-5 transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
        >
          <div>
            <h2 className="text-base font-semibold">Habla con tu coach IA</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Acompañamiento personalizado según tu diagnóstico.
            </p>
          </div>
          <span aria-hidden className="text-xl">
            →
          </span>
        </Link>

        {path && (
          <section className="mb-6 rounded-2xl border border-black/10 p-6 dark:border-white/10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Tu ruta personalizada
              </h2>
              <Link
                href="/ruta"
                className="text-sm text-gray-500 underline dark:text-gray-400"
              >
                Ver ruta
              </Link>
            </div>
            <PathCard path={path} />
          </section>
        )}

        <section className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Tus áreas de bienestar
            </h2>
            <Link
              href="/diagnostico"
              className="text-sm text-gray-500 underline dark:text-gray-400"
            >
              Ver diagnóstico
            </Link>
          </div>
          <ScoreBars scores={result.scores} primaryArea={result.primary_area} />
        </section>
      </div>
    </div>
  );
}
