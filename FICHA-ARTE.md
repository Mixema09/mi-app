# FICHA DE DIRECCIÓN DE ARTE — Reconecta AI
> ✅ APROBADA — Protocolo A/B/C completado en Sesión 2 · Dirección elegida: **Opción A — Santuario**

## Referencia del usuario (CONTRATO)
- ¿Hay imagen(es) de referencia?: SÍ → captura del feed de Instagram @soymixedima (entregada Sesión 1)
- Extracción (mirando la imagen):
  - Modo: CLARO (light) — el feed siempre es luminoso, nunca oscuro
  - Fondo: #FAF6F0 (crema cálida) · Superficie: #FFFFFF (blanco roto)
  - Texto 1°: #2D1810 (chocolate oscuro — no negro puro) · Texto 2°: #6B5344 (marrón medio)
  - Acento principal: #E07B40 (naranja tierra — en botones, CTA, marcos, detalles activos)
  - Acento secundario: #C9951A (dorado cálido — logros, hitos, highlights especiales)
  - Display: Playfair Display (serif con carácter — autoridad emocional, no corporativa)
  - Body: DM Sans (sans humanista — cercanía, calidez, legibilidad en móvil)
  - Radio: 16px (bordes suaves — coherente con la sensación de seguridad y calidez)
  - Espaciado: aireado (mucho blanco entre secciones — transmite calma, no urgencia)
  - Sombras: sutiles (0 2px 8px rgba(45,24,16,0.08) — profundidad sin frialdad)
  - Bordes: no (las cards usan sombra suave, no borde explícito)
  - Layout: mobile-first, columna centrada con márgenes 16px, cards apiladas
  - Detalle firma a replicar: personaje ilustrado 3D (mujer rizada — coherente con el feed)
- Prohibiciones anti-IA que la referencia levanta: naranja tierra + modo claro eliminan por diseño los errores más comunes: acento neón + modo oscuro genérico

## Identidad derivada
- TABLA DE LÍDERES:
  - Soul Breathwork → atmósfera de espacio seguro, sensación de santuario ← **FUSIÓN PRINCIPAL (Opción A elegida)**
  - Inner Child App ("Izzy") → tono de IA empática, lenguaje no clínico
  - Gabby Bernstein App → estructura de programa en módulos, voz de guía espiritual cercana
- Combinación tipográfica: Playfair Display + DM Sans (pareja probada en apps de bienestar premium)
- Arquetipo de marca: El Guía / La Cuidadora — la app acompaña, no prescribe
- Mundo del sujeto: mujer adulta LATAM, entorno doméstico cálido, naturaleza y tierra latinoamericana

## Protocolo A/B/C — COMPLETADO ✅
- Comparativa: `direcciones-abc.html` · Screenshot: `screenshot-abc.png`
- **Opción elegida: A — Santuario** (elegida por el usuario en Sesión 2 · 2026-07-12)
- Opciones descartadas: B (Camino) · C (Diario de Raíz)
- Composición aprobada: cards XL flotantes + blob orgánico luminoso en el héroe + anillo de progreso prominente
- Dispositivo ownable aprobado: **blob orgánico crema/naranja + contenedores de ícono soft-3D** (receta CSS abajo)

## Brand kit final — APROBADO ✅
- Fondo: #FAF6F0 · Superficie: #FFFFFF · Hundido: #F3EDE5
- Texto 1°: #2D1810 · Texto 2°: #6B5344 · Texto muted: #9C7B6B
- Acento: #E07B40 (SOLO en: CTA principal, progreso activo, badge de racha, elemento highlight)
- 2ª nota: #C9951A (logros, nivel de Merecimiento, racha — nunca en texto de cuerpo)
- Semánticos: éxito #4CAF72 · error #E05050 · aviso #F5A623
- Display: Playfair Display (700 hero, 600 title) · Body: DM Sans (400 body, 500 label, 600 CTA)
- Escala: display 32-40px / title 18-20px / body 15-16px / label 12-13px
- Radio: 16px uniforme (cards, botones, inputs) — chips/pills: 999px — hero card: 24px
- Profundidad 3 niveles: #FAF6F0 base / #FFFFFF elevado / #F3EDE5 hundido + shadow-sm
- Espaciado: escala 4·8·12·16·24·32·48·64 (nada intermedio)

## Dispositivo ownable — RECETA CSS (toda pantalla lo incluye)

### 1. Blob orgánico (héroe/sección principal)
```css
.blob-hero {
  position: absolute;
  top: -40px; right: -40px;
  width: 200px; height: 200px;
  background: radial-gradient(ellipse at 50% 50%,
    rgba(224,123,64,0.22) 0%,
    rgba(201,149,26,0.10) 50%,
    transparent 70%);
  border-radius: 60% 40% 70% 30% / 50% 60% 40% 70%;
  filter: blur(8px);
  pointer-events: none;
}
```

### 2. Íconos soft-3D (contenedor 40-48px)
```css
.icon-3d-orange {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: linear-gradient(145deg, #F5A86B, #E07B40);
  box-shadow:
    inset 0 1px 2px rgba(255,255,255,0.40),
    inset 0 -2px 3px rgba(0,0,0,0.15),
    0 4px 10px rgba(224,123,64,0.30);
  display: flex; align-items: center; justify-content: center;
}
.icon-3d-gold {
  background: linear-gradient(145deg, #E0B84A, #C9951A);
  box-shadow:
    inset 0 1px 2px rgba(255,255,255,0.40),
    inset 0 -2px 3px rgba(0,0,0,0.15),
    0 4px 10px rgba(201,149,26,0.30);
}
```

## Personalidad compilada
- 3 adjetivos: **Cálida · Profunda · Esperanzadora**
- Motion signature: ease-out · stagger 60ms entre cards · fade-up 200ms entrada · tap scale 0.97 80ms
- Spring: suave (stiffness 80, damping 18) · duración base 300ms
- Exclamaciones: máx 1/pantalla · celebración: nivel medio (confetti solo en hitos reales: completar una herida, 7 días de racha)

## Trazabilidad y vetos
- Paleta derivada de: referencia Instagram del usuario (CONTRATO)
- Modo CLARO: derivado de referencia IG (siempre luminosa) + arquetipo Cuidadora (esperanza, luz, calor)
- Registro anti-repetición: paleta crema/#E07B40/#C9951A + par Playfair/DM Sans **VETADOS para siguiente proyecto del SO**
- Dirección: "Santuario" (Soul Breathwork-inspired) — vetada para siguiente proyecto del SO

## Idioma UI: Español LATAM · Aprobada: 2026-07-12 (Sesión 2) ✅
