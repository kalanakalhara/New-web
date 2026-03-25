# GastroMaster-Web Developer Documentation

**GastroMaster-Web** is a multi-theme Nuxt 4 frontend for a gastro/restaurant platform. It connects to a Laravel API backend to fetch app settings (including which theme is active) and renders the appropriate UI based on that theme.

---

## Key Features

- **Runtime theme switching** — No redeployment needed. The active theme is determined from the backend API at request time.
- **Zero-config theme discovery** — New themes are auto-discovered from the `themes/` directory via `import.meta.glob`.
- **Shared base components** — UI primitives (`BaseButton`, `BaseInput`) are shared across all themes.
- **Dynamic CSS variables** — Color theming is driven by CSS custom properties set from the API response.

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| Nuxt | ^4.4.2 | Framework |
| Vue | ^3.5.30 | UI library |
| Vue Router | ^5.0.4 | Routing |
| Tailwind CSS | ^6.14.0 (via `@nuxtjs/tailwindcss`) | Utility-first styling |

---

## Project Structure at a Glance

```
New-web/
├── app/                    # Nuxt app source (composables, plugins, middleware, etc.)
│   ├── app.vue             # Root component
│   ├── router.options.ts   # Dynamic theme-aware router configuration
│   ├── assets/css/         # Global stylesheet (Tailwind)
│   ├── components/common/  # Shared base UI components (theme-agnostic)
│   ├── composables/        # useAppSettings, useActiveTheme
│   ├── middleware/         # Global route guard (theme enforcement)
│   └── plugins/            # App init plugin (loads settings on startup)
├── lib/
│   └── theme-loader.ts     # Auto-discovers and registers all themes
├── themes/
│   ├── default/            # Built-in fallback theme
│   └── theme1/             # Example alternate theme
├── types/
│   └── theme.ts            # TypeScript interfaces
└── nuxt.config.ts          # Nuxt configuration
```

---

## Quick Start

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000`. Make sure the Laravel API backend is running at `http://localhost/newapp/api/` so settings can load.
