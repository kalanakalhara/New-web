<script setup lang="ts">
const model = defineModel<string>({ default: '' })

defineProps<{
    placeholder?: string
}>()
</script>

<template>
    <input v-model="model" :placeholder="placeholder" class="w-full rounded-lg border px-4 py-2 outline-none"
        style="background: var(--color-surface); color: var(--color-text-primary);" />
</template>