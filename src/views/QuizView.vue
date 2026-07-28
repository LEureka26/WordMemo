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
import { getWrongList } from '@/services/storage'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()
const wordStore = useWordStore()
const statsStore = useStatsStore()

const showResult = ref(false)
const showRetryWrong = ref(false)
const wrongWords = ref<typeof wordStore.allWords>([])

async function buildReviewWords(mode: string): Promise<typeof wordStore.allWords> {
  const wrongList = await getWrongList()
  if (mode === 'difficult') {
    return wordStore.allWords.filter(w => w.wrong >= 3 && wrongList.includes(w.id))
  }
  return wordStore.allWords.filter(w => wrongList.includes(w.id))
}

async function safePush(path: string) {
  try {
    await router.push(path)
  } catch (error) {
    console.warn('页面跳转失败:', error)
    alert('页面跳转失败，请重试')
  }
}

onMounted(async () => {
  const mode = route.query.mode as string
  if (mode === 'wrong' || mode === 'difficult') {
    try {
      const sourceWords = await buildReviewWords(mode)
      if (sourceWords.length === 0) {
        alert(mode === 'difficult' ? '暂无需复习的难词' : '暂无错题，无需复习')
        await safePush('/')
        return
      }
      quizStore.init(undefined, sourceWords, true)
    } catch {
      alert('加载复习单词失败，请重试')
      await safePush('/')
      return
    }
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

async function handleNext() {
  showResult.value = false
  quizStore.nextQuestion()
  if (quizStore.isFinished) {
    statsStore.checkIn(quizStore.total)
    if (!quizStore.isRetryMode) {
      await statsStore.checkQuizAchievements(quizStore.correctCount, quizStore.total)
    }
  }
}

async function retryWrong() {
  showRetryWrong.value = false
  const wrongIds = new Set(quizStore.results.filter(r => !r.isCorrect).map(r => r.wordId))
  const sourceWords = wordStore.allWords.filter(w => wrongIds.has(w.id))
  quizStore.init(undefined, sourceWords, true)
}

async function handleLater() {
  showRetryWrong.value = false
  await safePush('/')
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

async function backToLearn() {
  await safePush('/')
}

function handleSkip() {
  quizStore.skipQuestion()
  showResult.value = true
}
</script>

<template>
  <div class="app-container max-w-[1440px] mx-auto px-6 min-h-screen flex flex-col">
    <NavBar />

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
