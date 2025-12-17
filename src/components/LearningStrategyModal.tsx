import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { X, Lightbulb, Clock, Moon, Brain, Microphone, PencilSimple } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function LearningStrategyModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    const hasSeenStrategy = sessionStorage.getItem('hasSeenLearningStrategy')
    if (!hasSeenStrategy) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    if (dontShowAgain) {
      sessionStorage.setItem('hasSeenLearningStrategy', 'true')
    }
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="relative border-2 border-primary/20 shadow-2xl">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 hover:bg-destructive/10 hover:text-destructive"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <CardHeader className="space-y-2 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Lightbulb weight="fill" className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Estrategia de Aprendizaje Optimizada</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Sigue estos principios científicos para maximizar tu aprendizaje
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-5">
                  <StrategyItem
                    icon={<Clock weight="duotone" className="w-6 h-6" />}
                    title="Bloques de Tiempo"
                    description="Estudia sesiones cortas de 25 a 45 minutos diarios (la constancia vence a la intensidad gracias a la Repetición Espaciada)."
                    color="text-primary"
                  />

                  <StrategyItem
                    icon={<Moon weight="duotone" className="w-6 h-6" />}
                    title="Horario Nocturno"
                    description="Estudia 1 hora antes de ir a la cama para evitar interferencias externas y preparar al cerebro para el almacenamiento."
                    color="text-secondary"
                  />

                  <StrategyItem
                    icon={<Brain weight="duotone" className="w-6 h-6" />}
                    title="Sueño Reparador"
                    description="Duerme entre 7 y 8 horas; es durante el sueño cuando el cerebro transfiere lo aprendido de la memoria a corto plazo a la de largo plazo."
                    color="text-accent"
                  />

                  <StrategyItem
                    icon={<Brain weight="duotone" className="w-6 h-6" />}
                    title="Atención Plena"
                    description="No estudies si estás exhausto; sin atención no hay codificación de memoria. Es preferible saltarse un día que estudiar 'en automático'."
                    color="text-primary"
                  />

                  <StrategyItem
                    icon={<Microphone weight="duotone" className="w-6 h-6" />}
                    title="Técnica Shadowing"
                    description="Escucha y repite en voz alta simultáneamente para entrenar tu bucle fonológico, mejorar la pronunciación y dejar de traducir mentalmente."
                    color="text-secondary"
                  />

                  <StrategyItem
                    icon={<PencilSimple weight="duotone" className="w-6 h-6" />}
                    title="Escritura Manual"
                    description="Toma notas a mano en un cuaderno. Esto obliga a tu cerebro a sintetizar y procesar la información (codificación profunda), algo que no sucede al teclear."
                    color="text-accent"
                  />
                </div>

                <div className="pt-4 border-t space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Checkbox
                      id="dont-show-again"
                      checked={dontShowAgain}
                      onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                      className="mt-1"
                    />
                    <label
                      htmlFor="dont-show-again"
                      className="text-sm font-medium leading-relaxed cursor-pointer select-none"
                    >
                      No volver a mostrar en esta sesión
                    </label>
                  </div>

                  <Button
                    onClick={handleClose}
                    className="w-full"
                    size="lg"
                  >
                    ¡Entendido, comenzar a aprender!
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface StrategyItemProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

function StrategyItem({ icon, title, description, color }: StrategyItemProps) {
  return (
    <div className="flex gap-4 group">
      <div className={cn('flex-shrink-0 p-2.5 bg-muted rounded-lg transition-colors group-hover:bg-primary/10', color)}>
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold text-base leading-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
