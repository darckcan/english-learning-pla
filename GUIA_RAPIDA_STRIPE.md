# 🚀 Guía Rápida: Variables de Entorno Stripe

## ✅ ¿Qué se hizo?

Las claves de Stripe se movieron del código a variables de entorno para mayor seguridad.

## 🏠 Desarrollo Local

**No necesitas hacer nada.** El archivo `.env` ya está configurado.

```bash
# Las claves están aquí:
cat .env

# Y funcionan automáticamente al iniciar:
npm run dev
```

## 🌐 Producción (IMPORTANTE)

**Debes configurar las variables en tu plataforma de hosting:**

### EasyPanel
1. Abre tu aplicación en EasyPanel
2. Ve a la pestaña **"Environment"**
3. Agrega estas 2 variables:

```
VITE_STRIPE_PUBLIC_KEY = pk_live_51NLv8cBSxEn7IlGkOJ3sfzOBWdlVkNkpVN7XrJ7v0z8LWxcSf3If43DJpxTWKdLSUF6aNa3cYKlY1IAeFw91fZY0008GleX7lm

VITE_STRIPE_SECRET_KEY = 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
```

4. **Guarda y redeplega**

### Vercel
```bash
vercel env add VITE_STRIPE_PUBLIC_KEY
# Pega: pk_live_51NLv8cBSxEn7IlGkOJ3sfzOBWdlVkNkpVN7XrJ7v0z8LWxcSf3If43DJpxTWKdLSUF6aNa3cYKlY1IAeFw91fZY0008GleX7lm

vercel env add VITE_STRIPE_SECRET_KEY
# Pega: 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
```

### Railway
1. Proyecto → **Variables**
2. Agrega las dos variables
3. Railway redeploya automáticamente

### Netlify
1. Site settings → **Environment variables**
2. Agrega las dos variables
3. Redeplega el sitio

## 🔍 Verificar que Funciona

Después de configurar las variables y deplegar:

1. Abre tu aplicación
2. Intenta hacer una compra de prueba
3. Deberías ser redirigido a Stripe correctamente

## ❌ Errores Comunes

### "VITE_STRIPE_PUBLIC_KEY no está configurada"
**Solución:** Configura la variable en tu plataforma de hosting y redeplega.

### "Error al crear sesión de checkout"
**Solución:** Verifica que ambas variables estén configuradas correctamente.

### Los pagos no funcionan en producción
**Solución:** 
1. Verifica que las variables estén en la plataforma de hosting
2. Asegúrate de haber redeployado después de agregar las variables
3. Revisa la consola del navegador en busca de errores

## 📞 ¿Necesitas Ayuda?

- **Documentación completa:** Ver `STRIPE_ENV_SETUP.md`
- **Resumen de cambios:** Ver `CAMBIOS_SEGURIDAD_STRIPE.md`
- **Stripe Dashboard:** https://dashboard.stripe.com

## 📋 Checklist Rápido

- [x] Claves movidas a `.env` (ya hecho)
- [ ] Variables configuradas en plataforma de hosting
- [ ] Aplicación redeployada
- [ ] Pagos probados en producción
- [ ] Todo funciona correctamente

---

**Tiempo estimado:** 5 minutos  
**Dificultad:** Fácil  
**Estado:** Casi listo, solo faltan las variables en producción
