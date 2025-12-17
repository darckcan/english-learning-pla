# 🌟 Nexus Fluent - Plataforma de Aprendizaje de Inglés

Una plataforma integral para aprender inglés en línea, estructurada por niveles (Beginner, A1–C2) con clases secuenciales, ejercicios y evaluaciones.

## 🚀 Características Principales

- ✅ **7 Niveles de Aprendizaje:** Desde Beginner hasta C2
- ✅ **270+ Lecciones Completas:** Con vocabulario, gramática y ejercicios
- ✅ **Sistema de Membresías:** Prueba gratuita de 15 días + planes pagos
- ✅ **Pagos con Stripe:** Integración completa con pasarela de pago
- ✅ **Gamificación:** Puntos, rachas, logros y certificados
- ✅ **Práctica de Vocabulario:** Modo de práctica interactivo
- ✅ **Examen de Ubicación:** Sistema adaptativo para determinar el nivel
- ✅ **Panel de Administración:** Control total para super admin y profesores
- ✅ **Temas Personalizables:** Múltiples temas visuales
- ✅ **Responsive Design:** Optimizado para móviles y tablets

## 📋 Requisitos Previos

- Node.js 20 o superior
- npm o yarn
- Cuenta de Stripe (para pagos)

## 🛠️ Instalación Local

```bash
# Clonar el repositorio
git clone [tu-repositorio]

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5000`

## 🚀 Despliegue en EasyPanel

### ⚠️ Problema Resuelto

El error `EISDIR: illegal operation on a directory` ha sido resuelto. Este error ocurría porque EasyPanel intentaba servir el código fuente directamente sin compilarlo.

### 📦 Solución: 3 Opciones de Despliegue

#### Opción 1: Docker con Node.js (Más simple)

1. En EasyPanel, crea un nuevo servicio Docker
2. Configura:
   ```
   Build Context: .
   Dockerfile: ./Dockerfile
   Port: 3000
   ```
3. Deploy!

#### Opción 2: Docker con Nginx (Más rápido)

1. En EasyPanel, crea un nuevo servicio Docker
2. Configura:
   ```
   Build Context: .
   Dockerfile: ./Dockerfile.nginx
   Port: 80
   ```
3. Deploy!

#### Opción 3: Build Manual

```bash
# Construir localmente
npm run build

# Subir solo la carpeta dist/ a EasyPanel
# Configurar como "Static Site"
```

### 📖 Documentación Detallada

Ver [EASYPANEL_DEPLOYMENT.md](./EASYPANEL_DEPLOYMENT.md) para instrucciones completas y troubleshooting.

## 🔐 Configuración de Variables de Entorno

Aunque esta aplicación usa Spark KV para persistencia (sin necesidad de base de datos externa), debes configurar:

### Variables de Stripe (Obligatorias)

```bash
# No se configuran como variables de entorno
# Se configuran directamente en el código en src/lib/stripe-config.ts
```

**Nota Importante:** Las claves de Stripe YA están configuradas en el código. No necesitas variables de entorno adicionales para el funcionamiento básico.

## 📁 Estructura del Proyecto

```
/workspaces/spark-template/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes shadcn
│   │   ├── Dashboard.tsx   # Panel principal del estudiante
│   │   ├── LandingPage.tsx # Página de inicio
│   │   ├── LessonView.tsx  # Vista de lecciones
│   │   ├── SuperAdminDashboard.tsx
│   │   └── ...
│   ├── lib/                # Lógica de negocio
│   │   ├── curriculum.ts   # Datos del currículo
│   │   ├── stripe-config.ts # Configuración de Stripe
│   │   ├── types.ts        # Tipos TypeScript
│   │   └── ...
│   ├── hooks/              # Hooks personalizados
│   ├── App.tsx             # Componente principal
│   └── index.css           # Estilos globales
├── Dockerfile              # Para despliegue con Node.js
├── Dockerfile.nginx        # Para despliegue con Nginx
├── nginx.conf              # Configuración de Nginx
└── package.json
```

## 👤 Credenciales de Super Admin

```
Usuario: darckcan
Contraseña: M.ario123
```

**⚠️ IMPORTANTE:** Cambia estas credenciales después del primer despliegue.

## 💳 Planes de Membresía

- **Prueba Gratuita:** 15 días
- **Plan Mensual:** $9.99 USD/mes
- **Plan Vitalicio:** $24.99 USD (pago único)

Los precios son configurables desde el panel de Super Admin.

## 🎨 Temas Disponibles

- Colorido
- Alegre
- Tonos Cálidos
- Dark Mode
- Profesional
- Minimalista

## 🧪 Testing

```bash
# Ejecutar tests (si existen)
npm test

# Linting
npm run lint
```

## 📱 Características Móviles

- ✅ Touch optimizado
- ✅ Feedback háptico
- ✅ Animaciones fluidas
- ✅ Zoom corregido para dispositivos móviles
- ✅ Interfaz adaptativa

## 🐛 Solución de Problemas Comunes

### Error: EISDIR en EasyPanel
✅ **Resuelto:** Usa los Dockerfiles proporcionados

### Los datos no persisten
- Verifica que Spark KV esté habilitado
- Confirma que el dominio sea consistente

### Stripe no procesa pagos
- Verifica las claves en `src/lib/stripe-config.ts`
- Confirma que usas las claves de producción (no test)

### La interfaz móvil se ve con mucho zoom
✅ **Resuelto:** El viewport está configurado correctamente en index.html

## 📚 Documentación Adicional

- [EASYPANEL_DEPLOYMENT.md](./EASYPANEL_DEPLOYMENT.md) - Guía de despliegue completa
- [STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md) - Configuración de Stripe
- [PRD.md](./PRD.md) - Documento de requisitos del producto

## 🤝 Soporte

Para problemas o preguntas:
1. Revisa la documentación en este README
2. Consulta EASYPANEL_DEPLOYMENT.md
3. Verifica los logs de la aplicación

## 📄 Licencia

MIT License - Ver LICENSE para más detalles.

## 🎯 Próximos Pasos Después del Despliegue

1. ✅ Cambiar credenciales de super admin
2. ✅ Verificar que Stripe procese pagos correctamente
3. ✅ Probar el flujo completo de registro → examen → lección
4. ✅ Configurar dominio personalizado en EasyPanel
5. ✅ Habilitar HTTPS (Let's Encrypt)
6. ✅ Configurar backups del KV store

---

**¡Listo para aprender inglés! 🚀📚🌟**
