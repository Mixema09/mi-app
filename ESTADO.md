# ESTADO — Reconecta AI
Última actualización: 2026-07-12 | Sesión actual: 3

🔧 CHECKPOINT — Sesión 3 R7 EN REVISIÓN: 4 cambios estructurales aplicados sobre R6 (§3B sección oscura, §4B milestones stepper numerado movido tras §4, trust strip dividers centrados, §6 comparador mercado Psicóloga/Curso/Reconecta) · tsc ✓ · screenshot /tmp/r7-landing.png · awaiting revisor-visual R7
Scores previos: R5 31/40·16/20·18/20 | R6 30/40·15/20·18/20 (bajó por monotonía borderLeft en §3B/§7B/FAQ)
Próximo paso EXACTO: recibir veredicto R7 → si ≥36/40 Y ≥16/20 Y ≥16/20 → commit+push → COMPLETADA → Sesión 4

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
- Landing: pendiente (Sesión 3)
- Onboarding: pendiente (Sesión 4)
- Paywall: pendiente (Sesión 4)
- Login/Auth: pendiente (Sesión 4)
- App interna: pendiente (Sesión 5)
- Servicios externos: pendiente (Sesión 6)

## Puertas de etapa
- Landing: no iniciada
- Onboarding: no iniciada
- Paywall: no iniciada
- Login/Auth: no iniciada
- App interna: no iniciada
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
- Sesión 3 — Landing page 10 secciones canónicas (app/page.tsx) + páginas footer + HeroReveal + mockups esquemáticos §5 — pendiente veredicto final del revisor-visual — 2026-07-12

## Sesión en progreso 🔧
- Sesión 3 — Landing page (10 secciones canónicas) — EN REVISIÓN FINAL
- Titular: "La herida no está en tu bolsillo" · CTA: "Descubrir mi herida del dinero" → /onboarding
- Garantía: "La Primera Revelación" (14 días, 100% reembolso sin preguntas)
- Stack valor: $284 → desde $4.99/mes (anual) / $7.49/mes (mensual) · 7 días trial gratis
- Páginas footer: /privacidad · /terminos · /reembolsos · /aviso-ia (todas creadas como placeholders)
- Tokens nuevos en globals.css: --soft3d-bg/shadow/shadow-lg · --gold-bg/shadow · --brand-primary-mid · --brand-gold-mid
- Fixes aplicados en re-revisión: HeroReveal (above-fold visible) · useReducedMotion · §5 mockups esquemáticos (4 pantallas) · trust strip limpio · §9 badge metodológico · §6 kicker "Empieza sin riesgo"
- Estado: awaiting revisor-visual → si ≥36/40 Y ≥16/20 → COMPLETADA

## Próximas sesiones 📋
- Sesión 3 (SIGUIENTE): Página de ventas — 10 secciones canónicas, copy desde FICHA-AVATAR.md
- Sesión 4: Onboarding diagnóstico + paywall + login
- Sesión 5: App interna — dashboard + chat IA + ruta personalizada + gamificación
- Sesión 6: Integraciones — Supabase + Claude API + Hotmart + Vercel + Resend + dominio
- Sesión 7: Testing + 7 animaciones baseline + pulido + certificado /100
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
