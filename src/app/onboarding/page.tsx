import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { requireUser, getProfile } from "@/lib/dal";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  await requireUser();
  const profile = await getProfile();

  // Si ya completó todo el flujo, la mandamos a su espacio.
  if (profile?.onboarding_completed && profile?.diagnosis_completed) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader />
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Cuéntanos sobre ti
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Responde con sinceridad. No hay respuestas correctas o incorrectas.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
