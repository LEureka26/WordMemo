interface KeyboardConfig {
  onPrev?: () => void
  onNext?: () => void
  onSpeak?: () => void
  onSubmit?: () => void
  onToggleChinese?: () => void
  onRateChange?: (rate: number) => void
  onShowHelp?: () => void
}

class KeyboardHandler {
  private config: KeyboardConfig = {}
  private enabled: boolean = true

  setConfig(config: KeyboardConfig): void {
    this.config = config
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }

  init(): void {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.enabled) return

    const target = e.target as HTMLElement
    const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

    switch (e.key) {
      case 'ArrowLeft':
        if (!isInputFocused && this.config.onPrev) {
          e.preventDefault()
          this.config.onPrev()
        }
        break
      case 'ArrowRight':
        if (!isInputFocused && this.config.onNext) {
          e.preventDefault()
          this.config.onNext()
        }
        break
      case ' ':
        if (!isInputFocused && this.config.onSpeak) {
          e.preventDefault()
          this.config.onSpeak()
        }
        break
      case 'Enter':
        if ((isInputFocused || e.ctrlKey) && this.config.onSubmit) {
          e.preventDefault()
          this.config.onSubmit()
        }
        break
      case '1':
        if (!isInputFocused && this.config.onRateChange) {
          this.config.onRateChange(0.5)
        }
        break
      case '2':
        if (!isInputFocused && this.config.onRateChange) {
          this.config.onRateChange(0.9)
        }
        break
      case '3':
        if (!isInputFocused && this.config.onRateChange) {
          this.config.onRateChange(1.5)
        }
        break
      case '?':
        if (!isInputFocused && this.config.onShowHelp) {
          this.config.onShowHelp()
        }
        break
    }
  }
}

export const keyboardHandler = new KeyboardHandler()
