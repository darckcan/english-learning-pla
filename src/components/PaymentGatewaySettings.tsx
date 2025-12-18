import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
// Componentes UI
import { Badge } from './ui/badge'
import { Input } from './ui/input' // Solo una vez
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
// Asegúrate de tener este archivo o ajusta la ruta
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card' 
// Iconos
import { CreditCard, Key, Eye, EyeSlash, CheckCircle, Warning, Spinner } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface StripeSettings {
  publicKey: string
  secretKey: string
  webhookSecret: string
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
  sendPaymentReceipts: true
}

export default function StripeGatewaySettings() {
  // Estado recuperado de la base de datos/KV
  const [settings, setSettings] = useKV<StripeSettings>('stripe_settings', DEFAULT_STRIPE_SETTINGS)

  // Estados locales para el formulario
  const [publicKey, setPublicKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [isTestMode, setIsTestMode] = useState(true)
  const [autoRenew, setAutoRenew] = useState(true)
  const [sendReceipts, setSendReceipts] = useState(true)
  
  // Estados de UI
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isVerifying, setIsVerifying] = useState(false)

  // Sincronizar estado local cuando settings carga
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
    if (type === 'public') return key.startsWith('pk_');
    if (type === 'secret') return key.startsWith('sk_');
    return false;
  }

  const handleVerify = async () => {
    if (!publicKey || !secretKey) {
      toast.error('Ingresa ambas claves para verificar')
      return
    }

    if (!validateStripeKey(publicKey, 'public')) {
      toast.error('La clave pública no tiene un formato válido')
      return
    }
    
    setIsVerifying(true)
    
    try {
      // Simulación de verificación (aquí iría tu llamada real a la API)
      await new Promise(resolve => setTimeout(resolve, 1000))

      const isLiveKey = publicKey.startsWith('pk_live_')
      const isTestKey = publicKey.startsWith('pk_test_')

      if (!isTestKey && !isLiveKey) {
         throw new Error('Formato de clave desconocido')
      }

      setVerificationStatus('success')
      toast.success('Conexión con Stripe verificada')
      
      // Guardar automáticamente al verificar con éxito
      handleSave()

    } catch (error) {
      setVerificationStatus('error')
      toast.error('Error al verificar las credenciales')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSave = () => {
    const newSettings: StripeSettings = {
      publicKey,
      secretKey,
      webhookSecret,
      isTestMode,
      isConfigured: verificationStatus === 'success',
      autoRenewSubscriptions: autoRenew,
      sendPaymentReceipts: sendReceipts,
      lastVerified: Date.now()
    }
    
    setSettings(newSettings)
    toast.success('Configuración guardada')
  }

  const handleClearConfig = () => {
    setPublicKey('')
    setSecretKey('')
    setWebhookSecret('')
    setVerificationStatus('idle')
    setSettings(DEFAULT_STRIPE_SETTINGS)
    toast.success('Configuración eliminada')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Pasarela de Pago - Stripe</CardTitle>
              <CardDescription>Configura la integración con Stripe para procesar pagos</CardDescription>
            </div>
          </div>
          {verificationStatus === 'success' && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Configurado
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
        <Accordion type="single" collapsible defaultValue="api-keys">
          <AccordionItem value="api-keys">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Claves de API
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="public-key">Clave Pública (Publishable Key)</Label>
                <Input
                  id="public-key"
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  placeholder="pk_test_..."
                />
                <p className="text-xs text-muted-foreground">
                  Comienza con pk_test_ (pruebas) o pk_live_ (producción)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret-key">Clave Secreta (Secret Key)</Label>
                <div className="relative">
                  <Input
                    id="secret-key"
                    type={showSecretKey ? 'text' : 'password'}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="sk_test_..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSecretKey ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Webhook Secret (Opcional)</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="whsec_..."
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="options">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Opciones de Pago
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Modo de Pruebas</p>
                  <p className="text-sm text-muted-foreground">Usar claves de prueba</p>
                </div>
                <Switch
                  checked={isTestMode}
                  onCheckedChange={setIsTestMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Renovación Automática</p>
                </div>
                <Switch
                  checked={autoRenew}
                  onCheckedChange={setAutoRenew}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enviar Recibos</p>
                </div>
                <Switch
                  checked={sendReceipts}
                  onCheckedChange={setSendReceipts}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleVerify}
            disabled={isVerifying || !publicKey || !secretKey}
          >
            {isVerifying ? (
              <>
                <Spinner className="h-4 w-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Verificar Conexión
              </>
            )}
          </Button>
          <Button variant="secondary" onClick={handleSave}>
            Guardar Configuración
          </Button>
          <Button variant="outline" onClick={handleClearConfig}>
            Limpiar
          </Button>
        </div>

        {settings?.lastVerified && (
          <p className="text-sm text-muted-foreground">
            Última verificación: {new Date(settings.lastVerified).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}