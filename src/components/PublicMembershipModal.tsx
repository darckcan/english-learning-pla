import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Check, CreditCard, Lightning, Sparkle, Crown } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { MembershipPricing, DEFAULT_PRICING } from '@/lib/membership'
import { motion } from 'framer-motion'

interface PublicMembershipModalProps {
  open: boolean
  onClose: () => void
  onGetStarted: () => void
}

export default function PublicMembershipModal({ open, onClose, onGetStarted }: PublicMembershipModalProps) {
  const [pricing] = useKV<MembershipPricing>('membership-pricing', DEFAULT_PRICING)

  const monthlyPrice = pricing?.monthlyPrice || DEFAULT_PRICING.monthlyPrice
  const lifetimePrice = pricing?.lifetimePrice || DEFAULT_PRICING.lifetimePrice
  const trialDays = pricing?.trialDays || DEFAULT_PRICING.trialDays

  const handleSelectPlan = () => {
    onClose()
    onGetStarted()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Crown size={28} weight="fill" className="text-accent hidden sm:inline" />
            <span>Planes de Membresía</span>
            <Crown size={28} weight="fill" className="text-accent hidden sm:inline" />
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base md:text-lg">
            Elige el plan perfecto para tu aprendizaje de inglés
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-3 sm:p-4 border border-primary/20 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-primary mb-1">
              <Sparkle size={18} weight="fill" className="sm:hidden" />
              <Sparkle size={20} weight="fill" className="hidden sm:inline" />
              <span className="font-semibold text-sm sm:text-base">¡Prueba Gratis!</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Comienza con <strong>{trialDays} días gratis</strong> sin compromiso. Accede a todo el contenido.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative border-2 hover:border-primary/50 transition-all duration-300 h-full">
              <CardHeader className="pb-2 sm:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl">Mensual</CardTitle>
                  <CreditCard className="text-primary" size={24} weight="duotone" />
                </div>
                <CardDescription className="text-xs sm:text-sm">Flexibilidad total, cancela cuando quieras</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="text-center py-3 sm:py-4 md:py-6">
                  <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold">${monthlyPrice}</span>
                    <span className="text-muted-foreground text-sm sm:text-base">/mes</span>
                  </div>
                </div>

                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="text-success mt-0.5 flex-shrink-0" size={16} weight="bold" />
                    <span>Acceso completo a todos los niveles</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="text-success mt-0.5 flex-shrink-0" size={16} weight="bold" />
                    <span>Ejercicios ilimitados</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="text-success mt-0.5 flex-shrink-0" size={16} weight="bold" />
                    <span>Audio de pronunciación nativa</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="text-success mt-0.5 flex-shrink-0" size={16} weight="bold" />
                    <span>Certificados de nivel</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="text-success mt-0.5 flex-shrink-0" size={16} weight="bold" />
                    <span>Cancela cuando quieras</span>
                  </li>
                </ul>

                <Button
                  onClick={handleSelectPlan}
                  className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                  size="lg"
                >
                  <CreditCard size={18} className="mr-2" />
                  Comenzar Prueba Gratis
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative border-2 border-accent hover:border-accent/80 transition-all duration-300 shadow-lg h-full">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent text-accent-foreground px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold whitespace-nowrap">
                  ¡MÁS POPULAR!
                </Badge>
              </div>
              <CardHeader className="pb-2 sm:pb-4 pt-6 sm:pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl">Vitalicia</CardTitle>
                  <Lightning className="text-accent" size={24} weight="duotone" />
                </div>
                <CardDescription className="text-xs sm:text-sm">Pago único, acceso para siempre</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="text-center py-3 sm:py-4 md:py-6">
                  <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold">${lifetimePrice}</span>
                    <span className="text-muted-foreground text-sm sm:text-base">una vez</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">
                    Menos de 3 meses del plan mensual
                  </p>
                </div>

                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="text-success mt-0.5 flex-shrink-0" size={16} weight="bold" />
                    <span className="font-semibold">Todo lo del plan mensual</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="text-success mt-0.5 flex-shrink-0" size={16} weight="bold" />
                    <span className="font-semibold">Acceso de por vida</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="text-success mt-0.5 flex-shrink-0" size={16} weight="bold" />
                    <span className="font-semibold">Actualizaciones futuras gratis</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="text-success mt-0.5 flex-shrink-0" size={16} weight="bold" />
                    <span className="font-semibold">Ahorra más de $95/año</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="text-success mt-0.5 flex-shrink-0" size={16} weight="bold" />
                    <span className="font-semibold">Sin suscripciones</span>
                  </li>
                </ul>

                <Button
                  onClick={handleSelectPlan}
                  className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                >
                  <Lightning size={18} weight="fill" className="mr-2" />
                  Comenzar Prueba Gratis
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-4 sm:mt-6 text-center text-[10px] sm:text-xs text-muted-foreground space-y-1 sm:space-y-2">
          <p className="flex items-center justify-center gap-2">
            <CreditCard size={14} />
            Pago seguro procesado por Stripe
          </p>
          <p>Regístrate primero para elegir tu plan. La prueba gratis comienza automáticamente.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
