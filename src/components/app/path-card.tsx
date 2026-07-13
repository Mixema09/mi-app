import type { PersonalizedPath } from "@/lib/database.types";

/** Muestra la ruta personalizada con sus pasos. */
export function PathCard({ path }: { path: PersonalizedPath }) {
  return (
    <div>
      <h3 className="text-base font-semibold">{path.title}</h3>
      <ol className="mt-4 space-y-3">
        {path.steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white dark:bg-white dark:text-neutral-900">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
