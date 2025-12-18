import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Accordion, AccordionConte
import { CreditCard, Key, Eye, EyeSl
interface StripeSettings {
  secretKey: string
  isTestMode: boolean
  autoRenewSubscriptions: bool
  lastVerified?: number

  publicKey: '',
  webhookSecret: ''
  isConfigured: fal
  sendPaymentReceipts: 

  const [settings, setS
  const [secretKey, setSecretKey]
  const [isTestMode, setIsTest
  const [sendReceipts, 
 

    if (settings) {
      setSecretK
      setIsTestM
      setSendReceipt
        setVerifica
    }

    if (!key) return false
 

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

  const handleVerify = async () => {
        publicKey,
      toast.error('Ingresa ambas claves para verificar')
        isTe
     

    if (!validateStripeKey(publicKey, 'public')) {
      toast.error('La clave pública no tiene el formato correcto')
      return
    }

    }
      toast.error('La clave secreta no tiene el formato correcto')
  const hand
    }

    setIsVerifying(true)
      toast.error('La clave secre


      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const isTestKey = publicKey.startsWith('pk_test_') && secretKey.startsWith('sk_test_')
      const isLiveKey = publicKey.startsWith('pk_live_') && secretKey.startsWith('sk_live_')

      if (!isTestKey && !isLiveKey) {
        toast.error('Las claves deben ser ambas de prueba o ambas de producción')
    toast.success('Configuración guard
        return
  const

    setSecretKey('')
      toast.success('Conexión con Stripe verificada correctamente')

      const newSettings: StripeSettings = {
    toast.success(
        secretKey,
  return (
        isTestMode,
        <div className="fle
        autoRenewSubscriptions: autoRenew,
        sendPaymentReceipts: sendReceipts,
        lastVerified: Date.now(),
       
      setSettings(() => newSettings)
    } catch {
      setVerificationStatus('error')
      toast.error('Error al verificar la conexión con Stripe')
    } finally {
      setIsVerifying(false)
     
   

  const handleSave = () => {
    if (!validateStripeKey(publicKey, 'public')) {
      toast.error('La clave pública no tiene el formato correcto')
      return
     
    if (!validateStripeKey(secretKey, 'secret')) {
      toast.error('La clave secreta no tiene el formato correcto')
      return
     

    const newSettings: StripeSettings = {
      publicKey,
      secretKey,
      webhookSecret,
                 
      isConfigured: verificationStatus === 'success',
      autoRenewSubscriptions: autoRenew,
      sendPaymentReceipts: sendReceipts,

    }
    setSettings(() => newSettings)
    toast.success('Configuración guardada')
   

                </div>
                  checked={autoRenew}
                />

                <div>
                  <p cl
                <Switc
                  onCheck
              </div>
          </AccordionItem>


          
          
        </div>
        {settings?.lastVerified && (
            Última verificación: {new Date(settings.lastVer
        )}
    </Card>
}



































































































































































