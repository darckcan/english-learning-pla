# Integración de Pasarela de Pago Stripe

## 🔐 Claves de API Configuradas

La aplicación está configurada con las siguientes claves de Stripe en modo **LIVE** (producción):

- **Clave Pública**: `pk_live_51NLv8cBSxEn7IlGkOJ3sfzOBWdlVkNkpVN7XrJ7v0z8LWxcSf3If43DJpxTWKdLSUF6aNa3cYKlY1IAeFw91fZY0008GleX7lm`
- **Clave Secreta**: `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`

⚠️ **IMPORTANTE**: Estas claves están en código. En un entorno de producción real, deberías usar variables de entorno y un backend seguro.

## 💳 Productos de Membresía

### Membresía Mensual
- **Precio por defecto**: $9.99 USD/mes
- **Tipo**: Suscripción recurrente
- **Beneficios**: Acceso completo a todos los niveles

### Membresía Vitalicia
- **Precio por defecto**: $24.99 USD (pago único)
- **Tipo**: Pago único
- **Beneficios**: Acceso de por vida + todas las actualizaciones futuras

## 🔄 Flujo de Pago

1. **Usuario navega a Configuración** → Tab "Config" en el Dashboard
2. **Ve estado de membresía** → Si está en prueba o expirada, ve botones de upgrade
3. **Hace clic en "Suscribirse" o "Comprar"** → Se abre el modal de Stripe
4. **Selecciona plan** → Mensual o Vitalicio
5. **Es redirigido a Stripe Checkout** → Página segura de Stripe
6. **Completa el pago** → Ingresa datos de tarjeta
7. **Es redirigido de vuelta** → Con `?payment=success&session_id={ID}`
8. **La app verifica el pago** → Automáticamente usando el hook `useStripePaymentVerification`
9. **Membresía activada** → Usuario recibe notificación de éxito

## 🛠️ Archivos Principales

### Configuración
- `/src/lib/stripe-config.ts` - Claves de API y configuración de productos
- `/src/lib/stripe-service.ts` - Servicios para crear pagos y verificar transacciones

### Componentes
- `/src/components/StripePaymentModal.tsx` - Modal de selección de plan
- `/src/components/PaymentsDashboard.tsx` - Dashboard de pagos para admin
- `/src/components/MembershipStatus.tsx` - Muestra estado actual de membresía

### Hooks
- `/src/hooks/use-stripe-payment.ts` - Verificación automática de pagos completados

## 🎛️ Panel de Super Administrador

El super administrador puede:

1. **Ver estadísticas de ingresos**
   - Ingresos totales
   - Ingresos del mes actual
   - Suscripciones activas
   - Miembros vitalicios

2. **Historial de pagos**
   - Lista completa de transacciones
   - Fecha y hora de cada pago
   - Tipo de membresía comprada
   - Estado del pago

3. **Ajustar precios**
   - Cambiar precio mensual
   - Cambiar precio vitalicio
   - Modificar días de prueba gratuita

## 🧪 Pruebas con Tarjetas de Stripe

Para probar pagos en modo LIVE, usa estas tarjetas de test de Stripe:

### ✅ Tarjetas que Funcionan
- **Número**: `4242 4242 4242 4242`
- **Fecha**: Cualquier fecha futura
- **CVC**: Cualquier 3 dígitos
- **ZIP**: Cualquier código postal

### ❌ Tarjetas que Fallan
- **Número**: `4000 0000 0000 0002` (tarjeta declinada)

## 🔒 Seguridad Implementada

1. **Checkout Hosted de Stripe** - Los datos de tarjeta nunca pasan por tu servidor
2. **Verificación de pagos** - Verifica el estado con Stripe antes de activar membresía
3. **Metadata** - Cada pago incluye userId y membershipType para rastreo
4. **Registro de transacciones** - Todas las transacciones se guardan en el historial

## 📊 Datos Persistidos

La aplicación guarda los siguientes datos:

- **`payment-records`** - Historial completo de pagos
- **`all-users`** - Usuarios con estado de membresía actualizado
- **`membership-pricing`** - Precios configurados por el admin

## 🔄 Actualización de Membresía

Cuando un pago es exitoso:

1. Se actualiza el campo `membership` del usuario:
```typescript
{
  type: 'monthly' | 'lifetime',
  startDate: timestamp,
  expiresAt: timestamp | null, // null para lifetime
  isActive: true
}
```

2. Se crea un registro de pago:
```typescript
{
  id: sessionId,
  userId: string,
  userEmail: string,
  amount: number,
  type: 'monthly' | 'lifetime',
  status: 'completed',
  date: timestamp
}
```

## 💡 Notas Importantes

1. **Suscripciones recurrentes**: Stripe maneja los cobros automáticos mensuales
2. **Webhooks**: Deberías configurar webhooks de Stripe para recibir notificaciones de:
   - Pagos exitosos
   - Pagos fallidos
   - Cancelaciones de suscripción
   - Renovaciones

3. **Backend recomendado**: Para producción, implementa un backend que:
   - Maneje las claves secretas de forma segura
   - Procese webhooks de Stripe
   - Verifique pagos antes de activar membresías
   - Maneje cancelaciones y reembolsos

## 🚀 Próximos Pasos Recomendados

1. Configurar webhooks en el dashboard de Stripe
2. Implementar manejo de cancelaciones de suscripción
3. Agregar notificaciones por email al completar pago
4. Implementar sistema de reembolsos
5. Agregar dashboard de métricas más avanzado
