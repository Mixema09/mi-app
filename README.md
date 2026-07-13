# mi-app

Aplicación web construida con [Next.js](https://nextjs.org) (App Router + TypeScript + Tailwind CSS) y [Supabase](https://supabase.com).

## Requisitos

- Node.js 18.18 o superior (este proyecto se creó con Node 22)
- npm

## Configuración

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea tu archivo de variables de entorno a partir de la plantilla:

   ```bash
   cp .env.example .env.local
   ```

3. Rellena `.env.local` con los valores de tu proyecto de Supabase
   (Dashboard → Project Settings → API):

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Estructura

```
src/
  app/                 # Rutas y páginas (App Router)
    layout.tsx
    page.tsx
    globals.css
  lib/supabase/
    client.ts          # Cliente de Supabase para el navegador
    server.ts          # Cliente de Supabase para el servidor
```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run start` — sirve el build de producción
- `npm run lint` — linter
