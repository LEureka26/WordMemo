interface GestureConfig {
  onLeft?: () => void
  onRight?: () => void
  onUp?: () => void
  onDown?: () => void
}

class GestureHandler {
  private element: HTMLElement | null = null
  private startX: number = 0
  private startY: number = 0
  private threshold: number = 50
  private config: GestureConfig = {}

  setElement(element: HTMLElement): void {
    this.element = element
    this.bindEvents()
  }

  setConfig(config: GestureConfig): void {
    this.config = config
  }

  private bindEvents(): void {
    if (!this.element) return

    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: true })
    this.element.addEventListener('touchend', this.handleTouchEnd, { passive: true })
  }

  private handleTouchStart = (e: TouchEvent): void => {
    const touch = e.touches[0]
    this.startX = touch.clientX
    this.startY = touch.clientY
  }

  private handleTouchEnd = (e: TouchEvent): void => {
    const touch = e.changedTouches[0]
    const endX = touch.clientX
    const endY = touch.clientY

    const diffX = endX - this.startX
    const diffY = endY - this.startY

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > this.threshold) {
        if (diffX > 0 && this.config.onRight) {
          this.config.onRight()
        } else if (diffX < 0 && this.config.onLeft) {
          this.config.onLeft()
        }
      }
    } else {
      if (Math.abs(diffY) > this.threshold) {
        if (diffY > 0 && this.config.onDown) {
          this.config.onDown()
        } else if (diffY < 0 && this.config.onUp) {
          this.config.onUp()
        }
      }
    }
  }

  destroy(): void {
    if (this.element) {
      this.element.removeEventListener('touchstart', this.handleTouchStart)
      this.element.removeEventListener('touchend', this.handleTouchEnd)
    }
    this.element = null
  }
}

export const gestureHandler = new GestureHandler()
