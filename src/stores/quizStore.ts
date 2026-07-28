import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Word, QuizResult } from '@/types'
import { useWordStore } from './wordStore'
import { useSettingsStore } from './settingsStore'
import { incrementWordCorrect, incrementWordWrong, getWrongList, setWrongList } from '@/services/storage'
import { matchAnswer } from '@/utils/matcher'

export const useQuizStore = defineStore('quiz', () => {
  const currentIndex = ref(0)
  const userInput = ref('')
  const isCorrect = ref<boolean | null>(null)
  const feedback = ref('')
  const correctAnswer = ref<string[]>([])
  const results = ref<QuizResult[]>([])
  const words = ref<Word[]>([])
  const isFinished = ref(false)
  const isRetryMode = ref(false)

  const currentWord = computed(() => {
    return words.value[currentIndex.value] || null
  })

  const progress = computed(() => {
    if (words.value.length === 0) return 0
    return ((currentIndex.value + 1) / words.value.length) * 100
  })

  const total = computed(() => words.value.length)

  const currentNumber = computed(() => currentIndex.value + 1)

  const correctCount = computed(() => {
    return results.value.filter(r => r.isCorrect).length
  })

  const accuracy = computed(() => {
    if (results.value.length === 0) return 0
    return Math.round((correctCount.value / results.value.length) * 100)
  })

  const wrongCount = computed(() => {
    return results.value.filter(r => !r.isCorrect).length
  })

  function init(group?: string, customWords?: Word[], useWrongList: boolean = false) {
    const wordStore = useWordStore()
    let sourceWords: Word[]

    if (customWords) {
      sourceWords = [...customWords]
    } else if (group && wordStore.wordGroups[group]) {
      sourceWords = [...wordStore.wordGroups[group]]
    } else {
      sourceWords = [...wordStore.currentGroupWords]
    }

    words.value = sourceWords.sort(() => Math.random() - 0.5)
    currentIndex.value = 0
    userInput.value = ''
    isCorrect.value = null
    feedback.value = ''
    correctAnswer.value = []
    results.value = []
    isFinished.value = false
    isRetryMode.value = useWrongList
  }

  async function validate(input: string) {
    if (!currentWord.value) return

    const wordStore = useWordStore()
    const settingsStore = useSettingsStore()
    
    const matched = matchAnswer(input, currentWord.value.chinese, settingsStore.settings.fuzzyMatch)
    
    isCorrect.value = matched
    correctAnswer.value = currentWord.value.chinese
    
    if (matched) {
      feedback.value = '回答正确！'
      await incrementWordCorrect(currentWord.value.id)
      
      const word = wordStore.getWordById(currentWord.value.id)
      if (word) word.correct++
      
      const wrongList = await getWrongList()
      const newWrongList = wrongList.filter(id => id !== currentWord.value.id)
      await setWrongList(newWrongList)
    } else {
      feedback.value = '回答错误'
      await incrementWordWrong(currentWord.value.id)

      const word = wordStore.getWordById(currentWord.value.id)
      if (word) word.wrong++
    }
    
    results.value.push({
      wordId: currentWord.value.id,
      isCorrect: matched,
      userAnswer: input,
      correctAnswer: currentWord.value.chinese,
      timestamp: Date.now(),
    })
  }

  async function nextQuestion() {
    if (currentIndex.value < words.value.length - 1) {
      currentIndex.value++
      userInput.value = ''
      isCorrect.value = null
      feedback.value = ''
      correctAnswer.value = []
    } else {
      isFinished.value = true
    }
  }

  async function skipQuestion() {
    if (!currentWord.value) return

    const wordStore = useWordStore()
    await incrementWordWrong(currentWord.value.id)

    const word = wordStore.getWordById(currentWord.value.id)
    if (word) word.wrong++

    isCorrect.value = false
    feedback.value = '已跳过'
    correctAnswer.value = currentWord.value.chinese

    results.value.push({
      wordId: currentWord.value.id,
      isCorrect: false,
      userAnswer: '',
      correctAnswer: currentWord.value.chinese,
      timestamp: Date.now(),
    })
  }

  function reset() {
    currentIndex.value = 0
    userInput.value = ''
    isCorrect.value = null
    feedback.value = ''
    correctAnswer.value = []
    results.value = []
    isFinished.value = false
    isRetryMode.value = false
  }

  return {
    currentIndex,
    userInput,
    isCorrect,
    feedback,
    correctAnswer,
    results,
    words,
    isFinished,
    wrongCount,
    isRetryMode,
    currentWord,
    progress,
    total,
    currentNumber,
    correctCount,
    accuracy,
    init,
    validate,
    nextQuestion,
    skipQuestion,
    reset,
  }
})
