class AudioService {
  private voices: SpeechSynthesisVoice[] = []
  private rate: number = 0.9
  private activated: boolean = false
  private speaking: boolean = false
  private speakToken = 0
  private resumeTimer: ReturnType<typeof setInterval> | null = null
  private pendingResolve: (() => void) | null = null
  private pendingReject: ((err: Error) => void) | null = null
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private currentAudio: HTMLAudioElement | null = null
  private unlockAudioEl: HTMLAudioElement | null = null

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices()
      window.speechSynthesis.onvoiceschanged = () => this.initVoices()
      this.startVoicePolling()
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const voices = window.speechSynthesis.getVoices()
    this.voices = voices.filter(v => v.lang.toLowerCase().startsWith('en'))
  }

  private startVoicePolling() {
    let attempts = 0
    const maxAttempts = 20
    const interval = setInterval(() => {
      this.initVoices()
      attempts++
      if (this.voices.length > 0 || attempts >= maxAttempts) {
        clearInterval(interval)
      }
    }, 250)
  }

  private getPreferredVoice(): SpeechSynthesisVoice | undefined {
    this.initVoices()
    const priorityList = [
      'Google US English',
      'Google English',
      'Microsoft Zira - English (United States)',
      'Microsoft Aria Online (Natural) - English (United States)',
      'Samantha',
      'Microsoft David - English (United States)',
      'Alex',
      'Google UK English Female',
      'Google UK English Male',
    ]

    for (const name of priorityList) {
      const voice = this.voices.find(v => v.name === name)
      if (voice) return voice
    }

    return this.voices.find(v => v.lang === 'en-US') ||
           this.voices.find(v => v.lang.startsWith('en')) ||
           this.voices[0]
  }

  private clearResumeTimer() {
    if (this.resumeTimer) {
      clearInterval(this.resumeTimer)
      this.resumeTimer = null
    }
  }

  private startChromeKeepAlive() {
    this.clearResumeTimer()
    this.resumeTimer = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        this.clearResumeTimer()
        return
      }
      try {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      } catch {}
    }, 10000)
  }

  private settlePending(error?: Error) {
    const resolve = this.pendingResolve
    const reject = this.pendingReject
    this.pendingResolve = null
    this.pendingReject = null
    if (error) {
      reject?.(error)
    } else {
      resolve?.()
    }
  }

  private stopCurrentPlayback() {
    this.clearResumeTimer()
    if (this.currentAudio) {
      this.currentAudio.onended = null
      this.currentAudio.onerror = null
      this.currentAudio.pause()
      this.currentAudio.src = ''
      this.currentAudio = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
      } catch {}
    }
    if (this.currentUtterance) {
      this.currentUtterance.onend = null
      this.currentUtterance.onerror = null
      this.currentUtterance.onstart = null
      this.currentUtterance = null
    }
    this.speaking = false
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' &&
      ('speechSynthesis' in window || typeof Audio !== 'undefined')
  }

  isActivated(): boolean {
    return this.activated
  }

  activate(): void {
    this.activated = true
    this.initVoices()

    if (typeof Audio !== 'undefined') {
      try {
        if (!this.unlockAudioEl) {
          this.unlockAudioEl = new Audio()
        }
        this.unlockAudioEl.src =
          'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
        void this.unlockAudioEl.play().catch(() => {})
      } catch {}
    }

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.getVoices()
      } catch {}
    }
  }

  speak(text: string, rate?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('浏览器不支持语音播放'))
        return
      }

      if (!this.isActivated()) {
        reject(new Error('音频服务未激活，请先点击开始学习'))
        return
      }

      const content = text?.trim()
      if (!content) {
        resolve()
        return
      }

      this.settlePending()
      this.pendingResolve = resolve
      this.pendingReject = reject

      const token = ++this.speakToken
      const needDelay = this.speaking ||
        (typeof window !== 'undefined' &&
          'speechSynthesis' in window &&
          (window.speechSynthesis.speaking || window.speechSynthesis.pending))

      this.stopCurrentPlayback()

      const run = () => {
        if (token !== this.speakToken) return
        this.initVoices()
        const voice = this.getPreferredVoice()
        if (voice) {
          this.speakWithSynthesis(content, rate, voice, token)
        } else {
          this.speakWithAudio(content, token)
        }
      }

      if (needDelay) {
        setTimeout(run, 60)
      } else {
        run()
      }
    })
  }

  private speakWithSynthesis(
    content: string,
    rate: number | undefined,
    voice: SpeechSynthesisVoice | undefined,
    token: number,
  ) {
    const utterance = new SpeechSynthesisUtterance(content)
    this.currentUtterance = utterance

    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    } else {
      utterance.lang = 'en-US'
    }
    utterance.rate = rate ?? this.rate
    utterance.pitch = 1
    utterance.volume = 1

    let started = false
    const fallbackTimer = setTimeout(() => {
      if (token !== this.speakToken || started) return
      this.stopCurrentPlayback()
      this.speakWithAudio(content, token)
    }, 800)

    this.speaking = true

    utterance.onstart = () => {
      started = true
      clearTimeout(fallbackTimer)
      if (token === this.speakToken) {
        this.startChromeKeepAlive()
      }
    }

    utterance.onend = () => {
      clearTimeout(fallbackTimer)
      if (token !== this.speakToken) return
      this.speaking = false
      this.clearResumeTimer()
      this.currentUtterance = null
      this.settlePending()
    }

    utterance.onerror = (event) => {
      clearTimeout(fallbackTimer)
      if (token !== this.speakToken) return
      this.speaking = false
      this.clearResumeTimer()
      this.currentUtterance = null

      if (event.error === 'canceled' || event.error === 'interrupted') {
        this.settlePending()
        return
      }

      this.speakWithAudio(content, token)
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }
      window.speechSynthesis.speak(utterance)
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }
    } catch {
      clearTimeout(fallbackTimer)
      this.speakWithAudio(content, token)
    }
  }

  private speakWithAudio(content: string, token: number) {
    if (token !== this.speakToken) return

    const urls = [
      `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(content)}&type=2`,
      `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=en&q=${encodeURIComponent(content)}`,
    ]

    const tryPlay = (index: number) => {
      if (token !== this.speakToken) return
      if (index >= urls.length) {
        this.speaking = false
        this.settlePending(new Error('语音播放失败'))
        return
      }

      const audio = new Audio(urls[index])
      this.currentAudio = audio
      this.speaking = true

      audio.onended = () => {
        if (token !== this.speakToken) return
        this.speaking = false
        this.currentAudio = null
        this.settlePending()
      }

      audio.onerror = () => {
        if (token !== this.speakToken) return
        tryPlay(index + 1)
      }

      void audio.play().catch(() => {
        if (token !== this.speakToken) return
        tryPlay(index + 1)
      })
    }

    tryPlay(0)
  }

  stop(): void {
    this.speakToken++
    this.stopCurrentPlayback()
    this.settlePending()
  }

  getVoices(): SpeechSynthesisVoice[] {
    this.initVoices()
    return this.voices
  }

  setRate(rate: number): void {
    this.rate = rate
  }

  getRate(): number {
    return this.rate
  }

  hasVoices(): boolean {
    this.initVoices()
    return this.voices.length > 0 || typeof Audio !== 'undefined'
  }

  isSpeaking(): boolean {
    return this.speaking
  }
}

export const audioService = new AudioService()
