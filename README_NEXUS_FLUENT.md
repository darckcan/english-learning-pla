# 🌐 Nexus Fluent - Plataforma de Aprendizaje de Inglés

Plataforma integral para aprender inglés en línea, estructurada por niveles (Beginner, A1–C2) con clases secuenciales, ejercicios y evaluaciones.

## 🚀 Deploy en EasyPanel

Este proyecto está **completamente configurado** para desplegar en EasyPanel usando **Dockerfile**.

### ⚡ Deploy Rápido

1. **Crear proyecto en EasyPanel**: `nexus-fluent`
2. **Conectar repositorio Git**
3. **Seleccionar método de build**: `Dockerfile` ← IMPORTANTE
4. **Configurar puerto**: `80`
5. **Health check path**: `/health`
6. **Click en Deploy** 🚀

### 📖 Documentación de Deploy

- **Guía Rápida**: [`DEPLOY_EASYPANEL.md`](./DEPLOY_EASYPANEL.md)
- **Guía Completa**: [`GUIA_EASYPANEL.md`](./GUIA_EASYPANEL.md)
- **Arquitectura**: [`ARQUITECTURA_EASYPANEL.md`](./ARQUITECTURA_EASYPANEL.md)
- **Resumen**: [`RESUMEN_EASYPANEL.md`](./RESUMEN_EASYPANEL.md)

### ✅ Verificación Pre-Deploy

```bash
chmod +x verificar-easypanel.sh
./verificar-easypanel.sh
```

## 🎯 Características

- **7 Niveles de Aprendizaje**: Beginner, A1, A2, B1, B2, C1, C2
- **270+ Lecciones Completas**: Con vocabulario, gramática y ejercicios
- **Evaluación Adaptativa**: Test de ubicación inicial
- **Gamificación**: Puntos, rachas y logros
- **Membresías**: Sistema de pagos con Stripe
- **Multi-tema**: Temas visuales personalizables
- **Responsive**: Optimizado para móvil y desktop
- **Certificados**: Al completar cada nivel

## 🛠️ Tecnologías

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui v4
- **Build Tool**: Vite 7
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons
- **Payments**: Stripe
- **Deployment**: Docker + Nginx

## 📦 Instalación Local

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔧 Configuración

### Variables de Entorno (Opcional)

```env
NODE_ENV=production
```

### Stripe (Ya configurado)

Las claves de Stripe están configuradas en el código. Para cambiarlas, edita:
- `src/hooks/use-stripe-payment.ts`

## 📊 Estructura del Proyecto

```
nexus-fluent/
├── src/
│   ├── App.tsx                    # Componente principal
│   ├── components/                # Componentes React
│   │   ├── Dashboard.tsx
│   │   ├── LessonView.tsx
│   │   ├── PlacementTest.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── curriculum.ts          # Contenido de lecciones
│   │   ├── types.ts               # TypeScript types
│   │   └── themes.ts              # Temas visuales
│   └── hooks/                     # Custom React hooks
├── Dockerfile                     # Configuración Docker
├── nginx.conf                     # Configuración Nginx
└── package.json                   # Dependencias
```

## 🎨 Temas Disponibles

- Dark Mode
- Colorful
- Warm Tones
- Forest
- Ocean
- Sunset
- Cyberpunk

## 💳 Sistema de Membresías

- **Prueba Gratuita**: 15 días
- **Plan Mensual**: $9.99 USD/mes
- **Plan Vitalicio**: $24.99 USD (una vez)

## 👥 Roles de Usuario

### Estudiante
- Acceso a lecciones según nivel
- Seguimiento de progreso
- Certificados y logros

### Super Administrador
- Gestión completa de usuarios
- Configuración de precios
- Monitoreo de actividad
- **Acceso**: usuario `darckcan`, contraseña `M.ario123`

## 🔒 Seguridad

- Headers de seguridad configurados
- CSP (Content Security Policy)
- XSS Protection
- Frame Options
- HTTPS automático con EasyPanel

## 📈 Performance

- Build optimizado con Vite
- Code splitting automático
- Gzip compression
- Cache de assets estáticos
- Health checks configurados

## 🐛 Troubleshooting

### Error EISDIR (Resuelto)
El proyecto usa un Dockerfile optimizado que evita este error común en EasyPanel.

### Build Falla
1. Verifica que seleccionaste "Dockerfile" como método
2. Revisa los logs de build en EasyPanel
3. Confirma que todos los archivos estén en el repo

### Health Check Falla
1. Verifica que nginx esté corriendo
2. Confirma puerto 80
3. Prueba acceder a `/health`

## 📞 Soporte

Para problemas de deploy:
1. Revisa la documentación en `GUIA_EASYPANEL.md`
2. Ejecuta el script de verificación
3. Revisa los logs en EasyPanel

## 📄 Licencia

MIT License - Copyright GitHub, Inc.

---

**¿Listo para deploy?** → Lee [`DEPLOY_EASYPANEL.md`](./DEPLOY_EASYPANEL.md) y comienza en minutos! 🚀
