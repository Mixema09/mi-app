import type { ReactNode } from "react";

const inputClass =
  "mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50";

/** Campo de texto etiquetado con error opcional. */
export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
  placeholder,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  placeholder?: string;
  errors?: string[];
}) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputClass}
      />
      {errors?.map((e) => (
        <p key={e} className="mt-1 text-xs text-red-600 dark:text-red-400">
          {e}
        </p>
      ))}
    </div>
  );
}

/** Botón de envío que se deshabilita mientras la acción está pendiente. */
export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      {pending ? "Un momento…" : children}
    </button>
  );
}

/** Muestra un mensaje de éxito o error de una acción. */
export function FormAlert({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) {
  if (error) {
    return (
      <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
        {error}
      </p>
    );
  }
  if (message) {
    return (
      <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
        {message}
      </p>
    );
  }
  return null;
}
