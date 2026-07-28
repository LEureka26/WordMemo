<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import NavBar from '@/components/common/NavBar.vue'
import StreakCard from '@/components/stats/StreakCard.vue'
import StatsGrid from '@/components/stats/StatsView.vue'
import DifficultList from '@/components/stats/DifficultList.vue'
import WrongWordList from '@/components/stats/WrongWordList.vue'
import { useWordStore } from '@/stores/wordStore'
import { useStatsStore } from '@/stores/statsStore'
import { achievements } from '@/data/defaultWords'

const router = useRouter()
const wordStore = useWordStore()
const statsStore = useStatsStore()

const badges = computed(() => {
  return achievements.map(a => ({
    id: a.id,
    name: a.name,
    description: getBadgeDescription(a.id),
    unlocked: statsStore.streak.badges.includes(a.id),
  }))
})

const wrongWords = computed(() => {
  return wordStore.allWords.filter(w => w.wrong > 0).sort((a, b) => b.wrong - a.wrong)
})

const difficultWords = computed(() => {
  return wordStore.allWords.filter(w => w.wrong >= 3).sort((a, b) => b.wrong - a.wrong)
})

function getBadgeDescription(id: string): string {
  const descMap: Record<string, string> = {
    first_day: '完成首次打卡',
    perfect_quiz: '单次默写全对',
    seven_days: '连续打卡7天',
    hundred_words: '累计学习100词',
  }
  return descMap[id] || ''
}

function handlePracticeDifficult() {
  router.push('/quiz?mode=difficult')
}

function handlePracticeWrong() {
  router.push('/quiz?mode=wrong')
}

function handleSelectWord(word: { id: string }) {
  router.push({ path: '/', query: { wordId: word.id } })
}

async function handleClearWrongWords() {
  if (!confirm('确定要清空所有错题记录吗？')) return
  await wordStore.clearAllWrongWords()
}
</script>

<template>
  <div class="app-container max-w-[1440px] mx-auto px-6 min-h-screen flex flex-col">
    <NavBar />

    <div class="flex gap-6 flex-1 pb-24 md:pb-6">
      <aside class="desktop-sidebar w-[280px] flex-shrink-0 flex flex-col gap-5 hidden md:flex">
        <StreakCard
          :streak="statsStore.streak.count"
          :daily-goal="20"
          :today-learned="wordStore.learnedCount"
        />

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
          :words="difficultWords"
          @practice="handlePracticeDifficult"
          @select="handleSelectWord"
        />

        <WrongWordList
          :words="wrongWords"
          @practice="handlePracticeWrong"
          @select="handleSelectWord"
          @clear="handleClearWrongWords"
        />
      </main>
    </div>
  </div>
</template>
