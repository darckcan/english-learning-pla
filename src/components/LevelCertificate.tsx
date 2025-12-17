import { useEffect, useState } from 'react'
import { Level, User } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Separator } from './ui/separator'
import { 
  Certificate, 
  Seal, 
  Download, 
  X,
  Medal,
  Star,
  Trophy
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LevelCertificateProps {
  level: Level
  user: User
  completedDate: number
  totalLessons: number
  averageScore: number
  isOpen: boolean
  onClose: () => void
}

const LEVEL_COLORS = {
  'A2': {
    primary: 'oklch(0.68 0.20 35)',
    secondary: 'oklch(0.78 0.15 45)',
    gradient: 'from-[oklch(0.68_0.20_35)] to-[oklch(0.78_0.15_45)]'
  },
  'B1': {
    primary: 'oklch(0.58 0.22 270)',
    secondary: 'oklch(0.72 0.15 310)',
    gradient: 'from-[oklch(0.58_0.22_270)] to-[oklch(0.72_0.15_310)]'
  },
  'B2': {
    primary: 'oklch(0.55 0.25 210)',
    secondary: 'oklch(0.65 0.20 240)',
    gradient: 'from-[oklch(0.55_0.25_210)] to-[oklch(0.65_0.20_240)]'
  },
  'Beginner': {
    primary: 'oklch(0.70 0.15 150)',
    secondary: 'oklch(0.80 0.12 160)',
    gradient: 'from-[oklch(0.70_0.15_150)] to-[oklch(0.80_0.12_160)]'
  },
  'A1': {
    primary: 'oklch(0.65 0.18 100)',
    secondary: 'oklch(0.75 0.14 120)',
    gradient: 'from-[oklch(0.65_0.18_100)] to-[oklch(0.75_0.14_120)]'
  },
  'C1': {
    primary: 'oklch(0.50 0.28 330)',
    secondary: 'oklch(0.60 0.22 350)',
    gradient: 'from-[oklch(0.50_0.28_330)] to-[oklch(0.60_0.22_350)]'
  },
  'C2': {
    primary: 'oklch(0.45 0.30 0)',
    secondary: 'oklch(0.55 0.25 20)',
    gradient: 'from-[oklch(0.45_0.30_0)] to-[oklch(0.55_0.25_20)]'
  }
}

const LEVEL_TITLES = {
  'A2': 'Nivel Elemental',
  'B1': 'Nivel Intermedio',
  'B2': 'Nivel Intermedio Alto',
  'Beginner': 'Nivel Principiante',
  'A1': 'Nivel Básico',
  'C1': 'Nivel Avanzado',
  'C2': 'Nivel Maestría'
}

export default function LevelCertificate({
  level,
  user,
  completedDate,
  totalLessons,
  averageScore,
  isOpen,
  onClose
}: LevelCertificateProps) {
  const [mounted, setMounted] = useState(false)
  const colors = LEVEL_COLORS[level]
  const dateStr = new Date(completedDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
    }
  }, [isOpen])

  const handleDownload = () => {
    const certificateElement = document.getElementById('certificate-content')
    if (!certificateElement) return

    import('html-to-image').then(({ toPng }) => {
      toPng(certificateElement, { 
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: 'white'
      })
        .then((dataUrl) => {
          const link = document.createElement('a')
          link.download = `LearnEnglish-Certificate-${level}-${user.username}.png`
          link.href = dataUrl
          link.click()
        })
        .catch((err) => {
          console.error('Error generating certificate:', err)
        })
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-12 right-0 text-white hover:text-white/80 hover:bg-white/10 z-50"
            onClick={onClose}
          >
            <X size={24} />
          </Button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Card 
              id="certificate-content"
              className="overflow-hidden border-4 shadow-2xl"
              style={{ borderColor: colors.primary }}
            >
              <div className={cn('h-6 bg-gradient-to-r', colors.gradient)} />
              
              <div className="p-12 bg-white relative">
                <div className="absolute top-8 left-8 opacity-5">
                  <Certificate size={120} weight="fill" />
                </div>
                <div className="absolute top-8 right-8 opacity-5">
                  <Certificate size={120} weight="fill" />
                </div>

                <div className="relative z-10 text-center space-y-6">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Trophy size={64} weight="fill" className="mx-auto mb-4" style={{ color: colors.primary }} />
                    <h1 className="text-5xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                      Certificado de Logro
                    </h1>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <p className="text-lg text-muted-foreground">Este certificado se otorga a</p>
                    <h2 className="text-4xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                      {user.fullName || user.username}
                    </h2>
                  </motion.div>

                  <Separator className="my-6" />

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <p className="text-lg text-muted-foreground">
                      Por completar exitosamente el
                    </p>
                    <div 
                      className="inline-block px-8 py-4 rounded-xl text-white text-3xl font-bold shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                    >
                      {LEVEL_TITLES[level]} - {level}
                    </div>
                    <p className="text-base text-muted-foreground max-w-2xl mx-auto pt-4">
                      en la plataforma LearnEnglish
                    </p>
                  </motion.div>

                  <Separator className="my-6" />

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-3 gap-6 py-6"
                  >
                    <div className="space-y-2">
                      <Medal size={32} weight="fill" className="mx-auto" style={{ color: colors.primary }} />
                      <p className="text-sm text-muted-foreground">Lecciones Completadas</p>
                      <p className="text-2xl font-bold text-foreground">{totalLessons}</p>
                    </div>
                    <div className="space-y-2">
                      <Star size={32} weight="fill" className="mx-auto" style={{ color: colors.primary }} />
                      <p className="text-sm text-muted-foreground">Puntuación Promedio</p>
                      <p className="text-2xl font-bold text-foreground">{averageScore}%</p>
                    </div>
                    <div className="space-y-2">
                      <Seal size={32} weight="fill" className="mx-auto" style={{ color: colors.primary }} />
                      <p className="text-sm text-muted-foreground">Fecha de Finalización</p>
                      <p className="text-lg font-bold text-foreground">{dateStr}</p>
                    </div>
                  </motion.div>

                  <Separator className="my-6" />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-center gap-12 pt-4"
                  >
                    <div className="text-center">
                      <div className="w-48 border-t-2 border-foreground/20 mb-2"></div>
                      <p className="text-sm font-medium text-muted-foreground">LearnEnglish Platform</p>
                      <p className="text-xs text-muted-foreground">Plataforma Oficial</p>
                    </div>
                    <div>
                      <Seal size={48} weight="fill" style={{ color: colors.primary }} />
                    </div>
                    <div className="text-center">
                      <div className="w-48 border-t-2 border-foreground/20 mb-2"></div>
                      <p className="text-sm font-medium text-muted-foreground">Certificado ID</p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {level}-{user.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className={cn('h-6 bg-gradient-to-r', colors.gradient)} />
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-4 mt-6"
          >
            <Button
              onClick={handleDownload}
              size="lg"
              className="bg-white text-foreground hover:bg-white/90"
            >
              <Download size={20} className="mr-2" />
              Descargar Certificado
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
