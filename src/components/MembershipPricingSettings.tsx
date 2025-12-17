import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { MembershipPricing, DEFAULT_PRICING } from '@/lib/membership'
import { CurrencyDollar, Clock, Crown } from '@phosphor-icons/react'

export default function MembershipPricingSettings() {
  const [pricing, setPricing] = useKV<MembershipPricing>('membership-pricing', DEFAULT_PRICING)
  const [trialDays, setTrialDays] = useState(pricing?.trialDays || DEFAULT_PRICING.trialDays)
  const [monthlyPrice, setMonthlyPrice] = useState(pricing?.monthlyPrice || DEFAULT_PRICING.monthlyPrice)
  const [lifetimePrice, setLifetimePrice] = useState(pricing?.lifetimePrice || DEFAULT_PRICING.lifetimePrice)

  const handleSave = () => {
    if (trialDays < 1 || trialDays > 365) {
      toast.error('Los días de prueba deben estar entre 1 y 365')
      return
    }

    if (monthlyPrice < 0.01 || monthlyPrice > 999.99) {
      toast.error('El precio mensual debe estar entre $0.01 y $999.99')
      return
    }

    if (lifetimePrice < 0.01 || lifetimePrice > 9999.99) {
      toast.error('El precio vitalicio debe estar entre $0.01 y $9999.99')
      return
    }

    const newPricing: MembershipPricing = {
      trialDays: Math.round(trialDays),
      monthlyPrice: Math.round(monthlyPrice * 100) / 100,
      lifetimePrice: Math.round(lifetimePrice * 100) / 100,
    }

    setPricing(() => newPricing)
    toast.success('Configuración de membresías actualizada correctamente')
  }

  const handleReset = () => {
    setTrialDays(DEFAULT_PRICING.trialDays)
    setMonthlyPrice(DEFAULT_PRICING.monthlyPrice)
    setLifetimePrice(DEFAULT_PRICING.lifetimePrice)
    setPricing(() => DEFAULT_PRICING)
    toast.success('Configuración restablecida a valores predeterminados')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CurrencyDollar size={24} />
          Configuración de Membresías
        </CardTitle>
        <CardDescription>
          Configura los precios y duración de las membresías de la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trial-days" className="flex items-center gap-2">
              <Clock size={16} />
              Días de Prueba Gratuita
            </Label>
            <Input
              id="trial-days"
              type="number"
              min="1"
              max="365"
              value={trialDays}
              onChange={(e) => setTrialDays(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Días de acceso gratuito para nuevos usuarios
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly-price" className="flex items-center gap-2">
              <CurrencyDollar size={16} />
              Precio Mensual (USD)
            </Label>
            <Input
              id="monthly-price"
              type="number"
              min="0.01"
              max="999.99"
              step="0.01"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Precio de la suscripción mensual
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lifetime-price" className="flex items-center gap-2">
              <Crown size={16} />
              Precio Vitalicio (USD)
            </Label>
            <Input
              id="lifetime-price"
              type="number"
              min="0.01"
              max="9999.99"
              step="0.01"
              value={lifetimePrice}
              onChange={(e) => setLifetimePrice(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Pago único para acceso ilimitado
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">Vista Previa:</p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-background rounded p-3 space-y-1">
              <p className="text-xs text-muted-foreground">Prueba Gratuita</p>
              <p className="text-lg font-bold">{trialDays} días</p>
              <p className="text-xs text-success">Sin costo</p>
            </div>
            <div className="bg-background rounded p-3 space-y-1">
              <p className="text-xs text-muted-foreground">Mensual</p>
              <p className="text-lg font-bold">${monthlyPrice.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">por mes</p>
            </div>
            <div className="bg-primary/10 border border-primary rounded p-3 space-y-1">
              <p className="text-xs text-muted-foreground">Vitalicia</p>
              <p className="text-lg font-bold">${lifetimePrice.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">pago único</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            Guardar Cambios
          </Button>
          <Button onClick={handleReset} variant="outline">
            Restablecer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
