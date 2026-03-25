# Creating a New Theme

Adding a new theme requires creating one directory with a few files. Nothing else in the codebase needs to be changed.

---

## Step-by-Step Guide

### Step 1 — Create the theme directory

```
themes/
└── mytheme/
```

Use a short, lowercase, hyphen-free key as the directory name. This key must match the `name` value returned by your backend's `/api/settings/` endpoint.

---

### Step 2 — Create `theme.config.ts`

```ts
// themes/mytheme/theme.config.ts
export default {
    key: 'mytheme',          // Must be unique and match the directory name
    label: 'My Custom Theme' // Human-readable display name
}
```

---

### Step 3 — Create `routes.ts`

Define every URL path your theme handles. Use the `{themekey}-{page}` naming convention for route names to avoid collisions.

```ts
// themes/mytheme/routes.ts
import type { ThemeRouteItem } from '../../types/theme'

export default [
    {
        name: 'mytheme-home',
        path: '/',
        component: () => import('./pages/home.vue')
    },
    {
        name: 'mytheme-about',
        path: '/about',
        component: () => import('./pages/about.vue')
    },
    // Add as many routes as you need
] satisfies ThemeRouteItem[]
```

> **Tip:** You only need to define the routes your theme uses. For any shared paths (e.g. `/`), both this theme and the `default` theme can define them. The correct one is chosen at runtime.

---

### Step 4 — Create `index.ts` (barrel file)

This is what the auto-discovery system looks for. It must be present for the theme to be picked up.

```ts
// themes/mytheme/index.ts
import type { ThemeDefinition } from '../../types/theme'
import config from './theme.config'
import routes from './routes'

export default {
    ...config,
    routes,
} satisfies ThemeDefinition
```

---

### Step 5 — Create your page components

Create a Vue component for each route defined in `routes.ts`:

```
themes/mytheme/pages/
    home.vue
    about.vue
```

**Example `home.vue`:**

```vue
<template>
    <div class="p-8">
        <h1 class="text-3xl font-bold">My Theme Home</h1>
        <BaseInput placeholder="Search here..." />
        <BaseButton label="Go" />
    </div>
</template>
```

You can use any shared components from `app/components/` (e.g. `BaseButton`, `BaseInput`) without importing them — Nuxt auto-imports them.

---

### Step 6 — (Optional) Add theme-private components

If your theme needs its own components that aren't shared with other themes, put them in:

```
themes/mytheme/components/
    MyWidget.vue
    ...
```

> **Note:** Components in `themes/*/components/` are **not** auto-imported by Nuxt. You must import them explicitly in your page files.

```vue
<script setup>
import MyWidget from '../components/MyWidget.vue'
</script>
```

---

### Step 7 — Restart the dev server

```bash
npm run dev
```

`import.meta.glob` is resolved at build time by Vite, so a server restart is required for the new theme to be discovered.

---

### Step 8 — Activate from the backend

Update your Laravel backend so that `GET /api/settings/` returns `"name": "mytheme"`. The frontend will automatically load your new theme on the next page load.

---

## Complete File Checklist

```
themes/mytheme/
├── index.ts          ✅ Required (auto-discovery entry point)
├── theme.config.ts   ✅ Required (key + label)
├── routes.ts         ✅ Required (URL routes)
├── pages/
│   ├── home.vue      ✅ One file per route defined in routes.ts
│   └── about.vue
└── components/       🔲 Optional (theme-private components)
```

**Files you do NOT need to touch:**

- `lib/theme-loader.ts` — auto-discovers your theme
- `app/router.options.ts` — auto-registers your routes
- `app/middleware/theme-route.global.ts` — auto-validates your routes
- `types/theme.ts` — no new types needed

---

## Dynamic Route Segments

For pages with dynamic URL segments (e.g. `/products/:id`), use the `:param` syntax in `routes.ts` and create a matching file using Vue Router's bracket naming:

**`routes.ts`:**
```ts
{
    name: 'mytheme-product',
    path: '/products/:id',
    component: () => import('./pages/products/[id].vue')
}
```

**`themes/mytheme/pages/products/[id].vue`:**
```vue
<script setup>
const route = useRoute()
</script>

<template>
    <div>Product ID: {{ route.params.id }}</div>
</template>
```
