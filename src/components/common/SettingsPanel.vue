<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()

const speedOptions = [
  { value: 0.5, label: '慢' },
  { value: 0.9, label: '正常' },
  { value: 1.5, label: '快' },
]

function toggleSetting(key: 'autoPlay' | 'showChinese' | 'fuzzyMatch') {
  settingsStore.toggle(key)
}

function setSpeed(rate: number) {
  settingsStore.update('rate', rate)
}
</script>

<template>
  <div class="card">
    <div class="card-header flex justify-between items-start mb-6">
      <div>
        <div class="card-title text-lg font-bold text-text-primary tracking-tight">设置</div>
        <div class="card-subtitle text-sm text-text-muted">学习偏好</div>
      </div>
    </div>

    <div class="settings-toggle flex items-center gap-3 p-3.5 bg-warm-card rounded-md border border-primary/10 mb-4 transition-all duration-normal hover:bg-accent-light">
      <span class="settings-label flex-1 text-sm font-medium text-text-primary">自动发音</span>
      <div 
        class="settings-switch w-12 h-7 rounded-full relative cursor-pointer transition-all duration-normal"
        :class="settingsStore.settings.autoPlay ? 'bg-gradient-to-r from-primary to-accent' : 'bg-primary/20'"
        @click="toggleSetting('autoPlay')"
      >
        <div 
          class="absolute top-1 w-5 h-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-normal"
          :class="settingsStore.settings.autoPlay ? 'left-6' : 'left-1'"
        ></div>
      </div>
    </div>

    <div class="settings-toggle flex items-center gap-3 p-3.5 bg-warm-card rounded-md border border-primary/10 mb-4 transition-all duration-normal hover:bg-accent-light">
      <span class="settings-label flex-1 text-sm font-medium text-text-primary">模糊匹配</span>
      <div 
        class="settings-switch w-12 h-7 rounded-full relative cursor-pointer transition-all duration-normal"
        :class="settingsStore.settings.fuzzyMatch ? 'bg-gradient-to-r from-primary to-accent' : 'bg-primary/20'"
        @click="toggleSetting('fuzzyMatch')"
      >
        <div 
          class="absolute top-1 w-5 h-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all duration-normal"
          :class="settingsStore.settings.fuzzyMatch ? 'left-6' : 'left-1'"
        ></div>
      </div>
    </div>

    <div class="speed-control flex items-center gap-4 p-3.5 bg-warm-card rounded-md border border-primary/10">
      <span class="speed-label text-sm font-medium text-text-primary w-14">语速</span>
      <div class="speed-buttons flex gap-2 flex-1">
        <button
          v-for="option in speedOptions"
          :key="option.value"
          class="speed-btn flex-1 py-2.5 rounded-lg text-xs font-medium border border-primary/20 bg-white text-text-secondary cursor-pointer transition-all duration-normal"
          :class="settingsStore.settings.rate === option.value ? 'bg-gradient-to-r from-primary to-accent text-white border-transparent' : ''"
          @click="setSpeed(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>
