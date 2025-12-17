import { User } from '@/lib/types'
import { isMembershipActive, getDaysRemaining, getMembershipLabel } from '@/lib/membership'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Calendar, CreditCard, Sparkle, Crown, Clock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface MembershipStatusProps {
  user: User
  onUpgrade?: () => void
}

export default function MembershipStatus({ user, onUpgrade }: MembershipStatusProps) {
  const isActive = isMembershipActive(user.membership)
  const daysRemaining = getDaysRemaining(user.membership)
  const membershipType = user.membership?.type || 'trial'
  const membershipLabel = getMembershipLabel(membershipType)

  const getStatusColor = (): 'default' | 'destructive' | 'outline' | 'secondary' => {
    if (!isActive) return 'destructive'
    if (membershipType === 'lifetime') return 'default'
    if (daysRemaining !== null && daysRemaining <= 3) return 'destructive'
    if (daysRemaining !== null && daysRemaining <= 7) return 'secondary'
    return 'outline'
  }

  const getStatusIcon = () => {
    if (membershipType === 'lifetime') return <Crown size={20} weight="fill" />
    if (membershipType === 'monthly') return <CreditCard size={20} />
    return <Sparkle size={20} />
  }

  const getStatusMessage = () => {
    if (!isActive) return 'Tu membresía ha expirado'
    if (membershipType === 'lifetime') return 'Membresía Vitalicia Activa'
    if (daysRemaining === null) return 'Activa'
    if (daysRemaining === 0) return 'Expira hoy'
    if (daysRemaining === 1) return 'Expira mañana'
    return `${daysRemaining} días restantes`
  }

  return (
    <Card className={`${!isActive ? 'border-destructive' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">{membershipLabel}</CardTitle>
          </div>
          <Badge variant={getStatusColor()}>
            {getStatusMessage()}
          </Badge>
        </div>
        {!isActive && (
          <CardDescription className="text-destructive">
            Para continuar usando Nexus Fluent, necesitas renovar tu membresía
          </CardDescription>
        )}
      </CardHeader>
      
      {(!isActive || (membershipType === 'trial' && daysRemaining !== null && daysRemaining <= 7)) && (
        <CardContent className="space-y-3">
          {membershipType === 'trial' && isActive && daysRemaining !== null && daysRemaining <= 7 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/10 border border-accent/20 rounded-lg p-3 space-y-2"
            >
              <p className="text-sm font-medium text-accent-foreground flex items-center gap-2">
                <Clock size={16} />
                Tu prueba gratuita está por terminar
              </p>
              <p className="text-xs text-muted-foreground">
                Actualiza ahora para continuar tu camino hacia la fluidez sin interrupciones
              </p>
            </motion.div>
          )}
          
          {onUpgrade && (
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Mensual</p>
                <p className="text-2xl font-bold">$9.99</p>
                <p className="text-xs text-muted-foreground">por mes</p>
                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={onUpgrade}
                >
                  Suscribirse
                </Button>
              </div>
              
              <div className="bg-primary/10 border-2 border-primary rounded-lg p-3 space-y-1 relative overflow-hidden">
                <Badge className="absolute top-2 right-2" variant="default">
                  Mejor Valor
                </Badge>
                <p className="text-xs text-muted-foreground">Vitalicia</p>
                <p className="text-2xl font-bold">$24.99</p>
                <p className="text-xs text-muted-foreground">pago único</p>
                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={onUpgrade}
                >
                  Comprar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
