import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { toast } from 'sonner'
import { CurrencyDollar, Check, CreditCard, Lightning, Warning, CheckCircle, Sparkle } from '@phosphor-icons/react'
import { User } from '@/lib/types'
import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe-service'
import { STRIPE_PRODUCTS } from '@/lib/stripe-config'
import { useKV } from '@github/spark/hooks'
import { MembershipPricing, DEFAULT_PRICING, createMonthlyMembership, createLifetimeMembership } from '@/lib/membership'
import { motion, AnimatePresence } from 'framer-motion'

interface StripePaymentModalProps {
  open: boolean
  onClose: () => void
  user: User
  onMembershipUpdate?: (membership: any) => void
}

type PaymentStep = 'select' | 'processing' | 'simulated-confirm' | 'success'

export default function StripePaymentModal({ open, onClose, user, onMembershipUpdate }: StripePaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime' | null>(null)
  const [pricing] = useKV<MembershipPricing>('membership-pricing', DEFAULT_PRICING)
  const [stripeReady, setStripeReady] = useState<boolean | null>(null)
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('select')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')

  const monthlyPrice = pricing?.monthlyPrice || DEFAULT_PRICING.monthlyPrice
  const lifetimePrice = pricing?.lifetimePrice || DEFAULT_PRICING.lifetimePrice

  useEffect(() => {
    if (open) {
      isStripeConfigured().then(setStripeReady)
      setPaymentStep('select')
      setSelectedPlan(null)
      setCardNumber('')
      setExpiryDate('')
      setCvc('')
    }
  }, [open])

  const handlePayment = async (type: 'monthly' | 'lifetime') => {
    setLoading(true)
    setSelectedPlan(type)
    setPaymentStep('processing')

    try {
      const product = type === 'monthly' ? STRIPE_PRODUCTS.monthly : STRIPE_PRODUCTS.lifetime
      const amount = type === 'monthly' ? monthlyPrice : lifetimePrice

      const result = await createCheckoutSession({
        amount,
        currency: 'usd',
        productName: product.name,
        customerEmail: user.email || 'no-email@nexusfluent.com',
        userId: user.id,
        membershipType: type,
      })

      if (!result.simulatedMode && result.url) {
        window.location.href = result.url
      } else {
        setPaymentStep('simulated-confirm')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error)
      toast.error('Error al iniciar el proceso de pago. Por favor intenta de nuevo.')
      setLoading(false)
      setSelectedPlan(null)
      setPaymentStep('select')
    }
  }

  const handleSimulatedPayment = () => {
    if (!selectedPlan) return
    
    setLoading(true)
    setPaymentStep('processing')
    
    setTimeout(() => {
      const membership = selectedPlan === 'monthly' 
        ? createMonthlyMembership() 
        : createLifetimeMembership()
      
      if (onMembershipUpdate) {
        onMembershipUpdate(membership)
      }
      
      setPaymentStep('success')
      setLoading(false)
      
      toast.success(`¡Membresía ${selectedPlan === 'monthly' ? 'mensual' : 'vitalicia'} activada!`)
    }, 1500)
  }

  const handleClose = () => {
    if (paymentStep === 'success' || paymentStep === 'select') {
      onClose()
    }
  }

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts: string[] = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {paymentStep === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-center">
                  Elige tu Membresía
                </DialogTitle>
                <DialogDescription className="text-center text-lg">
                  Desbloquea todo el contenido y mejora tu inglés sin límites
                </DialogDescription>
              </DialogHeader>

              {stripeReady === false && (
                <div className="flex items-center gap-3 p-4 mt-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                  <Sparkle size={24} className="flex-shrink-0" weight="fill" />
                  <div>
                    <p className="font-medium">Modo de demostración</p>
                    <p className="text-sm">Puedes probar el flujo de pago. Para pagos reales, configura Stripe Payment Links en el panel de administración.</p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card className="relative border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer" onClick={() => !loading && handlePayment('monthly')}>
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
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span>Acceso completo a todos los niveles</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span>Ejercicios ilimitados y práctica de vocabulario</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span>Audio de pronunciación nativa</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span>Certificados al completar niveles</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span>Sistema de logros y seguimiento de progreso</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span>Cancela cuando quieras</span>
                      </li>
                    </ul>

                    <Button
                      onClick={(e) => { e.stopPropagation(); handlePayment('monthly'); }}
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

                <Card className="relative border-2 border-accent hover:border-accent/80 transition-all duration-300 shadow-lg cursor-pointer" onClick={() => !loading && handlePayment('lifetime')}>
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
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span className="font-semibold">Todo lo del plan mensual</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span className="font-semibold">Acceso de por vida garantizado</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span className="font-semibold">Todas las actualizaciones futuras gratis</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span className="font-semibold">Ahorra más de $95 al año</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span className="font-semibold">Contenido exclusivo premium</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="text-green-600 mt-0.5 flex-shrink-0" size={20} weight="bold" />
                        <span className="font-semibold">Pago único, sin suscripciones</span>
                      </li>
                    </ul>

                    <Button
                      onClick={(e) => { e.stopPropagation(); handlePayment('lifetime'); }}
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
            </motion.div>
          )}

          {paymentStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <CreditCard size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Procesando tu pago...</h3>
              <p className="text-muted-foreground">Por favor espera un momento</p>
            </motion.div>
          )}

          {paymentStep === 'simulated-confirm' && (
            <motion.div
              key="simulated-confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">
                  Confirmar Pago - Modo Demo
                </DialogTitle>
                <DialogDescription className="text-center">
                  Plan {selectedPlan === 'monthly' ? 'Mensual' : 'Vitalicio'} - ${selectedPlan === 'monthly' ? monthlyPrice : lifetimePrice} USD
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3 text-amber-800">
                  <Warning size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Modo de demostración</p>
                    <p className="text-xs mt-1">
                      Este es un formulario de demostración. Para pagos reales, configura Stripe Payment Links en el panel de administración.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Número de tarjeta</Label>
                  <Input
                    id="card-number"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Fecha de expiración</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                    />
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleSimulatedPayment}
                    disabled={loading}
                    className="w-full h-12"
                    size="lg"
                  >
                    {loading ? (
                      'Procesando...'
                    ) : (
                      <>
                        <CreditCard size={20} className="mr-2" />
                        Confirmar Pago (Demo)
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setPaymentStep('select'); setSelectedPlan(null); }}
                    disabled={loading}
                    className="w-full"
                  >
                    Volver
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {paymentStep === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
              >
                <CheckCircle size={48} weight="fill" className="text-green-600" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 text-green-700">¡Pago Exitoso!</h3>
              <p className="text-muted-foreground mb-6">
                Tu membresía {selectedPlan === 'monthly' ? 'mensual' : 'vitalicia'} ha sido activada
              </p>
              <Button onClick={onClose} size="lg" className="px-8">
                Comenzar a Aprender
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
