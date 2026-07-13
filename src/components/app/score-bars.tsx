import { DIMENSIONS, type DimensionId } from "@/lib/diagnosis";

/** Barras horizontales de puntaje (0..100) por dimensión de bienestar. */
export function ScoreBars({
  scores,
  primaryArea,
}: {
  scores: Record<string, number>;
  primaryArea?: string | null;
}) {
  return (
    <ul className="space-y-4">
      {DIMENSIONS.map((dim) => {
        const value = scores[dim.id] ?? 0;
        const isPrimary = dim.id === (primaryArea as DimensionId);
        return (
          <li key={dim.id}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className={isPrimary ? "font-semibold" : ""}>
                {dim.label}
                {isPrimary && (
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    foco
                  </span>
                )}
              </span>
              <span className="tabular-nums text-gray-500 dark:text-gray-400">
                {value}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div
                className={`h-full rounded-full ${
                  isPrimary
                    ? "bg-amber-500"
                    : "bg-neutral-900 dark:bg-white"
                }`}
                style={{ width: `${value}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
