import { loadStripe, Stripe } from '@stripe/stripe-js'

export const STRIPE_CONFIG = {
  publicKey: 'pk_live_51NLv8cBSxEn7IlGkOJ3sfzOBWdlVkNkpVN7XrJ7v0z8LWxcSf3If43DJpxTWKdLSUF6aNa3cYKlY1IAeFw91fZY0008GleX7lm',
  secretKey: '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'
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
