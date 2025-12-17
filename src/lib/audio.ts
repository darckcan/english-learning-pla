export class AudioPronunciationService {
  private synth: SpeechSynthesis
  private voice: SpeechSynthesisVoice | null = null
  private isInitialized = false

  constructor() {
    this.synth = window.speechSynthesis
    this.initializeVoice()
  }

  private initializeVoice() {
    const loadVoices = () => {
      const voices = this.synth.getVoices()
      this.voice = voices.find(voice => 
        voice.lang.startsWith('en-') && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Natural'))
      ) || voices.find(voice => voice.lang.startsWith('en-')) || voices[0] || null
      
      this.isInitialized = true
    }

    if (this.synth.getVoices().length > 0) {
      loadVoices()
    }

    this.synth.addEventListener('voiceschanged', loadVoices)
  }

  private async waitForInitialization(): Promise<void> {
    if (this.isInitialized) return
    
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.isInitialized) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 50)
      
      setTimeout(() => {
        clearInterval(checkInterval)
        this.isInitialized = true
        resolve()
      }, 2000)
    })
  }

  async pronounce(text: string, rate: number = 0.9, pitch: number = 1.0): Promise<void> {
    await this.waitForInitialization()
    
    this.synth.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    
    if (this.voice) {
      utterance.voice = this.voice
    }
    
    utterance.lang = 'en-US'
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = 1.0

    return new Promise((resolve, reject) => {
      utterance.onend = () => resolve()
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
        reject(event)
      }
      
      this.synth.speak(utterance)
    })
  }

  async pronounceWord(word: string): Promise<void> {
    return this.pronounce(word, 0.85, 1.0)
  }

  async pronounceSentence(sentence: string): Promise<void> {
    return this.pronounce(sentence, 0.85, 1.0)
  }
  
  async pronounceExample(example: string): Promise<void> {
    return this.pronounce(example, 0.88, 1.0)
  }

  async pronounceSlowly(text: string): Promise<void> {
    return this.pronounce(text, 0.6, 1.0)
  }

  stop(): void {
    this.synth.cancel()
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window
  }
}

export const audioService = new AudioPronunciationService()
