<script setup lang="ts">
import { computed } from 'vue'
import type { Word } from '@/types'

const props = defineProps<{
  wrongWords: Word[]
}>()

const emit = defineEmits<{
  (e: 'review'): void
  (e: 'later'): void
}>()

const wrongCount = computed(() => props.wrongWords.length)
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]">
      <div class="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div class="text-center">
          <div class="text-4xl mb-4">❌</div>
          <h3 class="text-xl font-bold text-text-primary mb-2">
            有 <span class="text-error">{{ wrongCount }}</span> 个单词错误
          </h3>
          <p class="text-text-secondary mb-6">是否立即复习这些错词？</p>
        </div>

        <div class="wrong-list max-h-48 overflow-y-auto mb-6 space-y-2">
          <div
            v-for="word in wrongWords"
            :key="word.id"
            class="flex items-center justify-between p-3 bg-error/5 rounded-lg border border-error/10"
          >
            <span class="font-semibold text-sm text-text-primary">{{ word.english }}</span>
            <span class="text-xs text-error">错误 {{ word.wrong }} 次</span>
          </div>
        </div>

        <div class="flex gap-3">
          <button class="btn-outline flex-1" @click="emit('later')">稍后复习</button>
          <button class="btn-primary flex-1" @click="emit('review')">立即复习</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
