import type { Word } from '@/types'

export const defaultWords: Word[] = [
  { id: '1', english: 'abundant', chinese: ['丰富的', '充裕的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '2', english: 'brilliant', chinese: ['杰出的', '卓越的', '灿烂的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '3', english: 'comprehensive', chinese: ['综合的', '全面的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '4', english: 'diligent', chinese: ['勤奋的', '刻苦的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '5', english: 'eloquent', chinese: ['雄辩的', '有口才的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '6', english: 'glisten', chinese: ['闪光', '闪闪发光'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '7', english: 'radiant', chinese: ['光芒四射的', '灿烂的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '8', english: 'luminous', chinese: ['发光的', '明亮的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '9', english: 'sparkle', chinese: ['闪耀', '闪烁'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '10', english: 'vivid', chinese: ['生动的', '逼真的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '11', english: 'accurate', chinese: ['准确的', '精确的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '12', english: 'beneficial', chinese: ['有益的', '有利的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '13', english: 'convenient', chinese: ['方便的', '便利的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '14', english: 'diverse', chinese: ['多样的', '不同的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '15', english: 'efficient', chinese: ['高效的', '有效率的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '16', english: 'flexible', chinese: ['灵活的', '柔韧的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '17', english: 'genuine', chinese: ['真诚的', '真正的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '18', english: 'harmonious', chinese: ['和谐的', '融洽的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '19', english: 'immediate', chinese: ['立即的', '直接的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '20', english: 'jealous', chinese: ['嫉妒的', '吃醋的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '21', english: 'knowledgeable', chinese: ['知识渊博的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '22', english: 'magnificent', chinese: ['壮丽的', '宏伟的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '23', english: 'necessary', chinese: ['必要的', '必需的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '24', english: 'obvious', chinese: ['明显的', '显然的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '25', english: 'patient', chinese: ['耐心的', '容忍的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '26', english: 'qualified', chinese: ['合格的', '有资格的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '27', english: 'reliable', chinese: ['可靠的', '可信赖的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '28', english: 'significant', chinese: ['重要的', '显著的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '29', english: 'temporary', chinese: ['临时的', '暂时的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
  { id: '30', english: 'unique', chinese: ['独特的', '独一无二的'], group: '四级基础', correct: 0, wrong: 0, lastReview: 0, learned: false },
]

export const defaultGroups = ['四级基础']

export const achievements = [
  { id: 'first_day', name: '首日打卡', condition: (streak: number) => streak >= 1 },
  { id: 'perfect_quiz', name: '默写全对', condition: (_: number, correct: number, total: number) => total >= 5 && correct === total },
  { id: 'seven_days', name: '连续7天', condition: (streak: number) => streak >= 7 },
  { id: 'hundred_words', name: '百词达人', condition: (_: number, __: number, ___: number, words: number) => words >= 100 },
  { id: 'perfect_week', name: '完美一周', condition: (streak: number) => streak >= 7 },
]
