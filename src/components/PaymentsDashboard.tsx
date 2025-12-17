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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CurrencyDollar size={18} />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(payments || []).filter(p => p.status === 'completed').length} pagos completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendUp size={18} />
              Ingresos del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users size={18} />
              Suscripciones Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Membresías mensuales activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Receipt size={18} />
              Miembros Vitalicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lifetimeMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pagos únicos completados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            Últimas transacciones procesadas por Stripe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(payments || []).length === 0 ? (
            <div className="text-center py-12">
              <Receipt size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay pagos registrados todavía</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(payments || []).sort((a, b) => b.date - a.date).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.status === 'completed' ? 'bg-success/10' :
                      payment.status === 'pending' ? 'bg-accent/10' : 'bg-destructive/10'
                    }`}>
                      <CurrencyDollar size={20} className={
                        payment.status === 'completed' ? 'text-success' :
                        payment.status === 'pending' ? 'text-accent' : 'text-destructive'
                      } />
                    </div>
                    <div>
                      <p className="font-medium">{payment.userEmail}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(payment.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${payment.amount.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={payment.type === 'lifetime' ? 'default' : 'secondary'}>
                        {payment.type === 'lifetime' ? 'Vitalicia' : 'Mensual'}
                      </Badge>
                      <Badge variant={
                        payment.status === 'completed' ? 'default' :
                        payment.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {payment.status === 'completed' ? 'Completado' :
                         payment.status === 'pending' ? 'Pendiente' : 'Fallido'}
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
