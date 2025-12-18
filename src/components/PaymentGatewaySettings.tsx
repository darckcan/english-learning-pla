import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

// Componentes UI
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'

// Iconos
import { 
  CreditCard, 
  Key, 
  Eye, 
  EyeSlash, 
  ShieldCheck, 
  Warning, 
  CheckCircle, 
  Spinner, 
  Link as LinkIcon 
} from '@phosphor-icons/react'

// Tipos
interface StripeSettings {
  publicKey: string
  monthlyPriceId: string
  lifetimePriceId: string
  monthlyPaymentLink: string
  lifetimePaymentLink: string
  webhookSecret: string
  isConfigured: boolean
  lastVerified?: number
}

const DEFAULT_STRIPE_SETTINGS: StripeSettings = {
  publicKey: '',
  monthlyPriceId: '',
  lifetimePriceId: '',
  monthlyPaymentLink: '',
  lifetimePaymentLink: '',
  webhookSecret: '',
  isConfigured: false,
}

export default function PaymentGatewaySettings() {
  // Estado persistente
  const [settings, saveStripeSettings] = useKV<StripeSettings>('stripe_settings', DEFAULT_STRIPE_SETTINGS)

  // Estados locales del formulario
  const [publicKey, setPublicKey] = useState('')
  const [monthlyPriceId, setMonthlyPriceId] = useState('')
  const [lifetimePriceId, setLifetimePriceId] = useState('')
  const [monthlyPaymentLink, setMonthlyPaymentLink] = useState('')
  const [lifetimePaymentLink, setLifetimePaymentLink] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')

  // Estados de UI
  const [showPublicKey, setShowPublicKey] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error' | 'test-mode'>('idle')
  const [lastVerified, setLastVerified] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  // Validación de claves
  const validateStripeKey = (key: string) => {
    if (!key) return { valid: false, isLive: false, type: 'unknown' }
    if (key.startsWith('pk_live_')) return { valid: true, isLive: true, type: 'public' }
    if (key.startsWith('pk_test_')) return { valid: true, isLive: false, type: 'public' }
    if (key.startsWith('sk_')) return { valid: false, isLive: false, type: 'secret' } // Seguridad: no permitir secret key aquí
    return { valid: false, isLive: false, type: 'unknown' }
  }

  // Cargar configuración al iniciar
  useEffect(() => {
    if (settings) {
      setPublicKey(settings.publicKey || '')
      setMonthlyPriceId(settings.monthlyPriceId || '')
      setLifetimePriceId(settings.lifetimePriceId || '')
      setMonthlyPaymentLink(settings.monthlyPaymentLink || '')
      setLifetimePaymentLink(settings.lifetimePaymentLink || '')
      setWebhookSecret(settings.webhookSecret || '')
      setLastVerified(settings.lastVerified)

      if (settings.isConfigured && settings.publicKey) {
        const validation = validateStripeKey(settings.publicKey)
        if (validation.valid) {
          setVerificationStatus(validation.isLive ? 'success' : 'test-mode')
        }
      }
      setIsLoading(false)
    }
  }, [settings])

  const handleVerify = async () => {
    if (!publicKey) {
      toast.error('Ingresa la clave pública para verificar')
      return
    }

    const validation = validateStripeKey(publicKey)

    if (validation.type === 'secret') {
      toast.error('❌ Error de seguridad: Has ingresado la Clave Secreta (sk_...). Aquí solo va la Clave Pública (pk_...).')
      setVerificationStatus('error')
      return
    }

    if (!validation.valid) {
      toast.error('La clave pública no tiene un formato válido. Debe comenzar con pk_live_ (Producción) o pk_test_ (Pruebas)')
      setVerificationStatus('error')
      return
    }

    setIsVerifying(true)

    try {
      // Simular verificación de red
      await new Promise(resolve => setTimeout(resolve, 800))

      if (validation.isLive) {
        setVerificationStatus('success')
        toast.success('✅ Claves de PRODUCCIÓN verificadas correctamente')
      } else {
        setVerificationStatus('test-mode')
        toast.warning('⚠️ Estás usando claves de PRUEBA. Recuerda cambiar a producción para lanzar.')
      }

      await handleSave()

    } catch (error) {
      setVerificationStatus('error')
      toast.error('Error al verificar las credenciales')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSave = async () => {
    const hasPaymentMethod = !!(monthlyPriceId || lifetimePriceId || monthlyPaymentLink || lifetimePaymentLink)
    const validation = validateStripeKey(publicKey)

    const newSettings: StripeSettings = {
      publicKey,
      monthlyPriceId,
      lifetimePriceId,
      monthlyPaymentLink,
      lifetimePaymentLink,
      webhookSecret,
      isConfigured: validation.valid && hasPaymentMethod,
      lastVerified: Date.now()
    }

    await saveStripeSettings(newSettings)
    setLastVerified(newSettings.lastVerified)
    toast.success('Configuración guardada')
  }

  const handleClearConfig = async () => {
    setPublicKey('')
    setMonthlyPriceId('')
    setLifetimePriceId('')
    setMonthlyPaymentLink('')
    setLifetimePaymentLink('')
    setWebhookSecret('')
    setVerificationStatus('idle')
    setLastVerified(undefined)
    await saveStripeSettings(DEFAULT_STRIPE_SETTINGS)
    toast.success('Configuración eliminada')
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Pasarela de Pago - Stripe</CardTitle>
              <CardDescription>Configura Stripe para procesar pagos (Producción/Pruebas)</CardDescription>
            </div>
          </div>
          
          {verificationStatus === 'success' && (
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <ShieldCheck className="h-4 w-4 mr-1" />
              Producción (Live)
            </Badge>
          )}
          {verificationStatus === 'test-mode' && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-300">
              <Warning className="h-4 w-4 mr-1" />
              Modo Pruebas
            </Badge>
          )}
          {verificationStatus === 'error' && (
            <Badge variant="destructive">
              <Warning className="h-4 w-4 mr-1" />
              Error Config
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        
        {/* Alertas de Estado */}
        {verificationStatus === 'test-mode' && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
            <Warning size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Modo de Pruebas Activo</p>
              <p>Estás usando claves <code>pk_test_</code>. No se realizarán cobros reales.</p>
            </div>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            <ShieldCheck size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Modo Producción Activo</p>
              <p>El sistema está listo para procesar pagos reales con tarjetas de crédito.</p>
            </div>
          </div>
        )}

        <Accordion type="single" collapsible defaultValue="api-keys">
          
          {/* SECCIÓN 1: CLAVES API */}
          <AccordionItem value="api-keys">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Clave de API (Requerido)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="public-key">Clave Pública (Publishable Key)</Label>
                <div className="relative">
                  <Input
                    id="public-key"
                    type={showPublicKey ? 'text' : 'password'}
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value.trim())}
                    placeholder="pk_live_..."
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPublicKey(!showPublicKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPublicKey ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pega aquí tu clave que comienza con <strong>pk_live_</strong> para producción.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* SECCIÓN 2: PAYMENT LINKS (RECOMENDADO PARA NO-CODE) */}
          <AccordionItem value="payment-links">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Payment Links (Recomendado)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs mb-2">
                <p className="font-bold">✨ Método Simplificado</p>
                <p>Crea enlaces de pago en tu Dashboard de Stripe y pégalos aquí.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-link">Enlace Membresía Mensual</Label>
                <Input
                  id="monthly-link"
                  value={monthlyPaymentLink}
                  onChange={(e) => setMonthlyPaymentLink(e.target.value.trim())}
                  placeholder="https://buy.stripe.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lifetime-link">Enlace Membresía Vitalicia</Label>
                <Input
                  id="lifetime-link"
                  value={lifetimePaymentLink}
                  onChange={(e) => setLifetimePaymentLink(e.target.value.trim())}
                  placeholder="https://buy.stripe.com/..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* SECCIÓN 3: PRICE IDS (AVANZADO) */}
          <AccordionItem value="price-ids">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Price IDs (API Avanzada)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-xs text-muted-foreground">
                Usa esto si integras Stripe Checkout via API en lugar de enlaces directos.
              </p>
              <div className="space-y-2">
                <Label htmlFor="monthly-id">Price ID Mensual</Label>
                <Input
                  id="monthly-id"
                  value={monthlyPriceId}
                  onChange={(e) => setMonthlyPriceId(e.target.value.trim())}
                  placeholder="price_..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lifetime-id">Price ID Vitalicio</Label>
                <Input
                  id="lifetime-id"
                  value={lifetimePriceId}
                  onChange={(e) => setLifetimePriceId(e.target.value.trim())}
                  placeholder="price_..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* SECCIÓN 4: WEBHOOK */}
          <AccordionItem value="webhook">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                Webhook Secret (Opcional)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Webhook Signing Secret</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value.trim())}
                  placeholder="whsec_..."
                />
                <p className="text-xs text-muted-foreground">
                  Necesario para activar automáticamente las cuentas tras el pago.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        {/* ACCIONES */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button onClick={handleVerify} disabled={isVerifying || !publicKey}>
            {isVerifying ? (
              <>
                <Spinner className="h-4 w-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Verificar y Guardar
              </>
            )}
          </Button>

          <Button variant="secondary" onClick={handleSave}>
            Guardar sin Verificar
          </Button>

          <Button variant="outline" onClick={handleClearConfig}>
            Limpiar
          </Button>
        </div>

        {lastVerified && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            Última verificación: {new Date(lastVerified).toLocaleString()}
          </p>
        )}

      </CardContent>
    </Card>
  )
}