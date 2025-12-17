export class HapticFeedback {
  private static isSupported(): boolean {
    return 'vibrate' in navigator
  }

  static light() {
    if (this.isSupported()) {
      navigator.vibrate(10)
    }
  }

  static medium() {
    if (this.isSupported()) {
      navigator.vibrate(20)
    }
  }

  static heavy() {
    if (this.isSupported()) {
      navigator.vibrate(40)
    }
  }

  static success() {
    if (this.isSupported()) {
      navigator.vibrate([10, 50, 10])
    }
  }

  static error() {
    if (this.isSupported()) {
      navigator.vibrate([20, 100, 20, 100, 20])
    }
  }

  static warning() {
    if (this.isSupported()) {
      navigator.vibrate([30, 100, 30])
    }
  }

  static selection() {
    if (this.isSupported()) {
      navigator.vibrate(5)
    }
  }

  static impact() {
    if (this.isSupported()) {
      navigator.vibrate(15)
    }
  }

  static notification() {
    if (this.isSupported()) {
      navigator.vibrate([10, 50, 10, 50, 10])
    }
  }

  static achievement() {
    if (this.isSupported()) {
      navigator.vibrate([50, 100, 50, 100, 100])
    }
  }

  static longPress() {
    if (this.isSupported()) {
      navigator.vibrate(50)
    }
  }

  static swipe() {
    if (this.isSupported()) {
      navigator.vibrate(8)
    }
  }

  static rigid() {
    if (this.isSupported()) {
      navigator.vibrate(3)
    }
  }

  static soft() {
    if (this.isSupported()) {
      navigator.vibrate(7)
    }
  }

  static pattern(pattern: number[]) {
    if (this.isSupported()) {
      navigator.vibrate(pattern)
    }
  }

  static cancel() {
    if (this.isSupported()) {
      navigator.vibrate(0)
    }
  }
}

export const haptics = HapticFeedback
