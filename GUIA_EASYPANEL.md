# 🚀 Guía de Despliegue en EasyPanel - Nexus Fluent

## 📋 Requisitos Previos

- Cuenta en EasyPanel
- Repositorio Git con el código (GitHub, GitLab, Bitbucket)
- Docker instalado en el servidor EasyPanel

Este proyecto está configur

1. **Dockerfile** ← **RECOMENDADO PARA ESTE PROYECTO**

## 🔧 Configuración del Proyecto

- `Dockerfile` - Configuración de Docker optimizada co
- `.easypanel






2. Configura:
   - **Source**: Git Repository
   - **Branch**: main (o la rama que uses)
### 3️⃣ Configurar Build

- **Build Method**: Selec

### 4️⃣ Configurar Deployment

- **Port**: `80`
- **Health Check Path**: `/health`
### 5️⃣ Configurar Recursos (Opcion

- **Memory**: 768Mi - 1Gi



NODE_ENV=production


2. EasyPanel automáticamente configurará S

1. Click en **"Deploy"**

## 🔍 Verificación

El proyecto incluye un endpoint de health check
```
Response: "OK"









- Evita operaciones de lectura/escritu

**Verificar**:

- **Memory**: 768Mi - 1Gi
- **CPU**: 0.5 - 1.0

### 6️⃣ Variables de Entorno

Agregar las siguientes variables de entorno:

```env
NODE_ENV=production
```

### 7️⃣ Configurar Dominio

1. En la sección **Domains**, agrega tu dominio personalizado
2. EasyPanel automáticamente configurará SSL con Let's Encrypt

### 8️⃣ Deploy

1. Click en **"Deploy"** o **"Desplegar"**
2. EasyPanel comenzará el proceso de build
3. Espera a que el estado cambie a **"Running"**

## 🔍 Verificación

### Health Check

El proyecto incluye un endpoint de health check:

```
GET /health
Response: "OK"
```

EasyPanel verificará automáticamente este endpoint cada 30 segundos.

### Logs

Revisa los logs en tiempo real en EasyPanel:

1. Ve a tu servicio
2. Click en la pestaña **"Logs"**
3. Verifica que nginx esté corriendo correctamente

## 🐛 Solución de Problemas

### Error: EISDIR: illegal operation on a directory

**Solución**: Este error ha sido resuelto en la nueva configuración del Dockerfile. El proyecto ahora:
- Copia archivos explícitamente en lugar de directorios completos
- Usa nginx para servir archivos estáticos
- Evita operaciones de lectura/escritura en directorios

### Build Falla

**Verificar**:
1. El Dockerfile está en la raíz del proyecto
2. El archivo `.dockerignore` está configurado correctamente
3. Los logs de build en EasyPanel para ver el error específico

### App No Responde

**Verificar**:
1. El puerto está configurado como `80` en EasyPanel
2. El health check endpoint `/health` responde correctamente
3. Los logs de la aplicación no muestran errores

### Recursos Insuficientes

Si la app se reinicia constantemente:
1. Aumenta la memoria asignada a 1Gi
2. Aumenta el CPU a 1.0

## 📊 Monitoreo

### Métricas Disponibles

EasyPanel proporciona:
- CPU usage
- Memory usage
- Network traffic
- Request count
- Response times

### Acceso a Logs

```bash
# Ver logs en tiempo real desde EasyPanel UI
# O usar la CLI de EasyPanel si está disponible
```

## 🔄 Actualizaciones

### Deploy Automático

Configura webhooks en tu repositorio Git para deploy automático:

1. En EasyPanel, ve a tu servicio
2. Copia el webhook URL
3. Agrégalo a tu repositorio Git (Settings → Webhooks)
4. Cada push a la rama configurada disparará un nuevo deploy

### Deploy Manual

1. En EasyPanel, ve a tu servicio
2. Click en **"Redeploy"**
3. Selecciona si quieres rebuild o usar la última imagen

## 🔐 Seguridad

### Headers de Seguridad

El nginx.conf incluye:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy

### SSL/TLS

EasyPanel configura automáticamente SSL con Let's Encrypt para dominios personalizados.

## 📈 Optimizaciones

### Caché

- Assets estáticos cacheados por 1 año
- HTML sin caché (always fresh)
- Gzip compression habilitado

### Performance

- Nginx optimizado para SPAs
- Compresión gzip de assets
- Headers de caché apropiados

## 🆘 Soporte

### Recursos Útiles

- [Documentación de EasyPanel](https://easypanel.io/docs)
- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de Nginx](https://nginx.org/en/docs/)

### Contacto

Si encuentras problemas específicos del proyecto, verifica:
1. Los logs de build en EasyPanel
2. Los logs de runtime de la aplicación
3. El estado del health check

## ✅ Checklist de Despliegue

- [ ] Proyecto creado en EasyPanel
- [ ] Repositorio Git conectado
- [ ] Build method configurado como "Dockerfile"
- [ ] Puerto configurado como 80
- [ ] Health check configurado en /health
- [ ] Variables de entorno configuradas
- [ ] Dominio personalizado agregado (opcional)
- [ ] SSL configurado automáticamente
- [ ] Build completado exitosamente
- [ ] Health check pasando
- [ ] Aplicación accesible desde el navegador

## 🎉 ¡Listo!

Tu aplicación Nexus Fluent debería estar corriendo en EasyPanel. Accede a través del dominio configurado y verifica que todo funcione correctamente.

---

**Versión**: 1.0.0  
**Última actualización**: 2024  
**Método de Build**: Dockerfile con Nginx
2. El archivo `.dockerignore` está configurado correctamente
3. Los logs de build en EasyPanel para ver el error específico

### App No Responde

**Verificar**:
1. El puerto está configurado como `80` en EasyPanel
2. El health check endpoint `/health` responde correctamente
3. Los logs de la aplicación no muestran errores

### Recursos Insuficientes

Si la app se reinicia constantemente:
1. Aumenta la memoria asignada a 1Gi
2. Aumenta el CPU a 1.0

## 📊 Monitoreo

### Métricas Disponibles

EasyPanel proporciona:
- CPU usage
- Memory usage
- Network traffic
- Request count
- Response times

### Acceso a Logs

```bash
# Ver logs en tiempo real desde EasyPanel UI
# O usar la CLI de EasyPanel si está disponible
```

## 🔄 Actualizaciones

### Deploy Automático

Configura webhooks en tu repositorio Git para deploy automático:

1. En EasyPanel, ve a tu servicio
2. Copia el webhook URL
3. Agrégalo a tu repositorio Git (Settings → Webhooks)
4. Cada push a la rama configurada disparará un nuevo deploy

### Deploy Manual

1. En EasyPanel, ve a tu servicio
2. Click en **"Redeploy"**
3. Selecciona si quieres rebuild o usar la última imagen

## 🔐 Seguridad

### Headers de Seguridad

El nginx.conf incluye:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy

### SSL/TLS

EasyPanel configura automáticamente SSL con Let's Encrypt para dominios personalizados.

## 📈 Optimizaciones

### Caché

- Assets estáticos cacheados por 1 año
- HTML sin caché (always fresh)
- Gzip compression habilitado

### Performance

- Nginx optimizado para SPAs
- Compresión gzip de assets
- Headers de caché apropiados

## 🆘 Soporte

### Recursos Útiles

- [Documentación de EasyPanel](https://easypanel.io/docs)
- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de Nginx](https://nginx.org/en/docs/)

### Contacto

Si encuentras problemas específicos del proyecto, verifica:
1. Los logs de build en EasyPanel
2. Los logs de runtime de la aplicación
3. El estado del health check

## ✅ Checklist de Despliegue

- [ ] Proyecto creado en EasyPanel
- [ ] Repositorio Git conectado
- [ ] Build method configurado como "Dockerfile"
- [ ] Puerto configurado como 80
- [ ] Health check configurado en /health
- [ ] Variables de entorno configuradas
- [ ] Dominio personalizado agregado (opcional)
- [ ] SSL configurado automáticamente
- [ ] Build completado exitosamente
- [ ] Health check pasando
- [ ] Aplicación accesible desde el navegador

## 🎉 ¡Listo!

Tu aplicación Nexus Fluent debería estar corriendo en EasyPanel. Accede a través del dominio configurado y verifica que todo funcione correctamente.

---

**Versión**: 1.0.0  
**Última actualización**: 2024  
**Método de Build**: Dockerfile con Nginx
