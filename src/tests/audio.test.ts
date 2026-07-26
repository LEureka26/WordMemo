import { beforeEach, describe, expect, it, vi } from 'vitest'

function createSpeechMock(voices: Array<{ name: string; lang: string }> = []) {
  const utterances: Array<{
    text: string
    onend: ((ev?: Event) => void) | null
    onerror: ((ev: { error: string }) => void) | null
    onstart: ((ev?: Event) => void) | null
  }> = []

  const speechSynthesis = {
    speaking: false,
    pending: false,
    paused: false,
    cancel: vi.fn(() => {
      speechSynthesis.speaking = false
      speechSynthesis.pending = false
    }),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() =>
      voices.map(v => ({ ...v, default: false, localService: true, voiceURI: v.name })),
    ),
    speak: vi.fn((utterance: (typeof utterances)[number]) => {
      utterances.push(utterance)
      speechSynthesis.speaking = true
      utterance.onstart?.(new Event('start'))
      setTimeout(() => {
        speechSynthesis.speaking = false
        utterance.onend?.(new Event('end'))
      }, 20)
    }),
    onvoiceschanged: null as (() => void) | null,
  }

  class SpeechSynthesisUtterance {
    text: string
    lang = ''
    rate = 1
    pitch = 1
    volume = 1
    voice: SpeechSynthesisVoice | null = null
    onend: ((ev?: Event) => void) | null = null
    onerror: ((ev: { error: string }) => void) | null = null
    onstart: ((ev?: Event) => void) | null = null
    constructor(text: string) {
      this.text = text
    }
  }

  return { speechSynthesis, SpeechSynthesisUtterance, utterances }
}

function createAudioMock() {
  const instances: Array<{
    src: string
    play: ReturnType<typeof vi.fn>
    pause: ReturnType<typeof vi.fn>
    onended: ((ev?: Event) => void) | null
    onerror: ((ev?: Event) => void) | null
  }> = []

  class AudioMock {
    src = ''
    onended: ((ev?: Event) => void) | null = null
    onerror: ((ev?: Event) => void) | null = null
    play = vi.fn(() => {
      setTimeout(() => this.onended?.(new Event('ended')), 10)
      return Promise.resolve()
    })
    pause = vi.fn()
    constructor(src?: string) {
      if (src) this.src = src
      instances.push(this)
    }
  }

  return { AudioMock, instances }
}

describe('audioService', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
  })

  it('未激活时拒绝播放', async () => {
    const mock = createSpeechMock([{ name: 'Google US English', lang: 'en-US' }])
    vi.stubGlobal('speechSynthesis', mock.speechSynthesis)
    vi.stubGlobal('SpeechSynthesisUtterance', mock.SpeechSynthesisUtterance)
    vi.stubGlobal('Audio', createAudioMock().AudioMock)

    const { audioService } = await import('@/services/audio')
    await expect(audioService.speak('hello')).rejects.toThrow('未激活')
  })

  it('有英语语音时使用 speechSynthesis', async () => {
    const mock = createSpeechMock([{ name: 'Google US English', lang: 'en-US' }])
    const audio = createAudioMock()
    vi.stubGlobal('speechSynthesis', mock.speechSynthesis)
    vi.stubGlobal('SpeechSynthesisUtterance', mock.SpeechSynthesisUtterance)
    vi.stubGlobal('Audio', audio.AudioMock)

    const { audioService } = await import('@/services/audio')
    audioService.activate()
    const promise = audioService.speak('apple')
    await vi.advanceTimersByTimeAsync(30)
    expect(mock.speechSynthesis.speak).toHaveBeenCalled()
    await expect(promise).resolves.toBeUndefined()
  })

  it('无英语语音时回退到 Audio 发音', async () => {
    const mock = createSpeechMock([
      { name: 'Microsoft Huihui', lang: 'zh-CN' },
    ])
    const audio = createAudioMock()
    vi.stubGlobal('speechSynthesis', mock.speechSynthesis)
    vi.stubGlobal('SpeechSynthesisUtterance', mock.SpeechSynthesisUtterance)
    vi.stubGlobal('Audio', audio.AudioMock)

    const { audioService } = await import('@/services/audio')
    audioService.activate()
    const promise = audioService.speak('abundant')
    await vi.advanceTimersByTimeAsync(20)

    expect(mock.speechSynthesis.speak).not.toHaveBeenCalled()
    expect(audio.instances.some(i => i.src.includes('youdao') || i.src.includes('abundant'))).toBe(true)
    await expect(promise).resolves.toBeUndefined()
  })

  it('activate 解锁 Audio', async () => {
    const mock = createSpeechMock()
    const audio = createAudioMock()
    vi.stubGlobal('speechSynthesis', mock.speechSynthesis)
    vi.stubGlobal('SpeechSynthesisUtterance', mock.SpeechSynthesisUtterance)
    vi.stubGlobal('Audio', audio.AudioMock)

    const { audioService } = await import('@/services/audio')
    audioService.activate()
    expect(audio.instances.length).toBeGreaterThan(0)
    expect(audio.instances[0].play).toHaveBeenCalled()
  })
})
