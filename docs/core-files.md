# Core Files Reference

This page documents every file in the `app/` and `lib/` directories — the engine of the theme system.

---

## `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  compatibilityDate: '2026-03-25',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
})
```

Minimal configuration. Tailwind CSS is loaded via the `@nuxtjs/tailwindcss` module. The global stylesheet is `assets/css/main.css`.

---

## `app/app.vue`

The **root component**. It wraps the entire application and applies dynamic CSS custom properties from the API's color palette.

```vue
<script setup lang="ts">
const { settings } = useAppSettings()
const lightColors = computed(() => settings.value?.colors?.light)
</script>

<template>
  <div :style="lightColors ? { '--color-primary': lightColors.primary, ... } : {}">
    <NuxtPage />
  </div>
</template>
```

**Responsibility:** Reads `settings.value.colors.light` and sets CSS variables on the root `<div>`. These variables cascade to all child components, enabling theme-specific colors without any CSS class changes.

**CSS Variables set:**

| Variable | Purpose |
|---|---|
| `--color-background` | Page background |
| `--color-surface` | Card/panel background |
| `--color-primary` | Primary brand color |
| `--color-secondary` | Secondary brand color |
| `--color-accent` | Accent highlights |
| `--color-text-primary` | Main text |
| `--color-text-secondary` | Muted text |
| `--color-text-inverse` | Text on dark backgrounds |
| `--color-success / warning / danger / info` | Status colors |
| `--color-shadow` | Box shadow color |

---

## `app/router.options.ts`

The **heart of the dynamic routing system**. Replaces Nuxt's default file-based routing.

### What it does

1. Iterates `themeRegistry` to collect all unique route paths across all themes
2. For each path, records which theme provides which component loader
3. Registers a single `ThemeRouteWrapper` component per path

### `ThemeRouteWrapper` (inline component)

```ts
const wrapper = defineComponent({
  setup() {
    const activeThemeName = useState<string>('active-theme-name', () => 'default')

    const AsyncComp = computed(() => {
      const loader = componentsByTheme[activeThemeName.value]
                  ?? componentsByTheme['default']
      return loader ? defineAsyncComponent(loader) : null
    })

    return () => AsyncComp.value ? h(AsyncComp.value) : null
  }
})
```

- Reads `activeThemeName` reactively
- Picks the active theme's component loader (falls back to `default`)
- Uses `defineAsyncComponent` for lazy loading — only the active theme's bundle is fetched

**Route naming convention:** `theme-route-{path}` where `/` becomes `theme-route-` (index) and `/restaurants/:slug` becomes `theme-route-restaurants-slug`.

---

## `lib/theme-loader.ts`

**Auto-discovers and registers all themes** from the `themes/` directory.

### `import.meta.glob`

```ts
const modules = import.meta.glob<{ default: ThemeDefinition }>(
    '../themes/*/index.ts',
    { eager: true }
)
```

This Vite feature statically analyzes the glob pattern at build time and includes all matched files in the bundle. `eager: true` means modules are loaded synchronously (required for router setup).

### `themeRegistry`

```ts
export const themeRegistry: Record<string, ThemeDefinition> = {}
```

A plain object mapping theme key → `ThemeDefinition`. Populated at module initialization from all discovered `index.ts` files.

### `getThemeDefinition(themeName: string)`

Returns the `ThemeDefinition` for the given key, falling back to `themeRegistry['default']` if the key is not found.

---

## `app/composables/useAppSettings.ts`

Fetches and caches the application settings from the backend API.

### State

| State | Type | Description |
|---|---|---|
| `settings` | `AppSettings \| null` | The full API response object |
| `loaded` | `boolean` | Prevents duplicate API calls |

### `loadSettings()`

```ts
async function loadSettings(): Promise<AppSettings>
```

- Checks `loaded` — if already fetched, returns cached `settings.value`
- Otherwise, calls `$fetch('http://localhost/newapp/api/settings/')`
- Stores result in `settings`, sets `loaded = true`
- Returns the settings object

> **Note:** The API URL is currently hardcoded. Consider moving it to a `.env` variable (`NUXT_PUBLIC_API_BASE`) for environment portability.

---

## `app/composables/useActiveTheme.ts`

Manages which theme is currently active.

### State

| State | Type | Default | Description |
|---|---|---|---|
| `activeThemeName` | `string` | `'default'` | The key of the current theme |

### `setActiveTheme(themeName: string)`

Sets `activeThemeName.value`. Falls back to `'default'` if `themeName` is falsy. Triggers a reactive update in all `ThemeRouteWrapper` components, which re-evaluate their `AsyncComp` computed property.

### `activeTheme`

A computed `ThemeDefinition` for the current theme. Shorthand for `getThemeDefinition(activeThemeName.value)`.

---

## `app/plugins/settings-init.ts`

**Runs once on app startup** (both server and client).

```ts
export default defineNuxtPlugin(async () => {
    const { loadSettings } = useAppSettings()
    const { setActiveTheme } = useActiveTheme()

    try {
        const settings = await loadSettings()
        setActiveTheme(settings.name)
    } catch (error) {
        setActiveTheme('default')
    }
})
```

Calls `loadSettings()` and immediately sets the active theme from `settings.name`. On API failure, gracefully falls back to `'default'`.

---

## `app/middleware/theme-route.global.ts`

A **global route middleware** that runs before every navigation.

### Responsibility

Ensures the requested URL path is actually defined in the active theme's route list. If not, aborts navigation with a 404 error.

### Logic

```ts
const isAllowed = activeTheme.routes.some((route) => {
    const regexPattern = route.path
        .replace(/:[^/]+/g, '[^/]+')   // :slug → [^/]+
        .replace(/\//g, '\\/')
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(to.path)
})

if (!isAllowed) {
    return abortNavigation(createError({ statusCode: 404 }))
}
```

Dynamic segments (`:slug`) are converted to a regex that matches any non-slash string.

> **Note:** On first load, this middleware also calls `loadSettings()` and `setActiveTheme()` if settings haven't been loaded yet (e.g. if the plugin hasn't run).

---

## `app/assets/css/main.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

The global stylesheet. Injects all Tailwind CSS layers. Loaded globally via `nuxt.config.ts`.
