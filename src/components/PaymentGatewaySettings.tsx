import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Accordion, AccordionC
import { Switch } from './ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
  publicKey: string

interface StripeSettings {
  sendPaymentReceip
  secretKey: string
const DEFAULT_STRIPE_SET
  isTestMode: boolean
  isTestMode: true,
  sendPaymentReceipts: true,
  sendPaymentReceipts: boolean
  lastVerified?: number
 

  const [isTestMode, setIsTestMode] = useState(tr
  publicKey: '',
  const [showSec
  const [isVerifying

    if (settings) {
      setSecretKey(settings.sec
      setIsTestMode(settings
 

    }

  
      return key.startsWith('pk_test_') || key.s
    return key.startsWith('sk_test_') || key.sta

    if (!secretKey) {
      return

  
    }
    setIsVerifying(true)

      const response = await fetch('https://api.stripe.com/v1/balance', {

        },

        setVerificationStatus('success')
      } else {
        const error = await response.json()
      }
      setVerificationStatus('error')
    } finally {
    }

      }
     
  }, [settings])

    }
    if (!validateStripeKey
      return

    }
      return
  }

      webhookSecret,
      isConfigured: v
      sendPaymentReceipts: sendReceipts,
    }
    }

    if (!validateStripeKey(secretKey, 'secret')) {
      toast.error('La clave secreta no tiene un formato válido')
      return
    }

    setIsVerifying(true)
    setSendReceipts(true)


    <Card>
        <div className
        headers: {
        <CardDescription className="text-xs sm:te
        </
      <C

        </div>
        setVerificationStatus('success')
            <AccordionTrigger className="text-sm font-medium">
      } else {
        setVerificationStatus('error')
                  <Badge variant="secondary
            </AccordionTrigger>
       
                <ul c
                  <li>Copia la clave
                  <li>Para producción, desactiva el "Modo Prueba" y usa claves live
    } finally {
              <div classNam
    }
   

                  placeholde
    if (!publicKey || !secretKey) {

      return
    }

                    type={showSecretKey ? 'text' :
                    onChange={(e) => setSecretKey(e.target.value)}
            
     

                  >
                  </button>
            
     

                <div className="relative">
                    id="webhook-sec
                    value={webhookSecret}
            
     

                    className="absolute r
      publicKey,
                
      webhookSecret,
              </d
      isConfigured: verificationStatus === 'success',
      autoRenewSubscriptions: autoRenew,
      sendPaymentReceipts: sendReceipts,
                className="w-full"
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
                </di
                  <div>
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















































































































































