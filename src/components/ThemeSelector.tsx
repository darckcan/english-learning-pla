import { ThemeType } from '@/lib/types'
import { THEMES } from '@/lib/themes'
import { Card } from './ui/card'
import { Check } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ThemeSelectorProps {
  selectedTheme: ThemeType
  onThemeChange: (theme: ThemeType) => void
}

export default function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Elige tu Tema</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {Object.values(THEMES).map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              onClick={() => onThemeChange(theme.id)}
              className={`relative cursor-pointer transition-all duration-200 overflow-hidden ${
                selectedTheme === theme.id
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:shadow-md'
              }`}
            >
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs sm:text-sm truncate">{theme.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {theme.description}
                    </p>
                  </div>
                  {selectedTheme === theme.id && (
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check size={14} weight="bold" className="text-primary-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1.5">
                  <div
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Color primario"
                  />
                  <div
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Color secundario"
                  />
                  <div
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Color de acento"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
