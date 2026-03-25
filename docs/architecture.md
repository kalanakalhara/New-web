# Architecture Overview

## How Themes Work

The multi-theme system has three distinct layers that work together:

```
Backend API
    │
    │  GET /api/settings/ → { name: "theme1", colors: {...} }
    ▼
Plugin (settings-init.ts)
    │  Sets activeThemeName state
    ▼
Router (router.options.ts)
    │  Each route path → ThemeRouteWrapper component
    │  Wrapper reads activeThemeName → loads correct theme's .vue file
    ▼
Middleware (theme-route.global.ts)
    │  Validates that the active theme actually defines the requested path
    │  Aborts with 404 if not
    ▼
Rendered Page (e.g. themes/theme1/pages/home.vue)
```

---

## Why Dynamic Component Wrappers?

The Vue Router requires all components to be registered **at build time**. You cannot change which component handles a route path after the app starts without reloading.

The solution used here is a **wrapper component per route path**. Instead of registering `themes/theme1/pages/home.vue` directly for `/`, the router registers a lightweight `ThemeRouteWrapper` that:

1. Reads the reactive `activeThemeName` state
2. Uses `defineAsyncComponent` to load the matching page from the correct theme
3. Falls back to the `default` theme if the active theme doesn't define the path

This means the active theme can appear to "switch" without re-registering routes.

---

## Theme Auto-Discovery

`lib/theme-loader.ts` uses Vite's `import.meta.glob` to scan all `themes/*/index.ts` files at build time:

```
themes/
  default/index.ts  ──┐
  theme1/index.ts   ──┤── Loaded by import.meta.glob → themeRegistry
  theme2/index.ts   ──┘   (future themes auto-discovered)
```

Each `index.ts` exports a `ThemeDefinition` object containing the theme's key, label, and routes array. The `themeRegistry` record maps theme key → definition.

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        app.vue                          │
│  Applies CSS variables from settings.value.colors       │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────▼──────────────┐
         │       NuxtPage             │
         │  Renders matched route     │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │   ThemeRouteWrapper        │
         │   (per route path)         │
         │  reads activeThemeName     │
         │  → loads theme's .vue file │
         └────────────────────────────┘
```

---

## State Management

Two pieces of global state are managed via Nuxt's `useState`:

| State key | Type | Default | Description |
|---|---|---|---|
| `app-settings` | `AppSettings \| null` | `null` | Full API response (theme name, colors) |
| `app-settings-loaded` | `boolean` | `false` | Guards against duplicate API calls |
| `active-theme-name` | `string` | `'default'` | The resolved theme key used for routing |
