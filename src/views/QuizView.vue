<script setup lang="ts">import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBar from '@/components/common/NavBar.vue';
import QuizInput from '@/components/quiz/QuizInput.vue';
import ResultHint from '@/components/quiz/ResultHint.vue';
import ProgressBar from '@/components/learning/ProgressBar.vue';
import { useQuizStore } from '@/stores/quizStore';
import { useWordStore } from '@/stores/wordStore';
import { useStatsStore } from '@/stores/statsStore';
import { keyboardHandler } from '@/services/keyboard';
const route = useRoute();
const router = useRouter();
const quizStore = useQuizStore();
const wordStore = useWordStore();
const statsStore = useStatsStore();
const showResult = ref(false);
const showRetryWrong = ref(false);
onMounted(() => {
 quizStore.init(wordStore.activeGroup);
 keyboardHandler.setConfig({
 onSubmit: () => {
 if (quizStore.userInput.trim()) {
 handleSubmit();
 }
 },
 });
});
function handleSubmit() {
 if (!quizStore.userInput.trim())
 return;
 quizStore.validate(quizStore.userInput);
 showResult.value = true;
}
function handleNext() {
 showResult.value = false;
 quizStore.nextQuestion();
 if (quizStore.isFinished) {
 statsStore.checkIn(quizStore.total);
 if (quizStore.wrongCount > 0) {
 showRetryWrong.value = true;
 }
 }
}
function handleSkip() {
 quizStore.userInput = '';
 quizStore.isCorrect = false;
 quizStore.feedback = '已跳过';
 quizStore.correctAnswer = quizStore.currentWord?.chinese || [];
 quizStore.results.push({
 wordId: quizStore.currentWord?.id || '',
 isCorrect: false,
 userAnswer: '',
 correctAnswer: quizStore.currentWord?.chinese || [],
 timestamp: Date.now(),
 });
 showResult.value = true;
}
function retryWrong() {
 showRetryWrong.value = false;
 quizStore.init(wordStore.activeGroup, true);
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
            <div class="card-title text-lg font-bold text-text-primary tracking-tight">默写练习</div>
            <div class="card-subtitle text-sm text-text-muted">看英文写中文</div>
          </div>
          <span class="pill pill-primary">进行中</span>
        </div>

        <div v-if="!quizStore.isFinished">
          <QuizInput
            :word="quizStore.currentWord"
            :is-correct="quizStore.isCorrect"
            @submit="handleSubmit"
            @skip="handleSkip"
          />

          <ResultHint
            :is-correct="quizStore.isCorrect"
            :feedback="quizStore.feedback"
            :correct-answer="quizStore.correctAnswer"
            @next="handleNext"
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

    <Teleport to="body">
      <div 
        v-if="showRetryWrong"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]"
      >
        <div class="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 text-center shadow-2xl">
          <div class="text-4xl mb-4">❌</div>
          <h3 class="text-xl font-bold text-text-primary mb-2">有 {{ quizStore.wrongCount }} 个单词错误</h3>
          <p class="text-text-secondary mb-6">是否立即复习这些错词？</p>
          <div class="flex gap-3">
            <button class="btn-outline flex-1" @click="backToLearn">稍后复习</button>
            <button class="btn-primary flex-1" @click="retryWrong">立即复习</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
