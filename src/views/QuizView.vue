<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/common/NavBar.vue'
import QuizInput from '@/components/quiz/QuizInput.vue'
import ResultHint from '@/components/quiz/ResultHint.vue'
import ProgressBar from '@/components/learning/ProgressBar.vue'
import WrongWordReview from '@/components/quiz/WrongWordReview.vue'
import { useQuizStore } from '@/stores/quizStore'
import { useWordStore } from '@/stores/wordStore'
import { useStatsStore } from '@/stores/statsStore'
import { keyboardHandler } from '@/services/keyboard'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()
const wordStore = useWordStore()
const statsStore = useStatsStore()

const showResult = ref(false)
const showRetryWrong = ref(false)
const wrongWords = ref<typeof wordStore.allWords>([])

onMounted(() => {
  const mode = route.query.mode as string
  if (mode === 'wrong' || mode === 'difficult') {
    const sourceWords = mode === 'difficult'
      ? wordStore.allWords.filter(w => w.wrong >= 3)
      : wordStore.allWords.filter(w => w.wrong > 0)
    if (sourceWords.length === 0) {
      alert('暂无错题，无需复习')
      router.push('/')
      return
    }
    quizStore.init(undefined, true)
  } else {
    quizStore.init(wordStore.activeGroup)
  }

  keyboardHandler.setConfig({
    onSubmit: () => {
      if (quizStore.userInput.trim()) {
        handleSubmit()
      }
    },
  })
})

watch(() => quizStore.isFinished, (finished) => {
  if (finished && quizStore.wrongCount > 0 && !quizStore.isRetryMode) {
    wrongWords.value = quizStore.results
      .filter(r => !r.isCorrect)
      .map(r => wordStore.getWordById(r.wordId))
      .filter((w): w is NonNullable<typeof w> => w !== undefined)
    showRetryWrong.value = true
  }
})

function handleSubmit() {
  if (!quizStore.userInput.trim()) return
  quizStore.validate(quizStore.userInput)
  showResult.value = true
}

function handleNext() {
  showResult.value = false
  quizStore.nextQuestion()
  if (quizStore.isFinished) {
    statsStore.checkIn(quizStore.total)
  }
}

function handleSkip() {
  quizStore.userInput = ''
  quizStore.isCorrect = false
  quizStore.feedback = '已跳过'
  quizStore.correctAnswer = quizStore.currentWord?.chinese || []
  quizStore.results.push({
    wordId: quizStore.currentWord?.id || '',
    isCorrect: false,
    userAnswer: '',
    correctAnswer: quizStore.currentWord?.chinese || [],
    timestamp: Date.now(),
  })
  showResult.value = true
}

function retryWrong() {
  showRetryWrong.value = false
  quizStore.init(wordStore.activeGroup, true)
}

function handleLater() {
  showRetryWrong.value = false
  router.push('/')
}

function handlePrev() {
  if (quizStore.currentIndex > 0) {
    quizStore.currentIndex--
    quizStore.userInput = ''
    quizStore.isCorrect = null
    quizStore.feedback = ''
    quizStore.correctAnswer = []
    showResult.value = false
  }
}

function backToLearn() {
  router.push('/')
}
</script>

<template>
  <div class="app-container max-w-[1440px] mx-auto px-6 min-h-screen flex flex-col">
    <NavBar :current-route="route.name || ''" />

    <div class="flex-1 flex flex-col gap-6 pb-24 md:pb-6">
      <div class="card">
        <div class="card-header flex justify-between items-start mb-6">
          <div>
            <div class="card-title text-lg font-bold text-text-primary tracking-tight">
              默写练习
              <span v-if="quizStore.isRetryMode" class="ml-2 text-sm text-error">(错题复习)</span>
            </div>
            <div class="card-subtitle text-sm text-text-muted">看英文写中文</div>
          </div>
          <span class="pill pill-primary">进行中</span>
        </div>

        <div v-if="!quizStore.isFinished">
          <QuizInput
            :word="quizStore.currentWord"
            :is-correct="quizStore.isCorrect"
            :current-index="quizStore.currentIndex"
            :total="quizStore.total"
            :is-difficult="quizStore.currentWord ? quizStore.currentWord.wrong >= 3 : false"
            v-model:input="quizStore.userInput"
            @submit="handleSubmit"
            @skip="handleSkip"
            @next="handleNext"
            @prev="handlePrev"
          />

          <ResultHint
            :is-correct="quizStore.isCorrect"
            :feedback="quizStore.feedback"
            :correct-answer="quizStore.correctAnswer"
            @next="handleNext"
            @prev="handlePrev"
          />
        </div>

        <div v-else class="text-center py-8">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold text-text-primary mb-2">默写完成！</h3>
          <p class="text-text-secondary mb-6">
            正确 {{ quizStore.correctCount }} / {{ quizStore.total }}
            ({{ quizStore.accuracy }}%)
          </p>

          <div class="flex flex-col gap-3">
            <button class="btn-primary" @click="quizStore.init(wordStore.activeGroup)">
              再来一轮
            </button>
            <button class="btn-outline" @click="backToLearn">
              返回学习
            </button>
          </div>
        </div>
      </div>

      <ProgressBar
        v-if="!quizStore.isFinished"
        :progress="quizStore.progress"
        :current="quizStore.currentNumber"
        :total="quizStore.total"
      />
    </div>

    <WrongWordReview
      v-if="showRetryWrong"
      :wrong-words="wrongWords"
      @review="retryWrong"
      @later="handleLater"
    />
  </div>
</template>
