import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'
import { verifyPayment } from '@/lib/stripe-service'
import { toast } from 'sonner'

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
        try {
          const result = await verifyPayment(sessionId)
          
          if (result.status === 'paid' && result.userId && result.membershipType) {
            const membershipType = result.membershipType as 'monthly' | 'lifetime'
            
            let userEmail = ''
            let amount = 0
            
            setAllUsers((current) => {
              const users = current || []
              return users.map(u => {
                if (u.id === result.userId) {
                  userEmail = u.email || u.username
                  amount = membershipType === 'lifetime' ? 24.99 : 9.99
                  
                  const now = Date.now()
                  const expiresAt = membershipType === 'lifetime' 
                    ? null 
                    : now + (30 * 24 * 60 * 60 * 1000)
                  
                  return {
                    ...u,
                    membership: {
                      type: membershipType,
                      startDate: now,
                      expiresAt,
                      isActive: true,
                    }
                  }
                }
                return u
              })
            })

            setPayments((current) => {
              const records = current || []
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
  }, [setAllUsers, setPayments])
}
