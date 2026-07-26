<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'import', json: string): void
  (e: 'export'): void
}>()

const importText = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const showSample = ref(false)
const importError = ref('')
const showError = ref(false)

function showErrorMessage(msg: string) {
  importError.value = msg
  showError.value = true
  setTimeout(() => { showError.value = false }, 3000)
}

function handleImportText() {
  if (importText.value.trim()) {
    const content = importText.value.trim()
    const parsed = parseContent(content)
    if (parsed) {
      emit('import', JSON.stringify(parsed))
      importText.value = ''
    }
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    readFile(file)
  }
}

function parseCSV(content: string): any[] | null {
  const lines = content.split(/\r?\n/).filter(line => line.trim())
  if (lines.length === 0) {
    showErrorMessage('CSV 文件为空')
    return null
  }

  const words: any[] = []
  let hasHeader = false
  let startIndex = 0

  const firstLine = lines[0].toLowerCase().trim()
  if (firstLine.includes('english') || firstLine.includes('chinese') || firstLine.includes('word')) {
    hasHeader = true
    startIndex = 1
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const parts = line.split(',')
    if (parts.length >= 2) {
      const english = parts[0].trim()
      const chinese = parts.slice(1).join(',').trim()
      if (english && chinese) {
        words.push({
          english,
          chinese: chinese.split(/[;；]/).map(s => s.trim()).filter(Boolean)
        })
      }
    }
  }

  if (words.length === 0) {
    showErrorMessage('未能从 CSV 文件中解析出有效单词数据')
    return null
  }

  return words
}

function parseText(content: string): any[] | null {
  const lines = content.split(/\r?\n/).filter(line => line.trim())
  if (lines.length === 0) {
    showErrorMessage('文本文件为空')
    return null
  }

  const words: any[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    let english = ''
    let chinese = ''

    const tabMatch = trimmed.match(/^(.+?)\t+(.+)$/)
    if (tabMatch) {
      english = tabMatch[1].trim()
      chinese = tabMatch[2].trim()
    } else {
      const dashMatch = trimmed.match(/^(.+?)(--|——|－－)(.+)$/)
      if (dashMatch) {
        english = dashMatch[1].trim()
        chinese = dashMatch[3].trim()
      } else {
        const colonMatch = trimmed.match(/^(.+?)[:：](.+)$/)
        if (colonMatch) {
          english = colonMatch[1].trim()
          chinese = colonMatch[2].trim()
        } else {
          const spaceMatch = trimmed.match(/^([a-zA-Z\s]+?)\s+(.+)$/)
          if (spaceMatch) {
            english = spaceMatch[1].trim()
            chinese = spaceMatch[2].trim()
          }
        }
      }
    }

    if (english && chinese) {
      words.push({
        english,
        chinese: chinese.split(/[;；]/).map(s => s.trim()).filter(Boolean)
      })
    }
  }

  if (words.length === 0) {
    showErrorMessage('未能从文本文件中解析出有效单词数据，请检查格式')
    return null
  }

  return words
}

function parseContent(content: string): any[] | null {
  content = content.trim()

  if (content.startsWith('[') || content.startsWith('{')) {
    try {
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) {
        return parsed
      } else if (parsed && typeof parsed === 'object') {
        return [parsed]
      }
    } catch {
      showErrorMessage('JSON 格式错误，请检查语法')
      return null
    }
  }

  if (content.includes(',')) {
    const csvResult = parseCSV(content)
    if (csvResult) return csvResult
  }

  const textResult = parseText(content)
  if (textResult) return textResult

  showErrorMessage('无法识别文件格式，请使用 JSON、CSV 或标准文本格式')
  return null
}

function readFile(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    showErrorMessage('文件大小不能超过 5MB')
    return
  }

  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'docx' || ext === 'doc' || ext === 'pdf') {
    showErrorMessage('当前版本暂不支持 .docx/.doc/.pdf 格式导入，请使用 .json 或 .csv 格式')
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    const content = event.target?.result as string
    if (!content || content.trim().length === 0) {
      showErrorMessage('文件内容为空')
      return
    }

    const parsed = parseContent(content)
    if (parsed) {
      emit('import', JSON.stringify(parsed))
    }
  }
  reader.onerror = () => {
    showErrorMessage('文件读取失败，请检查文件是否损坏')
  }
  reader.readAsText(file)
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) {
    readFile(file)
  }
}

function handleExport() {
  emit('export')
}
</script>

<template>
  <div class="space-y-4">
    <div class="p-4 bg-accent-light rounded-lg">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-sm font-semibold text-text-primary">导入单词</h3>
        <button class="text-xs text-primary underline" @click="showSample = true">查看格式示例</button>
      </div>
      <textarea
        v-model="importText"
        class="w-full p-3 rounded-md border border-primary/20 text-sm bg-white resize-none h-24 mb-3"
        placeholder="粘贴 txt 格式的单词数据..."
      ></textarea>
      <div class="flex gap-2 mb-3">
        <button class="btn-secondary px-4 py-2 text-sm" @click="handleImportText">粘贴导入</button>
        <button class="btn-outline px-4 py-2 text-sm" @click="fileInput?.click()">选择文件</button>
        <input 
          ref="fileInput"
          type="file" 
          accept=".json,.csv,.txt" 
          class="hidden"
          @change="handleFileSelect"
        />
      </div>

      <!-- 错误提示 -->
      <div 
        v-if="showError" 
        class="mb-3 p-3 bg-error/10 border border-error/30 rounded-md text-sm text-error"
      >
        {{ importError }}
      </div>

      <div
        class="border-2 border-dashed rounded-lg p-6 text-center transition-colors"
        :class="isDragging ? 'border-primary bg-primary/10' : 'border-primary/30'"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <p class="text-sm text-text-muted">拖拽文件到此处导入</p>
        <p class="text-xs text-text-muted mt-1">支持 .json, .csv, .txt 格式</p>
      </div>
    </div>

    <div class="p-4 bg-secondary/10 rounded-lg">
      <h3 class="text-sm font-semibold text-text-primary mb-3">导出单词</h3>
      <button class="btn-secondary px-4 py-2 text-sm" @click="handleExport">导出 JSON</button>
    </div>

    <!-- 格式示例弹窗 -->
    <Teleport to="body">
      <div 
        v-if="showSample"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]"
        @click.self="showSample = false"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-text-primary">导入格式示例</h3>
            <button 
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              @click="showSample = false"
            >
              ✕
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-semibold text-text-primary mb-2">JSON 格式（推荐）</h4>
              <pre class="bg-gray-100 p-3 rounded-md text-xs font-mono overflow-x-auto">[
  {
    "english": "apple",
    "chinese": ["苹果"],
    "group": "四级基础"
  }
]</pre>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-text-primary mb-2">CSV 格式</h4>
              <pre class="bg-gray-100 p-3 rounded-md text-xs font-mono overflow-x-auto">english,chinese
apple,苹果
banana,香蕉</pre>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-text-primary mb-2">文本格式（每行一个单词）</h4>
              <div class="bg-gray-100 p-3 rounded-md text-xs font-mono space-y-1">
                <p>apple   苹果</p>
                <p>apple--苹果</p>
                <p>apple：苹果</p>
              </div>
            </div>
          </div>

          <button class="btn-primary w-full mt-4" @click="showSample = false">知道了</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>