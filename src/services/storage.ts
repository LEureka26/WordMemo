import type { StorageData, Word, Settings, Streak } from '@/types'
import { defaultWords, defaultGroups } from '@/data/defaultWords'

const STORAGE_KEY = 'wordmemo_data'

const defaultSettings: Settings = {
  autoPlay: true,
  rate: 0.9,
  showChinese: false,
  fuzzyMatch: false,
}

const defaultStreak: Streak = {
  lastDate: '',
  count: 0,
  badges: [],
}

function getDefaultData(): StorageData {
  const wordGroups: Record<string, Word[]> = {}
  defaultGroups.forEach(group => {
    wordGroups[group] = defaultWords.filter(w => w.group === group)
  })
  return {
    wordGroups,
    activeGroup: '四级基础',
    settings: defaultSettings,
    streak: defaultStreak,
    wrongList: [],
  }
}

export async function loadData(): Promise<StorageData> {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      return { ...getDefaultData(), ...parsed }
    }
  } catch {
    console.warn('Failed to load data from localStorage')
  }
  return getDefaultData()
}

export async function saveData(data: StorageData): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    console.warn('Failed to save data to localStorage')
  }
}

export async function getWordGroups(): Promise<Record<string, Word[]>> {
  const data = await loadData()
  return data.wordGroups
}

export async function setWordGroups(groups: Record<string, Word[]>): Promise<void> {
  const data = await loadData()
  data.wordGroups = groups
  await saveData(data)
}

export async function getActiveGroup(): Promise<string> {
  const data = await loadData()
  return data.activeGroup
}

export async function setActiveGroup(group: string): Promise<void> {
  const data = await loadData()
  data.activeGroup = group
  await saveData(data)
}

export async function getSettings(): Promise<Settings> {
  const data = await loadData()
  return data.settings
}

export async function setSettings(settings: Settings): Promise<void> {
  const data = await loadData()
  data.settings = settings
  await saveData(data)
}

export async function getStreak(): Promise<Streak> {
  const data = await loadData()
  return data.streak
}

export async function setStreak(streak: Streak): Promise<void> {
  const data = await loadData()
  data.streak = streak
  await saveData(data)
}

export async function getWrongList(): Promise<string[]> {
  const data = await loadData()
  return data.wrongList || []
}

export async function setWrongList(list: string[]): Promise<void> {
  const data = await loadData()
  data.wrongList = list
  await saveData(data)
}

export async function incrementWordCorrect(wordId: string): Promise<void> {
  const data = await loadData()
  for (const group of Object.values(data.wordGroups)) {
    const word = group.find(w => w.id === wordId)
    if (word) {
      word.correct++
      word.lastReview = Date.now()
      break
    }
  }
  await saveData(data)
}

export async function incrementWordWrong(wordId: string): Promise<void> {
  const data = await loadData()
  for (const group of Object.values(data.wordGroups)) {
    const word = group.find(w => w.id === wordId)
    if (word) {
      word.wrong++
      word.lastReview = Date.now()
      break
    }
  }
  if (!data.wrongList.includes(wordId)) {
    data.wrongList.push(wordId)
  }
  await saveData(data)
}

export async function toggleWordLearned(wordId: string): Promise<void> {
  const data = await loadData()
  for (const group of Object.values(data.wordGroups)) {
    const word = group.find(w => w.id === wordId)
    if (word) {
      word.learned = !word.learned
      break
    }
  }
  await saveData(data)
}

export async function addWord(word: Word): Promise<void> {
  const data = await loadData()
  if (!data.wordGroups[word.group]) {
    data.wordGroups[word.group] = []
  }
  data.wordGroups[word.group].push(word)
  await saveData(data)
}

export async function updateWord(wordId: string, updates: Partial<Word>): Promise<void> {
  const data = await loadData()
  for (const group of Object.values(data.wordGroups)) {
    const word = group.find(w => w.id === wordId)
    if (word) {
      Object.assign(word, updates)
      break
    }
  }
  await saveData(data)
}

export async function deleteWord(wordId: string): Promise<void> {
  const data = await loadData()
  for (const group of Object.values(data.wordGroups)) {
    const index = group.findIndex(w => w.id === wordId)
    if (index !== -1) {
      group.splice(index, 1)
      break
    }
  }
  data.wrongList = data.wrongList.filter(id => id !== wordId)
  await saveData(data)
}

export async function clearWrongWords(): Promise<void> {
  const data = await loadData()
  for (const group of Object.values(data.wordGroups)) {
    for (const word of group) {
      word.wrong = 0
    }
  }
  data.wrongList = []
  await saveData(data)
}

export async function createGroup(name: string): Promise<void> {
  const data = await loadData()
  if (!data.wordGroups[name]) {
    data.wordGroups[name] = []
  }
  await saveData(data)
}

export async function deleteGroup(name: string): Promise<void> {
  const data = await loadData()
  if (data.wordGroups[name]) {
    delete data.wordGroups[name]
    if (data.activeGroup === name) {
      data.activeGroup = Object.keys(data.wordGroups)[0] || '四级基础'
    }
  }
  await saveData(data)
}
