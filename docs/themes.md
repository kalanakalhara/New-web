# Themes Reference

Each theme lives in its own directory under `themes/`. This page documents the structure and files that make up a theme, using the two existing themes as reference.

---

## Theme Directory Layout

```
themes/
└── {theme-key}/
    ├── index.ts          # Barrel export — required for auto-discovery
    ├── theme.config.ts   # Theme identity (key, label)
    ├── routes.ts         # URL routes defined by this theme
    ├── pages/            # Vue page components (one per route)
    │   └── ...
    └── components/       # Vue components private to this theme
        └── ...
```

---

## `theme.config.ts`

Declares the theme's identity.

```ts
export default {
    key: 'theme1',       // Must be unique across all themes
    label: 'Theme 1'     // Human-readable display name
}
```

---

## `index.ts` (Barrel)

The single required entry point for auto-discovery. Combines `theme.config.ts` and `routes.ts` into a `ThemeDefinition`.

```ts
import type { ThemeDefinition } from '../../types/theme'
import config from './theme.config'
import routes from './routes'

export default {
    ...config,
    routes,
} satisfies ThemeDefinition
```

This file is what `lib/theme-loader.ts` picks up via `import.meta.glob`.

---

## `routes.ts`

Declares all URL paths this theme handles. Each entry maps a path to a lazy-loaded Vue component.

```ts
import type { ThemeRouteItem } from '../../types/theme'

export default [
    {
        name: 'theme1-home',       // Must be unique — use "{themekey}-{page}" pattern
        path: '/',
        component: () => import('./pages/home.vue')
    },
    {
        name: 'theme1-about',
        path: '/about',
        component: () => import('./pages/about.vue')
    },
    {
        name: 'theme1-restaurant',
        path: '/restaurants/:slug',
        component: () => import('./pages/restaurants/[slug].vue')
    },
    {
        name: 'theme1-restaurant-dishes',
        path: '/restaurants/:slug/dishes',
        component: () => import('./pages/restaurants/[slug]/dishes.vue')
    }
] satisfies ThemeRouteItem[]
```

**Important:** Route paths are shared across themes. If `theme1` defines `/about` and `default` also defines `/about`, the correct one is chosen at runtime based on the active theme.

---

## Existing Themes

### `default`

The built-in fallback theme. Used when the API returns an unknown theme name or when the API is unreachable.

| Route | Page File |
|---|---|
| `/` | `pages/home.vue` |
| `/about` | `pages/about.vue` |

**Components:**

- `HeroBanner.vue` — Simple banner with a surface-colored background

---

### `theme1`

The first custom theme, intended for restaurant browsing.

| Route | Page File |
|---|---|
| `/` | `pages/home.vue` |
| `/about` | `pages/about.vue` |
| `/restaurants/:slug` | `pages/restaurants/[slug].vue` |
| `/restaurants/:slug/dishes` | `pages/restaurants/[slug]/dishes.vue` |

**Components:**

- `HeroBanner.vue` — Themed version of the banner

**Pages:**

- `home.vue` — Search input and "Find restaurant" button
- `about.vue` — About page placeholder
- `restaurants/[slug].vue` — Displays restaurant name from `route.params.slug`
- `restaurants/[slug]/dishes.vue` — Dishes listing for a restaurant (scaffold)
