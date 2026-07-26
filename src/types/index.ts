export interface Word {
  id: string
  english: string
  chinese: string[]
  group: string
  correct: number
  wrong: number
  lastReview: number
  learned: boolean
}

export interface Settings {
  autoPlay: boolean
  rate: number
  showChinese: boolean
  fuzzyMatch: boolean
}

export interface Streak {
  lastDate: string
  count: number
  badges: string[]
}

export interface QuizResult {
  wordId: string
  isCorrect: boolean
  userAnswer: string
  correctAnswer: string[]
  timestamp: number
}

export interface StorageData {
  wordGroups: Record<string, Word[]>
  activeGroup: string
  settings: Settings
  streak: Streak
  wrongList: string[]
}
