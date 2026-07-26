<script setup lang="ts">
defineProps<{
  streak: number
}>()
</script>

<template>
  <div class="streak-card">
    <h3 class="text-sm uppercase tracking-widest opacity-90 mb-3">连续打卡</h3>
    <div class="streak-number text-4xl md:text-5xl font-extrabold mb-2">{{ streak }}</div>
    <div class="streak-label text-base opacity-90">天</div>
  </div>
</template>
