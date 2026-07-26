import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useStatsStore } from '@/stores/statsStore'

vi.mock('@/services/storage', () => ({
  getStreak: vi.fn(() => Promise.resolve({ lastDate: '', count: 0, badges: [] })),
  setStreak: vi.fn(),
}))

vi.mock('@/utils/date', () => ({
  getToday: vi.fn(() => '2026-07-26'),
  getYesterday: vi.fn(() => '2026-07-25'),
}))

describe('statsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('checkIn with less than 5 words does nothing', async () => {
    const statsStore = useStatsStore()
    await statsStore.checkIn(3)
    expect(statsStore.streak.count).toBe(0)
  })

  it('checkIn on first day sets count to 1', async () => {
    const statsStore = useStatsStore()
    await statsStore.checkIn(5)
    expect(statsStore.streak.count).toBe(1)
    expect(statsStore.streak.lastDate).toBe('2026-07-26')
  })

  it('checkIn on consecutive day increments count', async () => {
    const statsStore = useStatsStore()
    statsStore.streak = { lastDate: '2026-07-25', count: 3, badges: [] }
    await statsStore.checkIn(5)
    expect(statsStore.streak.count).toBe(4)
  })

  it('checkIn on same day does not increment', async () => {
    const statsStore = useStatsStore()
    statsStore.streak = { lastDate: '2026-07-26', count: 3, badges: [] }
    await statsStore.checkIn(5)
    expect(statsStore.streak.count).toBe(3)
  })

  it('checkIn after gap resets count to 1', async () => {
    const statsStore = useStatsStore()
    statsStore.streak = { lastDate: '2026-07-20', count: 5, badges: [] }
    await statsStore.checkIn(5)
    expect(statsStore.streak.count).toBe(1)
  })
})
