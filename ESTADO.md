# ESTADO — Reconecta AI
Última actualización: 2026-07-13 | Sesión actual: 4

✅ Sesión 3 CERRADA — Landing pausada por decisión del usuario. Score final: 30/40·15/20·18/20 (11 rondas). Tag git: landing-v1-stable (commit 38c2f35). Pulido fino diferido a Sesión 7. NO retocar landing hasta solicitud explícita.
🔧 CHECKPOINT ACTIVO — Sesión 4 RONDA 2 EN REVISIÓN: las 3 pantallas construidas, fix de blank-render aplicado, revisor-visual corriendo.
Próximo paso EXACTO: esperar scores del revisor-visual → si ≥36/40 y ≥16/20 en las 3 → cerrar Sesión 4 → empezar Sesión 5 (app interna: dashboard + chat IA + ruta + gamificación).

## Qué es esta app
Reconecta AI: plataforma de sanación emocional de la relación con el dinero usando el Método RAÍZ™, IA conversacional con memoria y contenido personalizado. Para adultos de LATAM con bloqueos económicos de origen emocional. Modelo: Onboarding-first anónimo → paywall post-diagnóstico. $7.49/mes · $59.99/año.

## Promesa central
"Reconecta AI ayuda a adultos de LATAM que sienten que no merecen prosperar a sanar la raíz emocional de su relación con el dinero — sin estrategias financieras ni positivismo vacío — mediante el Método RAÍZ™: una IA que te conoce, te recuerda y diseña un camino de sanación completamente personalizado desde tu historia de vida."

## Reporte de validación (Sesión 1)
- Veredicto: ✅ Oportunidad de oro — mercado probado en inglés, brecha LATAM confirmada
- Apps de referencia: Soul Breathwork (4.7★) · Inner Child App con "Izzy" (4.6★) · Gabby Bernstein (4.8★, $199/año)
- Lo que los usuarios odian de la competencia: (1) No en español, pierdo matices emocionales (2) Trabaja niño interior O dinero, nunca los dos juntos (3) La IA no recuerda sesiones anteriores
- Brecha LATAM: SÍ — libros en Amazon/Mercado Libre con demanda activa, talleres de terapeutas, pero CERO apps en español con esta intersección específica
- Precio de referencia: $15-35/mes · $169-199/año

## Dirección de Arte (Preliminar — Sesión 2 finaliza con A/B/C)
- FICHA-ARTE.md: existe preliminar — a aprobar tras A/B/C en Sesión 2
- Referencia del usuario: SÍ — captura Instagram @soymixedima (feed) → es CONTRATO
- Resumen: fondo #FAF6F0 · acento #E07B40 (naranja tierra) · dorado #C9951A · Playfair Display + DM Sans · radio 16px · modo CLARO
- Personalidad: Cálida · Profunda · Esperanzadora
- REGISTRO ANTI-REPETICIÓN: paleta crema/naranja/dorado + par Playfair/DM Sans vetados para próximo proyecto del SO

## Avatar y venta (Sesión 1)
- FICHA-AVATAR.md: existe — pendiente aprobación del usuario
- Resumen: Valentina, mujer LATAM 28-48 años · dolor #1 "Trabajo mucho pero el dinero siempre se me va" · deseo #1 "Sentirme merecedora de prosperar sin culpa" · consciencia nivel 4 (solución-consciente) · sofisticación nivel 3
- Landing: pendiente Sesión 3 — 10 secciones canónicas del 19 — CTA primario: "Descubrir mi herida del dinero"

## Estrategia de monetización (cosa juzgada)
- Modelo: Onboarding-first anónimo (diagnóstico gratis → Perfil Emocional del Dinero™ → paywall → registro)
- Justificación: bienestar B2C — la evaluación gratuita genera inversión emocional antes del paywall; el pico de "eso soy yo" = momento de máxima conversión
- Diseño del paywall: aparece inmediatamente después de mostrar el Perfil Emocional completo
- Trial: 7 días premium completo
- Puente D1-D7: D1 primera meditación · D2-D3 chat IA + journaling · D4-D5 primer hito de ruta · D6 aviso pre-cobro · D7 celebración de 1 semana
- Pricing: $7.49/mes | $59.99/año (mostrado como "$4.99/mes — 2 meses gratis")

## Gamificación y retención
- Loop Hooked: Gatillo (notificación 9am "¿Cómo te sientes hoy?") → Acción (check-in + ejercicio del día 5 min) → Recompensa (insight personalizado + progreso en herida activa) → Inversión (perfil emocional que se enriquece con cada sesión — el usuario "pierde su historia" si se va)
- Mecánicas: racha diaria · hitos de sanación por herida (7 niveles) · "Nivel de Merecimiento" que sube visualmente
- Primera victoria (<5 min del onboarding): ver su Perfil Emocional del Dinero™ — momento "esto soy yo exactamente"
- Notificaciones: 1/día a las 9am + re-enganche D3 y D7 si no abre · tope: 2/día máximo

## Secuencia maestra de construcción
- Ruta: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: ✅ PAUSADA (v1-stable, Sesión 7)
- Onboarding: 🔧 EN REVISIÓN (ronda 2)
- Paywall: 🔧 EN REVISIÓN (ronda 2)
- Login/Auth: 🔧 EN REVISIÓN (ronda 2)
- App interna: pendiente (Sesión 5)
- Servicios externos: pendiente (Sesión 6)

## Puertas de etapa
- Landing: ⏸ pausada (score 30/40, retomar Sesión 7)
- Onboarding: 🔧 revisión ronda 2 — score ronda 1: 21/40·4/20
- Paywall: 🔧 revisión ronda 2 — score ronda 1: 20/40·4/20·13/20
- Login/Auth: 🔧 revisión ronda 2 — score ronda 1: 22/40·3/20
- App interna: no iniciada (espera cierre Sesión 4)
- Servicios externos: bloqueados (esperan puertas anteriores)
- Certificado /100 (48): pendiente (Sesión 7)

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js 15 App Router — landing SEO + app routes en mismo proyecto
- Stack: TypeScript + Tailwind v4 + shadcn/ui + Motion (framer-motion)
- Auth: Supabase Auth — magic link + Google OAuth — sesión anónima durante onboarding (progreso no se pierde)
- DB: Supabase PostgreSQL con RLS en todas las tablas
- IA conversacional: Claude API claude-sonnet-4-6 (streaming) — BFF pattern (NUNCA en frontend)
- IA structured output: Claude API para generar Perfil Emocional del Dinero™ (JSON tipado)
- Memoria IA: últimas 20 conversaciones + resumen emocional en system prompt (se actualiza en cada sesión)
- AI_MODEL: siempre en env var, nunca hardcodeado
- Venta: Hotmart + webhook con hottok + firma verificada + idempotencia
- Email: Resend + dominio propio
- Deploy: Vercel
- Idioma: Español LATAM (monolingual MVP — inglés/portugués en V2)
- Videos IA (adulto + niño interior): V2 post primeros clientes — complejidad + costo justifican diferirlo
- Loop (24): Hooked — ver sección de gamificación
- Auth (26): Supabase Auth Google + magic link + anónimo durante diagnóstico
- Modelo de datos (25): 8 tablas — users · emotional_profiles · conversation_history · daily_checkins · healing_routes · exercises · completed_activities · subscriptions
- Arquitectura IA (30): sync streaming para chat — no requiere async en MVP de texto
- Features del MVP (3): (1) Diagnóstico → Perfil Emocional del Dinero™ (2) Chat IA con memoria completa (3) Ruta personalizada + ejercicio diario

## Sesiones completadas ✅
- Sesión 1 — Validación de mercado + Constitución del Producto + Avatar + Monetización + Arquitectura — 2026-07-12
- Sesión 2 — Scaffold Next.js 16 + Tailwind v4 + Google Fonts + tokens CSS + A/B/C (Opción A elegida) + FICHA-ARTE.md aprobada + componentes UI manuales (Button/Card/Input/Dialog/Skeleton) + lib/utils — 2026-07-12
- Sesión 3 — Landing page 10 secciones (app/page.tsx) PAUSADA · score 30/40·15/20·18/20 · tag landing-v1-stable · pulido Sesión 7 — 2026-07-13

## Sesión en progreso 🔧
- Sesión 4 — Onboarding diagnóstico + Paywall + Login — RONDA 2 (fixes aplicados, revisor corriendo)
- Arquitectura: UI-first con localStorage (sin Supabase/Claude API hasta Sesión 6)
- /onboarding: 12 pasos (welcome→8 preguntas→recognition→loading→reveal) — Perfil Emocional del Dinero™ engine (4 arquetipos) — commit 8b9279d
- /paywall: muestra herida + ruta preview + features + 2 testimonios + pricing toggle + CTA trial — commit activo
- /login: magic link + Google OAuth stub, useReducedMotion integrado, error Google arreglado — commit activo
- FIX CRÍTICO APLICADO: opacity:0 eliminado de todos los initial states (causa de blank render en SSR/Playwright)
- FIX ONBOARDING: emoji 🫂 → HandHeart (Phosphor), auto-avance 300ms → 600ms
- FIX PAYWALL: back button (router.back()), 2 testimonios agregados
- FIX LOGIN: useReducedMotion integrado, mensaje de error de Google arreglado
- Score anterior (ronda 1, blank render): onboarding 21/40·4/20 · paywall 20/40·4/20·13/20 · login 22/40·3/20
- Score ronda 2: PENDIENTE (revisor-visual corriendo)

## Próximas sesiones 📋
- Sesión 4 (ACTUAL): cerrar con gates ≥36/40 y ≥16/20 en las 3 pantallas
- Sesión 5 (SIGUIENTE): App interna — dashboard + chat IA + ruta personalizada + gamificación
- Sesión 6: Integraciones — Supabase + Claude API + Hotmart + Vercel + Resend + dominio
- Sesión 7: Testing + 7 animaciones baseline + pulido landing + certificado /100
- Sesión 8: Adquisición (afiliados Hotmart + IG) + lanzamiento + backoffice

## Problemas conocidos ⚠️
- shadcn/ui init bloqueado por proxy (ui.shadcn.com rechazado) — resuelto: componentes creados manualmente con Radix UI + CVA + los mismos tokens de la app; funcionalidad idéntica

## Pendientes del usuario (SOLO tú puedes hacer esto)
- [ ] Crear cuenta en Hotmart — Sesión 6 (te guío clic a clic cuando lleguemos)
- [ ] Crear cuenta en Supabase — Sesión 6 (gratis)
- [ ] Crear cuenta en Vercel — Sesión 6 (gratis)
- [ ] Comprar dominio reconectaai.com o similar — Sesión 6 (~$12/año)
- [ ] Crear cuenta en Resend + verificar dominio — Sesión 6 (gratis hasta 3,000 emails/mes)
- [ ] Obtener API Key de Claude/Anthropic — antes de Sesión 6 (tienen créditos gratuitos de inicio)

## Notas para la próxima sesión
- La marca @soymixedima ya tiene audiencia real en el tema — el lanzamiento aprovecha esa base directamente
- Los personajes ilustrados 3D del IG son el dispositivo ownable de la marca — la app debe incluir un personaje guía coherente con ese estilo
- "La herida que bloquea tu abundancia" y "¿Y si nunca fue el dinero?" son frases que YA convierten en su IG — el copy de la landing arranca desde ahí
- Videos IA (adulto + niño interior): feature V2 más esperada — documentarla en el roadmap público para generar expectativa
