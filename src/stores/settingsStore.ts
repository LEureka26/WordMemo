import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Settings } from '@/types'
import { getSettings, setSettings } from '@/services/storage'
import { audioService } from '@/services/audio'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>({
    autoPlay: true,
    rate: 0.9,
    showChinese: false,
    fuzzyMatch: false,
  })

  async function load() {
    settings.value = await getSettings()
    audioService.setRate(settings.value.rate)
  }

  async function update(key: keyof Settings, value: Settings[keyof Settings]) {
    settings.value[key] = value as never
    await setSettings(settings.value)
    
    if (key === 'rate') {
      audioService.setRate(value as number)
    }
  }

  async function toggle(key: 'autoPlay' | 'showChinese' | 'fuzzyMatch') {
    settings.value[key] = !settings.value[key]
    await setSettings(settings.value)
  }

  return {
    settings,
    load,
    update,
    toggle,
  }
})
