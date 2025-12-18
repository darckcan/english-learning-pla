import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { toast } from 'sonner'
import { User } from '@/lib/types'
import { isMembershipActive, getDaysRemaining } from '@/lib/membership'
import { ArrowsClockwise, Warning, CheckCircle, Clock, CreditCard, Users, Bell } from '@phosphor-icons/react'

interface MembershipStats {
  active: number
  expired: number
  trial: number
  monthly: number
  lifetime: number
  expiringIn7Days: number
}

export default function MembershipStatusManager() {
  const [allUsers, setAllUsers] = useKV<User[]>('all-users', [])
  const [isProcessing, setIsProcessing] = useState(false)
  const [autoCheckEnabled, setAutoCheckEnabled] = useKV<boolean>('auto-membership-check', true)
  const [lastCheck, setLastCheck] = useKV<number>('last-membership-check', 0)
  const [stats, setStats] = useState<MembershipStats>({
    active: 0,
    expired: 0,
    trial: 0,
    monthly: 0,
    lifetime: 0,
    expiringIn7Days: 0,
  })

  useEffect(() => {
    calculateStats()
  }, [allUsers])

  useEffect(() => {
    if (autoCheckEnabled) {
      const now = Date.now()
      const oneHour = 60 * 60 * 1000
      if (!lastCheck || now - lastCheck > oneHour) {
        checkAndUpdateMemberships(true)
      }
    }
  }, [autoCheckEnabled, lastCheck])

  const calculateStats = () => {
    const users = allUsers || []
    const now = Date.now()
    const sevenDays = 7 * 24 * 60 * 60 * 1000

    const newStats: MembershipStats = {
      active: 0,
      expired: 0,
      trial: 0,
      monthly: 0,
      lifetime: 0,
      expiringIn7Days: 0,
    }

    users.forEach(user => {
      if (!user.membership) return

      if (isMembershipActive(user.membership)) {
        newStats.active++
        
        if (user.membership.type === 'trial') newStats.trial++
        else if (user.membership.type === 'monthly') newStats.monthly++
        else if (user.membership.type === 'lifetime') newStats.lifetime++

        if (user.membership.endDate) {
          const timeUntilExpiry = user.membership.endDate - now
          if (timeUntilExpiry > 0 && timeUntilExpiry <= sevenDays) {
            newStats.expiringIn7Days++
          }
        }
      } else {
        newStats.expired++
      }
    })

    setStats(newStats)
  }

  const checkAndUpdateMemberships = async (silent = false) => {
    setIsProcessing(true)
    const users = allUsers || []
    const now = Date.now()
    let updatedCount = 0
    let expiredCount = 0

    const updatedUsers = users.map(user => {
      if (!user.membership) return user
      
      if (user.membership.type === 'lifetime') return user
      
      if (user.membership.endDate && now > user.membership.endDate && user.membership.isActive) {
        expiredCount++
        updatedCount++
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

    if (updatedCount > 0) {
      setAllUsers(() => updatedUsers)
    }

    setLastCheck(() => now)
    setIsProcessing(false)

    if (!silent) {
      if (expiredCount > 0) {
        toast.info(`Se desactivaron ${expiredCount} membresías expiradas`)
      } else {
        toast.success('Todas las membresías están actualizadas')
      }
    }

    calculateStats()
  }

  const reactivateMembership = (userId: string, type: 'trial' | 'monthly') => {
    const users = allUsers || []
    const user = users.find(u => u.id === userId)
    
    if (!user) return

    const now = Date.now()
    const duration = type === 'trial' ? 15 : 30
    const endDate = now + (duration * 24 * 60 * 60 * 1000)

    setAllUsers((current) => {
      const users = current || []
      return users.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            membership: {
              type,
              startDate: now,
              endDate,
              isActive: true,
            }
          }
        }
        return u
      })
    })

    toast.success(`Membresía ${type === 'trial' ? 'de prueba' : 'mensual'} reactivada para ${user.username}`)
    calculateStats()
  }

  const expiredUsers = (allUsers || []).filter(u => 
    u.membership && !isMembershipActive(u.membership) && u.role === 'student'
  )

  const expiringUsers = (allUsers || []).filter(u => {
    if (!u.membership || !u.membership.endDate || u.membership.type === 'lifetime') return false
    const daysLeft = getDaysRemaining(u.membership)
    return daysLeft !== null && daysLeft <= 7 && daysLeft > 0
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ArrowsClockwise size={20} className="text-primary sm:w-6 sm:h-6" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">Gestión de Membresías</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Control automático del estado de suscripciones
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={() => checkAndUpdateMemberships()}
            disabled={isProcessing}
            size="sm"
            variant="outline"
          >
            {isProcessing ? (
              <ArrowsClockwise size={16} className="animate-spin" />
            ) : (
              <ArrowsClockwise size={16} />
            )}
            <span className="hidden sm:inline ml-2">Verificar Ahora</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 sm:p-3 text-center">
            <CheckCircle size={20} className="mx-auto text-green-600 mb-1" />
            <p className="text-lg sm:text-xl font-bold text-green-700">{stats.active}</p>
            <p className="text-xs text-green-600">Activas</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 sm:p-3 text-center">
            <Warning size={20} className="mx-auto text-red-600 mb-1" />
            <p className="text-lg sm:text-xl font-bold text-red-700">{stats.expired}</p>
            <p className="text-xs text-red-600">Expiradas</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3 text-center">
            <Clock size={20} className="mx-auto text-blue-600 mb-1" />
            <p className="text-lg sm:text-xl font-bold text-blue-700">{stats.trial}</p>
            <p className="text-xs text-blue-600">Prueba</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 sm:p-3 text-center">
            <CreditCard size={20} className="mx-auto text-purple-600 mb-1" />
            <p className="text-lg sm:text-xl font-bold text-purple-700">{stats.monthly}</p>
            <p className="text-xs text-purple-600">Mensuales</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 sm:p-3 text-center">
            <Users size={20} className="mx-auto text-yellow-600 mb-1" />
            <p className="text-lg sm:text-xl font-bold text-yellow-700">{stats.lifetime}</p>
            <p className="text-xs text-yellow-600">Vitalicias</p>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 sm:p-3 text-center">
            <Bell size={20} className="mx-auto text-orange-600 mb-1" />
            <p className="text-lg sm:text-xl font-bold text-orange-700">{stats.expiringIn7Days}</p>
            <p className="text-xs text-orange-600">Por expirar</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Verificación Automática</Label>
            <p className="text-xs text-muted-foreground">
              Verificar y actualizar membresías automáticamente cada hora
            </p>
          </div>
          <Switch
            checked={autoCheckEnabled || false}
            onCheckedChange={(checked) => setAutoCheckEnabled(() => checked)}
          />
        </div>

        {lastCheck && (
          <p className="text-xs text-muted-foreground text-center">
            Última verificación: {new Date(lastCheck).toLocaleString('es-ES')}
          </p>
        )}

        {expiringUsers.length > 0 && (
          <div className="border border-orange-200 bg-orange-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={16} className="text-orange-600" />
              <p className="text-sm font-medium text-orange-800">
                Membresías por expirar en 7 días ({expiringUsers.length})
              </p>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {expiringUsers.slice(0, 5).map(user => (
                <div key={user.id} className="flex items-center justify-between text-sm bg-white rounded p-2">
                  <span className="text-orange-900">{user.username}</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-300 text-xs">
                    {getDaysRemaining(user.membership)} días
                  </Badge>
                </div>
              ))}
              {expiringUsers.length > 5 && (
                <p className="text-xs text-orange-600 text-center">
                  +{expiringUsers.length - 5} más
                </p>
              )}
            </div>
          </div>
        )}

        {expiredUsers.length > 0 && (
          <div className="border border-red-200 bg-red-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Warning size={16} className="text-red-600" />
              <p className="text-sm font-medium text-red-800">
                Membresías expiradas ({expiredUsers.length})
              </p>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {expiredUsers.slice(0, 10).map(user => (
                <div key={user.id} className="flex items-center justify-between bg-white rounded p-2">
                  <div>
                    <span className="text-sm font-medium text-red-900">{user.username}</span>
                    <p className="text-xs text-red-600">
                      {user.membership?.type === 'trial' ? 'Prueba' : 'Mensual'} - Expiró el {
                        user.membership?.endDate 
                          ? new Date(user.membership.endDate).toLocaleDateString('es-ES')
                          : 'N/A'
                      }
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reactivateMembership(user.id, 'trial')}
                      className="h-7 text-xs"
                    >
                      +15 días
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => reactivateMembership(user.id, 'monthly')}
                      className="h-7 text-xs"
                    >
                      +30 días
                    </Button>
                  </div>
                </div>
              ))}
              {expiredUsers.length > 10 && (
                <p className="text-xs text-red-600 text-center">
                  +{expiredUsers.length - 10} más
                </p>
              )}
            </div>
          </div>
        )}

        {expiredUsers.length === 0 && expiringUsers.length === 0 && (
          <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
            <CheckCircle size={20} />
            <span className="text-sm">Todas las membresías están al día</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
