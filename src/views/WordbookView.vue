<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/common/NavBar.vue'
import GroupManager from '@/components/wordstore/GroupManager.vue'
import WordList from '@/components/wordstore/WordList.vue'
import ImportExport from '@/components/wordstore/ImportExport.vue'
import { useWordStore } from '@/stores/wordStore'
import type { Word } from '@/types'

const route = useRoute()
const wordStore = useWordStore()

const searchQuery = ref('')
const showCreateModal = ref(false)
const newGroupName = ref('')
const showExportModal = ref(false)
const exportData = ref('')
const showAddWordModal = ref(false)
const showEditModal = ref(false)
const editingWord = ref<Word | null>(null)
const newWord = ref({
  english: '',
  chinese: '',
  group: ''
})
const importResult = ref<{ success: number; skip: number; fail: number } | null>(null)
const showImportResult = ref(false)
const selectedWordIds = ref<string[]>([])
const isDeleting = ref(false)

function handleGroupSelect(group: string) {
  wordStore.setActive(group)
}

function handleSearch() {
  wordStore.search(searchQuery.value)
}

function openCreateModal() {
  showCreateModal.value = true
}

function createGroup() {
  if (newGroupName.value.trim()) {
    wordStore.create(newGroupName.value.trim())
    newGroupName.value = ''
    showCreateModal.value = false
  }
}

function handleImport(json: string) {
  let success = 0
  let skip = 0
  let fail = 0

  try {
    const words = JSON.parse(json)
    if (Array.isArray(words)) {
      words.forEach((word: any) => {
        if (word.english && word.chinese) {
          const exists = wordStore.allWords.find(w =>
            w.english.toLowerCase() === word.english.toLowerCase() &&
            w.group === (word.group || wordStore.activeGroup)
          )
          if (exists) {
            skip++
          } else {
            wordStore.add({
              english: word.english,
              chinese: Array.isArray(word.chinese) ? word.chinese : [word.chinese],
              group: word.group || wordStore.activeGroup
            })
            success++
          }
        } else {
          fail++
        }
      })
    } else {
      fail++
    }
  } catch {
    fail++
  }

  importResult.value = { success, skip, fail }
  showImportResult.value = true
}

function handleExport() {
  exportData.value = wordStore.exportWords(wordStore.activeGroup)
  showExportModal.value = true
}

function copyExportData() {
  navigator.clipboard.writeText(exportData.value)
  alert('已复制到剪贴板')
}

function openAddWordModal() {
  newWord.value = {
    english: '',
    chinese: '',
    group: wordStore.activeGroup
  }
  showAddWordModal.value = true
}

function addWord() {
  if (newWord.value.english.trim() && newWord.value.chinese.trim()) {
    wordStore.add({
      english: newWord.value.english.trim(),
      chinese: newWord.value.chinese.split(/[,，;；]/).map(s => s.trim()).filter(Boolean),
      group: newWord.value.group || wordStore.activeGroup
    })
    showAddWordModal.value = false
  }
}

function handleSelectWord(word: Word) {
  editingWord.value = { ...word }
  showEditModal.value = true
}

function updateWord() {
  if (editingWord.value) {
    wordStore.update(editingWord.value.id, {
      english: editingWord.value.english,
      chinese: editingWord.value.chinese
    })
    showEditModal.value = false
    editingWord.value = null
  }
}

function deleteWord(wordId: string) {
  if (confirm('确定要删除这个单词吗？')) {
    wordStore.remove(wordId)
    showEditModal.value = false
    editingWord.value = null
  }
}

function deleteGroup(groupName: string) {
  if (groupName === '四级基础') {
    alert('默认分组不能删除')
    return
  }
  if (confirm(`确定要删除分组"${groupName}"吗？该分组下的所有单词将被删除。`)) {
    wordStore.removeGroup(groupName)
  }
}

function handleSelectionChange(ids: string[]) {
  selectedWordIds.value = ids
}

async function batchDeleteWords() {
  if (selectedWordIds.value.length === 0) return

  const confirmed = confirm(`确定要删除选中的 ${selectedWordIds.value.length} 个单词吗？此操作不可恢复。`)
  if (!confirmed) return

  isDeleting.value = true
  try {
    for (const id of selectedWordIds.value) {
      wordStore.remove(id)
    }
    selectedWordIds.value = []
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="app-container max-w-[1440px] mx-auto px-6 min-h-screen flex flex-col">
    <NavBar :current-route="route.name || ''" />

    <div class="flex-1 flex flex-col gap-6 pb-24 md:pb-6">
      <div class="card">
        <div class="card-header flex justify-between items-start mb-6">
          <div>
            <div class="card-title text-lg font-bold text-text-primary tracking-tight">词库管理</div>
            <div class="card-subtitle text-sm text-text-muted">{{ wordStore.activeGroup }} · {{ wordStore.currentGroupWords.length }}词</div>
          </div>
          <span class="pill pill-warning">错题 {{ wordStore.allWords.filter(w => w.wrong > 0).length }}个</span>
        </div>

        <GroupManager 
          :groups="wordStore.groupNames" 
          :active-group="wordStore.activeGroup"
          @select="handleGroupSelect"
          @create="openCreateModal"
          @delete="deleteGroup"
        />

        <div class="search-box relative mb-5">
          <span class="search-icon absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input w-full px-4 py-3.5 pl-12 rounded-md border border-primary/20 text-sm bg-white/80 transition-all duration-normal focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,168,124,0.1)]"
            placeholder="搜索单词..."
            @input="handleSearch"
          />
        </div>

        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-text-muted">共 {{ wordStore.currentGroupWords.length }} 个单词</span>
          <div class="flex gap-2">
            <button
              v-if="selectedWordIds.length > 0"
              class="btn-error text-sm px-4 py-2"
              :disabled="isDeleting"
              @click="batchDeleteWords"
            >
              {{ isDeleting ? '删除中...' : `删除选中 (${selectedWordIds.length})` }}
            </button>
            <button class="btn-secondary text-sm px-4 py-2" @click="openAddWordModal">+ 添加单词</button>
          </div>
        </div>

        <WordList 
          :words="wordStore.currentGroupWords" 
          @select="handleSelectWord"
          @selection-change="handleSelectionChange"
        />
      </div>

      <div class="card">
        <div class="card-header flex justify-between items-start mb-4">
          <div>
            <div class="card-title text-lg font-bold text-text-primary tracking-tight">导入导出</div>
            <div class="card-subtitle text-sm text-text-muted">备份与恢复词库</div>
          </div>
        </div>
        <ImportExport 
          @import="handleImport"
          @export="handleExport"
        />
        <button class="btn-outline w-full mt-4" @click="handleExport">
          导出当前分组
        </button>
      </div>
    </div>

    <Teleport to="body">
      <!-- 创建分组弹窗 -->
      <div 
        v-if="showCreateModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]"
        @click.self="showCreateModal = false"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
          <h3 class="text-lg font-bold text-text-primary mb-4">创建分组</h3>
          <input
            v-model="newGroupName"
            type="text"
            class="w-full px-4 py-3 rounded-md border border-primary/20 mb-4"
            placeholder="分组名称"
          />
          <div class="flex gap-3">
            <button class="btn-outline flex-1" @click="showCreateModal = false">取消</button>
            <button class="btn-primary flex-1" @click="createGroup">创建</button>
          </div>
        </div>
      </div>

      <!-- 导出弹窗 -->
      <div 
        v-if="showExportModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]"
        @click.self="showExportModal = false"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-text-primary">导出数据</h3>
            <button 
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              @click="showExportModal = false"
            >
              ✕
            </button>
          </div>
          <textarea
            :value="exportData"
            class="w-full p-4 rounded-md border border-primary/20 h-48 text-sm font-mono resize-none mb-4"
            readonly
          ></textarea>
          <div class="flex gap-3">
            <button class="btn-outline flex-1" @click="showExportModal = false">关闭</button>
            <button class="btn-primary flex-1" @click="copyExportData">复制</button>
          </div>
        </div>
      </div>

      <!-- 添加单词弹窗 -->
      <div 
        v-if="showAddWordModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]"
        @click.self="showAddWordModal = false"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
          <h3 class="text-lg font-bold text-text-primary mb-4">添加单词</h3>
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm text-text-muted mb-1">英文单词</label>
              <input
                v-model="newWord.english"
                type="text"
                class="w-full px-4 py-3 rounded-md border border-primary/20"
                placeholder="例如：apple"
              />
            </div>
            <div>
              <label class="block text-sm text-text-muted mb-1">中文释义（多个用逗号分隔）</label>
              <input
                v-model="newWord.chinese"
                type="text"
                class="w-full px-4 py-3 rounded-md border border-primary/20"
                placeholder="例如：苹果,苹果公司"
              />
            </div>
            <div>
              <label class="block text-sm text-text-muted mb-1">分组</label>
              <select
                v-model="newWord.group"
                class="w-full px-4 py-3 rounded-md border border-primary/20 bg-white"
              >
                <option v-for="group in wordStore.groupNames" :key="group" :value="group">{{ group }}</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3">
            <button class="btn-outline flex-1" @click="showAddWordModal = false">取消</button>
            <button class="btn-primary flex-1" @click="addWord">添加</button>
          </div>
        </div>
      </div>

      <!-- 编辑单词弹窗 -->
      <div 
        v-if="showEditModal && editingWord"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]"
        @click.self="showEditModal = false"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
          <h3 class="text-lg font-bold text-text-primary mb-4">编辑单词</h3>
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm text-text-muted mb-1">英文单词</label>
              <input
                v-model="editingWord.english"
                type="text"
                class="w-full px-4 py-3 rounded-md border border-primary/20"
              />
            </div>
            <div>
              <label class="block text-sm text-text-muted mb-1">中文释义（多个用逗号分隔）</label>
              <input
                :value="editingWord.chinese.join('，')"
                type="text"
                class="w-full px-4 py-3 rounded-md border border-primary/20"
                @input="editingWord && (editingWord.chinese = ($event.target as HTMLInputElement).value.split(/[,，;；]/).map(s => s.trim()).filter(Boolean))"
              />
            </div>
          </div>
          <div class="flex gap-3">
            <button class="btn-error flex-1" @click="deleteWord(editingWord.id)">删除</button>
            <button class="btn-outline flex-1" @click="showEditModal = false">取消</button>
            <button class="btn-primary flex-1" @click="updateWord">保存</button>
          </div>
        </div>
      </div>

      <!-- 导入结果弹窗 -->
      <div 
        v-if="showImportResult && importResult"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]"
        @click.self="showImportResult = false"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl text-center">
          <h3 class="text-lg font-bold text-text-primary mb-4">导入完成</h3>
          <div class="space-y-2 mb-6">
            <p class="text-success">成功导入 {{ importResult.success }} 个</p>
            <p class="text-text-muted">跳过重复 {{ importResult.skip }} 个</p>
            <p class="text-error">失败 {{ importResult.fail }} 个</p>
          </div>
          <button class="btn-primary w-full" @click="showImportResult = false">确定</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>