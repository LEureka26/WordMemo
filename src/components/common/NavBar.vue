<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { BookOpen, PenLine, Library, BarChart3 } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: '学习', path: '/', icon: BookOpen },
  { name: '默写', path: '/quiz', icon: PenLine },
  { name: '词库', path: '/wordbook', icon: Library },
  { name: '统计', path: '/stats', icon: BarChart3 },
]

const activePath = computed(() => {
  return typeof route.path === 'string' ? route.path : '/'
})
</script>

<template>
  <header class="desktop-header hidden md:flex items-center justify-between py-5 mb-6">
    <div class="logo flex items-center gap-3">
      <div class="logo-icon w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-[0_8px_24px_rgba(232,168,124,0.3)]">
        W
      </div>
      <div class="logo-text">
        <h1 class="text-lg font-bold tracking-tight">WordMemo</h1>
        <p class="text-xs text-text-muted tracking-widest uppercase">阳光学习</p>
      </div>
    </div>
    <nav class="desktop-nav flex gap-2">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item px-5 py-3 rounded-full text-sm font-medium transition-all duration-normal relative"
        :class="activePath === item.path ? 'bg-gradient-to-r from-primary to-accent text-white shadow-[0_8px_24px_rgba(232,168,124,0.3)]' : 'text-text-secondary hover:bg-accent-light hover:text-text-primary'"
      >
        {{ item.name }}
      </router-link>
    </nav>
  </header>

  <header class="mobile-header md:hidden flex items-center justify-between py-4 mb-4">
    <div class="logo flex items-center gap-2">
      <div class="logo-icon w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-[0_8px_24px_rgba(232,168,124,0.3)]">
        W
      </div>
      <div class="logo-text">
        <h1 class="text-sm font-bold">WordMemo</h1>
        <p class="text-[10px] text-text-muted tracking-wider uppercase">阳光学习</p>
      </div>
    </div>
  </header>

  <nav class="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-white py-3 shadow-[0_-8px_32px_rgba(232,168,124,0.1)] border-t border-primary/10 z-50">
    <div class="mobile-nav-items flex justify-around">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="mobile-nav-item flex flex-col items-center gap-1 text-xs font-medium px-4 py-2 rounded-xl transition-all duration-normal"
        :class="activePath === item.path ? 'text-primary bg-accent-light' : 'text-text-muted'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        {{ item.name }}
      </router-link>
    </div>
  </nav>
</template>
