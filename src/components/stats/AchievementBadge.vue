<script setup lang="ts">
const props = defineProps<{
  id: string
  name: string
  description?: string
  unlocked: boolean
}>()
</script>

<template>
  <div
    class="badge-item flex flex-col items-center p-4 rounded-xl transition-all duration-normal"
    :class="unlocked
      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-[0_8px_24px_rgba(232,168,124,0.3)]'
      : 'bg-gray-100 text-text-muted'"
  >
    <div class="text-2xl mb-2">{{ unlocked ? '🏆' : '🔒' }}</div>
    <div class="text-sm font-medium">{{ name }}</div>
    <div v-if="description" class="text-xs opacity-70 mt-1">{{ description }}</div>
  </div>
</template>
