# 🌟 Nexus Fluent - Plataforma de Aprendizaje de Inglés

Plataforma completa de aprendizaje de inglés con lecciones estructuradas desde nivel Principiante hasta C2.

## 🚀 Despliegue en EasyPanel

### ⚠️ **IMPORTANTE: Lee esto primero**

**Esta aplicación NO puede funcionar desde un solo archivo HTML.** Es una aplicación React compleja que requiere compilación.

### 📖 Guías de Despliegue

1. **[LEEME_EASYPANEL.md](LEEME_EASYPANEL.md)** - **LEE ESTO PRIMERO** ⭐
   - Guía completa en español
   - 3 métodos diferentes explicados
   - Preguntas frecuentes

2. **[DEPLOY_EASYPANEL_SIMPLE.md](DEPLOY_EASYPANEL_SIMPLE.md)** - Guía técnica resumida

3. **[EASYPANEL_DEPLOYMENT.md](EASYPANEL_DEPLOYMENT.md)** - Documentación detallada

### 🎯 Método Recomendado: GitHub + EasyPanel

```bash
# 1. Sube a GitHub
git init
git add .
git commit -m "Nexus Fluent"
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main

# 2. En EasyPanel:
# - Conecta tu repo de GitHub
# - Build Command: npm install && npm run build
# - Start Command: npx serve -s dist -l 3000
# - Port: 3000
```

### 🛠️ Scripts de Preparación

**Windows:**
```bash
crear-paquete-easypanel.bat
```

**Mac/Linux:**
```bash
chmod +x crear-paquete-easypanel.sh
./crear-paquete-easypanel.sh
```

### 📦 Alternativa: Compilar y subir archivos

```bash
npm install
npm run build
# Sube TODO el contenido de la carpeta dist/ a EasyPanel
```

## 🔐 Credenciales de Super Admin

```
Usuario: darckcan
Contraseña: M.ario123
```

**⚠️ CAMBIAR INMEDIATAMENTE EN PRODUCCIÓN**

## 💳 Integración con Stripe

La aplicación incluye sistema de membresías integrado con Stripe. Ver [STRIPE_INTEGRATION.md](STRIPE_INTEGRATION.md)

## 🏗️ Desarrollo Local

```bash
npm install
npm run dev
```

## 📄 Documentación Adicional

- [PRD.md](PRD.md) - Especificación del producto
- [STRIPE_INTEGRATION.md](STRIPE_INTEGRATION.md) - Configuración de pagos
- [EMAIL_NOTIFICATIONS.md](EMAIL_NOTIFICATIONS.md) - Sistema de emails

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
