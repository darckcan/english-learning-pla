# ⚠️ ADVERTENCIA CRÍTICA DE SEGURIDAD - STRIPE

## 🚨 PROBLEMA DE SEGURIDAD IDENTIFICADO

Las claves de API de Stripe están **hardcodeadas** en el código fuente en el archivo `/src/lib/stripe-config.ts`. Esto representa un **RIESGO DE SEGURIDAD CRÍTICO** en producción.

### Claves Actualmente Expuestas:
```
Clave Pública: pk_live_51NLv8cBSxEn7IlGkOJ3sfzOBWdlVkNkpVN7XrJ7v0z8LWxcSf3If43DJpxTWKdLSUF6aNa3cYKlY1IAeFw91fZY0008GleX7lm
Clave Secreta: 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
```

## ⚠️ RIESGOS

1. **Cualquier persona con acceso al código puede:**
   - Ver tus claves secretas de Stripe
   - Hacer cargos fraudulentos
   - Acceder a información de pagos
   - Crear sesiones de checkout falsas
   - Comprometer la seguridad financiera de tu aplicación

2. **Si el código está en un repositorio público:**
   - Las claves están completamente expuestas a internet
   - Los bots automáticamente escanean y recolectan estas claves
   - Podrías recibir cargos no autorizados

## ✅ SOLUCIÓN RECOMENDADA

### Opción 1: Variables de Entorno (Recomendado)

1. **Crear archivo `.env` en la raíz del proyecto:**
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_51NLv8cBSxEn7IlGkOJ3sfzOBWdlVkNkpVN7XrJ7v0z8LWxcSf3If43DJpxTWKdLSUF6aNa3cYKlY1IAeFw91fZY0008GleX7lm
STRIPE_SECRET_KEY=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
```

2. **Agregar `.env` a `.gitignore`:**
```
.env
.env.local
.env.production
```

3. **Modificar `/src/lib/stripe-config.ts`:**
```typescript
export const STRIPE_CONFIG = {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  secretKey: import.meta.env.STRIPE_SECRET_KEY || ''
}
```

4. **Configurar las variables en tu plataforma de despliegue:**
   - EasyPanel: Panel de control → Variables de entorno
   - Vercel: Project Settings → Environment Variables
   - Railway: Variables tab
   - Netlify: Site settings → Environment variables

### Opción 2: Backend Seguro (MÁS SEGURO)

La clave secreta **NUNCA** debería estar en el frontend. Implementa un backend:

```
Frontend (React) → Backend (Node.js/Express) → Stripe API
                     ↑
                   Clave secreta aquí
```

**Ventajas:**
- Clave secreta nunca se expone al cliente
- Mayor control sobre transacciones
- Webhooks para eventos de Stripe
- Validación adicional de seguridad

## 🔄 ACCIONES INMEDIATAS REQUERIDAS

### Si estas claves ya están en producción:

1. **INMEDIATAMENTE:**
   - Ve al Dashboard de Stripe (https://dashboard.stripe.com)
   - Navega a: Developers → API keys
   - **Revoca las claves actuales** haciendo clic en los "..." → "Roll key"
   - Genera nuevas claves

2. **Verifica transacciones:**
   - Revisa el historial de pagos en Stripe
   - Busca actividad sospechosa
   - Contacta a Stripe Support si encuentras algo

3. **Implementa una solución segura:**
   - Usa variables de entorno
   - Considera implementar un backend
   - Nunca comitees las nuevas claves al repositorio

### Si estas claves están en un repositorio público:

1. **Las claves están COMPROMETIDAS** - deben ser revocadas INMEDIATAMENTE
2. **Limpia el historial de Git** (las claves siguen en commits antiguos):
   ```bash
   # CUIDADO: Esto reescribe el historial
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch src/lib/stripe-config.ts" \
     --prune-empty --tag-name-filter cat -- --all
   ```

## 📋 CHECKLIST DE SEGURIDAD

- [ ] Revocar claves expuestas en Stripe Dashboard
- [ ] Generar nuevas claves de API
- [ ] Implementar variables de entorno
- [ ] Agregar `.env` a `.gitignore`
- [ ] Configurar variables en plataforma de despliegue
- [ ] Verificar que las claves no están en el código
- [ ] (Opcional) Implementar backend para mayor seguridad
- [ ] Configurar webhooks de Stripe
- [ ] Revisar transacciones recientes

## 🔗 RECURSOS ÚTILES

- [Stripe: API Keys Best Practices](https://stripe.com/docs/keys)
- [Vite: Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Stripe: Webhooks Guide](https://stripe.com/docs/webhooks)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## 📞 CONTACTO DE SOPORTE

Si necesitas ayuda:
- **Stripe Support:** https://support.stripe.com
- **Emergencia de seguridad:** security@stripe.com

---

**NOTA:** Este archivo debe ser revisado y las acciones implementadas **ANTES** de poner la aplicación en producción.
