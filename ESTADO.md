# Estado del MVP — mi-app

App de coaching para usuarias. Flujo objetivo:
**registro/login → onboarding → diagnóstico → resultado personalizado → pantalla principal → chat IA**

Stack: Next.js 16 (App Router, TypeScript, Tailwind) + Supabase (Auth + Postgres).

> Nota sobre este entorno: es un contenedor remoto cuya política de red **bloquea el acceso directo a `supabase.co`**. Por eso las tablas se crean vía el conector de Supabase (MCP) y las pruebas end-to-end contra Auth en vivo se validan localmente/por build; la verificación por bloque es TypeScript + build.

---

## Progreso por bloques

- [x] **Bloque 1 — Middleware de sesión** ✅
  - `src/lib/supabase/middleware.ts`: `updateSession()` refresca la sesión en cada request y protege rutas.
  - `src/proxy.ts`: en Next 16 `middleware.ts` se llama **`proxy.ts`**. Registrado (build muestra `ƒ Proxy`).
  - Rutas públicas: `/`, `/login`, `/registro`, `/recuperar-password`, `/actualizar-password`, `/auth/*`.
  - Verificado: `tsc --noEmit` ✅ · `next build` ✅

- [x] **Bloque 2 — Tablas reales + RLS** ✅
  - Tablas creadas en Supabase (proyecto estaba pausado → reactivado): `profiles`, `onboarding_responses`, `diagnostic_results`, `personalized_paths`, `chat_conversations`, `chat_messages`.
  - RLS habilitado en las 6 tablas; cada usuaria solo accede a sus filas (`auth.uid()`).
  - Trigger `on_auth_user_created` crea el perfil automáticamente al registrarse.
  - Funciones endurecidas (search_path fijo, EXECUTE revocado). **Advisors de seguridad: 0 hallazgos.**
  - Migraciones versionadas en `supabase/migrations/`. Tipos TS en `src/lib/database.types.ts`, dominio en `src/lib/diagnosis.ts`.

- [ ] **Bloque 3 — Auth (registro, login, logout, recuperación)**
- [ ] **Bloque 4 — Onboarding conectado a Supabase**
- [ ] **Bloque 5 — Diagnóstico + resultado personalizado**
- [ ] **Bloque 6 — Pantalla principal + redirección**
- [ ] **Bloque 7 — Chat IA + ruta personalizada**

## Decisiones de producto (MVP)
- Idioma: español. Usuarias = mujeres (coaching).
- Onboarding = autoevaluación por dimensiones de bienestar; el diagnóstico calcula puntajes y define un área principal de enfoque y una ruta personalizada.

## Pendiente de configuración manual (fuera del código)
- Para un flujo sin fricción en demo, en el dashboard de Supabase se puede **desactivar la confirmación por correo** (Auth → Providers → Email → "Confirm email"). Si se deja activa, el registro pedirá confirmar el correo antes de iniciar sesión.
