<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import NavBar from '@/components/common/NavBar.vue'
import StreakCard from '@/components/stats/StreakCard.vue'
import StatsGrid from '@/components/stats/StatsView.vue'
import DifficultList from '@/components/stats/DifficultList.vue'
import { useWordStore } from '@/stores/wordStore'
import { useStatsStore } from '@/stores/statsStore'

const route = useRoute()
const router = useRouter()
const wordStore = useWordStore()
const statsStore = useStatsStore()

const badges = computed(() => statsStore.streak.badges.map(id => statsStore.getBadgeName(id)))

function handlePracticeDifficult() {
  router.push('/quiz')
}
</script>

<template>
  <div class="app-container max-w-[1440px] mx-auto px-6 min-h-screen flex flex-col">
    <NavBar :current-route="route.name || ''" />

    <div class="flex gap-6 flex-1 pb-24 md:pb-6">
      <aside class="desktop-sidebar w-[280px] flex-shrink-0 flex flex-col gap-5 hidden md:flex">
        <StreakCard :streak="statsStore.streak.count" />

        <div class="stats-grid grid grid-cols-2 gap-4">
          <div class="stat-card bg-warm-card rounded-lg p-4 text-center shadow-sm border border-primary/10">
            <div class="stat-icon streak bg-gradient-to-r from-primary to-accent text-white w-10 h-10 mx-auto mb-2 text-sm">🔥</div>
            <div class="stat-value text-xl font-extrabold text-text-primary">{{ wordStore.learnedCount }}</div>
            <div class="stat-label text-[10px] uppercase tracking-wider text-text-muted">已学词数</div>
          </div>
          <div class="stat-card bg-warm-card rounded-lg p-4 text-center shadow-sm border border-primary/10">
            <div class="stat-icon correct bg-success/15 text-[#2E7D58] w-10 h-10 mx-auto mb-2 text-sm">✓</div>
            <div class="stat-value text-xl font-extrabold text-text-primary">{{ statsStore.accuracy }}%</div>
            <div class="stat-label text-[10px] uppercase tracking-wider text-text-muted">正确率</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header flex justify-between items-start mb-4">
            <div>
              <div class="card-title text-sm font-bold text-text-primary">今日目标</div>
              <div class="card-subtitle text-xs text-text-muted">学习 20 词</div>
            </div>
          </div>
          <div class="progress-bar h-2 bg-primary/15 rounded-full overflow-hidden">
            <div 
              class="progress-fill h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-slow"
              :style="{ width: `${Math.min((wordStore.learnedCount / 20) * 100, 100)}%` }"
            ></div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-text-muted">
            <span>{{ wordStore.learnedCount }}/20</span>
            <span>{{ Math.round((wordStore.learnedCount / 20) * 100) }}%</span>
          </div>
        </div>
      </aside>

      <main class="main-content flex-1 flex flex-col gap-6">
        <StatsGrid 
          :streak="statsStore.streak.count"
          :accuracy="statsStore.accuracy"
          :learned-count="wordStore.learnedCount"
          :badges="badges"
        />

        <DifficultList 
          :words="wordStore.getDifficultWords()"
          @practice="handlePracticeDifficult"
        />
      </main>
    </div>
  </div>
</template>
