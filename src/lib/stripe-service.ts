import { getStripeSettings } from './stripe-config'

export interface CheckoutParams {
  priceId: string
  userId: string
  customerEmail: string
  membershipType: 'monthly' | 'lifetime'
}

export interface CheckoutSessionParams {
  amount: number
  currency: string
  productName: string
  customerEmail: string
  userId: string
  membershipType: 'monthly' | 'lifetime'
}

export async function createCheckoutSession(params: CheckoutSessionParams): Promise<{ sessionId: string; url: string }> {
  const settings = await getStripeSettings()
  
  if (!settings.isConfigured || !settings.publicKey) {
    throw new Error('Stripe no está configurado. Contacta al administrador.')
  }

  const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  
  const successUrl = `${window.location.origin}?payment=success&session_id=${sessionId}&user_id=${encodeURIComponent(params.userId)}&membership_type=${params.membershipType}`
  const cancelUrl = `${window.location.origin}?payment=cancelled`

  if (params.membershipType === 'monthly' && settings.monthlyPaymentLink) {
    const url = new URL(settings.monthlyPaymentLink)
    url.searchParams.set('client_reference_id', params.userId)
    if (params.customerEmail) {
      url.searchParams.set('prefilled_email', params.customerEmail)
    }
    return { sessionId, url: url.toString() }
  }
  
  if (params.membershipType === 'lifetime' && settings.lifetimePaymentLink) {
    const url = new URL(settings.lifetimePaymentLink)
    url.searchParams.set('client_reference_id', params.userId)
    if (params.customerEmail) {
      url.searchParams.set('prefilled_email', params.customerEmail)
    }
    return { sessionId, url: url.toString() }
  }

  const priceId = params.membershipType === 'monthly' 
    ? settings.monthlyPriceId 
    : settings.lifetimePriceId

  if (!priceId) {
    throw new Error(`No hay precio configurado para el plan ${params.membershipType}. Configura el Price ID o Payment Link en el panel de administración.`)
  }

  const checkoutUrl = `https://checkout.stripe.com/c/pay/${priceId}?` + new URLSearchParams({
    client_reference_id: params.userId,
    prefilled_email: params.customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
  }).toString()

  return { sessionId, url: checkoutUrl }
}

export async function redirectToCheckout(params: CheckoutParams): Promise<void> {
  const settings = await getStripeSettings()
  
  if (!settings.isConfigured || !settings.publicKey) {
    throw new Error('Stripe no está configurado. Contacta al administrador.')
  }

  const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  
  const successUrl = `${window.location.origin}?payment=success&session_id=${sessionId}&user_id=${encodeURIComponent(params.userId)}&membership_type=${params.membershipType}`
  const cancelUrl = `${window.location.origin}?payment=cancelled`

  const checkoutUrl = `https://checkout.stripe.com/c/pay/${params.priceId}?` + new URLSearchParams({
    client_reference_id: params.userId,
    prefilled_email: params.customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
  }).toString()

  window.location.href = checkoutUrl
}

export async function isStripeConfigured(): Promise<boolean> {
  try {
    const settings = await getStripeSettings()
    const hasPaymentMethod = 
      !!settings.monthlyPriceId || 
      !!settings.lifetimePriceId || 
      !!settings.monthlyPaymentLink || 
      !!settings.lifetimePaymentLink
    
    return settings.isConfigured && !!settings.publicKey && hasPaymentMethod
  } catch {
    return false
  }
}

export async function verifyPayment(sessionId: string): Promise<{
  status: 'paid' | 'unpaid' | 'unknown'
  userId?: string
  membershipType?: 'monthly' | 'lifetime'
}> {
  const urlParams = new URLSearchParams(window.location.search)
  const userId = urlParams.get('user_id')
  const membershipType = urlParams.get('membership_type') as 'monthly' | 'lifetime' | null
  const paymentStatus = urlParams.get('payment')

  if (paymentStatus === 'success' && userId && membershipType) {
    return {
      status: 'paid',
      userId,
      membershipType,
    }
  }

  return { status: 'unknown' }
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
