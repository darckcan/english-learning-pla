import { getStripeSettings, getStripe, StripeSettings } from './stripe-config'

export interface CheckoutParams {
  priceId: string
  userId: string
  customerEmail: string
  membershipType: 'monthly' | 'lifetime'
}

export async function redirectToCheckout(params: CheckoutParams): Promise<void> {
  const stripe = await getStripe()
  
  if (!stripe) {
    throw new Error('Stripe no está configurado. Contacta al administrador.')
  }

  const successUrl = `${window.location.origin}?payment=success&user_id=${encodeURIComponent(params.userId)}&membership_type=${params.membershipType}`
  const cancelUrl = `${window.location.origin}?payment=cancelled`

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: params.priceId, quantity: 1 }],
    mode: params.membershipType === 'monthly' ? 'subscription' : 'payment',
    successUrl,
    cancelUrl,
    customerEmail: params.customerEmail,
    clientReferenceId: params.userId,
  })

  if (error) {
    console.error('Stripe checkout error:', error)
    throw new Error(error.message || 'Error al iniciar el checkout')
  }
}

export async function createCheckoutWithPaymentLink(
  paymentLinkUrl: string,
  userId: string,
  membershipType: 'monthly' | 'lifetime'
): Promise<void> {
  const url = new URL(paymentLinkUrl)
  url.searchParams.set('client_reference_id', userId)
  url.searchParams.set('prefilled_email', '')
  
  const successParam = encodeURIComponent(`${window.location.origin}?payment=success&user_id=${userId}&membership_type=${membershipType}`)
  
  window.location.href = url.toString()
}

export async function isStripeConfigured(): Promise<boolean> {
  try {
    const settings = await getStripeSettings()
    return settings.isConfigured && !!settings.publicKey && (!!settings.monthlyPriceId || !!settings.lifetimePriceId)
  } catch {
    return false
  }
}

export async function verifyPaymentFromUrl(): Promise<{
  success: boolean
  userId?: string
  membershipType?: 'monthly' | 'lifetime'
} | null> {
  const urlParams = new URLSearchParams(window.location.search)
  const paymentStatus = urlParams.get('payment')
  const userId = urlParams.get('user_id')
  const membershipType = urlParams.get('membership_type') as 'monthly' | 'lifetime' | null

  if (paymentStatus === 'cancelled') {
    return { success: false }
  }

  if (paymentStatus === 'success' && userId && membershipType) {
    return {
      success: true,
      userId,
      membershipType,
    }
  }

  return null
}

export function clearPaymentParams(): void {
  window.history.replaceState({}, document.title, window.location.pathname)
}

export async function checkExpiredSubscriptions(
  users: any[], 
  updateUser: (userId: string, membership: any) => void
): Promise<number> {
  let expiredCount = 0
  const now = Date.now()
  
  for (const user of users) {
    if (user.membership && user.membership.type === 'monthly' && user.membership.isActive) {
      if (user.membership.endDate && now > user.membership.endDate) {
        updateUser(user.id, {
          ...user.membership,
          isActive: false,
        })
        expiredCount++
      }
    }
  }
  
  return expiredCount
}
