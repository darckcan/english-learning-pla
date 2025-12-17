import { User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { getDaysRemaining, getMembershipLabel } from '@/lib/membership'
import { Warning, Clock, Sparkle } from '@phosphor-icons/react'

interface MembershipExpiryAlertProps {
  user: User
  onUpgrade?: () => void
}

export default function MembershipExpiryAlert({ user, onUpgrade }: MembershipExpiryAlertProps) {
  const daysRemaining = getDaysRemaining(user.membership)
  
  if (daysRemaining === null || user.membership?.type === 'lifetime') {
    return null
  }

  if (daysRemaining <= 0) {
    return (
      <Alert className="border-destructive bg-destructive/10">
        <Warning className="h-5 w-5 text-destructive" />
        <AlertDescription className="ml-2">
          <div className="flex flex-col gap-2">
            <div>
              <strong className="text-destructive">Tu membresía ha expirado</strong>
              <p className="text-sm text-muted-foreground mt-1">
                Para continuar accediendo a todas las lecciones y funciones, necesitas renovar tu membresía.
              </p>
            </div>
            {onUpgrade && (
              <Button variant="destructive" onClick={onUpgrade} className="w-fit">
                Renovar Ahora
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (daysRemaining <= 3) {
    return (
      <Alert className="border-destructive bg-destructive/10">
        <Warning className="h-5 w-5 text-destructive" />
        <AlertDescription className="ml-2">
          <div className="flex flex-col gap-2">
            <div>
              <strong className="text-destructive">
                ¡Tu membresía expira en {daysRemaining} día{daysRemaining !== 1 ? 's' : ''}!
              </strong>
              <p className="text-sm text-muted-foreground mt-1">
                No pierdas tu progreso. Renueva ahora para continuar aprendiendo sin interrupciones.
              </p>
            </div>
            {onUpgrade && (
              <Button variant="destructive" onClick={onUpgrade} className="w-fit">
                Renovar Membresía
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (daysRemaining <= 7) {
    return (
      <Alert className="border-accent bg-accent/10">
        <Clock className="h-5 w-5 text-accent" />
        <AlertDescription className="ml-2">
          <div className="flex flex-col gap-2">
            <div>
              <strong className="text-accent-foreground">
                Tu membresía vence en {daysRemaining} días
              </strong>
              <p className="text-sm text-muted-foreground mt-1">
                Considera renovar pronto para evitar interrupciones en tu aprendizaje.
              </p>
            </div>
            {onUpgrade && (
              <Button variant="outline" onClick={onUpgrade} className="w-fit">
                Ver Opciones de Renovación
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

interface MembershipUpgradeCardProps {
  user: User
  compact?: boolean
}

export function MembershipUpgradeCard({ user, compact = false }: MembershipUpgradeCardProps) {
  const daysRemaining = getDaysRemaining(user.membership)
  const membershipType = getMembershipLabel(user.membership?.type || 'trial')

  if (user.membership?.type === 'lifetime') {
    return null
  }

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Sparkle className="w-8 h-8 text-primary flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-lg">Actualiza a Membresía Vitalicia</h3>
              <p className="text-sm text-muted-foreground">
                Pago único de $24.99 - Acceso de por vida sin preocupaciones
              </p>
              <Button className="w-full">
                Actualizar Ahora
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkle className="w-6 h-6 text-primary" />
          Actualiza tu Membresía
        </CardTitle>
        <CardDescription>
          Actualmente tienes: <strong>{membershipType}</strong>
          {daysRemaining !== null && daysRemaining > 0 && (
            <span> - {daysRemaining} día{daysRemaining !== 1 ? 's' : ''} restante{daysRemaining !== 1 ? 's' : ''}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Mensual</CardTitle>
              <div className="text-3xl font-bold text-primary">$9.99</div>
              <CardDescription>por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Acceso completo a todos los niveles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Ejercicios ilimitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Certificados de nivel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Seguimiento de progreso</span>
                </li>
              </ul>
              <Button className="w-full mt-4" variant="outline">
                Seleccionar Mensual
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
              MEJOR VALOR
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Vitalicia</CardTitle>
              <div className="text-3xl font-bold text-primary">$24.99</div>
              <CardDescription>pago único</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Todo lo de Mensual</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span><strong>Acceso de por vida</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span><strong>Sin renovaciones</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span><strong>Ahorra más del 80%</strong></span>
                </li>
              </ul>
              <Button className="w-full mt-4">
                Seleccionar Vitalicia
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Todos los pagos son procesados de forma segura
        </div>
      </CardContent>
    </Card>
  )
}
