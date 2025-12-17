# 🔐 Configuración de Variables de Entorno - Stripe

## ✅ Cambios Implementados

Las claves de Stripe han sido **movidas a variables de entorno** para mejorar la seguridad de la aplicación.

### Archivos Modificados:
- ✅ `/src/lib/stripe-config.ts` - Ahora usa `import.meta.env` en lugar de claves hardcodeadas
- ✅ `.env` - Archivo con las claves (NO se sube a Git)
- ✅ `.env.example` - Plantilla para otros desarrolladores
- ✅ `.gitignore` - Ya incluye `.env` para protección

## 🚀 Configuración Local

### 1. Desarrollo Local

El archivo `.env` ya está creado con las claves actuales. Para otros desarrolladores:

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env y agrega tus claves de Stripe
# Obtén tus claves en: https://dashboard.stripe.com/apikeys
```

### 2. Variables Requeridas

```env
# Clave pública (se expone en el frontend)
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# Clave secreta (⚠️ NUNCA debería estar en frontend en producción)
VITE_STRIPE_SECRET_KEY=sk_live_...
```

## 🌐 Configuración en Producción

### EasyPanel

1. Ve a tu aplicación en EasyPanel
2. Navega a la pestaña **Environment**
3. Agrega las variables:
   - `VITE_STRIPE_PUBLIC_KEY` = `pk_live_...`
   - `VITE_STRIPE_SECRET_KEY` = `sk_live_...`
4. Guarda y redeploya

### Vercel

```bash
# Instala Vercel CLI
npm i -g vercel

# Configura las variables
vercel env add VITE_STRIPE_PUBLIC_KEY
vercel env add VITE_STRIPE_SECRET_KEY

# O usa el dashboard: Project Settings → Environment Variables
```

### Railway

1. Ve a tu proyecto en Railway
2. Click en **Variables**
3. Agrega las variables de entorno
4. Railway automáticamente redeploya

### Netlify

1. Site settings → Environment variables
2. Agrega las variables:
   - Key: `VITE_STRIPE_PUBLIC_KEY`, Value: `pk_live_...`
   - Key: `VITE_STRIPE_SECRET_KEY`, Value: `sk_live_...`
3. Deploy settings → Trigger deploy

## ⚠️ ADVERTENCIA IMPORTANTE

### Clave Secreta en el Frontend

Actualmente la clave secreta (`sk_live_...`) se usa en el frontend para crear sesiones de checkout. **Esto NO es ideal para producción**.

### ¿Por qué es un problema?

```
❌ Mal: Frontend → Stripe API (clave secreta expuesta)
✅ Bien: Frontend → Backend → Stripe API (clave secreta segura)
```

La clave secreta puede ser vista por cualquiera que inspeccione el código JavaScript del navegador.

### Solución Recomendada (Futuro)

Implementar un backend que maneje las claves secretas:

```typescript
// Frontend (React)
const response = await fetch('/api/create-checkout', {
  method: 'POST',
  body: JSON.stringify({ membershipType: 'monthly' })
})
const { sessionUrl } = await response.json()
window.location.href = sessionUrl

// Backend (Node.js/Express)
app.post('/api/create-checkout', async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  const session = await stripe.checkout.sessions.create({...})
  res.json({ sessionUrl: session.url })
})
```

## 🔒 Mejores Prácticas de Seguridad

### ✅ Hacer:
- Usar variables de entorno para todas las claves
- Agregar `.env` a `.gitignore`
- Rotar claves periódicamente
- Usar claves de test (`pk_test_...`) en desarrollo
- Implementar backend para claves secretas

### ❌ No Hacer:
- Commitear archivos `.env` a Git
- Compartir claves en Slack, email, etc.
- Usar claves de producción en desarrollo
- Exponer claves secretas en el frontend
- Hardcodear claves en el código

## 🔄 Rotación de Claves

Si necesitas rotar tus claves de Stripe:

1. **Dashboard de Stripe:**
   - Ve a: https://dashboard.stripe.com/apikeys
   - Click en "..." junto a tu clave
   - Selecciona "Roll key"
   - Stripe genera una nueva clave

2. **Actualiza en todos lados:**
   - Archivo `.env` local
   - Variables de entorno en producción
   - Cualquier CI/CD pipeline

3. **Despliega:**
   - La aplicación automáticamente usará las nuevas claves

## 🧪 Verificación

Para verificar que las variables están configuradas:

```typescript
// En el navegador (consola de desarrollo)
console.log('Public key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY)
// Debería mostrar: pk_live_...

// ⚠️ NO hagas esto con la clave secreta en producción
```

## 📞 Soporte

Si tienes problemas:

- **Stripe Docs:** https://stripe.com/docs/keys
- **Vite Env Vars:** https://vitejs.dev/guide/env-and-mode.html
- **Stripe Support:** https://support.stripe.com

## 🎯 Próximos Pasos Recomendados

1. [ ] Verificar que las variables funcionan localmente
2. [ ] Configurar variables en plataforma de despliegue
3. [ ] Considerar implementar un backend para mayor seguridad
4. [ ] Configurar webhooks de Stripe
5. [ ] Usar claves de test para desarrollo
6. [ ] Implementar logging de errores de Stripe

---

**Última actualización:** Implementación de variables de entorno para Stripe  
**Estado:** ✅ Configuración básica completa, recomendado implementar backend
