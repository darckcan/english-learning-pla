# 🚀 Guía Simple para Desplegar en EasyPanel

## ❗ Aclaración Importante

Esta aplicación es una app React compleja que **NO puede** ejecutarse desde un solo archivo HTML. Necesita:
- Compilación de TypeScript → JavaScript
- Bundling de módulos
- Procesamiento de dependencias (React, Stripe, shadcn/ui, etc.)

## ✅ Solución Más Simple: Usar EasyPanel con GitHub

### Paso 1: Sube tu código a GitHub

```bash
# Si aún no tienes un repositorio
git init
git add .
git commit -m "Nexus Fluent - Plataforma de inglés"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### Paso 2: Configurar en EasyPanel

1. **Crear Nuevo Servicio**
   - Ve a tu proyecto en EasyPanel
   - Click en "Create Service"
   - Selecciona "App"

2. **Conectar GitHub**
   - Selecciona tu repositorio
   - Branch: `main`

3. **Configuración de Build**
   ```
   Build Command: npm install && npm run build
   Start Command: npx serve -s dist -l 3000
   Port: 3000
   ```

4. **Variables de Entorno** (Opcional)
   ```
   NODE_ENV=production
   ```

5. **Hacer Deploy**
   - Click en "Deploy"
   - Espera 5-10 minutos

### Paso 3: Configurar Dominio

1. En EasyPanel → Settings → Domains
2. Agregar tu dominio
3. Habilitar SSL (Let's Encrypt)

## 🎯 Alternativa: Usar Docker (Más Simple)

Si EasyPanel soporta Docker, es aún más fácil:

### Opción A: Nginx (Recomendado)

```yaml
# En EasyPanel:
Service Type: Docker
Dockerfile: Dockerfile.nginx
Port: 80
```

### Opción B: Node.js

```yaml
# En EasyPanel:
Service Type: Docker
Dockerfile: Dockerfile
Port: 3000
```

Ya tienes ambos Dockerfiles configurados en el proyecto.

## ❌ Lo que NO funcionará

- ❌ Subir solo el archivo `index.html`
- ❌ Copiar el código fuente sin compilar
- ❌ Intentar ejecutar archivos `.tsx` directamente

## ✅ Lo que SÍ funcionará

- ✅ Build local + subir carpeta `dist/`
- ✅ Conectar con GitHub + Build automático
- ✅ Docker con Dockerfile.nginx o Dockerfile
- ✅ Usar servicio de hosting para React (Vercel, Netlify, etc.)

## 🆘 Si EasyPanel NO soporta ninguna de estas opciones

Si tu versión de EasyPanel solo permite archivos HTML estáticos, entonces necesitarías:

1. **Compilar localmente:**
   ```bash
   npm install
   npm run build
   ```

2. **Subir TODO el contenido de la carpeta `dist/`** (no solo index.html)
   - dist/index.html
   - dist/assets/ (toda esta carpeta)
   - Y todos los demás archivos generados

3. **Configurar el servidor para SPA routing:**
   - Todas las rutas deben apuntar a index.html
   - (Esto normalmente requiere configuración del servidor)

## 📞 ¿Necesitas Ayuda?

Si no estás seguro de cómo proceder:

1. Verifica qué opciones tiene tu EasyPanel:
   - ¿Soporta GitHub deployments?
   - ¿Soporta Docker?
   - ¿Soporta build commands?
   
2. Según eso, usa la guía correspondiente arriba

## 🎓 Resumen

**No existe una forma de ejecutar esta aplicación desde un único archivo HTML**. Es como intentar comprimir todo un edificio en una sola habitación - la aplicación necesita su estructura completa para funcionar.

La forma más simple es: **GitHub + EasyPanel con build automático**
