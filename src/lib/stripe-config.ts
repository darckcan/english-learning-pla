import { loadStripe, Stripe } from '@stripe/stripe-js'

export interface StripeSettings {
  publicKey: string
  secretKey: string
  webhookSecret?: string
  isTestMode: boolean
  isConfigured: boolean
  lastVerified?: number
  autoRenewSubscriptions: boolean
  sendPaymentReceipts: boolean
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

export async function getStripeSettings(): Promise<StripeSettings> {
  try {
    const stored = await window.spark.kv.get<StripeSettings>('stripe-settings')
    if (stored && stored.publicKey && stored.secretKey) {
      return stored
    }
  } catch (e) {
    console.warn('Error loading Stripe settings from KV:', e)
  }
  
  const envPublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || ''
  const envSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY || ''
  
  if (envPublicKey && envSecretKey) {
    return {
      ...DEFAULT_STRIPE_SETTINGS,
      publicKey: envPublicKey,
      secretKey: envSecretKey,
      isConfigured: true,
    }
  }
  
  return DEFAULT_STRIPE_SETTINGS
}

export const STRIPE_CONFIG = {
  get publicKey() {
    return import.meta.env.VITE_STRIPE_PUBLIC_KEY || ''
  },
  get secretKey() {
    return import.meta.env.VITE_STRIPE_SECRET_KEY || ''
  }
}

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = async () => {
  const settings = await getStripeSettings()
  if (!settings.publicKey) {
    console.warn('⚠️ Stripe public key not configured')
    return null
  }
  if (!stripePromise) {
    stripePromise = loadStripe(settings.publicKey)
  }
  return stripePromise
}

export const getStripeSync = (publicKey: string) => {
  return loadStripe(publicKey)
}

export interface StripeProduct {
  id: string
  name: string
  description: string
  priceAmount: number
  currency: string
  interval?: 'month' | 'lifetime'
}

export const STRIPE_PRODUCTS = {
  monthly: {
    id: 'prod_monthly_nexusfluent',
    name: 'Membresía Mensual',
    description: 'Acceso completo a todos los niveles y clases',
    priceAmount: 9.99,
    currency: 'usd',
    interval: 'month' as const
  },
  lifetime: {
    id: 'prod_lifetime_nexusfluent',
    name: 'Membresía Vitalicia',
    description: 'Acceso de por vida a todo el contenido',
    priceAmount: 24.99,
    currency: 'usd',
    interval: 'lifetime' as const
  }
}
