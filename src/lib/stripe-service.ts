import { STRIPE_CONFIG, StripeProduct } from './stripe-config'

export interface PaymentSession {
  sessionId: string
  url: string
  status: 'pending' | 'complete' | 'expired'
}

export interface PaymentIntentData {
  amount: number
  currency: string
  productName: string
  customerEmail: string
  userId: string
  membershipType: 'monthly' | 'lifetime'
}

export async function createPaymentIntent(data: PaymentIntentData): Promise<{ clientSecret: string; paymentIntentId: string }> {
  try {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_CONFIG.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: Math.round(data.amount * 100).toString(),
        currency: data.currency,
        'metadata[userId]': data.userId,
        'metadata[membershipType]': data.membershipType,
        'metadata[customerEmail]': data.customerEmail,
        description: `Pago de ${data.productName} para ${data.customerEmail}`,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Error al crear la intención de pago')
    }

    const paymentIntent = await response.json()
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error('Error creando payment intent:', error)
    throw error
  }
}

export async function createCheckoutSession(data: PaymentIntentData): Promise<{ sessionId: string; url: string }> {
  try {
    const successUrl = `${window.location.origin}?payment=success&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${window.location.origin}?payment=cancelled`

    const params = new URLSearchParams({
      'success_url': successUrl,
      'cancel_url': cancelUrl,
      'payment_method_types[]': 'card',
      'mode': data.membershipType === 'monthly' ? 'subscription' : 'payment',
      'customer_email': data.customerEmail,
      'client_reference_id': data.userId,
      'metadata[userId]': data.userId,
      'metadata[membershipType]': data.membershipType,
    })

    if (data.membershipType === 'monthly') {
      params.append('line_items[0][price_data][currency]', data.currency)
      params.append('line_items[0][price_data][product_data][name]', data.productName)
      params.append('line_items[0][price_data][product_data][description]', 'Acceso completo a todos los niveles y clases')
      params.append('line_items[0][price_data][unit_amount]', Math.round(data.amount * 100).toString())
      params.append('line_items[0][price_data][recurring][interval]', 'month')
      params.append('line_items[0][quantity]', '1')
    } else {
      params.append('line_items[0][price_data][currency]', data.currency)
      params.append('line_items[0][price_data][product_data][name]', data.productName)
      params.append('line_items[0][price_data][product_data][description]', 'Acceso de por vida a todo el contenido')
      params.append('line_items[0][price_data][unit_amount]', Math.round(data.amount * 100).toString())
      params.append('line_items[0][quantity]', '1')
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_CONFIG.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Error al crear sesión de checkout')
    }

    const session = await response.json()
    return {
      sessionId: session.id,
      url: session.url,
    }
  } catch (error) {
    console.error('Error creando checkout session:', error)
    throw error
  }
}

export async function verifyPayment(sessionId: string): Promise<{ status: string; userId?: string; membershipType?: string }> {
  try {
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRIPE_CONFIG.secretKey}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al verificar el pago')
    }

    const session = await response.json()
    return {
      status: session.payment_status,
      userId: session.metadata?.userId,
      membershipType: session.metadata?.membershipType,
    }
  } catch (error) {
    console.error('Error verificando pago:', error)
    throw error
  }
}
