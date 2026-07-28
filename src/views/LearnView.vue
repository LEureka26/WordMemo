<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/common/NavBar.vue'
import SettingsPanel from '@/components/common/SettingsPanel.vue'
import ShortcutHelp from '@/components/common/ShortcutHelp.vue'
import StreakCard from '@/components/stats/StreakCard.vue'
import WordCard from '@/components/learning/WordCard.vue'
import ProgressBar from '@/components/learning/ProgressBar.vue'
import { useLearningStore } from '@/stores/learningStore'
import { useWordStore } from '@/stores/wordStore'
import { useStatsStore } from '@/stores/statsStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { audioService } from '@/services/audio'
import { keyboardHandler } from '@/services/keyboard'

const route = useRoute()
const learningStore = useLearningStore()
const wordStore = useWordStore()
const statsStore = useStatsStore()
const settingsStore = useSettingsStore()

const showHelp = ref(false)
const showAudioActivation = ref(false)

function locateWordFromQuery() {
  const wordId = route.query.wordId as string
  if (!wordId) return
  const index = learningStore.words.findIndex(w => w.id === wordId)
  if (index !== -1) {
    learningStore.currentIndex = index
    learningStore.showChinese = false
  }
}

onMounted(async () => {
  if (!audioService.isActivated()) {
    showAudioActivation.value = true
  }

  learningStore.init(wordStore.activeGroup)
  locateWordFromQuery()

  keyboardHandler.setConfig({
    onPrev: () => learningStore.prev(),
    onNext: () => learningStore.next(),
    onSpeak: () => learningStore.speakCurrentWord(),
    onRateChange: (rate) => settingsStore.update('rate', rate),
    onShowHelp: () => showHelp.value = true,
  })
})

watch(() => wordStore.activeGroup, () => {
  learningStore.init(wordStore.activeGroup)
  locateWordFromQuery()
})

function handleActivateAudio() {
  audioService.activate()
  showAudioActivation.value = false
  learningStore.speakCurrentWord()
}

function handleSelectWord(word: { id: string }) {
  const index = learningStore.words.findIndex(w => w.id === word.id)
  if (index !== -1) {
    learningStore.currentIndex = index
    learningStore.showChinese = false
  }
}

function getStatusClass(word: { learned: boolean; wrong: number }): string {
  if (word.learned) return 'learned'
  if (word.wrong > 0) return 'learning'
  return 'new'
}
</script>

<template>
  <div class="app-container max-w-[1440px] mx-auto px-6 min-h-screen flex flex-col">
    <NavBar />

    <div class="layout-desktop flex gap-6 flex-1">
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

        <SettingsPanel />

        <div class="card">
          <div class="card-header flex justify-between items-start mb-4">
            <div>
              <div class="card-title text-sm font-bold text-text-primary">单词列表</div>
              <div class="card-subtitle text-xs text-text-muted">{{ wordStore.activeGroup }} · {{ learningStore.total }}词</div>
            </div>
            <span class="pill pill-secondary text-xs">学习中</span>
          </div>
          <div class="learn-word-list overflow-y-auto overflow-x-hidden space-y-3">
            <div
              v-for="word in learningStore.words"
              :key="word.id"
              class="word-item flex items-center justify-between p-4 bg-warm-card rounded-md border border-primary/10 transition-all duration-normal cursor-pointer hover:bg-accent-light hover:translate-x-1"
              :class="{ 'border-primary bg-primary/5': learningStore.currentWord?.id === word.id }"
              @click="handleSelectWord(word)"
            >
              <div class="word-item-content flex items-center gap-3.5 min-w-0">
                <span
                  class="word-item-status w-2.5 h-2.5 rounded-full flex-shrink-0"
                  :class="getStatusClass(word)"
                ></span>
                <span class="word-item-english font-semibold text-sm text-text-primary truncate">{{ word.english }}</span>
                <span class="word-item-chinese text-xs text-text-muted truncate hidden md:inline">{{ word.chinese[0] }}</span>
              </div>
              <span class="word-item-meta text-xs text-text-muted flex-shrink-0 ml-2">
                {{ word.correct }}/{{ word.wrong }}
              </span>
            </div>
            <div v-if="learningStore.words.length === 0" class="text-center py-8 text-text-muted">
              暂无单词
            </div>
          </div>
          <div v-if="learningStore.words.length > 5" class="text-center text-xs text-text-muted mt-2">
            共 {{ learningStore.words.length }} 个单词，滚动查看更多
          </div>
        </div>
      </aside>

      <main class="main-content flex-1 flex flex-col gap-6 pb-24 md:pb-6">
        <WordCard
          :word="learningStore.currentWord"
          :show-chinese="learningStore.showChinese"
          :is-speaking="learningStore.isSpeaking"
          @speak="learningStore.speakCurrentWord"
          @toggle-chinese="learningStore.toggleShowChinese"
          @mark-learned="learningStore.markAsLearned"
          @next="learningStore.next"
          @prev="learningStore.prev"
          @up="learningStore.markAsLearned"
        />

        <ProgressBar
          :progress="learningStore.progress"
          :current="learningStore.currentNumber"
          :total="learningStore.total"
        />
      </main>
    </div>

    <ShortcutHelp :visible="showHelp" @close="showHelp = false" />

    <Teleport to="body">
      <div 
        v-if="showAudioActivation"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]"
      >
        <div class="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 text-center shadow-2xl">
          <div class="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl mb-4">
            🔊
          </div>
          <h3 class="text-xl font-bold text-text-primary mb-2">开始学习</h3>
          <p class="text-text-secondary mb-6">点击下方按钮激活语音功能，开启你的学习之旅</p>
          <button 
            class="btn-primary w-full py-4"
            @click="handleActivateAudio"
          >
            开始学习
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.learn-word-list {
  max-height: calc(5 * 3.75rem + 4 * 0.75rem);
  scrollbar-width: thin;
}
.learn-word-list::-webkit-scrollbar {
  width: 4px;
}
.learn-word-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.word-item-status.learned {
  background: var(--color-success, #4CAF7D);
}
.word-item-status.learning {
  background: var(--color-warning, #E6A817);
}
.word-item-status.new {
  background: #c4c4c4;
}
</style>
