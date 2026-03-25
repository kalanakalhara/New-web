# Shared Components

Components in `app/components/` are available to every theme without any import. Nuxt auto-imports all components from this directory.

These components are **theme-agnostic** — they derive their visual appearance entirely from CSS custom properties, so they automatically adapt to the active theme's color palette.

---

## `BaseButton`

**File:** `app/components/common/BaseButton.vue`

A styled primary button.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Button text (also overridable via default slot) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type attribute |

### Slots

| Slot | Description |
|---|---|
| `default` | Overrides `label` prop with custom content |

### Styling

- Background: `var(--color-primary)`
- Shadow: `0 6px 20px var(--color-shadow)`
- Layout: `rounded-lg px-4 py-2 font-medium text-white`

### Usage

```vue
<BaseButton label="Find restaurant" />

<!-- or with custom slot content -->
<BaseButton type="submit">
    <span>🔍 Search</span>
</BaseButton>
```

---

## `BaseInput`

**File:** `app/components/common/BaseInput.vue`

A text input with two-way binding via `v-model`.

### Model

Binds to a `string` value. Uses Vue 3's `defineModel` for clean two-way binding.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | — | Input placeholder text |

### Styling

- Background: `var(--color-surface)`
- Text color: `var(--color-text-primary)`
- Layout: `w-full rounded-lg border px-4 py-2 outline-none`

### Usage

```vue
<script setup>
const query = ref('')
</script>

<template>
    <BaseInput v-model="query" placeholder="Search restaurants..." />
</template>
```
