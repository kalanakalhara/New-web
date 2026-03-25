<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
    <div class="p-8">
        <h1 class="text-3xl font-bold">Theme 1 Restaurant: {{ route.params.slug }}</h1>
    </div>
</template>