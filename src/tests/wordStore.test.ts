import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWordStore } from '@/stores/wordStore'

describe('wordStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('getDifficultWords returns words with wrong >= 3', () => {
    const wordStore = useWordStore()
    wordStore.wordGroups = {
      '四级基础': [
        { id: '1', english: 'apple', chinese: ['苹果'], group: '四级基础', correct: 0, wrong: 3, lastReview: 0, learned: false },
        { id: '2', english: 'banana', chinese: ['香蕉'], group: '四级基础', correct: 0, wrong: 1, lastReview: 0, learned: false },
        { id: '3', english: 'cherry', chinese: ['樱桃'], group: '四级基础', correct: 0, wrong: 5, lastReview: 0, learned: false },
      ],
    }
    const difficult = wordStore.getDifficultWords()
    expect(difficult.length).toBe(2)
    expect(difficult.map(w => w.english)).toContain('apple')
    expect(difficult.map(w => w.english)).toContain('cherry')
  })
})
