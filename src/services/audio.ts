class AudioService {
  private voices: SpeechSynthesisVoice[] = []
  private rate: number = 0.9
  private activated: boolean = false
  private speaking: boolean = false
  private pendingResolve: ((value: void) => void) | null = null
  private pendingReject: ((reason: Error) => void) | null = null

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
    this.voices = voices.filter(v => v.lang.startsWith('en'))
  }

  private startVoicePolling() {
    let attempts = 0
    const maxAttempts = 10
    const interval = setInterval(() => {
      if (this.voices.length > 0 || attempts >= maxAttempts) {
        clearInterval(interval)
        return
      }
      this.initVoices()
      attempts++
    }, 500)
  }

  private getPreferredVoice(): SpeechSynthesisVoice | undefined {
    const priorityList = [
      'Google US English',
      'Google English',
      'Microsoft Zira - English (United States)',
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

  isSupported(): boolean {
    return 'speechSynthesis' in window
  }

  isActivated(): boolean {
    return this.activated
  }

  activate(): void {
    this.activated = true
    this.initVoices()
    if (this.isSupported()) {
      const utterance = new SpeechSynthesisUtterance(' ')
      utterance.volume = 0
      utterance.onend = () => {}
      utterance.onerror = () => {}
      try {
        window.speechSynthesis.speak(utterance)
      } catch {}
    }
  }

  speak(text: string, rate?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('浏览器不支持语音合成'))
        return
      }

      if (!this.isActivated()) {
        reject(new Error('音频服务未激活，请先点击开始学习'))
        return
      }

      if (this.speaking) {
        this.pendingReject?.(new Error('语音播放被中断'))
        window.speechSynthesis.cancel()
      }

      this.pendingResolve = resolve
      this.pendingReject = reject

      const doSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(text)
        const voice = this.getPreferredVoice()

        if (voice) {
          utterance.voice = voice
        }
        utterance.lang = 'en-US'
        utterance.rate = rate || this.rate
        utterance.pitch = 1
        utterance.volume = 1

        this.speaking = true

        utterance.onend = () => {
          this.speaking = false
          this.pendingResolve = null
          this.pendingReject = null
          resolve()
        }

        utterance.onerror = (event) => {
          this.speaking = false
          this.pendingResolve = null
          this.pendingReject = null

          if (event.error === 'canceled' || event.error === 'interrupted') {
            resolve()
            return
          }

          const errorMessages: Record<string, string> = {
            'not-allowed': '语音播放被阻止',
            'language-unavailable': '语言不可用',
            'voice-unavailable': '语音不可用',
            'audio-busy': '音频设备繁忙',
            'audio-hardware': '音频硬件错误',
          }

          reject(new Error(errorMessages[event.error] || `语音播放失败: ${event.error}`))
        }

        window.speechSynthesis.speak(utterance)
      }

      if (this.speaking) {
        setTimeout(doSpeak, 100)
      } else {
        doSpeak()
      }
    })
  }

  stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel()
      this.speaking = false
      this.pendingResolve = null
      this.pendingReject = null
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices
  }

  setRate(rate: number): void {
    this.rate = rate
  }

  getRate(): number {
    return this.rate
  }

  hasVoices(): boolean {
    return this.voices.length > 0
  }

  isSpeaking(): boolean {
    return this.speaking
  }
}

export const audioService = new AudioService()