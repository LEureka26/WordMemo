<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Word } from '@/types'

const props = defineProps<{
  word: Word | null
  isCorrect: boolean | null
  input: string
  currentIndex: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'update:input', value: string): void
  (e: 'submit', input: string): void
  (e: 'skip'): void
  (e: 'next'): void
  (e: 'prev'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const inputValue = computed({
  get: () => props.input,
  set: (val) => emit('update:input', val)
})

watch(() => props.word, () => {
  emit('update:input', '')
  setTimeout(() => {
    inputRef.value?.focus()
  }, 100)
})

function handleSubmit() {
  const value = props.input.trim()
  if (value) {
    emit('submit', value)
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleSubmit()
  }
}

function handleSkip() {
  emit('skip')
}
</script>

<template>
  <div class="quiz-section">
    <div class="quiz-word-display text-center mb-8">
      <h2 class="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mb-3">
        {{ word?.english || '-' }}
      </h2>
      <p class="text-lg text-text-muted italic">
        /{{ word?.english?.toLowerCase() || '' }}/
      </p>
    </div>

    <div class="quiz-input-group mb-6">
      <label class="quiz-input-label block text-xs uppercase tracking-widest text-text-muted mb-3">你的答案</label>
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        class="quiz-input w-full px-6 py-5 rounded-md border-2 border-primary/20 text-lg bg-white/80 transition-all duration-normal focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(232,168,124,0.1)]"
        :class="{ 
          'border-success bg-success/10': isCorrect === true,
          'border-error bg-error/10': isCorrect === false,
        }"
        placeholder="输入中文释义"
        @keydown="handleKeydown"
      />
    </div>

    <div class="quiz-actions flex gap-4">
      <button class="btn btn-outline" @click="handleSkip">跳过</button>
      <button class="btn btn-primary" @click="handleSubmit">提交</button>
      <button v-if="currentIndex > 0" class="btn btn-outline" @click="emit('prev')">上一题</button>
      <button v-if="currentIndex < total - 1" class="btn btn-primary" @click="emit('next')">下一题</button>
    </div>
  </div>
</template>
