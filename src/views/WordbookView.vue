<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/common/NavBar.vue'
import GroupManager from '@/components/wordstore/GroupManager.vue'
import WordList from '@/components/wordstore/WordList.vue'
import ImportExport from '@/components/wordstore/ImportExport.vue'
import { useWordStore } from '@/stores/wordStore'

const route = useRoute()
const wordStore = useWordStore()

const searchQuery = ref('')
const showCreateModal = ref(false)
const newGroupName = ref('')
const showExportModal = ref(false)
const exportData = ref('')

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
  wordStore.importWords(json)
}

function handleExport() {
  exportData.value = wordStore.exportWords(wordStore.activeGroup)
  showExportModal.value = true
}

function copyExportData() {
  navigator.clipboard.writeText(exportData.value)
  alert('已复制到剪贴板')
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

        <WordList :words="wordStore.currentGroupWords" />
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
    </Teleport>
  </div>
</template>
