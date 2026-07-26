import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Word } from '@/types'
import { useWordStore } from './wordStore'
import { toggleWordLearned, incrementWordCorrect } from '@/services/storage'
import { audioService } from '@/services/audio'
import { useSettingsStore } from './settingsStore'

export const useLearningStore = defineStore('learning', () => {
  const currentIndex = ref(0)
  const showChinese = ref(false)
  const isSpeaking = ref(false)
  const words = ref<Word[]>([])

  const currentWord = computed(() => {
    return words.value[currentIndex.value] || null
  })

  const progress = computed(() => {
    if (words.value.length === 0) return 0
    return ((currentIndex.value + 1) / words.value.length) * 100
  })

  const total = computed(() => words.value.length)

  const currentNumber = computed(() => currentIndex.value + 1)

  function init(group?: string) {
    const wordStore = useWordStore()
    if (group && wordStore.wordGroups[group]) {
      words.value = [...wordStore.wordGroups[group]]
    } else {
      words.value = [...wordStore.currentGroupWords]
    }
    currentIndex.value = 0
    showChinese.value = false
  }

  async function next() {
    if (currentIndex.value < words.value.length - 1) {
      currentIndex.value++
      showChinese.value = false
    }
  }

  async function prev() {
    if (currentIndex.value > 0) {
      currentIndex.value--
      showChinese.value = false
    }
  }

  async function speakCurrentWord() {
    if (!currentWord.value) return

    isSpeaking.value = true
    try {
      const settingsStore = useSettingsStore()
      await audioService.speak(currentWord.value.english, settingsStore.settings.rate)
    } catch (error) {
      console.warn('语音播放失败:', error)
    } finally {
      isSpeaking.value = false
    }
  }

  async function toggleShowChinese() {
    showChinese.value = !showChinese.value
  }

  async function markAsLearned() {
    if (!currentWord.value) return
    
    await toggleWordLearned(currentWord.value.id)
    await incrementWordCorrect(currentWord.value.id)
    
    const wordStore = useWordStore()
    const word = wordStore.getWordById(currentWord.value.id)
    if (word) {
      word.learned = !word.learned
      word.correct++
    }
    
    if (currentIndex.value < words.value.length - 1) {
      await next()
    }
  }

  return {
    currentIndex,
    showChinese,
    isSpeaking,
    words,
    currentWord,
    progress,
    total,
    currentNumber,
    init,
    next,
    prev,
    speakCurrentWord,
    toggleShowChinese,
    markAsLearned,
  }
})
