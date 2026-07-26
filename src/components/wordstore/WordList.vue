<script setup lang="ts">
import type { Word } from '@/types'

defineProps<{
  words: Word[]
  activeWordId?: string
}>()

const emit = defineEmits<{
  (e: 'select', word: Word): void
}>()

function getStatusClass(word: Word): string {
  if (word.learned) return 'learned'
  if (word.wrong > 0) return 'learning'
  return 'new'
}
</script>

<template>
  <div class="word-list space-y-3">
    <div
      v-for="word in words"
      :key="word.id"
      class="word-item flex items-center justify-between p-4 bg-warm-card rounded-md border border-primary/10 transition-all duration-normal cursor-pointer hover:bg-accent-light hover:translate-x-1"
      :class="{ 'border-primary bg-primary/5': activeWordId === word.id }"
      @click="emit('select', word)"
    >
      <div class="word-item-content flex items-center gap-3.5">
        <span 
          class="word-item-status w-2.5 h-2.5 rounded-full flex-shrink-0"
          :class="getStatusClass(word)"
        ></span>
        <span class="word-item-english font-semibold text-sm text-text-primary">{{ word.english }}</span>
        <span class="word-item-chinese text-xs text-text-muted hidden md:inline">{{ word.chinese[0] }}</span>
      </div>
      <span class="word-item-meta text-xs text-text-muted">
        {{ word.correct }}/{{ word.wrong }}
      </span>
    </div>

    <div v-if="words.length === 0" class="text-center py-8 text-text-muted">
      暂无单词
    </div>
  </div>
</template>
