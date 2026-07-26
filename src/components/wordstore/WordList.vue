<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Word } from '@/types'

const props = defineProps<{
  words: Word[]
  activeWordId?: string
}>()

const emit = defineEmits<{
  (e: 'select', word: Word): void
  (e: 'selectionChange', selectedIds: string[]): void
}>()

const selectedIds = ref<string[]>([])

const isAllSelected = computed(() => {
  return props.words.length > 0 && selectedIds.value.length === props.words.length
})

const isIndeterminate = computed(() => {
  return selectedIds.value.length > 0 && selectedIds.value.length < props.words.length
})

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = props.words.map(w => w.id)
  }
  emit('selectionChange', selectedIds.value)
}

function toggleSelect(wordId: string) {
  const index = selectedIds.value.indexOf(wordId)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(wordId)
  }
  emit('selectionChange', [...selectedIds.value])
}

function handleRowClick(word: Word, event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.closest('.checkbox-wrapper')) {
    return
  }
  emit('select', word)
}

function getStatusClass(word: Word): string {
  if (word.learned) return 'learned'
  if (word.wrong > 0) return 'learning'
  return 'new'
}

function getStatusLabel(word: Word): string {
  if (word.learned) return '已掌握'
  if (word.wrong > 0) return '学习中'
  return '未学习'
}
</script>

<template>
  <div class="word-list space-y-3">
    <!-- 批量操作栏 -->
    <div v-if="words.length > 0" class="flex items-center gap-3 p-3 bg-accent-light rounded-md">
      <label class="checkbox-wrapper flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          :checked="isAllSelected"
          :indeterminate="isIndeterminate"
          class="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary"
          @change="toggleSelectAll"
        />
        <span class="text-sm text-text-secondary">全选</span>
      </label>
      <span v-if="selectedIds.length > 0" class="text-xs text-text-muted">
        已选择 {{ selectedIds.length }} 个
      </span>
    </div>

    <div
      v-for="word in words"
      :key="word.id"
      class="word-item flex items-center justify-between p-4 bg-warm-card rounded-md border border-primary/10 transition-all duration-normal cursor-pointer hover:bg-accent-light hover:translate-x-1"
      :class="{ 'border-primary bg-primary/5': activeWordId === word.id }"
      @click="handleRowClick(word, $event)"
    >
      <div class="word-item-content flex items-center gap-3.5">
        <label class="checkbox-wrapper flex items-center cursor-pointer" @click.stop>
          <input
            type="checkbox"
            :checked="selectedIds.includes(word.id)"
            class="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary"
            @change="toggleSelect(word.id)"
          />
        </label>
        <span 
          class="word-item-status w-2.5 h-2.5 rounded-full flex-shrink-0"
          :class="getStatusClass(word)"
        ></span>
        <span class="word-item-english font-semibold text-sm text-text-primary">{{ word.english }}</span>
        <span class="word-item-chinese text-xs text-text-muted hidden md:inline">{{ word.chinese[0] }}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="word-item-meta text-xs text-text-muted">
          {{ word.correct }}/{{ word.wrong }}
        </span>
        <span 
          class="text-xs px-2 py-0.5 rounded-full"
          :class="{
            'bg-success/20 text-success': word.learned,
            'bg-warning/20 text-warning': word.wrong > 0 && !word.learned,
            'bg-gray-200 text-text-muted': !word.learned && word.wrong === 0
          }"
        >
          {{ getStatusLabel(word) }}
        </span>
      </div>
    </div>

    <div v-if="words.length === 0" class="text-center py-8 text-text-muted">
      暂无单词
    </div>
  </div>
</template>