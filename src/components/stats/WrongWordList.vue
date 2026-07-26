<script setup lang="ts">
import type { Word } from '@/types'

const props = defineProps<{
  words: Word[]
}>()

const emit = defineEmits<{
  (e: 'practice'): void
  (e: 'select', word: Word): void
  (e: 'clear'): void
}>()

function getWrongLevelClass(wrong: number): string {
  if (wrong >= 3) return 'bg-error text-white'
  if (wrong >= 2) return 'bg-error/70 text-white'
  return 'bg-error/40 text-white'
}
</script>

<template>
  <div class="card">
    <div class="card-header flex justify-between items-start mb-6">
      <div>
        <div class="card-title text-lg font-bold text-text-primary tracking-tight">错题本</div>
        <div class="card-subtitle text-sm text-text-muted">所有默写错误的单词</div>
      </div>
      <div class="flex gap-2">
        <button
          v-if="words.length > 0"
          class="btn btn-outline text-sm px-3 py-2"
          @click="emit('clear')"
        >
          全部已掌握
        </button>
        <button
          v-if="words.length > 0"
          class="btn btn-primary text-sm px-4 py-2"
          @click="emit('practice')"
        >
          复习错题
        </button>
      </div>
    </div>

    <div class="word-list space-y-3">
      <div
        v-for="word in words"
        :key="word.id"
        class="word-item flex items-center justify-between p-4 bg-warm-card rounded-md border border-error/20 cursor-pointer transition-all duration-normal hover:shadow-md hover:-translate-y-0.5"
        @click="emit('select', word)"
      >
        <div class="word-item-content flex items-center gap-3.5">
          <span
            class="word-item-status w-2.5 h-2.5 rounded-full"
            :class="getWrongLevelClass(word.wrong)"
          ></span>
          <span class="word-item-english font-semibold text-sm text-text-primary">{{ word.english }}</span>
          <span class="word-item-chinese text-xs text-text-muted hidden md:inline">{{ word.chinese[0] }}</span>
        </div>
        <span class="word-item-meta text-xs text-error font-medium">错误 {{ word.wrong }} 次</span>
      </div>

      <div v-if="words.length === 0" class="text-center py-8 text-text-muted">
        暂无错题，继续保持！
      </div>
    </div>
  </div>
</template>
