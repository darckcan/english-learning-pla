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

export interface CheckoutResult {
  sessionId: string
  url?: string
  simulatedMode: boolean
}

export async function createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutResult> {
  const settings = await getStripeSettings()
  
  const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  
  if (settings.monthlyPaymentLink && params.membershipType === 'monthly') {
    try {
      const url = new URL(settings.monthlyPaymentLink)
      url.searchParams.set('client_reference_id', params.userId)
      if (params.customerEmail) {
        url.searchParams.set('prefilled_email', params.customerEmail)
      }
      return { sessionId, url: url.toString(), simulatedMode: false }
    } catch (e) {
      console.warn('Invalid monthly payment link:', e)
    }
  }
  
  if (settings.lifetimePaymentLink && params.membershipType === 'lifetime') {
    try {
      const url = new URL(settings.lifetimePaymentLink)
      url.searchParams.set('client_reference_id', params.userId)
      if (params.customerEmail) {
        url.searchParams.set('prefilled_email', params.customerEmail)
      }
      return { sessionId, url: url.toString(), simulatedMode: false }
    } catch (e) {
      console.warn('Invalid lifetime payment link:', e)
    }
  }

  return { sessionId, simulatedMode: true }
}

export async function isStripeConfigured(): Promise<boolean> {
  try {
    const settings = await getStripeSettings()
    const hasPaymentLink = !!settings.monthlyPaymentLink || !!settings.lifetimePaymentLink
    return hasPaymentLink
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
