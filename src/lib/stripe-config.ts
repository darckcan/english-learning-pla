import { loadStripe, Stripe } from '@stripe/stripe-js'

export interface StripeSettings {
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

const STORAGE_KEY = 'stripe-production-settings'

export async function getStripeSettings(): Promise<StripeSettings> {
  try {
    const stored = await window.spark.kv.get<StripeSettings>(STORAGE_KEY)
    if (stored && stored.publicKey) {
      return stored
    }
  } catch (e) {
    console.warn('Error loading Stripe settings from KV:', e)
  }
  
  return DEFAULT_STRIPE_SETTINGS
}

export async function saveStripeSettings(settings: StripeSettings): Promise<void> {
  await window.spark.kv.set(STORAGE_KEY, settings)
  resetStripeInstance()
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

export function validateStripeKey(key: string): { valid: boolean; isLive: boolean; type: 'public' | 'secret' | 'unknown' } {
  if (key.startsWith('pk_live_')) {
    return { valid: true, isLive: true, type: 'public' }
  }
  if (key.startsWith('pk_test_')) {
    return { valid: true, isLive: false, type: 'public' }
  }
  if (key.startsWith('sk_live_')) {
    return { valid: true, isLive: true, type: 'secret' }
  }
  if (key.startsWith('sk_test_')) {
    return { valid: true, isLive: false, type: 'secret' }
  }
  return { valid: false, isLive: false, type: 'unknown' }
}
