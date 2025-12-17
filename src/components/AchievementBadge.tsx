import { Level } from '@/lib/types'
import { Card, CardContent } from './ui/card'
import { 
  Medal,
  Trophy,
  Star,
  Crown,
  Seal,
  Target,
  Flame,
  BookOpen,
  Lightning,
  GraduationCap
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface AchievementBadgeProps {
  type: 'level-complete' | 'perfect-score' | 'streak' | 'all-lessons' | 'fast-learner'
  level?: Level
  title: string
  description: string
  unlockedAt?: number
  isLocked?: boolean
  index?: number
}

const BADGE_ICONS = {
  'level-complete': GraduationCap,
  'perfect-score': Star,
  'streak': Flame,
  'all-lessons': BookOpen,
  'fast-learner': Lightning
}

const LEVEL_BADGE_COLORS = {
  'A2': {
    bg: 'bg-[oklch(0.68_0.20_35)]/10',
    border: 'border-[oklch(0.68_0.20_35)]',
    icon: 'text-[oklch(0.68_0.20_35)]',
    gradient: 'from-[oklch(0.68_0.20_35)] to-[oklch(0.78_0.15_45)]'
  },
  'B1': {
    bg: 'bg-[oklch(0.58_0.22_270)]/10',
    border: 'border-[oklch(0.58_0.22_270)]',
    icon: 'text-[oklch(0.58_0.22_270)]',
    gradient: 'from-[oklch(0.58_0.22_270)] to-[oklch(0.72_0.15_310)]'
  },
  'B2': {
    bg: 'bg-[oklch(0.55_0.25_210)]/10',
    border: 'border-[oklch(0.55_0.25_210)]',
    icon: 'text-[oklch(0.55_0.25_210)]',
    gradient: 'from-[oklch(0.55_0.25_210)] to-[oklch(0.65_0.20_240)]'
  },
  'Beginner': {
    bg: 'bg-[oklch(0.70_0.15_150)]/10',
    border: 'border-[oklch(0.70_0.15_150)]',
    icon: 'text-[oklch(0.70_0.15_150)]',
    gradient: 'from-[oklch(0.70_0.15_150)] to-[oklch(0.80_0.12_160)]'
  },
  'A1': {
    bg: 'bg-[oklch(0.65_0.18_100)]/10',
    border: 'border-[oklch(0.65_0.18_100)]',
    icon: 'text-[oklch(0.65_0.18_100)]',
    gradient: 'from-[oklch(0.65_0.18_100)] to-[oklch(0.75_0.14_120)]'
  },
  'C1': {
    bg: 'bg-[oklch(0.50_0.28_330)]/10',
    border: 'border-[oklch(0.50_0.28_330)]',
    icon: 'text-[oklch(0.50_0.28_330)]',
    gradient: 'from-[oklch(0.50_0.28_330)] to-[oklch(0.60_0.22_350)]'
  },
  'C2': {
    bg: 'bg-[oklch(0.45_0.30_0)]/10',
    border: 'border-[oklch(0.45_0.30_0)]',
    icon: 'text-[oklch(0.45_0.30_0)]',
    gradient: 'from-[oklch(0.45_0.30_0)] to-[oklch(0.55_0.25_20)]'
  }
}

const TYPE_COLORS = {
  'level-complete': {
    bg: 'bg-primary/10',
    border: 'border-primary',
    icon: 'text-primary',
    gradient: 'from-primary to-primary/70'
  },
  'perfect-score': {
    bg: 'bg-accent/10',
    border: 'border-accent',
    icon: 'text-accent',
    gradient: 'from-accent to-accent/70'
  },
  'streak': {
    bg: 'bg-destructive/10',
    border: 'border-destructive',
    icon: 'text-destructive',
    gradient: 'from-destructive to-destructive/70'
  },
  'all-lessons': {
    bg: 'bg-secondary/10',
    border: 'border-secondary',
    icon: 'text-secondary',
    gradient: 'from-secondary to-secondary/70'
  },
  'fast-learner': {
    bg: 'bg-success/10',
    border: 'border-success',
    icon: 'text-success',
    gradient: 'from-success to-success/70'
  }
}

export default function AchievementBadge({
  type,
  level,
  title,
  description,
  unlockedAt,
  isLocked = false,
  index = 0
}: AchievementBadgeProps) {
  const Icon = BADGE_ICONS[type]
  const colors = level && type === 'level-complete' 
    ? LEVEL_BADGE_COLORS[level] 
    : TYPE_COLORS[type]

  const dateStr = unlockedAt 
    ? new Date(unlockedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : ''

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 15
      }}
    >
      <Card 
        className={cn(
          'relative overflow-hidden transition-all hover:shadow-lg hover:scale-105',
          isLocked && 'opacity-40 grayscale',
          !isLocked && 'cursor-pointer'
        )}
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <motion.div
                animate={!isLocked ? {
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1.05, 1]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className={cn(
                  'relative w-24 h-24 rounded-full flex items-center justify-center border-4',
                  colors.border,
                  colors.bg
                )}
              >
                <div className={cn(
                  'absolute inset-0 rounded-full bg-gradient-to-br opacity-20',
                  colors.gradient
                )} />
                <Icon size={48} weight="fill" className={cn('relative z-10', colors.icon)} />
              </motion.div>

              {!isLocked && level && type === 'level-complete' && (
                <div className={cn(
                  'absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white bg-gradient-to-br shadow-lg',
                  colors.gradient
                )}>
                  <span className="text-white text-xs font-bold">{level}</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-lg text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
              {!isLocked && dateStr && (
                <p className="text-xs text-muted-foreground pt-2">
                  Desbloqueado: {dateStr}
                </p>
              )}
              {isLocked && (
                <p className="text-xs text-muted-foreground pt-2">
                  🔒 Bloqueado
                </p>
              )}
            </div>
          </div>
        </CardContent>

        {!isLocked && (
          <motion.div
            className={cn(
              'absolute inset-0 pointer-events-none bg-gradient-to-r opacity-0',
              colors.gradient
            )}
            animate={{
              opacity: [0, 0.1, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        )}
      </Card>
    </motion.div>
  )
}
