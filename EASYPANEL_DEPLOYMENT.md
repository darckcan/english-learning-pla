# Guía de Despliegue en EasyPanel para Nexus Fluent

## 🚀 Problema Resuelto

El error `EISDIR: illegal operation on a directory, open '/etc/easypanel/projects/nexus_fluent/nexusfluente/code/src/components/'` ocurría porque EasyPanel intentaba servir el código fuente directamente sin compilarlo.

## ✅ Solución Implementada

Se ha agregado la configuración necesaria para que EasyPanel compile correctamente la aplicación:

### Archivos Agregados:

1. **Dockerfile** - Para construir una imagen Docker optimizada
2. **.dockerignore** - Para excluir archivos innecesarios
3. **.easypanel** - Configuración específica de EasyPanel (si es compatible)

## 📋 Pasos para Desplegar en EasyPanel

### Opción 1: Usando Docker (Recomendado)

1. **En EasyPanel, crea un nuevo servicio Docker**
   - Ve a tu proyecto en EasyPanel
   - Click en "Add Service" → "Docker"
   - Selecciona "Build from Source"

2. **Configura el servicio:**
   ```
   Build Context: .
   Dockerfile Path: ./Dockerfile
   Port: 3000
   ```

3. **Variables de Entorno (si necesitas):**
   ```
   NODE_ENV=production
   ```

4. **Deploy!**
   - Click en "Deploy"
   - Espera a que se construya la imagen (5-10 minutos la primera vez)

### Opción 2: Build Manual y Servir Archivos Estáticos

Si EasyPanel no soporta Docker, puedes hacer build manual:

1. **Localmente, ejecuta:**
   ```bash
   npm install
   npm run build
   ```

2. **Sube solo la carpeta `dist/` a EasyPanel**

3. **Configura EasyPanel para servir archivos estáticos:**
   - En la configuración del servicio
   - Selecciona "Static Site"
   - Directorio raíz: `dist`
   - Index: `index.html`

### Opción 3: Usando Node.js Directamente

1. **En EasyPanel, configura:**
   ```
   Build Command: npm install && npm run build
   Start Command: npx serve -s dist -l $PORT
   ```

2. **Variables de Entorno:**
   ```
   NODE_ENV=production
   PORT=3000
   ```

## 🔧 Verificación Post-Despliegue

Después del despliegue, verifica:

1. ✅ La aplicación carga correctamente
2. ✅ Los archivos estáticos se sirven (CSS, JS, imágenes)
3. ✅ Las rutas funcionan correctamente
4. ✅ El almacenamiento KV persiste datos
5. ✅ Stripe procesa pagos correctamente

## 🐛 Troubleshooting

### Si sigue apareciendo el error EISDIR:

- **Asegúrate de que EasyPanel está ejecutando el build**, no sirviendo el código fuente
- Verifica que el comando de start sea `serve -s dist` o similar
- Confirma que la carpeta `dist` se generó correctamente

### Si la aplicación muestra pantalla en blanco:

- Verifica la consola del navegador para errores
- Asegúrate de que las rutas base estén correctas
- Revisa que todos los assets se carguen correctamente

### Si los datos no persisten:

- Verifica que el almacenamiento KV esté habilitado
- Confirma que el dominio sea consistente

## 📦 Estructura de Producción

```
dist/
├── index.html          # Punto de entrada
├── assets/            # JS, CSS compilados
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [otros assets]
└── [otros archivos]
```

## 🔐 Configuración de Seguridad

Asegúrate de configurar en EasyPanel:

1. **HTTPS habilitado** (Let's Encrypt)
2. **Headers de seguridad:**
   ```
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
   ```

## 📝 Notas Adicionales

- **Tiempo de Build:** ~5-10 minutos primera vez, ~2-3 minutos después
- **Tamaño de la Imagen:** ~150-200 MB
- **Memoria Recomendada:** 512 MB mínimo
- **CPU Recomendado:** 0.5 vCPU mínimo

## 🆘 Soporte

Si tienes problemas con el despliegue:

1. Verifica los logs de EasyPanel
2. Ejecuta `npm run build` localmente para verificar que compile
3. Revisa que todas las dependencias estén en `dependencies` (no en `devDependencies`)
