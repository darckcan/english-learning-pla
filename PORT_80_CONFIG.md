# ✅ Configuración Puerto 80 - Nexus Fluent

## 🎯 Resumen

La aplicación está completamente configurada para funcionar en el **puerto 80** en todos los entornos.

---

## 📋 Archivos Configurados

### 1. **vite.config.ts** ✅
```typescript
server: {
  host: '0.0.0.0',
  port: 80,
  strictPort: false
},
preview: {
  host: '0.0.0.0',
  port: 80,
  strictPort: false
}
```

### 2. **package.json** ✅
```json
"scripts": {
  "dev": "vite",
  "start": "vite preview --host 0.0.0.0 --port 80",
  "serve": "vite preview --host 0.0.0.0 --port 80"
}
```

### 3. **nginx.conf** ✅
```nginx
server {
    listen 80;
    server_name _;
    # ... configuración completa
}
```

### 4. **Dockerfile** ✅
```dockerfile
# Expone el puerto 80 (EasyPanel default)
EXPOSE 80

# Nginx escucha en puerto 80 por defecto
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🚀 Comandos de Ejecución

### Desarrollo Local
```bash
# El servidor de desarrollo correrá en puerto 80
npm run dev
```
⚠️ **Nota**: En sistemas Linux/Mac puede requerir `sudo` para usar puertos < 1024:
```bash
sudo npm run dev
```

### Producción
```bash
# Build y preview en puerto 80
npm run build
npm run start
```

### Docker (EasyPanel)
```bash
# El contenedor expone automáticamente el puerto 80
docker build -t nexus-fluent .
docker run -p 80:80 nexus-fluent
```

---

## 🌐 EasyPanel Deployment

### Configuración Automática

**Dockerfile Mode** (Recomendado)
- EasyPanel detectará automáticamente el puerto 80
- Nginx sirve la aplicación en puerto 80
- No requiere configuración adicional

**Nixpacks Mode**
- Configurado en `nixpacks.toml` para usar puerto 80
- El comando `npm run start` usa puerto 80

### Variables de Entorno Requeridas

En el panel de EasyPanel, configura:

```env
NODE_ENV=production
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_STRIPE_SECRET_KEY=sk_live_...
```

---

## 🔍 Verificación

### 1. Verificar que el puerto está configurado:
```bash
# En desarrollo
cat vite.config.ts | grep "port: 80"

# En producción (Docker)
cat nginx.conf | grep "listen 80"
```

### 2. Probar localmente:
```bash
npm run build
npm run start
# Acceder a: http://localhost:80
```

### 3. Health Check:
```bash
curl http://localhost:80/health
# Respuesta esperada: OK
```

---

## 📱 Puertos por Entorno

| Entorno | Puerto | Configuración |
|---------|--------|---------------|
| **Desarrollo** | 80 | `vite.config.ts` |
| **Preview** | 80 | `package.json` scripts |
| **Producción (Docker)** | 80 | `nginx.conf` + `Dockerfile` |
| **EasyPanel** | 80 | Auto-detectado |

---

## 🛠️ Troubleshooting

### Problema: "Port 80 already in use"

**Linux/Mac:**
```bash
# Ver qué proceso usa el puerto 80
sudo lsof -i :80

# Matar el proceso
sudo kill -9 <PID>
```

**Windows:**
```powershell
# Ver qué proceso usa el puerto 80
netstat -ano | findstr :80

# Matar el proceso
taskkill /PID <PID> /F
```

### Problema: "Permission denied" en puerto 80

**Solución 1:** Ejecutar con privilegios
```bash
sudo npm run dev
```

**Solución 2:** Usar puerto alternativo temporalmente
```bash
# Modificar vite.config.ts temporalmente a puerto > 1024
# Ejemplo: port: 3000
```

### Problema: EasyPanel no detecta el puerto

**Verificar:**
1. ✅ El `Dockerfile` expone puerto 80: `EXPOSE 80`
2. ✅ Nginx escucha en puerto 80: `listen 80;`
3. ✅ En EasyPanel, el puerto del contenedor está configurado a 80

---

## 📊 Arquitectura de Puertos

```
┌─────────────────────────────────────────────┐
│           Internet / Usuario                │
└─────────────────┬───────────────────────────┘
                  │
                  │ Puerto 80
                  │
┌─────────────────▼───────────────────────────┐
│          EasyPanel Load Balancer            │
│         (Maneja HTTPS/SSL automático)       │
└─────────────────┬───────────────────────────┘
                  │
                  │ Puerto 80
                  │
┌─────────────────▼───────────────────────────┐
│        Docker Container (Nginx)              │
│     Escucha en puerto 80 internamente       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │    Archivos Estáticos (dist/)       │   │
│  │    - HTML, JS, CSS, Assets         │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## ✨ Confirmación Final

✅ **Puerto de desarrollo**: 80  
✅ **Puerto de producción**: 80  
✅ **Puerto Docker/EasyPanel**: 80  
✅ **Nginx configurado**: Puerto 80  
✅ **Health check**: `/health` en puerto 80  

**Estado**: 🟢 Todo configurado correctamente para puerto 80

---

## 📞 Siguiente Paso

Para desplegar en EasyPanel:
1. Commit los cambios
2. Push al repositorio
3. En EasyPanel, seleccionar "Dockerfile" como método de build
4. EasyPanel detectará automáticamente el puerto 80
5. ¡Listo! 🎉
