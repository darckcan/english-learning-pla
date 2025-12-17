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
            setNotificationHistory((current) => [...(current || []), ...newNotifications])
            console.log(`✅ ${newNotifications.length} notificaciones por email enviadas`)
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
