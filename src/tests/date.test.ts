import { describe, it, expect } from 'vitest'
import { getToday, getYesterday } from '@/utils/date'

describe('date utils', () => {
  it('getToday returns correct format', () => {
    const today = getToday()
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('getYesterday returns correct format', () => {
    const yesterday = getYesterday()
    expect(yesterday).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
