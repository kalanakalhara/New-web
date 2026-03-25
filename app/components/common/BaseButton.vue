<script setup lang="ts">
defineProps<{
    label?: string
    type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
    <button :type="type || 'button'" class="rounded-lg px-4 py-2 font-medium text-white"
        style="background: var(--color-primary); box-shadow: 0 6px 20px var(--color-shadow);">
        <slot>{{ label }}</slot>
    </button>
</template>