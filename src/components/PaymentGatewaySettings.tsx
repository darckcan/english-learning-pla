import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { toast } from 'sonner'
import { Switch } from './ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { CreditCard, Key, Eye, EyeSlash, CheckCircle, XCircle, Lightning, Warning, Gear, ArrowsClockwise, Info } from '@phosphor-icons/react'

interface StripeSettings {
  publicKey: string
  secretKey: string
  webhookSecret?: string
  isTestMode: boolean
  isConfigured: boolean
  autoRenewSubscriptions: boolean
  sendPaymentReceipts: boolean
  lastVerified?: number
}

const DEFAULT_STRIPE_SETTINGS: StripeSettings = {
  publicKey: '',
  secretKey: '',
  webhookSecret: '',
  isTestMode: true,
  isConfigured: false,
  autoRenewSubscriptions: true,
  sendPaymentReceipts: true,
}

export default function PaymentGatewaySettings() {
  const [settings, setSettings] = useKV<StripeSettings>('stripe-settings', DEFAULT_STRIPE_SETTINGS)
  
  const [publicKey, setPublicKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [isTestMode, setIsTestMode] = useState(true)
  const [autoRenew, setAutoRenew] = useState(true)
  const [sendReceipts, setSendReceipts] = useState(true)
  
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (settings) {
      setPublicKey(settings.publicKey || '')
      setSecretKey(settings.secretKey || '')
      setWebhookSecret(settings.webhookSecret || '')
      setIsTestMode(settings.isTestMode !== false)
      setAutoRenew(settings.autoRenewSubscriptions !== false)
      setSendReceipts(settings.sendPaymentReceipts !== false)
      if (settings.isConfigured) {
        setVerificationStatus('success')
      }
    }
  }, [settings])

  const validateStripeKey = (key: string, type: 'public' | 'secret'): boolean => {
    if (!key) return false
    if (type === 'public') {
      return key.startsWith('pk_test_') || key.startsWith('pk_live_')
    }
    return key.startsWith('sk_test_') || key.startsWith('sk_live_')
  }

  const verifyStripeConnection = async () => {
    if (!secretKey) {
      toast.error('Ingresa la clave secreta para verificar la conexión')
      return
    }

    if (!validateStripeKey(secretKey, 'secret')) {
      toast.error('La clave secreta no tiene un formato válido')
      return
    }

    setIsVerifying(true)
    setVerificationStatus('idle')

    try {
      const response = await fetch('https://api.stripe.com/v1/balance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      })

      if (response.ok) {
        setVerificationStatus('success')
        toast.success('¡Conexión con Stripe verificada exitosamente!')
      } else {
        setVerificationStatus('error')
        const error = await response.json()
        toast.error(`Error de Stripe: ${error.error?.message || 'Clave inválida'}`)
      }
    } catch (error) {
      setVerificationStatus('error')
      toast.error('Error al conectar con Stripe. Verifica tu conexión a internet.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSave = () => {
    if (!publicKey || !secretKey) {
      toast.error('Las claves pública y secreta son obligatorias')
      return
    }

    if (!validateStripeKey(publicKey, 'public')) {
      toast.error('La clave pública debe comenzar con pk_test_ o pk_live_')
      return
    }

    if (!validateStripeKey(secretKey, 'secret')) {
      toast.error('La clave secreta debe comenzar con sk_test_ o sk_live_')
      return
    }

    const isLiveMode = publicKey.startsWith('pk_live_') || secretKey.startsWith('sk_live_')
    if (isLiveMode && isTestMode) {
      toast.error('Tienes claves de producción pero el modo prueba está activado')
      return
    }

    const newSettings: StripeSettings = {
      publicKey,
      secretKey,
      webhookSecret,
      isTestMode,
      isConfigured: verificationStatus === 'success',
      autoRenewSubscriptions: autoRenew,
      sendPaymentReceipts: sendReceipts,
      lastVerified: verificationStatus === 'success' ? Date.now() : undefined,
    }

    setSettings(() => newSettings)
    toast.success('Configuración de Stripe guardada correctamente')
  }

  const handleClear = () => {
    setSettings(() => DEFAULT_STRIPE_SETTINGS)
    setPublicKey('')
    setSecretKey('')
    setWebhookSecret('')
    setIsTestMode(true)
    setAutoRenew(true)
    setSendReceipts(true)
    setVerificationStatus('idle')
    toast.success('Configuración eliminada')
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CreditCard size={20} className="text-primary" />
          <CardTitle className="text-base sm:text-lg">Pasarela de Pago - Stripe</CardTitle>
        </div>
        <CardDescription className="text-xs sm:text-sm">
          Configura tu cuenta de Stripe para procesar pagos de membresías
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-xs sm:text-sm">
          <Info size={16} className="text-primary flex-shrink-0" />
          <p>Obtén tus claves API desde el <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-primary underline">Dashboard de Stripe</a></p>
        </div>

        <Accordion type="single" collapsible defaultValue="keys" className="w-full">
          <AccordionItem value="keys">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Key size={16} />
                Claves API
                {settings?.isConfigured && (
                  <Badge variant="secondary" className="ml-2 text-xs">Configurado</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="bg-muted/30 p-3 rounded-lg text-xs space-y-1">
                <p className="font-medium">Instrucciones:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Ve a tu Dashboard de Stripe → Developers → API Keys</li>
                  <li>Copia la clave publicable (pk_test_... o pk_live_...)</li>
                  <li>Copia la clave secreta (sk_test_... o sk_live_...)</li>
                  <li>Para producción, desactiva el "Modo Prueba" y usa claves live</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="public-key" className="text-sm flex items-center gap-2">
                  Clave Pública (Publishable Key)
                </Label>
                <Input
                  id="public-key"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  placeholder="pk_test_..."
                  className="font-mono text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret-key" className="text-sm flex items-center gap-2">
                  Clave Secreta (Secret Key)
                </Label>
                <div className="relative">
                  <Input
                    id="secret-key"
                    type={showSecretKey ? 'text' : 'password'}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="sk_test_..."
                    className="font-mono text-xs sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSecretKey ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret" className="text-sm flex items-center gap-2">
                  Webhook Secret (Opcional)
                </Label>
                <div className="relative">
                  <Input
                    id="webhook-secret"
                    type={showWebhookSecret ? 'text' : 'password'}
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    placeholder="whsec_..."
                    className="font-mono text-xs sm:text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showWebhookSecret ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Para recibir notificaciones automáticas de pagos (webhooks)
                </p>
              </div>

              <Button
                onClick={verifyStripeConnection}
                disabled={!secretKey || isVerifying}
                variant="outline"
                className="w-full"
                size="sm"
              >
                {isVerifying ? (
                  <>
                    <ArrowsClockwise size={16} className="mr-2 animate-spin" />
                    Verificando conexión...
                  </>
                ) : (
                  <>
                    <Lightning size={16} className="mr-2" />
                    Verificar Conexión con Stripe
                  </>
                )}
              </Button>

              {verificationStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
                  <CheckCircle size={18} />
                  <span>Conexión verificada exitosamente</span>
                </div>
              )}

              {verificationStatus === 'error' && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg text-sm">
                  <XCircle size={18} />
                  <span>Error en la verificación. Revisa las claves.</span>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="settings">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Gear size={16} />
                Configuración de Pagos
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Modo Prueba</Label>
                  <p className="text-xs text-muted-foreground">
                    Usar entorno de pruebas de Stripe (no cobra dinero real)
                  </p>
                </div>
                <Switch
                  checked={isTestMode}
                  onCheckedChange={setIsTestMode}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Renovación Automática</Label>
                  <p className="text-xs text-muted-foreground">
                    Renovar membresías mensuales automáticamente
                  </p>
                </div>
                <Switch
                  checked={autoRenew}
                  onCheckedChange={setAutoRenew}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Enviar Recibos</Label>
                  <p className="text-xs text-muted-foreground">
                    Enviar recibo por correo al completar un pago
                  </p>
                </div>
                <Switch
                  checked={sendReceipts}
                  onCheckedChange={setSendReceipts}
                />
              </div>

              {!isTestMode && (
                <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
                  <Warning size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Modo Producción Activado</p>
                    <p className="text-xs mt-1">Los pagos serán procesados con dinero real. Asegúrate de usar claves de producción (pk_live_ y sk_live_).</p>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {settings?.lastVerified && (
          <p className="text-xs text-muted-foreground text-center">
            Última verificación: {new Date(settings.lastVerified).toLocaleString('es-ES')}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
          <Button onClick={handleSave} className="flex-1" size="sm">
            Guardar Configuración
          </Button>
          <Button onClick={handleClear} variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
            Eliminar Configuración
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
