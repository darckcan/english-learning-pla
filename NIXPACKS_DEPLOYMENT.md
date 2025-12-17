# 🚀 Guía de Despliegue con Nixpacks

## 📋 Qué es Nixpacks

Nixpacks es un sistema de build automático que detecta el lenguaje de tu aplicación y configura el entorno de despliegue. Es compatible con:
- Railway
- Render
- Fly.io
- Y otras plataformas

## ✅ Configuración Implementada

Se ha creado el archivo `nixpacks.toml` en la raíz del proyecto con la siguiente configuración:

```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run start"

[variables]
NODE_ENV = "production"
```

## 🔧 Qué Hace Esta Configuración

### 1. **Setup Phase**
```toml
nixPkgs = ["nodejs_20"]
```
- Instala Node.js versión 20
- Asegura un ambiente consistente

### 2. **Install Phase**
```toml
cmds = ["npm ci"]
```
- Instala dependencias con `npm ci` (más rápido y confiable que `npm install`)
- Usa el `package-lock.json` para instalar versiones exactas

### 3. **Build Phase**
```toml
cmds = ["npm run build"]
```
- Ejecuta el script de build de Vite
- Compila TypeScript a JavaScript
- Genera los archivos estáticos en `/dist`
- Procesa Tailwind CSS

### 4. **Start Command**
```toml
cmd = "npm run start"
```
- Ejecuta `vite preview --host 0.0.0.0 --port 3000`
- Sirve la aplicación en el puerto 3000
- Escucha en todas las interfaces (0.0.0.0) para aceptar conexiones externas

### 5. **Variables de Entorno**
```toml
NODE_ENV = "production"
```
- Establece el entorno como producción
- Optimiza el rendimiento
- Deshabilita herramientas de desarrollo

## 🌐 Despliegue en Diferentes Plataformas

### Railway

1. **Conecta tu Repositorio**
   ```bash
   railway link
   ```

2. **Configura Variables de Entorno** (IMPORTANTE)
   ```bash
   railway variables set VITE_STRIPE_PUBLIC_KEY="pk_live_..."
   railway variables set STRIPE_SECRET_KEY="sk_live_..."
   ```

3. **Despliega**
   ```bash
   railway up
   ```

Railway detectará automáticamente el `nixpacks.toml` y lo usará para el despliegue.

### Render

1. **Crea un Nuevo Web Service**
   - Conecta tu repositorio
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm run start`

2. **Variables de Entorno**
   - Agrega en el panel de Render:
     - `VITE_STRIPE_PUBLIC_KEY`
     - `STRIPE_SECRET_KEY`

3. **Configuración Adicional**
   - Puerto: 3000
   - Node Version: 20

### Fly.io

1. **Inicializa**
   ```bash
   fly launch
   ```

2. **Configura Secrets**
   ```bash
   fly secrets set VITE_STRIPE_PUBLIC_KEY="pk_live_..."
   fly secrets set STRIPE_SECRET_KEY="sk_live_..."
   ```

3. **Despliega**
   ```bash
   fly deploy
   ```

## ⚙️ Scripts de package.json

El archivo `package.json` incluye los siguientes scripts relevantes:

```json
{
  "scripts": {
    "build": "tsc -b --noCheck && vite build",
    "start": "vite preview --host 0.0.0.0 --port 3000",
    "serve": "vite preview --host 0.0.0.0 --port 3000"
  }
}
```

### `build`
- Compila TypeScript
- Ejecuta Vite build
- Genera archivos en `/dist`

### `start` / `serve`
- Sirve la aplicación compilada
- Puerto 3000
- Escucha en todas las interfaces

## 🔍 Verificación de Despliegue

Después de desplegar, verifica:

### 1. Build Exitoso
```bash
# Revisa los logs
railway logs  # Para Railway
fly logs      # Para Fly.io
```

Deberías ver:
```
✓ building client + server bundles...
✓ built in XXXms
```

### 2. Aplicación Corriendo
```bash
curl https://tu-app.railway.app
```

Deberías recibir HTML de tu aplicación.

### 3. Variables de Entorno Configuradas
Verifica en tu plataforma que las variables estén establecidas.

### 4. Funcionalidad de Stripe
- Prueba el flujo de pago completo
- Verifica que la redirección funcione
- Confirma que las membresías se activen

## 🐛 Resolución de Problemas

### Error: "Module not found"
**Causa:** Dependencias no instaladas
**Solución:**
```bash
# Verifica que todas las dependencias estén en package.json
npm install
```

### Error: "Port already in use"
**Causa:** Puerto 3000 ocupado
**Solución:** Nixpacks asignará automáticamente el puerto correcto en producción.

### Error: "Build failed"
**Causa:** Errores de TypeScript
**Solución:**
```bash
# Ejecuta build localmente para ver errores
npm run build
```

### Aplicación no responde
**Causa:** No está escuchando en 0.0.0.0
**Solución:** Ya configurado en los scripts con `--host 0.0.0.0`

### Variables de entorno no funcionan
**Causa:** No están configuradas en la plataforma
**Solución:** Configúralas en el panel de control de tu plataforma

## 🔐 Configuración de Seguridad

### ⚠️ IMPORTANTE: Variables de Entorno

Antes de desplegar, **DEBES** modificar `/src/lib/stripe-config.ts`:

**ANTES (INSEGURO):**
```typescript
export const STRIPE_CONFIG = {
  publicKey: 'pk_live_51NLv8cBSxEn7IlGk...',
  secretKey: 'sk_live_51NLv8cBSxEn7IlGk...'
}
```

**DESPUÉS (SEGURO):**
```typescript
export const STRIPE_CONFIG = {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  secretKey: import.meta.env.STRIPE_SECRET_KEY || ''
}
```

Luego configura las variables en tu plataforma de despliegue.

## 📊 Comparación: Nixpacks vs Docker

### Nixpacks ✅
**Ventajas:**
- Configuración mínima
- Build automático
- Rápido de configurar
- Ideal para Node.js

**Desventajas:**
- Menos control
- Limitado a tecnologías soportadas

### Docker 🐳
**Ventajas:**
- Control total
- Reproducible en cualquier lugar
- Soporte para tecnologías complejas

**Desventajas:**
- Requiere Dockerfile
- Más complejo de configurar
- Builds más lentos

### ¿Cuándo usar cada uno?

**Usa Nixpacks si:**
- Quieres desplegar rápido
- Tu stack es Node.js + Vite + React
- No necesitas configuración compleja

**Usa Docker si:**
- Necesitas control total
- Tienes dependencias complejas
- Quieres reproducir el ambiente exacto

## 📁 Estructura de Archivos Relevantes

```
/
├── nixpacks.toml          # ← Configuración de Nixpacks
├── package.json           # Scripts de build y start
├── vite.config.ts         # Configuración de Vite
├── tsconfig.json          # Configuración de TypeScript
├── Dockerfile             # Alternativa con Docker
├── .dockerignore          # Archivos a ignorar en Docker
└── src/
    └── lib/
        └── stripe-config.ts  # ⚠️ Modificar para usar env vars
```

## 🚀 Despliegue Rápido (Quick Start)

### Opción 1: Railway (Recomendado)

```bash
# 1. Instala Railway CLI
npm install -g railway

# 2. Inicia sesión
railway login

# 3. Crea proyecto
railway init

# 4. Configura variables
railway variables set VITE_STRIPE_PUBLIC_KEY="pk_live_..."
railway variables set STRIPE_SECRET_KEY="sk_live_..."

# 5. Despliega
railway up
```

### Opción 2: Render

1. Ve a https://render.com
2. Click "New +" → "Web Service"
3. Conecta tu repositorio
4. Render detectará automáticamente la configuración
5. Agrega variables de entorno
6. Click "Create Web Service"

### Opción 3: Fly.io

```bash
# 1. Instala Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Inicia sesión
fly auth login

# 3. Lanza la app
fly launch

# 4. Configura secrets
fly secrets set VITE_STRIPE_PUBLIC_KEY="pk_live_..."
fly secrets set STRIPE_SECRET_KEY="sk_live_..."

# 5. Despliega
fly deploy
```

## 📈 Monitoreo Post-Despliegue

### Logs en Tiempo Real

**Railway:**
```bash
railway logs
```

**Fly.io:**
```bash
fly logs
```

**Render:**
Ve al dashboard → Logs tab

### Métricas

Monitorea:
- CPU usage
- Memoria
- Requests por minuto
- Errores
- Latencia

### Alertas

Configura alertas para:
- Aplicación caída
- Alto uso de recursos
- Errores de Stripe
- Latencia elevada

## 🔄 Actualizaciones

Para actualizar tu aplicación desplegada:

```bash
# 1. Haz tus cambios
git add .
git commit -m "Update feature X"

# 2. Push a tu repositorio
git push origin main

# 3. La plataforma re-desplegará automáticamente
```

## 📚 Recursos Adicionales

- [Nixpacks Documentation](https://nixpacks.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Fly.io Documentation](https://fly.io/docs)
- [Vite Production Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Checklist Final

Antes de considerar el despliegue completo:

- [ ] Archivo `nixpacks.toml` creado
- [ ] Variables de entorno configuradas en la plataforma
- [ ] Claves de Stripe movidas a variables de entorno
- [ ] Build local exitoso (`npm run build`)
- [ ] Scripts de start funcionan (`npm run start`)
- [ ] Dominio personalizado configurado (opcional)
- [ ] SSL/HTTPS habilitado
- [ ] Webhooks de Stripe configurados (para producción)
- [ ] Monitoreo y alertas configurados
- [ ] Backup de base de datos (si aplica)

---

**Última actualización:** $(date)
**Método de despliegue:** Nixpacks
**Puerto:** 3000
**Node Version:** 20
