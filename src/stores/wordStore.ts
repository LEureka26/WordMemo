import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Word } from '@/types'
import { generateUUID } from '@/utils/uuid'
import { getWordGroups, setWordGroups, getActiveGroup, setActiveGroup, addWord, updateWord, deleteWord, createGroup, deleteGroup, clearWrongWords } from '@/services/storage'

export const useWordStore = defineStore('word', () => {
  const wordGroups = ref<Record<string, Word[]>>({})
  const activeGroup = ref('四级基础')
  const searchQuery = ref('')

  const allWords = computed(() => {
    return Object.values(wordGroups.value).flat()
  })

  const currentGroupWords = computed(() => {
    let words = wordGroups.value[activeGroup.value] || []
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      words = words.filter(w => 
        w.english.toLowerCase().includes(query) ||
        w.chinese.some(c => c.toLowerCase().includes(query))
      )
    }
    return words
  })

  const groupNames = computed(() => {
    return Object.keys(wordGroups.value)
  })

  const learnedCount = computed(() => {
    return allWords.value.filter(w => w.learned).length
  })

  const totalCount = computed(() => {
    return allWords.value.length
  })

  async function load() {
    wordGroups.value = await getWordGroups()
    activeGroup.value = await getActiveGroup()
  }

  function getWordById(id: string): Word | undefined {
    for (const group of Object.values(wordGroups.value)) {
      const word = group.find(w => w.id === id)
      if (word) return word
    }
    return undefined
  }

  async function setActive(group: string) {
    activeGroup.value = group
    await setActiveGroup(group)
  }

  async function add(word: Omit<Word, 'id' | 'correct' | 'wrong' | 'lastReview' | 'learned'>) {
    const newWord: Word = {
      ...word,
      id: generateUUID(),
      correct: 0,
      wrong: 0,
      lastReview: 0,
      learned: false,
    }
    await addWord(newWord)
    if (!wordGroups.value[word.group]) {
      wordGroups.value[word.group] = []
    }
    wordGroups.value[word.group].push(newWord)
  }

  async function update(id: string, updates: Partial<Word>) {
    await updateWord(id, updates)
    const word = getWordById(id)
    if (word) {
      Object.assign(word, updates)
    }
  }

  async function remove(id: string) {
    await deleteWord(id)
    for (const group of Object.values(wordGroups.value)) {
      const index = group.findIndex(w => w.id === id)
      if (index !== -1) {
        group.splice(index, 1)
        break
      }
    }
  }

  async function create(groupName: string) {
    await createGroup(groupName)
    if (!wordGroups.value[groupName]) {
      wordGroups.value[groupName] = []
    }
  }

  async function removeGroup(groupName: string) {
    await deleteGroup(groupName)
    delete wordGroups.value[groupName]
    if (activeGroup.value === groupName) {
      activeGroup.value = Object.keys(wordGroups.value)[0] || '四级基础'
    }
  }

  function search(query: string) {
    searchQuery.value = query
  }

  function getDifficultWords(): Word[] {
    return allWords.value.filter(w => w.wrong >= 3)
  }

  function importWords(json: string): void {
    try {
      const words: Word[] = JSON.parse(json)
      words.forEach(word => {
        if (!wordGroups.value[word.group]) {
          wordGroups.value[word.group] = []
        }
        if (!wordGroups.value[word.group].find(w => w.id === word.id)) {
          wordGroups.value[word.group].push(word)
        }
      })
      setWordGroups(wordGroups.value)
    } catch {
      throw new Error('Invalid JSON format')
    }
  }

  function exportWords(group?: string): string {
    let words: Word[]
    if (group && wordGroups.value[group]) {
      words = wordGroups.value[group]
    } else {
      words = allWords.value
    }
    return JSON.stringify(words, null, 2)
  }

  async function clearAllWrongWords() {
    await clearWrongWords()
    for (const group of Object.values(wordGroups.value)) {
      for (const word of group) {
        word.wrong = 0
      }
    }
  }

  return {
    wordGroups,
    activeGroup,
    searchQuery,
    allWords,
    currentGroupWords,
    groupNames,
    learnedCount,
    totalCount,
    load,
    getWordById,
    setActive,
    add,
    update,
    remove,
    create,
    removeGroup,
    search,
    getDifficultWords,
    importWords,
    exportWords,
    clearAllWrongWords,
  }
})
