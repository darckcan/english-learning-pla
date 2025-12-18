import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { EnvelopeSimple, Bell, BellSlash, CheckCircle, Warning, Clock, XCircle, Flask } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  EmailNotification, 
  processEmailNotifications, 
  shouldSendNotification,
  getEmailConfig,
  getEmailProviderInfo
} from '@/lib/email-service'
import { getDaysRemaining } from '@/lib/membership'

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
  const [currentProvider, setCurrentProvider] = useState<string>('simulation')

  useEffect(() => {
    getEmailConfig().then(config => {
      setCurrentProvider(config.provider)
    })
  }, [])

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
        
        const sentCount = newNotifications.filter(n => n.status === 'sent').length
        const simulatedCount = newNotifications.filter(n => n.status === 'simulated').length
        const failedCount = newNotifications.filter(n => n.status === 'failed').length
        
        if (sentCount > 0) {
          toast.success(`${sentCount} email(s) enviado(s)`)
        }
        if (simulatedCount > 0) {
          toast.info(`${simulatedCount} email(s) simulado(s) - Ver consola`)
        }
        if (failedCount > 0) {
          toast.error(`${failedCount} email(s) fallido(s)`)
        }
      } else {
        toast.info('No hay notificaciones pendientes')
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

  const getStatusIcon = (status?: EmailNotification['status']) => {
    switch (status) {
      case 'sent': return <CheckCircle size={12} className="text-green-600" />
      case 'simulated': return <Flask size={12} className="text-yellow-600" />
      case 'failed': return <XCircle size={12} className="text-red-600" />
      default: return <CheckCircle size={12} className="text-green-600" />
    }
  }

  const getStatusBadgeVariant = (status?: EmailNotification['status']) => {
    switch (status) {
      case 'sent': return 'default'
      case 'simulated': return 'secondary'
      case 'failed': return 'destructive'
      default: return 'default'
    }
  }

  const providerInfo = getEmailProviderInfo(currentProvider as any)
  const isSimulation = currentProvider === 'simulation'

  const recentNotifications = (notificationHistory || [])
    .sort((a, b) => b.sentAt - a.sentAt)
    .slice(0, 10)

  const sentCount = (notificationHistory || []).filter(n => n.status === 'sent').length
  const simulatedCount = (notificationHistory || []).filter(n => n.status === 'simulated' || !n.status).length
  const failedCount = (notificationHistory || []).filter(n => n.status === 'failed').length

  return (
    <div className="space-y-3 sm:space-y-6">
      {isSimulation && (
        <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-900/10">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <Warning className="w-4 h-4 mt-0.5 text-yellow-600 flex-shrink-0" />
              <div className="text-xs sm:text-sm">
                <strong>Modo Simulación Activo</strong>
                <p className="text-muted-foreground mt-1">
                  Los emails se registran en la consola pero NO se envían realmente. 
                  Configura EmailJS o un webhook para enviar emails de verdad.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                <EnvelopeSimple size={16} className="sm:w-5 sm:h-5" />
                Notificaciones Email
              </CardTitle>
              <CardDescription className="text-[10px] sm:text-sm">
                {providerInfo.name} - Recordatorios de vencimiento
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
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
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
                <CardTitle className="text-[10px] sm:text-sm font-medium flex items-center gap-1">
                  <CheckCircle size={10} className="text-green-600" />
                  <span className="hidden sm:inline">Enviados</span>
                  <span className="sm:hidden">OK</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6 pt-0">
                <div className="text-lg sm:text-3xl font-bold text-green-600">
                  {sentCount}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 p-2 sm:p-0">
              <CardHeader className="pb-1 sm:pb-3 p-2 sm:p-6">
                <CardTitle className="text-[10px] sm:text-sm font-medium flex items-center gap-1">
                  <Flask size={10} className="text-yellow-600" />
                  <span className="hidden sm:inline">Simulados</span>
                  <span className="sm:hidden">Sim</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6 pt-0">
                <div className="text-lg sm:text-3xl font-bold text-yellow-600">
                  {simulatedCount}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 p-2 sm:p-0">
              <CardHeader className="pb-1 sm:pb-3 p-2 sm:p-6">
                <CardTitle className="text-[10px] sm:text-sm font-medium flex items-center gap-1">
                  <XCircle size={10} className="text-red-600" />
                  <span className="hidden sm:inline">Fallidos</span>
                  <span className="sm:hidden">Err</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6 pt-0">
                <div className="text-lg sm:text-3xl font-bold text-red-600">
                  {failedCount}
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
                {isProcessing ? 'Procesando...' : 'Procesar Ahora'}
              </span>
            </Button>
            
            {usersNeedingNotification.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1 justify-center text-xs">
                <Warning size={12} />
                {usersNeedingNotification.length} pendiente(s)
              </Badge>
            )}

            {lastCheck && lastCheck > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 justify-center text-xs">
                <Clock size={12} />
                Última: {new Date(lastCheck).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </Badge>
            )}
          </div>

          {usersNeedingNotification.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="p-2 sm:p-4">
                <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                  <Warning size={14} />
                  Usuarios Pendientes de Notificación
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
          <CardTitle className="text-sm sm:text-lg">Historial de Notificaciones</CardTitle>
          <CardDescription className="text-[10px] sm:text-sm">
            Últimas 10 notificaciones procesadas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 pt-0">
          {recentNotifications.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <EnvelopeSimple size={32} className="mx-auto mb-2 opacity-50 sm:w-12 sm:h-12" />
              <p className="text-xs sm:text-sm">Sin notificaciones aún</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Las notificaciones aparecerán aquí cuando se procesen
              </p>
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
                        {user?.fullName || user?.username || 'Usuario eliminado'}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {notification.email} • {new Date(notification.sentAt).toLocaleDateString('es-MX')}
                      </div>
                      {notification.errorMessage && (
                        <div className="text-[10px] text-red-500 truncate mt-0.5">
                          {notification.errorMessage}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-[9px] sm:text-xs">
                        {getNotificationTypeLabel(notification.type)}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(notification.status)} className="text-[9px] sm:text-xs flex items-center gap-1">
                        {getStatusIcon(notification.status)}
                        <span className="hidden sm:inline">
                          {notification.status === 'sent' ? 'Enviado' : 
                           notification.status === 'simulated' ? 'Simulado' : 
                           notification.status === 'failed' ? 'Fallido' : 'OK'}
                        </span>
                      </Badge>
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
