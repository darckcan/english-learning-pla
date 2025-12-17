import { loadStripe, Stripe } from '@stripe/stripe-js'

export const STRIPE_CONFIG = {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || ''
}

if (!STRIPE_CONFIG.publicKey) {
  console.warn('⚠️ VITE_STRIPE_PUBLIC_KEY no está configurada. Configura las variables de entorno.')
}

if (!STRIPE_CONFIG.secretKey) {
  console.warn('⚠️ VITE_STRIPE_SECRET_KEY no está configurada. ADVERTENCIA: La clave secreta debería estar en un backend.')
}

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publicKey)
  }
  return stripePromise
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
