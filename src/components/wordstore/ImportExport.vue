<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'import', json: string): void
  (e: 'export'): void
}>()

const importText = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

function handleImportText() {
  if (importText.value.trim()) {
    emit('import', importText.value.trim())
    importText.value = ''
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      emit('import', content)
    }
    reader.readAsText(file)
  }
}

function handleExport() {
  emit('export')
}
</script>

<template>
  <div class="space-y-4">
    <div class="p-4 bg-accent-light rounded-lg">
      <h3 class="text-sm font-semibold text-text-primary mb-3">导入单词</h3>
      <textarea
        v-model="importText"
        class="w-full p-3 rounded-md border border-primary/20 text-sm bg-white resize-none h-24 mb-3"
        placeholder="粘贴 JSON 格式的单词数据..."
      ></textarea>
      <div class="flex gap-2">
        <button class="btn-secondary px-4 py-2 text-sm" @click="handleImportText">粘贴导入</button>
        <button class="btn-outline px-4 py-2 text-sm" @click="fileInput?.click()">选择文件</button>
        <input 
          ref="fileInput"
          type="file" 
          accept=".json,.csv" 
          class="hidden"
          @change="handleFileSelect"
        />
      </div>
    </div>

    <div class="p-4 bg-secondary/10 rounded-lg">
      <h3 class="text-sm font-semibold text-text-primary mb-3">导出单词</h3>
      <button class="btn-secondary px-4 py-2 text-sm" @click="handleExport">导出 JSON</button>
    </div>
  </div>
</template>
