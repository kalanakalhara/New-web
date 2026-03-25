# GastroMaster-Web

A multi-theme Nuxt 4 frontend for a gastro/restaurant platform. The active theme and color palette are driven entirely by a Laravel API backend — no redeployment needed to switch themes.

---

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 20.x |
| npm | 10.x |
| Python | 3.8+ *(for MkDocs only)* |
| Laravel backend | Running at `http://localhost/newapp/api/` |

---

## Project Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The app is available at **http://localhost:3000**.

> **Important:** The Laravel API backend must be running so the app can fetch theme settings from `GET /api/settings/`. If the API is unreachable, the app falls back to the `default` theme automatically.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run generate` | Generate a static site |
| `npm run postinstall` | Run `nuxt prepare` (auto-runs after `npm install`) |

---

## Serving the Developer Documentation

Documentation is built with [MkDocs](https://www.mkdocs.org/). The source files are in `docs/`.

### Install MkDocs (once)

```bash
pip install mkdocs
```

### Serve docs locally

```bash
mkdocs serve
```

Docs are available at **http://127.0.0.1:8000** with live reload.

### Build static docs site

```bash
mkdocs build
```

Output is generated in the `site/` directory.

---

## Project Structure

```
New-web/
├── app/                    # Nuxt app source
│   ├── app.vue             # Root component (applies theme CSS variables)
│   ├── router.options.ts   # Dynamic theme-aware router
│   ├── assets/css/         # Global stylesheet (Tailwind)
│   ├── components/common/  # Shared UI components (BaseButton, BaseInput)
│   ├── composables/        # useAppSettings, useActiveTheme
│   ├── middleware/         # Global route guard
│   └── plugins/            # Settings initializer plugin
├── lib/
│   └── theme-loader.ts     # Auto-discovers themes via import.meta.glob
├── themes/
│   ├── default/            # Built-in fallback theme
│   └── theme1/             # Example custom theme
├── types/
│   └── theme.ts            # Shared TypeScript interfaces
├── docs/                   # MkDocs documentation source
├── mkdocs.yml              # MkDocs configuration
└── nuxt.config.ts          # Nuxt configuration
```

---

## Adding a New Theme

1. Create `themes/{yourtheme}/theme.config.ts` — set a unique `key` and `label`
2. Create `themes/{yourtheme}/routes.ts` — define your URL routes
3. Create `themes/{yourtheme}/index.ts` — barrel export (required for auto-discovery)
4. Add page components under `themes/{yourtheme}/pages/`
5. Restart the dev server (`npm run dev`)
6. Update your backend to return `"name": "{yourtheme}"` from `/api/settings/`

No other files need to be changed. See **[Developer Docs → Creating a New Theme](docs/creating-a-theme.md)** for the full step-by-step guide.

---

## How Theme Switching Works

```
Backend API (/api/settings/) → { name: "theme1", colors: { ... } }
        ↓
Plugin (settings-init.ts) sets activeThemeName state
        ↓
Router (router.options.ts) — each path has a ThemeRouteWrapper
  that reads activeThemeName and loads the correct .vue file at runtime
        ↓
Middleware (theme-route.global.ts) — blocks routes not defined by the active theme
        ↓
Rendered Page from themes/theme1/pages/
```
