import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'
import { verifyPayment, isStripeConfigured } from '@/lib/stripe-service'
import { toast } from 'sonner'
import { MembershipPricing, DEFAULT_PRICING } from '@/lib/membership'

interface PaymentRecord {
  id: string
  userId: string
  userEmail: string
  amount: number
  type: 'monthly' | 'lifetime'
  status: 'completed' | 'pending' | 'failed'
  date: number
}

export function useStripePaymentVerification() {
  const [allUsers, setAllUsers] = useKV<User[]>('all-users', [])
  const [payments, setPayments] = useKV<PaymentRecord[]>('payment-records', [])
  const [pricing] = useKV<MembershipPricing>('membership-pricing', DEFAULT_PRICING)

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const sessionId = urlParams.get('session_id')
      const paymentStatus = urlParams.get('payment')

      if (paymentStatus === 'cancelled') {
        toast.error('Pago cancelado')
        window.history.replaceState({}, document.title, window.location.pathname)
        return
      }

      if (sessionId && paymentStatus === 'success') {
        const configured = await isStripeConfigured()
        if (!configured) {
          toast.error('Stripe no está configurado. Contacta al administrador.')
          window.history.replaceState({}, document.title, window.location.pathname)
          return
        }

        try {
          const result = await verifyPayment(sessionId)
          
          if (result.status === 'paid' && result.userId && result.membershipType) {
            const membershipType = result.membershipType as 'monthly' | 'lifetime'
            
            let userEmail = ''
            let amount = membershipType === 'lifetime' 
              ? (pricing?.lifetimePrice || DEFAULT_PRICING.lifetimePrice)
              : (pricing?.monthlyPrice || DEFAULT_PRICING.monthlyPrice)
            
            setAllUsers((current) => {
              const users = current || []
              return users.map(u => {
                if (u.id === result.userId) {
                  userEmail = u.email || u.username
                  
                  const now = Date.now()
                  const endDate = membershipType === 'lifetime' 
                    ? undefined 
                    : now + (30 * 24 * 60 * 60 * 1000)
                  
                  return {
                    ...u,
                    membership: {
                      type: membershipType,
                      startDate: now,
                      endDate,
                      isActive: true,
                    }
                  }
                }
                return u
              })
            })

            setPayments((current) => {
              const records = current || []
              const existingRecord = records.find(r => r.id === sessionId)
              if (existingRecord) return records
              
              const newRecord: PaymentRecord = {
                id: sessionId,
                userId: result.userId!,
                userEmail,
                amount,
                type: membershipType,
                status: 'completed',
                date: Date.now()
              }
              return [...records, newRecord]
            })

            toast.success(
              membershipType === 'lifetime' 
                ? '¡Membresía Vitalicia activada! 🎉' 
                : '¡Membresía Mensual activada! 🎉'
            )
          } else {
            toast.error('No se pudo verificar el pago. Contacta a soporte.')
          }
        } catch (error) {
          console.error('Error verificando pago:', error)
          toast.error('Error al verificar el pago. Contacta a soporte.')
        }

        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }

    checkPaymentStatus()
  }, [setAllUsers, setPayments, pricing])
}

export function useMembershipAutoCheck() {
  const [allUsers, setAllUsers] = useKV<User[]>('all-users', [])
  const [autoCheckEnabled] = useKV<boolean>('auto-membership-check', true)

  useEffect(() => {
    if (!autoCheckEnabled) return

    const checkMemberships = () => {
      const users = allUsers || []
      const now = Date.now()
      let hasExpired = false

      const updatedUsers = users.map(user => {
        if (!user.membership) return user
        if (user.membership.type === 'lifetime') return user
        
        if (user.membership.endDate && now > user.membership.endDate && user.membership.isActive) {
          hasExpired = true
          return {
            ...user,
            membership: {
              ...user.membership,
              isActive: false,
            }
          }
        }
        
        return user
      })

      if (hasExpired) {
        setAllUsers(() => updatedUsers)
      }
    }

    checkMemberships()

    const interval = setInterval(checkMemberships, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [allUsers, autoCheckEnabled, setAllUsers])
}
