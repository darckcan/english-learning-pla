import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { toast } from 'sonner'
interface StripeSettings {
  secretKey: string

  autoRenewSubscriptions: 
  lastVerified?: nu

  publicKey: '',
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
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (settings) {
      setPublicKey(settings.publicKey || '')
      setSecretKey(settings.secretKey || '')
      setWebhookSecret(settings.webhookSecret || '')
      setIsTestMode(settings.isTestMode ?? true)
      setAutoRenew(settings.autoRenewSubscriptions ?? true)
      setSendReceipts(settings.sendPaymentReceipts ?? true)
      if (settings.isConfigured) {
        setVerificationStatus('success')
      }
    }
  }, [settings])

  const validateStripeKey = (key: string, type: 'public' | 'secret') => {
    if (!key) return false
    if (type === 'public') {
      return key.startsWith('pk_test_') || key.startsWith('pk_live_')
    }
    return key.startsWith('sk_test_') || key.startsWith('sk_live_')
  }

    setVerificationStatus('idle')
    try {
        method: 'GET',
          'A
     

        toast.success('Conexión con Stripe verific
        setVerificationStatus('error')
      }
     

    }


      ret

      toast.error('La 
    }
    if (!validateStripeKey(secretKey, 'secret')) 
      retu


      webhookSecret,
      isConfigured: verificationStatus =
      sendPaymentReceipts: sendReceipts,
    }
    setSettings(() => newSettings)
  }
  const
    setPublic
    setWebhookSecret('')
    setAutoRenew(true)
    setVerifica
  }
  ret
   

        </div>
          Configura tu cuenta de St
      </CardHeader>
        <div
     

          <AccordionItem value="keys">
              <div className="flex items-center gap-2">
            
     

            <AccordionContent className="space-y-4
                <p className="font-medium">Instrucciones:</p>
            
     


                
                
                  id
                 
                  className="font-mono text-xs sm:tex
              </div>
              <div className="space-y-2"
                  Clave Secreta
     

                    value={secretK
                    placeholder="sk_test_..."
   

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
                <Input
                  id="webhook-secret"
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="whsec_..."
                  className="font-mono text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="text-sm">Modo Prueba</span>
                </div>
                <Switch
                  checked={isTestMode}
                  onCheckedChange={setIsTestMode}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleVerify}
                  disabled={isVerifying || !secretKey}
                  variant="outline"
                  className="flex-1"
                >
                  {isVerifying ? (
                    <Spinner size={16} className="animate-spin mr-2" />
                  ) : verificationStatus === 'success' ? (
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                  ) : verificationStatus === 'error' ? (
                    <XCircle size={16} className="mr-2 text-red-500" />
                  ) : null}
                  Verificar Conexión
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="options">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
















































