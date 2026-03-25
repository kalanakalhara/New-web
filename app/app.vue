<script setup lang="ts">
const { settings } = useAppSettings()

const lightColors = computed(() => settings.value?.colors?.light)
</script>

<template>
  <div :style="lightColors ? {
    '--color-background': lightColors.background,
    '--color-surface': lightColors.surface,
    '--color-primary': lightColors.primary,
    '--color-secondary': lightColors.secondary,
    '--color-accent': lightColors.accent,
    '--color-text-primary': lightColors.text_primary,
    '--color-text-secondary': lightColors.text_secondary,
    '--color-text-inverse': lightColors.text_inverse,
    '--color-success': lightColors.success,
    '--color-warning': lightColors.warning,
    '--color-danger': lightColors.danger,
    '--color-info': lightColors.info,
    '--color-shadow': lightColors.shadow
  } : {}" class="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
    <NuxtPage />
  </div>
</template>