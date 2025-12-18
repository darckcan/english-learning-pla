import { loadStripe, Stripe } from '@stripe/stripe-js'

export interface StripeSettings {
  publicKey: string
  monthlyPriceId: string
  lifetimePriceId: string
  isTestMode: boolean
  isConfigured: boolean
  lastVerified?: number
}

const DEFAULT_STRIPE_SETTINGS: StripeSettings = {
  publicKey: '',
  monthlyPriceId: '',
  lifetimePriceId: '',
  isTestMode: true,
  isConfigured: false,
}

export async function getStripeSettings(): Promise<StripeSettings> {
  try {
    const stored = await window.spark.kv.get<StripeSettings>('stripe-settings')
    if (stored && stored.publicKey) {
      return stored
    }
  } catch (e) {
    console.warn('Error loading Stripe settings from KV:', e)
  }
  
  const envPublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || ''
  
  if (envPublicKey) {
    return {
      ...DEFAULT_STRIPE_SETTINGS,
      publicKey: envPublicKey,
      isConfigured: true,
    }
  }
  
  return DEFAULT_STRIPE_SETTINGS
}

export async function saveStripeSettings(settings: StripeSettings): Promise<void> {
  await window.spark.kv.set('stripe-settings', settings)
}

let stripeInstance: Stripe | null = null
let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = async (): Promise<Stripe | null> => {
  if (stripeInstance) return stripeInstance
  
  const settings = await getStripeSettings()
  if (!settings.publicKey) {
    console.warn('⚠️ Stripe public key not configured')
    return null
  }
  
  if (!stripePromise) {
    stripePromise = loadStripe(settings.publicKey)
  }
  
  stripeInstance = await stripePromise
  return stripeInstance
}

export const resetStripeInstance = () => {
  stripeInstance = null
  stripePromise = null
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
