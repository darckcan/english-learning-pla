import { useState } from 'react'
import { Button } from './ui/button'
import { SpeakerHigh, SpeakerSlash, SpeakerSimpleHigh } from '@phosphor-icons/react'
import { audioService } from '@/lib/audio'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface PronunciationButtonProps {
  text: string
  variant?: 'default' | 'ghost' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  slow?: boolean
  className?: string
  showLabel?: boolean
}

export default function PronunciationButton({
  text,
  variant = 'ghost',
  size = 'icon',
  slow = false,
  className,
  showLabel = false,
}: PronunciationButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePronounce = async () => {
    if (!audioService.isSupported()) {
      toast.error('Audio no disponible', {
        description: 'Tu navegador no soporta la síntesis de voz.',
      })
      return
    }

    if (isPlaying) {
      audioService.stop()
      setIsPlaying(false)
      return
    }

    try {
      setIsPlaying(true)
      if (slow) {
        await audioService.pronounceSlowly(text)
      } else {
        await audioService.pronounce(text)
      }
    } catch (error) {
      console.error('Pronunciation error:', error)
      toast.error('Error de audio', {
        description: 'No se pudo reproducir la pronunciación.',
      })
    } finally {
      setIsPlaying(false)
    }
  }

  const Icon = isPlaying ? SpeakerSimpleHigh : SpeakerHigh

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePronounce}
      className={cn(isPlaying && 'text-primary', className)}
      title={isPlaying ? 'Detener' : slow ? 'Escuchar despacio' : 'Escuchar pronunciación'}
    >
      <Icon size={size === 'icon' ? 20 : 18} className={cn(isPlaying && 'animate-pulse')} />
      {showLabel && (
        <span className="ml-2">{isPlaying ? 'Reproduciendo...' : slow ? 'Despacio' : 'Escuchar'}</span>
      )}
    </Button>
  )
}
