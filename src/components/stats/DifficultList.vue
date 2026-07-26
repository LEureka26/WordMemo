<script setup lang="ts">
import type { Word } from '@/types'

defineProps<{
  words: Word[]
}>()

const emit = defineEmits<{
  (e: 'practice'): void
}>()
</script>

<template>
  <div class="card">
    <div class="card-header flex justify-between items-start mb-6">
      <div>
        <div class="card-title text-lg font-bold text-text-primary tracking-tight">难词本</div>
        <div class="card-subtitle text-sm text-text-muted">错误 3 次以上的单词</div>
      </div>
      <button 
        v-if="words.length > 0"
        class="btn btn-primary text-sm px-4 py-2"
        @click="emit('practice')"
      >
        复习难词
      </button>
    </div>

    <div class="word-list space-y-3">
      <div
        v-for="word in words"
        :key="word.id"
        class="word-item flex items-center justify-between p-4 bg-warm-card rounded-md border border-error/20"
      >
        <div class="word-item-content flex items-center gap-3.5">
          <span class="word-item-status w-2.5 h-2.5 rounded-full bg-error"></span>
          <span class="word-item-english font-semibold text-sm text-text-primary">{{ word.english }}</span>
          <span class="word-item-chinese text-xs text-text-muted hidden md:inline">{{ word.chinese[0] }}</span>
        </div>
        <span class="word-item-meta text-xs text-error font-medium">错误 {{ word.wrong }} 次</span>
      </div>

      <div v-if="words.length === 0" class="text-center py-8 text-text-muted">
        暂无难词，继续保持！
      </div>
    </div>
  </div>
</template>
