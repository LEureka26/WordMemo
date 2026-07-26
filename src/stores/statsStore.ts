import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Streak } from '@/types'
import { getStreak, setStreak } from '@/services/storage'
import { getToday, getYesterday } from '@/utils/date'
import { achievements } from '@/data/defaultWords'
import { useWordStore } from './wordStore'

export const useStatsStore = defineStore('stats', () => {
  const streak = ref<Streak>({
    lastDate: '',
    count: 0,
    badges: [],
  })

  const todayProgress = computed(() => {
    const wordStore = useWordStore()
    return {
      learned: wordStore.learnedCount,
      total: wordStore.totalCount,
    }
  })

  const accuracy = computed(() => {
    const wordStore = useWordStore()
    const allWords = wordStore.allWords || []
    const total = allWords.reduce((sum: number, w: { correct: number; wrong: number }) => sum + w.correct + w.wrong, 0)
    if (total === 0) return 0
    const correct = allWords.reduce((sum: number, w: { correct: number }) => sum + w.correct, 0)
    return Math.round((correct / total) * 100)
  })

  async function load() {
    streak.value = await getStreak()
  }

  async function checkIn(wordsCount: number) {
    if (wordsCount < 5) return

    const today = getToday()
    const yesterday = getYesterday()

    if (streak.value.lastDate === today) {
      return
    }

    if (streak.value.lastDate === yesterday) {
      streak.value.count++
    } else {
      streak.value.count = 1
    }

    streak.value.lastDate = today
    await checkAchievements()
    await save()
  }

  async function checkAchievements() {
    const wordStore = useWordStore()
    const learnedWords = wordStore.learnedCount
    const correctCount = wordStore.allWords.reduce((sum: number, w: { correct: number }) => sum + w.correct, 0)
    const totalAnswered = wordStore.allWords.reduce((sum: number, w: { correct: number; wrong: number }) => sum + w.correct + w.wrong, 0)

    achievements.forEach(achievement => {
      if (!streak.value.badges.includes(achievement.id)) {
        if (achievement.condition(streak.value.count, correctCount, totalAnswered, learnedWords)) {
          streak.value.badges.push(achievement.id)
        }
      }
    })
  }

  async function save() {
    await setStreak(streak.value)
  }

  function getBadgeName(id: string): string {
    const achievement = achievements.find(a => a.id === id)
    return achievement?.name || id
  }

  return {
    streak,
    todayProgress,
    accuracy,
    load,
    checkIn,
    save,
    getBadgeName,
  }
})
