import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
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
        toast.success(`Se enviaron ${newNotifications.length} notificaciones por email`)
      }

      setLastCheck(Date.now())
    } catch (error) {
      console.error('Error procesando notificaciones:', error)
      toast.error('Error al procesar notificaciones')
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
      case 'expiry-7days':
        return 'Vence en 7 días'
      case 'expiry-3days':
        return 'Vence en 3 días'
      case 'expiry-1day':
        return 'Vence en 1 día'
      case 'expired':
        return 'Membresía expirada'
    }
  }

  const getNotificationTypeBadgeVariant = (type: EmailNotification['type']) => {
    switch (type) {
      case 'expiry-7days':
        return 'default'
      case 'expiry-3days':
        return 'secondary'
      case 'expiry-1day':
        return 'destructive'
      case 'expired':
        return 'destructive'
    }
  }

  const recentNotifications = (notificationHistory || [])
    .sort((a, b) => b.sentAt - a.sentAt)
    .slice(0, 10)

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <EnvelopeSimple className="w-4 h-4 sm:w-5 sm:h-5" />
                Sistema de Notificaciones por Email
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Recordatorios automáticos de vencimiento de membresías
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="auto-notifications"
                checked={autoNotifications}
                onCheckedChange={(checked) => {
                  setAutoNotifications(checked)
                  toast.success(
                    checked 
                      ? 'Notificaciones automáticas activadas' 
                      : 'Notificaciones automáticas desactivadas'
                  )
                }}
              />
              <Label htmlFor="auto-notifications" className="cursor-pointer">
                {autoNotifications ? (
                  <span className="flex items-center gap-1 text-success text-sm">
                    <Bell className="w-4 h-4" />
                    <span className="hidden sm:inline">Activadas</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground text-sm">
                    <BellSlash className="w-4 h-4" />
                    <span className="hidden sm:inline">Desactivadas</span>
                  </span>
                )}
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Card className="bg-muted/30">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium">Usuarios Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {usersNeedingNotification.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requieren notificación
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium">Emails Enviados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-success">
                  {(notificationHistory || []).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total de notificaciones
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium">Última Revisión</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs sm:text-sm font-semibold">
                  {lastCheck ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{formatDate(lastCheck)}</span>
                    </span>
                  ) : (
                    'Nunca'
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Próxima en {autoNotifications ? '1 hora' : 'manual'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleManualProcess}
              disabled={isProcessing}
              className="flex items-center gap-2 w-full sm:w-auto"
              size="sm"
            >
              <EnvelopeSimple className="w-4 h-4" />
              {isProcessing ? 'Procesando...' : 'Procesar Notificaciones'}
            </Button>
            
            {usersNeedingNotification.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1 justify-center">
                <Warning className="w-3 h-3" />
                {usersNeedingNotification.length} pendiente(s)
              </Badge>
            )}
          </div>

          {usersNeedingNotification.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Warning className="w-4 h-4" />
                  Usuarios que Necesitan Notificación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {usersNeedingNotification.map(user => {
                    const days = getDaysRemaining(user.membership)
                    return (
                      <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 bg-background rounded-md">
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{user.fullName || user.username}</div>
                          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                        </div>
                        <Badge variant={days === null || days <= 1 ? 'destructive' : 'secondary'} className="text-xs w-fit">
                          {days === null ? 'Revisión' : `${days} día${days !== 1 ? 's' : ''}`}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Historial de Notificaciones</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Últimas 10 notificaciones enviadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentNotifications.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <EnvelopeSimple className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No se han enviado notificaciones aún</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="min-w-[600px] sm:min-w-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Email</TableHead>
                      <TableHead className="text-xs sm:text-sm">Tipo</TableHead>
                      <TableHead className="text-xs sm:text-sm">Fecha</TableHead>
                      <TableHead className="text-xs sm:text-sm">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentNotifications.map((notification, index) => {
                      const user = users.find(u => u.id === notification.userId)
                      return (
                        <TableRow key={`${notification.userId}-${notification.sentAt}-${index}`}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                                {user?.fullName || user?.username || 'Usuario eliminado'}
                              </div>
                              <div className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                                {notification.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getNotificationTypeBadgeVariant(notification.type)} className="text-xs">
                              {getNotificationTypeLabel(notification.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatDate(notification.sentAt)}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-success text-xs">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Enviado</span>
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
