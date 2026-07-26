<script setup lang="ts">
import { watch, ref } from 'vue'

const props = defineProps<{
  isCorrect: boolean | null
  feedback: string
  correctAnswer: string[]
  wordDetail?: string
}>()

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'prev'): void
}>()

const isVisible = ref(false)

watch(() => props.isCorrect, (newVal) => {
  if (newVal !== null) {
    isVisible.value = true
  }
})
</script>

<template>
  <Transition name="slide">
    <div 
      v-if="isVisible && isCorrect !== null"
      class="quiz-feedback mt-6 p-5 rounded-md"
      :class="isCorrect ? 'bg-success/15 border-l-4 border-success' : 'bg-error/15 border-l-4 border-error'"
    >
      <div class="feedback-icon text-2xl mb-2">{{ isCorrect ? '✓' : '✕' }}</div>
      <div class="feedback-text text-base font-medium text-text-primary">{{ feedback }}</div>
      <div class="feedback-detail text-sm text-text-secondary mt-2">
        正确答案：{{ correctAnswer.join('；') }}
      </div>
      <div v-if="wordDetail" class="feedback-detail text-sm text-text-secondary mt-2">
        详细释义：{{ wordDetail }}
      </div>
      <div class="flex gap-3 mt-4">
        <button class="btn btn-outline" @click="emit('prev')">上一题</button>
        <button class="btn btn-primary" @click="emit('next')">下一题</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
