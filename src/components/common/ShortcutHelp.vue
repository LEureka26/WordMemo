<script setup lang="ts">
defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const shortcuts = [
  { keys: ['←', '→'], description: '切换单词', scene: '学习模式' },
  { keys: ['Space'], description: '发音', scene: '学习模式' },
  { keys: ['Enter'], description: '提交答案', scene: '默写模式' },
  { keys: ['Ctrl+Enter'], description: '提交答案', scene: '默写模式' },
  { keys: ['1', '2', '3'], description: '语速调节', scene: '全局' },
  { keys: ['?'], description: '显示帮助', scene: '全局' },
]
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="visible" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
        @click.self="emit('close')"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-text-primary">快捷键帮助</h3>
            <button 
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-muted hover:bg-gray-200 transition-colors"
              @click="emit('close')"
            >
              ✕
            </button>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="shortcut in shortcuts" 
              :key="shortcut.description"
              class="flex items-center justify-between py-2 border-b border-gray-100"
            >
              <div>
                <div class="text-sm font-medium text-text-primary">{{ shortcut.description }}</div>
                <div class="text-xs text-text-muted">{{ shortcut.scene }}</div>
              </div>
              <div class="flex gap-1">
                <span 
                  v-for="key in shortcut.keys" 
                  :key="key"
                  class="px-2 py-1 bg-accent-light rounded text-xs font-mono font-bold text-primary"
                >
                  {{ key }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
