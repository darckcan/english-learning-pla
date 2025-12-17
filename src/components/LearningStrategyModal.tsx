import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { Lightbulb, Moon, Brain, Eye, PencilSimple, Clock } from '@phosphor-icons/react'

interface LearningStrategyModalProps {
  onClose: () => void
}

export default function LearningStrategyModal({ onClose }: LearningStrategyModalProps) {
  const [showModal, setShowModal] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [hasShownThisSession, setHasShownThisSession] = useKV<string>('learning-strategy-shown-session', 'no')

  useEffect(() => {
    if (hasShownThisSession === 'no') {
      setShowModal(true)
    }
  }, [hasShownThisSession])

  const handleClose = () => {
    if (dontShowAgain) {
      setHasShownThisSession(() => 'yes')
    }
    setShowModal(false)
    onClose()
  }

  return (
    <Dialog open={showModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="text-accent" size={32} weight="fill" />
            Estrategia de Aprendizaje Optimizada
          </DialogTitle>
          <DialogDescription className="text-base">
            Sigue estos principios científicos para maximizar tu aprendizaje
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
            <Clock className="text-primary mt-1 shrink-0" size={28} weight="bold" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Bloques de Tiempo</h3>
              <p className="text-sm text-muted-foreground">
                Estudia sesiones cortas de <strong>25 a 45 minutos diarios</strong>. La constancia vence a la intensidad gracias a la <strong>Repetición Espaciada</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-secondary/10 rounded-lg">
            <Moon className="text-secondary mt-1 shrink-0" size={28} weight="fill" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Horario Nocturno</h3>
              <p className="text-sm text-muted-foreground">
                Estudia <strong>1 hora antes de ir a la cama</strong> para evitar interferencias externas y preparar al cerebro para el almacenamiento.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg">
            <Brain className="text-accent mt-1 shrink-0" size={28} weight="fill" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Sueño Reparador</h3>
              <p className="text-sm text-muted-foreground">
                Duerme entre <strong>7 y 8 horas</strong>; es durante el sueño cuando el cerebro transfiere lo aprendido de la memoria a corto plazo a la de largo plazo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
            <Eye className="text-primary mt-1 shrink-0" size={28} weight="bold" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Atención Plena</h3>
              <p className="text-sm text-muted-foreground">
                <strong>No estudies si estás exhausto</strong>; sin atención no hay codificación de memoria. Es preferible saltarse un día que estudiar "en automático".
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-secondary/10 rounded-lg">
            <svg className="mt-1 shrink-0" width="28" height="28" viewBox="0 0 256 256" fill="currentColor">
              <path d="M200,224H150.54A266.56,266.56,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25a88,88,0,0,0-176,0c0,31.4,14.51,64.68,42,96.25A266.56,266.56,0,0,0,105.46,224H56a8,8,0,0,0,0,16H200a8,8,0,0,0,0-16ZM56,104a72,72,0,0,1,144,0c0,57.23-55.47,105-72,118C111.47,209,56,161.23,56,104Zm112,0a40,40,0,1,1-40-40A40,40,0,0,1,168,104Zm-16,0a24,24,0,1,0-24,24A24,24,0,0,0,152,104Z"></path>
            </svg>
            <div>
              <h3 className="font-semibold text-lg mb-2">Técnica Shadowing</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Escucha y repite en voz alta simultáneamente</strong> para entrenar tu bucle fonológico, mejorar la pronunciación y dejar de traducir mentalmente.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg">
            <PencilSimple className="text-accent mt-1 shrink-0" size={28} weight="bold" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Escritura Manual</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Toma notas a mano en un cuaderno</strong>. Esto obliga a tu cerebro a sintetizar y procesar la información (codificación profunda), algo que no sucede al teclear.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <Label htmlFor="dont-show" className="text-sm cursor-pointer">
              No mostrar nuevamente en esta sesión
            </Label>
          </div>
          <Button onClick={handleClose}>
            ¡Entendido!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
