import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { PathCard } from "@/components/app/path-card";
import { requireUser, getProfile } from "@/lib/dal";
import { getOrCreateDiagnosis } from "@/lib/diagnosis-service";
import { primaryAreaLabel } from "@/lib/diagnosis";

export default async function RutaPage() {
  const user = await requireUser();
  const profile = await getProfile();

  if (!profile?.onboarding_completed) redirect("/onboarding");
  if (!profile?.diagnosis_completed) redirect("/diagnostico");

  const bundle = await getOrCreateDiagnosis(user.id);
  if (!bundle?.path) redirect("/dashboard");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <div className="mb-8">
          <span className="text-sm font-medium uppercase tracking-widest text-gray-400">
            Tu ruta personalizada
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {bundle.path.title}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Diseñada para tu foco actual: {primaryAreaLabel(bundle.result)}.
          </p>
        </div>

        <section className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <PathCard path={bundle.path} />
        </section>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/chat"
            className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Hablar con mi coach
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-black/15 px-6 py-3 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}
