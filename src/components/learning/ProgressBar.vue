<script setup lang="ts">
defineProps<{
  progress: number
  current: number
  total: number
}>()
</script>

<template>
  <div class="progress-section mt-6">
    <div class="progress-header flex justify-between mb-3">
      <span class="progress-text text-sm text-text-muted">学习进度</span>
      <span class="progress-value text-sm font-semibold text-primary">第 {{ current }} / {{ total }} 题</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>
