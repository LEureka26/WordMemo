<script setup lang="ts">
import { onMounted } from 'vue'
import { useWordStore } from '@/stores/wordStore'
import { useStatsStore } from '@/stores/statsStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { audioService } from '@/services/audio'
import { keyboardHandler } from '@/services/keyboard'

const wordStore = useWordStore()
const statsStore = useStatsStore()
const settingsStore = useSettingsStore()

onMounted(async () => {
  await wordStore.load()
  await statsStore.load()
  await settingsStore.load()
  keyboardHandler.init()
})

function handleActivateAudio() {
  audioService.activate()
}

defineExpose({ handleActivateAudio })
</script>

<template>
  <div class="min-h-screen bg-warm-bg">
    <router-view />
  </div>
</template>
