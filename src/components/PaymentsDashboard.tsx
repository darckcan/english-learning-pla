import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { toast } from 'sonner'
import { CurrencyDollar, Receipt, TrendUp, Users, Calendar } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'

interface PaymentRecord {
  id: string
  userId: string
  userEmail: string
  amount: number
  type: 'monthly' | 'lifetime'
  status: 'completed' | 'pending' | 'failed'
  date: number
}

export default function PaymentsDashboard() {
  const [allUsers] = useKV<User[]>('all-users', [])
  const [payments, setPayments] = useKV<PaymentRecord[]>('payment-records', [])

  const totalRevenue = (payments || []).reduce((sum, p) => p.status === 'completed' ? sum + p.amount : sum, 0)
  const monthlyRevenue = (payments || []).filter(p => {
    const date = new Date(p.date)
    const now = new Date()
    return date.getMonth() === now.getMonth() && 
           date.getFullYear() === now.getFullYear() &&
           p.status === 'completed'
  }).reduce((sum, p) => sum + p.amount, 0)

  const activeSubscriptions = (allUsers || []).filter(u => 
    u.membership?.isActive && u.membership.type !== 'trial'
  ).length

  const lifetimeMembers = (allUsers || []).filter(u => 
    u.membership?.type === 'lifetime'
  ).length

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <CurrencyDollar size={16} className="sm:w-[18px] sm:h-[18px]" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(payments || []).filter(p => p.status === 'completed').length} pagos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <TrendUp size={16} className="sm:w-[18px] sm:h-[18px]" />
              Mes Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">${monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
              Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mensuales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
              <Receipt size={16} className="sm:w-[18px] sm:h-[18px]" />
              Vitalicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{lifetimeMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Únicos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Historial de Pagos</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Últimas transacciones procesadas por Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(payments || []).length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Receipt size={40} className="mx-auto text-muted-foreground mb-3 sm:mb-4 sm:w-12 sm:h-12" />
              <p className="text-sm sm:text-base text-muted-foreground">No hay pagos registrados todavía</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {(payments || []).sort((a, b) => b.date - a.date).map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      payment.status === 'completed' ? 'bg-success/10' :
                      payment.status === 'pending' ? 'bg-accent/10' : 'bg-destructive/10'
                    }`}>
                      <CurrencyDollar size={18} className={`sm:w-5 sm:h-5 ${
                        payment.status === 'completed' ? 'text-success' :
                        payment.status === 'pending' ? 'text-accent' : 'text-destructive'
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">{payment.userEmail}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                        <Calendar size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
                        <span className="truncate">
                          {new Date(payment.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:text-right gap-2">
                    <p className="text-base sm:text-lg font-bold">${payment.amount.toFixed(2)}</p>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Badge variant={payment.type === 'lifetime' ? 'default' : 'secondary'} className="text-xs">
                        {payment.type === 'lifetime' ? 'Vitalicia' : 'Mensual'}
                      </Badge>
                      <Badge variant={
                        payment.status === 'completed' ? 'default' :
                        payment.status === 'pending' ? 'secondary' : 'destructive'
                      } className="text-xs">
                        {payment.status === 'completed' ? 'OK' :
                         payment.status === 'pending' ? 'Pend' : 'Fallo'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
