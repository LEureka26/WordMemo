<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  streak: number
  dailyGoal?: number
  todayLearned?: number
}>()

const progressPercent = computed(() => {
  const goal = props.dailyGoal || 20
  const learned = props.todayLearned || 0
  return Math.min((learned / goal) * 100, 100)
})

const isGoalReached = computed(() => {
  return (props.todayLearned || 0) >= (props.dailyGoal || 20)
})
</script>

<template>
  <div class="streak-card relative overflow-hidden">
    <div class="absolute top-[-20px] right-[-20px] w-[100px] h-[100px] bg-white/10 rounded-full"></div>
    <div class="absolute bottom-[-30px] left-[-30px] w-[80px] h-[80px] bg-white/5 rounded-full"></div>

    <div class="relative z-10">
      <h3 class="text-sm uppercase tracking-widest opacity-90 mb-3">连续打卡</h3>
      <div class="flex items-baseline justify-center gap-1 mb-2">
        <div class="streak-number text-4xl md:text-5xl font-extrabold">{{ streak }}</div>
        <div class="streak-label text-base opacity-90">天</div>
      </div>

      <div class="mt-4">
        <div class="flex justify-between text-xs opacity-80 mb-1">
          <span>今日进度</span>
          <span>{{ todayLearned || 0 }}/{{ dailyGoal || 20 }}</span>
        </div>
        <div class="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            class="h-full bg-white/80 rounded-full transition-all duration-slow"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
        <div v-if="isGoalReached" class="text-xs text-center mt-2 opacity-90 font-medium">
          今日目标已达成！
        </div>
      </div>
    </div>
  </div>
</template>
