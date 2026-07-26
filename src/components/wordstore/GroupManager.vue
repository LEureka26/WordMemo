<script setup lang="ts">
defineProps<{
  groups: string[]
  activeGroup: string
}>()

const emit = defineEmits<{
  (e: 'select', group: string): void
  (e: 'create'): void
  (e: 'delete', group: string): void
}>()
</script>

<template>
  <div class="group-tabs flex gap-2 flex-wrap mb-5">
    <div
      v-for="group in groups"
      :key="group"
      class="group-tab-wrapper relative"
    >
      <button
        class="group-tab px-4.5 py-2.5 rounded-full text-sm font-medium bg-primary/10 text-text-secondary border-none cursor-pointer transition-all duration-normal hover:bg-primary/20"
        :class="activeGroup === group ? 'bg-gradient-to-r from-primary to-accent text-white' : ''"
        @click="emit('select', group)"
      >
        {{ group }}
      </button>
      <button
        v-if="group !== '四级基础'"
        class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-white text-xs flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        @click.stop="emit('delete', group)"
      >
        ✕
      </button>
    </div>
    <button 
      class="group-tab px-4.5 py-2.5 rounded-full text-sm font-medium bg-primary/10 text-text-secondary border-none cursor-pointer transition-all duration-normal hover:bg-primary/20"
      @click="emit('create')"
    >
      + 新建
    </button>
  </div>
</template>