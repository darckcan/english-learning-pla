import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
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

  const [webhookSecret, setWebhookSecret] = useSta
  const [autoRenew, setAutoRenew] = useState(true)
  const [showSecretKey, setShowSecretKey] = useS
  const [verificationStatus, setVerificationStat
  useEffect(() => {
      setPublicKey(settings.publicKey || '')
      setWebhookSecret(settings.webhookSecret || '
      setAutoRenew(settings.autoRenewSubscriptions ?? tr
      if (settings.isConfigured) {
      }
  }, [settings])

    if (type === 'p
    }
  }
  const handleVerify = async () => {
      toast.error('Ingresa ambas claves para verific
    }
    if (!validateStripeKey(publicKey, 'public')) {
      return

      toast.error('La clave secreta no t
    }
    s
    try {

      const isLiveKey = publicKey.startsWith('pk_live_') && secretKey.sta
      if (!isTestKey && !i
        setVerificationStatu
      }
     

   

        isConfigured: true,
        sendPaymentReceipts: sendRe
      }
    } catch 
     

  }
  const handleSave = () => {
      toast.
    }

    }
    const newSettings: StripeSettings = {
      secret
     

      lastVerified: sett

  }
  const handleClearConfig = () => {
    se
    setVerificationStatus('idle')
    toast.success('Configuración eliminada')

    <Card>
        <div className="flex items-center justify-between">
            <CreditCard className="h-6
              
       

              <CheckCircle className="
            </Badge>

              <Warning className="h-4 w-4 m
            </Badg
        </div>
      <CardContent cla
          <AccordionItem value
              <div classNam
                Claves de API
            </AccordionTrigger>
              <div className="sp
       
                  value={publicKey}
             
                <p className="text-x
                </p>

                <Label html
     
   

                  />
                    type="button"
                    className="absolute right-3 top-1/2 -translate
            
     
                  Comienza con sk_test_ (pruebas) 
              </div>
            
     

                  onChange={(e) => setWeb
                
                
              </div>
          </Accor
      isConfigured: verificationStatus === 'success',
      autoRenewSubscriptions: autoRenew,
      sendPaymentReceipts: sendReceipts,
      lastVerified: settings?.lastVerified
    }
    setSettings(() => newSettings)
    toast.success('Configuración guardada')
  }

  const handleClearConfig = () => {
    setPublicKey('')
    setSecretKey('')
    setWebhookSecret('')
    setVerificationStatus('idle')
    setSettings(() => DEFAULT_STRIPE_SETTINGS)
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
                <p className="text-xs text-muted-foreground">
                  Comienza con sk_test_ (pruebas) o sk_live_ (producción)
                </p>
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
                <p className="text-xs text-muted-foreground">
                  Para verificar webhooks de Stripe
                </p>
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
                  <p className="text-sm text-muted-foreground">
                    Usar claves de prueba para desarrollo
                  </p>
                </div>
                <Switch
                  checked={isTestMode}
                  onCheckedChange={setIsTestMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Renovación Automática</p>
                  <p className="text-sm text-muted-foreground">
                    Renovar membresías automáticamente
                  </p>
                </div>
                <Switch
                  checked={autoRenew}
                  onCheckedChange={setAutoRenew}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enviar Recibos</p>
                  <p className="text-sm text-muted-foreground">
                    Enviar recibos de pago por correo
                  </p>
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
