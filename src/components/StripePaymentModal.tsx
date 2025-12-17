import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { toast } from 'sonner'
import { CurrencyDollar, Check, X, CreditCard, Lightning } from '@phosphor-icons/react'
import { User } from '@/lib/types'
import { createCheckoutSession } from '@/lib/stripe-service'
import { STRIPE_PRODUCTS } from '@/lib/stripe-config'
import { useKV } from '@github/spark/hooks'
import { MembershipPricing, DEFAULT_PRICING } from '@/lib/membership'

interface StripePaymentModalProps {
  open: boolean
  onClose: () => void
  user: User
}

export default function StripePaymentModal({ open, onClose, user }: StripePaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime' | null>(null)
  const [pricing] = useKV<MembershipPricing>('membership-pricing', DEFAULT_PRICING)

  const monthlyPrice = pricing?.monthlyPrice || DEFAULT_PRICING.monthlyPrice
  const lifetimePrice = pricing?.lifetimePrice || DEFAULT_PRICING.lifetimePrice

  const handlePayment = async (type: 'monthly' | 'lifetime') => {
    setLoading(true)
    setSelectedPlan(type)

    try {
      const product = type === 'monthly' ? STRIPE_PRODUCTS.monthly : STRIPE_PRODUCTS.lifetime
      const amount = type === 'monthly' ? monthlyPrice : lifetimePrice

      const { sessionId, url } = await createCheckoutSession({
        amount,
        currency: 'usd',
        productName: product.name,
        customerEmail: user.email || 'no-email@nexusfluent.com',
        userId: user.id,
        membershipType: type,
      })

      if (url) {
        window.location.href = url
      } else {
        throw new Error('No se recibió URL de pago')
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error)
      toast.error('Error al iniciar el proceso de pago. Por favor intenta de nuevo.')
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Elige tu Membresía
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Desbloquea todo el contenido y mejora tu inglés sin límites
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="relative border-2 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Mensual</CardTitle>
                <CreditCard className="text-primary" size={32} weight="duotone" />
              </div>
              <CardDescription>Flexibilidad total, cancela cuando quieras</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold">${monthlyPrice}</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span>Acceso completo a todos los niveles</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span>Ejercicios ilimitados y práctica de vocabulario</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span>Audio de pronunciación nativa</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span>Certificados al completar niveles</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span>Sistema de logros y seguimiento de progreso</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span>Cancela cuando quieras</span>
                </li>
              </ul>

              <Button
                onClick={() => handlePayment('monthly')}
                disabled={loading}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {loading && selectedPlan === 'monthly' ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <CurrencyDollar size={24} />
                    Elegir Plan Mensual
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="relative border-2 border-accent hover:border-accent/80 transition-all duration-300 shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-accent text-accent-foreground px-4 py-1 text-sm font-semibold">
                ¡MÁS POPULAR!
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Vitalicia</CardTitle>
                <Lightning className="text-accent" size={32} weight="duotone" />
              </div>
              <CardDescription>Pago único, acceso para siempre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold">${lifetimePrice}</span>
                  <span className="text-muted-foreground">una sola vez</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Equivale a menos de 3 meses de la mensual
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span className="font-semibold">Todo lo del plan mensual</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span className="font-semibold">Acceso de por vida garantizado</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span className="font-semibold">Todas las actualizaciones futuras gratis</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span className="font-semibold">Ahorra más de $95 al año</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span className="font-semibold">Contenido exclusivo premium</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-success mt-0.5 flex-shrink-0" size={20} weight="bold" />
                  <span className="font-semibold">Pago único, sin suscripciones</span>
                </li>
              </ul>

              <Button
                onClick={() => handlePayment('lifetime')}
                disabled={loading}
                className="w-full h-12 text-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
              >
                {loading && selectedPlan === 'lifetime' ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <Lightning size={24} weight="fill" />
                    Elegir Plan Vitalicio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
          <p className="flex items-center justify-center gap-2">
            <CreditCard size={16} />
            Pago seguro procesado por Stripe
          </p>
          <p>Todos los pagos son procesados de forma segura. Tus datos están protegidos.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
