import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { EnvelopeSimple, Bell, BellSlash, CheckCircle, Warning, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  EmailNotification, 
  processEmailNotifications, 
  shouldSendNotification,
  generateExpiryEmail 
} from '@/lib/email-service'
import { getDaysRemaining } from '@/lib/membership'
import { formatDate } from '@/lib/helpers'
import { useIsMobile } from '@/hooks/use-mobile'

interface EmailNotificationManagerProps {
  users: User[]
}

export default function EmailNotificationManager({ users }: EmailNotificationManagerProps) {
  const [notificationHistory, setNotificationHistory] = useKV<EmailNotification[]>(
    'email-notification-history',
    []
  )
  const [autoNotifications, setAutoNotifications] = useKV<boolean>(
    'auto-notifications-enabled',
    true
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastCheck, setLastCheck] = useKV<number>('last-notification-check', 0)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!autoNotifications) return

    const checkInterval = setInterval(async () => {
      const now = Date.now()
      const oneHourMs = 60 * 60 * 1000
      
      if (now - (lastCheck || 0) > oneHourMs) {
        await processNotifications()
      }
    }, 60 * 60 * 1000)

    return () => clearInterval(checkInterval)
  }, [autoNotifications, lastCheck, users])

  const processNotifications = async () => {
    setIsProcessing(true)
    try {
      const newNotifications = await processEmailNotifications(
        users.filter(u => u.role === 'student' && u.email),
        notificationHistory || []
      )

      if (newNotifications.length > 0) {
        setNotificationHistory((current) => [...(current || []), ...newNotifications])
        toast.success(`Se enviaron ${newNotifications.length} notificaciones`)
      }

      setLastCheck(Date.now())
    } catch (error) {
      console.error('Error procesando notificaciones:', error)
      toast.error('Error al procesar')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManualProcess = async () => {
    await processNotifications()
  }

  const getUsersNeedingNotification = () => {
    return users.filter(user => {
      const { shouldSend } = shouldSendNotification(user, notificationHistory || [])
      return shouldSend && user.email
    })
  }

  const usersNeedingNotification = getUsersNeedingNotification()

  const getNotificationTypeLabel = (type: EmailNotification['type']): string => {
    switch (type) {
      case 'expiry-7days': return '7 días'
      case 'expiry-3days': return '3 días'
      case 'expiry-1day': return '1 día'
      case 'expired': return 'Expirada'
    }
  }

  const getNotificationTypeBadgeVariant = (type: EmailNotification['type']) => {
    switch (type) {
      case 'expiry-7days': return 'default'
      case 'expiry-3days': return 'secondary'
      case 'expiry-1day': return 'destructive'
      case 'expired': return 'destructive'
    }
  }

  const recentNotifications = (notificationHistory || [])
    .sort((a, b) => b.sentAt - a.sentAt)
    .slice(0, 10)

  return (
    <div className="space-y-3 sm:space-y-6">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                <EnvelopeSimple size={16} className="sm:w-5 sm:h-5" />
                Notificaciones Email
              </CardTitle>
              <CardDescription className="text-[10px] sm:text-sm">
                Recordatorios de vencimiento
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="auto-notifications"
                checked={autoNotifications}
                onCheckedChange={(checked) => {
                  setAutoNotifications(checked)
                  toast.success(checked ? 'Activadas' : 'Desactivadas')
                }}
              />
              <Label htmlFor="auto-notifications" className="cursor-pointer">
                {autoNotifications ? (
                  <span className="flex items-center gap-1 text-green-600 text-xs sm:text-sm">
                    <Bell size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Activadas</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                    <BellSlash size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Desactivadas</span>
                  </span>
                )}
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 pt-0 space-y-3 sm:space-y-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Card className="bg-muted/30 p-2 sm:p-0">
              <CardHeader className="pb-1 sm:pb-3 p-2 sm:p-6">
                <CardTitle className="text-[10px] sm:text-sm font-medium">Pendientes</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6 pt-0">
                <div className="text-lg sm:text-3xl font-bold text-primary">
                  {usersNeedingNotification.length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 p-2 sm:p-0">
              <CardHeader className="pb-1 sm:pb-3 p-2 sm:p-6">
                <CardTitle className="text-[10px] sm:text-sm font-medium">Enviados</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6 pt-0">
                <div className="text-lg sm:text-3xl font-bold text-green-600">
                  {(notificationHistory || []).length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 p-2 sm:p-0">
              <CardHeader className="pb-1 sm:pb-3 p-2 sm:p-6">
                <CardTitle className="text-[10px] sm:text-sm font-medium">Revisión</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6 pt-0">
                <div className="text-[10px] sm:text-sm font-semibold flex items-center gap-1">
                  <Clock size={10} className="sm:w-4 sm:h-4" />
                  <span className="truncate">{lastCheck ? 'Hace poco' : 'Nunca'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleManualProcess}
              disabled={isProcessing}
              className="flex items-center gap-2 w-full sm:w-auto h-8"
              size="sm"
            >
              <EnvelopeSimple size={14} />
              <span className="text-xs sm:text-sm">
                {isProcessing ? 'Procesando...' : 'Procesar'}
              </span>
            </Button>
            
            {usersNeedingNotification.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1 justify-center text-xs">
                <Warning size={12} />
                {usersNeedingNotification.length} pendiente(s)
              </Badge>
            )}
          </div>

          {usersNeedingNotification.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="p-2 sm:p-4">
                <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                  <Warning size={14} />
                  Usuarios Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-4 pt-0">
                <div className="space-y-1.5">
                  {usersNeedingNotification.slice(0, 5).map(user => {
                    const days = getDaysRemaining(user.membership)
                    return (
                      <div key={user.id} className="flex items-center justify-between gap-2 p-2 bg-background rounded-md">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-xs truncate">{user.fullName || user.username}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                        </div>
                        <Badge variant={days === null || days <= 1 ? 'destructive' : 'secondary'} className="text-[10px] flex-shrink-0">
                          {days === null ? '?' : `${days}d`}
                        </Badge>
                      </div>
                    )
                  })}
                  {usersNeedingNotification.length > 5 && (
                    <p className="text-[10px] text-muted-foreground text-center pt-1">
                      +{usersNeedingNotification.length - 5} más
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-sm sm:text-lg">Historial</CardTitle>
          <CardDescription className="text-[10px] sm:text-sm">
            Últimas 10 notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 pt-0">
          {recentNotifications.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <EnvelopeSimple size={32} className="mx-auto mb-2 opacity-50 sm:w-12 sm:h-12" />
              <p className="text-xs sm:text-sm">Sin notificaciones</p>
            </div>
          ) : (
            <div className="space-y-1.5 sm:space-y-2">
              {recentNotifications.map((notification, index) => {
                const user = users.find(u => u.id === notification.userId)
                return (
                  <div
                    key={`${notification.userId}-${notification.sentAt}-${index}`}
                    className="flex items-center justify-between gap-2 p-2 sm:p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs sm:text-sm truncate">
                        {user?.fullName || user?.username || 'Eliminado'}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {notification.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <Badge variant={getNotificationTypeBadgeVariant(notification.type)} className="text-[9px] sm:text-xs">
                        {getNotificationTypeLabel(notification.type)}
                      </Badge>
                      <CheckCircle size={12} className="text-green-600 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
