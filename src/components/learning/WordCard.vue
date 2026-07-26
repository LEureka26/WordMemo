<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Word } from '@/types'
import { audioService } from '@/services/audio'
import { gestureHandler } from '@/services/gesture'
import { useSettingsStore } from '@/stores/settingsStore'

const props = defineProps<{
  word: Word | null
  showChinese: boolean
  isSpeaking: boolean
}>()

const emit = defineEmits<{
  (e: 'speak'): void
  (e: 'toggleChinese'): void
  (e: 'markLearned'): void
  (e: 'next'): void
  (e: 'prev'): void
  (e: 'up'): void
}>()

const cardRef = ref<HTMLElement | null>(null)
const settingsStore = useSettingsStore()
const audioError = ref('')

onMounted(() => {
  if (cardRef.value) {
    gestureHandler.setElement(cardRef.value)
    gestureHandler.setConfig({
      onLeft: () => emit('prev'),
      onRight: () => emit('next'),
      onUp: () => emit('up'),
    })
  }
})

watch(() => props.word, async (newWord) => {
  if (newWord && audioService.isActivated() && audioService.isSupported() && settingsStore.settings.autoPlay) {
    emit('speak')
  }
})

function handleSpeak() {
  audioError.value = ''
  
  if (!audioService.isSupported()) {
    audioError.value = '当前浏览器不支持语音合成'
    return
  }
  
  if (!audioService.isActivated()) {
    audioError.value = '请先点击"开始学习"激活语音功能'
    return
  }
  
  if (!audioService.hasVoices()) {
    audioError.value = '未检测到可用的英语语音包'
  }
  
  emit('speak')
}

function handleToggleChinese() {
  emit('toggleChinese')
}

function handleMarkLearned() {
  emit('markLearned')
}

function handleNext() {
  emit('next')
}

function handlePrev() {
  emit('prev')
}
</script>

<template>
  <div 
    ref="cardRef"
    class="word-card"
    @click="handleSpeak"
  >
    <div class="absolute top-[-60px] right-[-60px] w-[180px] h-[180px] bg-primary/15 rounded-full"></div>
    <div class="absolute bottom-[-40px] left-[-40px] w-[120px] h-[120px] bg-secondary/10 rounded-full"></div>

    <div class="word-header flex justify-between items-center mb-7 relative z-10">
      <div class="word-info">
        <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-2">
          {{ word?.english || '-' }}
        </h2>
        <div class="pronunciation text-lg text-text-muted italic">
          /{{ word?.english?.toLowerCase() || '' }}/
        </div>
      </div>
      <button 
        class="audio-button w-[72px] h-[72px] md:w-[80px] md:h-[80px] rounded-full bg-gradient-to-r from-primary to-accent text-white text-lg font-semibold flex items-center justify-center shadow-[0_12px_32px_rgba(232,168,124,0.35)] transition-all duration-normal hover:scale-105 active:scale-95"
        @click.stop="handleSpeak"
      >
        {{ isSpeaking ? '⏳' : '🔊' }}
      </button>
    </div>

    <div v-if="audioError" class="audio-error bg-error/10 border border-error/30 rounded-lg p-4 mb-6 relative z-10">
      <p class="text-sm text-error flex items-center gap-2">
        <span>⚠</span>
        {{ audioError }}
      </p>
    </div>

    <div class="chinese-hint bg-secondary/10 rounded-md p-5 mb-6 relative z-10">
      <h3 class="text-xs uppercase tracking-wider text-[#2E7D58] mb-2">中文释义</h3>
      <p class="text-xl font-semibold text-text-primary">
        {{ word?.chinese?.join('；') || '-' }}
      </p>
    </div>

    <div class="word-actions flex gap-4 relative z-10">
      <button 
        class="btn btn-outline"
        @click.stop="handleMarkLearned"
      >
        标记已掌握
      </button>
      <button 
        class="btn btn-primary"
        @click.stop="handleNext"
      >
        下一个
      </button>
    </div>

    <div class="flex justify-between mt-4 text-sm text-text-muted">
      <button 
        class="hover:text-primary transition-colors"
        @click.stop="handlePrev"
      >
        ← 上一个
      </button>
      <span>左右滑动切换 · 上滑标记已掌握</span>
    </div>
  </div>
</template>