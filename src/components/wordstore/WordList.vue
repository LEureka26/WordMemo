<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Word } from '@/types'

const props = defineProps<{
  words: Word[]
  activeWordId?: string
  showCheckbox?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', word: Word): void
  (e: 'selectionChange', selectedIds: string[]): void
}>()

const selectedIds = ref<string[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const pageSizeOptions = [10, 20, 50]

const totalPages = computed(() => {
  if (props.words.length === 0) return 1
  return Math.ceil(props.words.length / pageSize.value)
})

const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.words.slice(start, end)
})

const visiblePageNumbers = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

watch(() => props.words, () => {
  currentPage.value = 1
}, { deep: true })

watch(pageSize, (newSize, oldSize) => {
  const currentIndex = (currentPage.value - 1) * oldSize
  currentPage.value = Math.floor(currentIndex / newSize) + 1
  currentPage.value = Math.min(currentPage.value, totalPages.value)
})

const isAllSelected = computed(() => {
  return paginatedWords.value.length > 0 && selectedIds.value.length === props.words.length
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

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<template>
  <div class="word-list space-y-3">
    <!-- 批量操作栏 -->
    <div v-if="showCheckbox && words.length > 0" class="flex items-center gap-3 p-3 bg-accent-light rounded-md">
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

    <TransitionGroup
      name="word-list"
      tag="div"
      class="space-y-3"
    >
      <div
        v-for="word in paginatedWords"
        :key="word.id"
        class="word-item flex items-center justify-between p-4 bg-warm-card rounded-md border border-primary/10 transition-all duration-normal cursor-pointer hover:bg-accent-light hover:translate-x-1"
        :class="{ 'border-primary bg-primary/5': activeWordId === word.id }"
        @click="handleRowClick(word, $event)"
      >
        <div class="word-item-content flex items-center gap-3.5">
          <label v-if="showCheckbox" class="checkbox-wrapper flex items-center cursor-pointer" @click.stop>
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
    </TransitionGroup>

    <div v-if="words.length === 0" class="text-center py-8 text-text-muted">
      暂无单词
    </div>

    <!-- 分页控件 -->
    <div v-if="words.length > 0" class="pagination-wrapper flex flex-col items-center gap-4 pt-4 border-t border-primary/10">
      <div class="flex items-center justify-center gap-4 flex-wrap">
        <div class="flex items-center gap-1.5">
          <button
            class="px-3 py-1.5 rounded text-sm transition-all duration-normal"
            :class="currentPage === 1 ? 'text-text-muted cursor-not-allowed' : 'text-text-primary hover:bg-primary/10'"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            上一页
          </button>

          <button
            v-for="page in visiblePageNumbers"
            :key="page"
            class="min-w-[32px] px-2 py-1.5 rounded text-sm transition-all duration-normal"
            :class="page === currentPage
              ? 'bg-gradient-to-r from-primary to-accent text-white'
              : page === '...'
                ? 'text-text-muted cursor-default'
                : 'text-text-primary hover:bg-primary/10'"
            :disabled="page === '...'"
            @click="typeof page === 'number' && goToPage(page)"
          >
            {{ page }}
          </button>

          <button
            class="px-3 py-1.5 rounded text-sm transition-all duration-normal"
            :class="currentPage === totalPages ? 'text-text-muted cursor-not-allowed' : 'text-text-primary hover:bg-primary/10'"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            下一页
          </button>
        </div>

        <div class="flex items-center gap-2 pl-4 border-l border-primary/10">
          <span class="text-xs text-text-muted">每页</span>
          <select
            v-model="pageSize"
            class="px-2 py-1 rounded border border-primary/20 text-sm bg-white focus:outline-none focus:border-primary"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
          </select>
          <span class="text-xs text-text-muted">条</span>
        </div>
      </div>

      <div class="text-xs text-text-muted">
        共 {{ words.length }} 条，第 {{ currentPage }}/{{ totalPages }} 页
      </div>
    </div>
  </div>
</template>

<style scoped>
.word-list-enter-active,
.word-list-leave-active {
  transition: all 0.3s ease;
}

.word-list-enter-from,
.word-list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.word-list-move {
  transition: transform 0.3s ease;
}
</style>
