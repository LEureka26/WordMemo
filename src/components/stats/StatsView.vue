<script setup lang="ts">
defineProps<{
  streak: number
  accuracy: number
  learnedCount: number
  badges: string[]
}>()

const stats = [
  { icon: '🔥', label: '连续打卡', key: 'streak' },
  { icon: '✓', label: '正确率', key: 'accuracy' },
  { icon: '📚', label: '累计学习', key: 'learned' },
]
</script>

<template>
  <div class="card">
    <div class="card-header flex justify-between items-start mb-6">
      <div>
        <div class="card-title text-lg font-bold text-text-primary tracking-tight">学习统计</div>
        <div class="card-subtitle text-sm text-text-muted">坚持与成长</div>
      </div>
    </div>

    <div class="stats-grid grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <div class="stat-card bg-warm-card rounded-lg p-6 text-center shadow-sm border border-primary/10 transition-all duration-normal hover:-translate-y-1 hover:shadow-md">
        <div class="stat-icon streak bg-gradient-to-r from-primary to-accent text-white">🔥</div>
        <div class="stat-value text-2xl md:text-3xl font-extrabold text-text-primary mb-1">{{ streak }}</div>
        <div class="stat-label text-xs uppercase tracking-wider text-text-muted">连续打卡</div>
      </div>
      <div class="stat-card bg-warm-card rounded-lg p-6 text-center shadow-sm border border-primary/10 transition-all duration-normal hover:-translate-y-1 hover:shadow-md">
        <div class="stat-icon correct bg-success/15 text-[#2E7D58]">✓</div>
        <div class="stat-value text-2xl md:text-3xl font-extrabold text-text-primary mb-1">{{ accuracy }}%</div>
        <div class="stat-label text-xs uppercase tracking-wider text-text-muted">本周正确率</div>
      </div>
      <div class="stat-card bg-warm-card rounded-lg p-6 text-center shadow-sm border border-primary/10 transition-all duration-normal hover:-translate-y-1 hover:shadow-md">
        <div class="stat-icon total bg-secondary/15 text-[#2E7D58]">📚</div>
        <div class="stat-value text-2xl md:text-3xl font-extrabold text-text-primary mb-1">{{ learnedCount }}</div>
        <div class="stat-label text-xs uppercase tracking-wider text-text-muted">累计学习</div>
      </div>
    </div>

    <div class="badges-section">
      <h3 class="text-sm font-semibold text-text-primary mb-4">成就徽章</h3>
      <div class="badges-grid flex flex-wrap gap-3">
        <span 
          v-for="badge in badges" 
          :key="badge"
          class="badge-item px-5 py-3 rounded-full text-sm font-medium transition-all duration-normal"
          :class="true ? 'bg-gradient-to-r from-primary to-accent text-white shadow-[0_8px_24px_rgba(232,168,124,0.3)]' : 'bg-gray-100 text-text-muted'"
        >
          {{ badge }}
        </span>
        <span 
          v-for="i in Math.max(0, 5 - badges.length)" 
          :key="'empty-' + i"
          class="badge-item px-5 py-3 rounded-full text-sm font-medium bg-gray-100 text-text-muted"
        >
          未解锁
        </span>
      </div>
    </div>
  </div>
</template>
