import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizStore } from '@/stores/quizStore'
import { useWordStore } from '@/stores/wordStore'
import * as storage from '@/services/storage'

vi.mock('@/services/storage', () => ({
  incrementWordCorrect: vi.fn(),
  incrementWordWrong: vi.fn(),
  getWrongList: vi.fn(() => Promise.resolve([])),
  setWrongList: vi.fn(),
}))

describe('quizStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('init with wrong list mode', () => {
    const quizStore = useQuizStore()
    quizStore.init(undefined, true)
    expect(quizStore.isRetryMode).toBe(true)
  })

  it('init without wrong list mode', () => {
    const quizStore = useQuizStore()
    quizStore.init('四级基础', false)
    expect(quizStore.isRetryMode).toBe(false)
  })

  it('validate correct answer', async () => {
    const quizStore = useQuizStore()
    const wordStore = useWordStore()
    wordStore.wordGroups = {
      '四级基础': [
        { id: '1', english: 'apple', chinese: ['苹果'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
      ],
    }
    wordStore.activeGroup = '四级基础'
    quizStore.init('四级基础')

    await quizStore.validate('苹果')
    expect(quizStore.isCorrect).toBe(true)
    expect(quizStore.results.length).toBe(1)
  })

  it('validate wrong answer increments wrong count', async () => {
    const quizStore = useQuizStore()
    const wordStore = useWordStore()
    wordStore.wordGroups = {
      '四级基础': [
        { id: '1', english: 'apple', chinese: ['苹果'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
      ],
    }
    wordStore.activeGroup = '四级基础'
    quizStore.init('四级基础')

    await quizStore.validate('香蕉')
    expect(quizStore.isCorrect).toBe(false)
    expect(quizStore.wrongCount).toBe(1)
  })
})
