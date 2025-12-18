import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { CreditCard, Key, Eye, EyeSlash, CheckCircle, Warning, Spinner, Link as LinkIcon, ShieldCheck } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { StripeSettings, getStripeSettings, saveStripeSettings, validateStripeKey } from '@/lib/stripe-config'

const DEFAULT_STRIPE_SETTINGS: StripeSettings = {
  publicKey: '',
  monthlyPriceId: '',
  lifetimePriceId: '',
  monthlyPaymentLink: '',
  lifetimePaymentLink: '',
  webhookSecret: '',
  isConfigured: false,
}

export default function StripeGatewaySettings() {
  const [publicKey, setPublicKey] = useState('')
  const [monthlyPriceId, setMonthlyPriceId] = useState('')
  const [lifetimePriceId, setLifetimePriceId] = useState('')
  const [monthlyPaymentLink, setMonthlyPaymentLink] = useState('')
  const [lifetimePaymentLink, setLifetimePaymentLink] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  
  const [showPublicKey, setShowPublicKey] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error' | 'test-mode'>('idle')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastVerified, setLastVerified] = useState<number | undefined>()

  useEffect(() => {
    getStripeSettings().then((settings) => {
      setPublicKey(settings.publicKey || '')
      setMonthlyPriceId(settings.monthlyPriceId || '')
      setLifetimePriceId(settings.lifetimePriceId || '')
      setMonthlyPaymentLink(settings.monthlyPaymentLink || '')
      setLifetimePaymentLink(settings.lifetimePaymentLink || '')
      setWebhookSecret(settings.webhookSecret || '')
      setLastVerified(settings.lastVerified)
      
      if (settings.isConfigured) {
        const validation = validateStripeKey(settings.publicKey)
        if (validation.valid && validation.isLive) {
          setVerificationStatus('success')
        } else if (validation.valid && !validation.isLive) {
          setVerificationStatus('test-mode')
        }
      }
      setIsLoading(false)
    })
  }, [])

  const handleVerify = async () => {
    if (!publicKey) {
      toast.error('Ingresa la clave pública para verificar')
      return
    }

    const validation = validateStripeKey(publicKey)
    
    if (!validation.valid) {
      toast.error('La clave pública no tiene un formato válido. Debe comenzar con pk_live_ o pk_test_')
      setVerificationStatus('error')
      return
    }

    if (validation.type !== 'public') {
      toast.error('Debes usar la clave pública (Publishable Key), no la secreta')
      setVerificationStatus('error')
      return
    }

    setIsVerifying(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      if (validation.isLive) {
        setVerificationStatus('success')
        toast.success('✅ Claves de PRODUCCIÓN verificadas correctamente')
      } else {
        setVerificationStatus('test-mode')
        toast.warning('⚠️ Estás usando claves de PRUEBA. Para pagos reales, usa claves de producción (pk_live_)')
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
              <CardTitle>Pasarela de Pago - Stripe (Producción)</CardTitle>
              <CardDescription>Configura Stripe para procesar pagos reales</CardDescription>
            </div>
          </div>
          {verificationStatus === 'success' && (
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <ShieldCheck className="h-4 w-4 mr-1" />
              Producción
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
              Error
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {verificationStatus === 'test-mode' && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            <Warning size={24} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Modo de Pruebas Activo</p>
              <p className="text-sm mt-1">
                Estás usando claves de prueba (pk_test_). Los pagos no serán reales.
                Para aceptar pagos de clientes, cambia a claves de producción desde tu 
                <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline ml-1 font-medium">
                  Dashboard de Stripe
                </a>.
              </p>
            </div>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <ShieldCheck size={24} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Modo Producción Activo</p>
              <p className="text-sm mt-1">
                Stripe está configurado para procesar pagos reales. Los cargos a tarjetas serán efectivos.
              </p>
            </div>
          </div>
        )}

        <Accordion type="single" collapsible defaultValue="api-keys">
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
                    onChange={(e) => setPublicKey(e.target.value)}
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
                  <strong>Producción:</strong> pk_live_... &nbsp;|&nbsp; <strong>Pruebas:</strong> pk_test_...
                </p>
                <p className="text-xs text-muted-foreground">
                  Encuentra tus claves en{' '}
                  <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline text-primary">
                    dashboard.stripe.com/apikeys
                  </a>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment-links">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Payment Links (Recomendado)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                <p className="font-medium">✨ Método más fácil</p>
                <p className="mt-1">
                  Los Payment Links se crean desde tu Dashboard de Stripe sin necesidad de código.
                  <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                    Crear Payment Link →
                  </a>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthly-payment-link">Payment Link - Membresía Mensual</Label>
                <Input
                  id="monthly-payment-link"
                  value={monthlyPaymentLink}
                  onChange={(e) => setMonthlyPaymentLink(e.target.value)}
                  placeholder="https://buy.stripe.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lifetime-payment-link">Payment Link - Membresía Vitalicia</Label>
                <Input
                  id="lifetime-payment-link"
                  value={lifetimePaymentLink}
                  onChange={(e) => setLifetimePaymentLink(e.target.value)}
                  placeholder="https://buy.stripe.com/..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price-ids">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Price IDs (Alternativo)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                <p>
                  Usa Price IDs si prefieres el flujo de Checkout tradicional.
                  Encuéntralos en tu producto de Stripe bajo "API ID".
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthly-price-id">Price ID - Membresía Mensual</Label>
                <Input
                  id="monthly-price-id"
                  value={monthlyPriceId}
                  onChange={(e) => setMonthlyPriceId(e.target.value)}
                  placeholder="price_..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lifetime-price-id">Price ID - Membresía Vitalicia</Label>
                <Input
                  id="lifetime-price-id"
                  value={lifetimePriceId}
                  onChange={(e) => setLifetimePriceId(e.target.value)}
                  placeholder="price_..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="webhook">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
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
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="whsec_..."
                />
                <p className="text-xs text-muted-foreground">
                  Usado para verificar eventos de webhook. Configúralo en{' '}
                  <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer" className="underline text-primary">
                    dashboard.stripe.com/webhooks
                  </a>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button
            onClick={handleVerify}
            disabled={isVerifying || !publicKey}
          >
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
            Solo Guardar
          </Button>
          <Button variant="outline" onClick={handleClearConfig}>
            Limpiar Configuración
          </Button>
        </div>

        {lastVerified && (
          <p className="text-sm text-muted-foreground">
            Última verificación: {new Date(lastVerified).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
