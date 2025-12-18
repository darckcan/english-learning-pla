import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'
import { EmailNotification, processEmailNotifications } from '@/lib/email-service'

export function useEmailNotifications(users: User[], enabled: boolean = true) {
  const [notificationHistory, setNotificationHistory] = useKV<EmailNotification[]>(
    'email-notification-history',
    []
  )
  const [lastCheck, setLastCheck] = useKV<number>('last-notification-check', 0)
  const [autoNotifications] = useKV<boolean>('auto-notifications-enabled', true)

  useEffect(() => {
    if (!enabled || !autoNotifications) return

    const checkNotifications = async () => {
      const now = Date.now()
      const oneHourMs = 60 * 60 * 1000

      if (now - (lastCheck || 0) > oneHourMs) {
        try {
          const studentUsers = users.filter(u => u.role === 'student' && u.email)
          const newNotifications = await processEmailNotifications(
            studentUsers,
            notificationHistory || []
          )

          if (newNotifications.length > 0) {
            const successCount = newNotifications.filter(n => n.status === 'sent').length
            const simulatedCount = newNotifications.filter(n => n.status === 'simulated').length
            const failedCount = newNotifications.filter(n => n.status === 'failed').length
            
            setNotificationHistory((current) => [...(current || []), ...newNotifications])
            
            if (successCount > 0) {
              console.log(`✅ ${successCount} emails enviados exitosamente`)
            }
            if (simulatedCount > 0) {
              console.log(`🧪 ${simulatedCount} emails simulados (no enviados realmente)`)
            }
            if (failedCount > 0) {
              console.log(`❌ ${failedCount} emails fallidos`)
            }
          }

          setLastCheck(now)
        } catch (error) {
          console.error('Error en proceso automático de notificaciones:', error)
        }
      }
    }

    checkNotifications()

    const interval = setInterval(checkNotifications, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [users, enabled, autoNotifications, lastCheck])

  return {
    notificationHistory,
    lastCheck,
  }
}
