# TypeScript Types Reference

All shared TypeScript interfaces live in `types/theme.ts`.

---

## `ThemeColors`

Defines the full color palette for a single color mode (light or dark).

```ts
export interface ThemeColors {
    background: string
    surface: string
    primary: string
    secondary: string
    accent: string
    text_primary: string
    text_secondary: string
    text_inverse: string
    success: string
    warning: string
    danger: string
    info: string
    shadow: string
}
```

Each value is a CSS color string (hex, `rgb()`, etc.) sourced from the backend API.

---

## `ThemeColorModes`

Groups light and dark palettes together.

```ts
export interface ThemeColorModes {
    light: ThemeColors
    dark: ThemeColors
}
```

Currently only `light` is applied in `app.vue`. Dark mode support can be added by switching between `colors.light` and `colors.dark` based on user preference.

---

## `AppSettings`

The shape of the JSON response from `GET /api/settings/`.

```ts
export interface AppSettings {
    name: string      // Theme key, e.g. "theme1" or "default"
    author: string    // Site author metadata
    version: string   // App version string
    colors: ThemeColorModes
}
```

`name` is the most critical field — it determines which theme is activated.

---

## `ThemeRouteItem`

A single route entry defined inside a theme's `routes.ts`.

```ts
export interface ThemeRouteItem {
    name: string                      // Unique route name, e.g. "theme1-home"
    path: string                      // URL path, e.g. "/" or "/restaurants/:slug"
    component: () => Promise<any>     // Dynamic import returning the Vue component
}
```

The `component` is always a lazy import (arrow function wrapping `import()`), enabling code splitting per theme page.

---

## `ThemeDefinition`

The full definition of a theme, combining its identity and its routes.

```ts
export interface ThemeDefinition {
    key: string             // Unique identifier, e.g. "theme1"
    label: string           // Human-readable name, e.g. "Theme 1"
    routes: ThemeRouteItem[]
}
```

This is what each theme's `index.ts` exports, and what `themeRegistry` stores.
