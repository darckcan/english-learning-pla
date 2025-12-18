# 🚀 Guía: Configuración de Stripe para Producción

## ✅ Resumen

La pasarela de pago Stripe ahora se configura **directamente desde el panel de Super Admin**, sin necesidad de variables de entorno ni modificar código.

## 🔧 Pasos para Configurar

### 1. Obtener tus Claves de Producción en Stripe

1. Ve a [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Asegúrate de estar en **modo Live** (no Test) - hay un toggle arriba a la derecha
3. Copia tu **Publishable key** (empieza con `pk_live_`)
4. La **Secret key** NO es necesaria en esta configuración frontend

### 2. Crear tus Payment Links (Método Recomendado)

1. Ve a [dashboard.stripe.com/payment-links](https://dashboard.stripe.com/payment-links)
2. Crea un Payment Link para **Membresía Mensual**:
   - Nombre: "Membresía Mensual - Nexus Fluent"
   - Precio: $9.99 USD (o el que prefieras)
   - Tipo: Suscripción mensual
3. Crea otro Payment Link para **Membresía Vitalicia**:
   - Nombre: "Membresía Vitalicia - Nexus Fluent"  
   - Precio: $24.99 USD (o el que prefieras)
   - Tipo: Pago único
4. Copia las URLs de ambos Payment Links (empiezan con `https://buy.stripe.com/...`)

### 3. Configurar en Nexus Fluent

1. Inicia sesión como **Super Admin**
2. Ve a la sección **"Pasarela de Pago - Stripe"**
3. Expande **"Clave de API (Requerido)"**:
   - Pega tu clave pública (`pk_live_...`)
4. Expande **"Payment Links (Recomendado)"**:
   - Pega el Payment Link de membresía mensual
   - Pega el Payment Link de membresía vitalicia
5. Click en **"Verificar y Guardar"**
6. Debería aparecer la badge verde "Producción"

## ✅ Verificación

Después de configurar:

1. El badge debe mostrar **"Producción"** (verde)
2. Si muestra **"Modo Pruebas"** (amarillo), estás usando claves de test
3. Prueba el flujo de pago con una tarjeta real (o de test si estás en modo pruebas)

## 📋 Tipos de Claves

| Prefijo | Tipo | Uso |
|---------|------|-----|
| `pk_live_` | Clave pública de producción | ✅ Pagos reales |
| `pk_test_` | Clave pública de pruebas | ⚠️ Solo para testing |
| `sk_live_` | Clave secreta de producción | ❌ No usar en frontend |
| `sk_test_` | Clave secreta de pruebas | ❌ No usar en frontend |

## ⚠️ Importante

- **NO** necesitas la clave secreta (sk_) para esta configuración
- Las claves se guardan de forma segura en el almacenamiento de la aplicación
- Si cambias de modo pruebas a producción, los usuarios deberán pagar con tarjetas reales

## 🔄 Alternativa: Price IDs

Si prefieres usar el checkout tradicional de Stripe en lugar de Payment Links:

1. Crea productos en [dashboard.stripe.com/products](https://dashboard.stripe.com/products)
2. Copia el **Price ID** de cada producto (empieza con `price_...`)
3. En el panel de configuración, expande **"Price IDs (Alternativo)"**
4. Pega los Price IDs correspondientes

## ❓ Solución de Problemas

### "Sistema de pagos no disponible"
- Verifica que ingresaste la clave pública correctamente
- Asegúrate de haber guardado la configuración
- Verifica que al menos un Payment Link o Price ID esté configurado

### Los pagos no se procesan
- Confirma que estás usando claves de producción (`pk_live_`)
- Verifica que los Payment Links estén activos en tu dashboard de Stripe
- Revisa el [dashboard de Stripe](https://dashboard.stripe.com/payments) para ver intentos de pago

### Badge muestra "Modo Pruebas"
- Estás usando una clave de prueba (`pk_test_`)
- Para pagos reales, cambia a la clave de producción desde tu dashboard de Stripe
