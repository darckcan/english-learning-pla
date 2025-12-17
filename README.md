# 🌟 Nexus Fluent - Plataforma de Aprendizaje de Inglés

![Status](https://img.shields.io/badge/Status-Producción-success)
![Puerto](https://img.shields.io/badge/Puerto-80-blue)
![Easy%20Panel](https://img.shields.io/badge/Deploy-Easy%20Panel-orange)
![Nixpacks](https://img.shields.io/badge/Build-Nixpacks-purple)

**Plataforma completa de aprendizaje de inglés con 270+ lecciones desde nivel Beginner hasta C2**

---

## 🎯 ÚLTIMAS ACTUALIZACIONES

### ✅ Problemas Resueltos (Última actualización)

#### 1. ✅ Usuarios Duplicados - SOLUCIONADO
- **Validación robusta** de username único (case-insensitive)
- **Validación robusta** de email único (case-insensitive)
- **Usernames reservados** bloqueados (`darckcan`, `admin`, `superadmin`)
- **Validación de longitud** (username ≥ 3, password ≥ 6)
- **Doble verificación** antes de guardar datos

#### 2. ✅ Despliegue Easy Panel - CONFIGURADO
- **Puerto 80** configurado y funcionando
- **Nixpacks** optimizado para build rápido
- **Variables de entorno** documentadas
- **Scripts** de build y start listos

---

## 🚀 INICIO RÁPIDO

### 📖 EMPIEZA AQUÍ

| ¿Qué necesitas? | Lee este documento |
|-----------------|-------------------|
| 🆕 Primera vez | [`INICIO_RAPIDO.md`](./INICIO_RAPIDO.md) |
| 🚀 Desplegar en Easy Panel | [`GUIA_EASYPANEL_USUARIOS.md`](./GUIA_EASYPANEL_USUARIOS.md) |
| ✅ Verificar sistema | [`VERIFICACION_COMPLETA.md`](./VERIFICACION_COMPLETA.md) |
| 📚 Índice completo | [`README_PRINCIPAL.md`](./README_PRINCIPAL.md) |

### ⚡ Comandos Rápidos

```bash
# Desarrollo local
npm install
npm run dev
# → http://localhost:5173

# Build para producción
npm run build
npm run start
# → http://localhost:80

# Verificar sistema
chmod +x verificar-sistema.sh
./verificar-sistema.sh
```

---

## 🎓 CARACTERÍSTICAS PRINCIPALES

### Para Estudiantes
- ✅ **270+ lecciones** desde Beginner hasta C2
- ✅ **Examen de ubicación** personalizado
- ✅ **15 días de prueba gratuita**
- ✅ **Sistema de puntos y logros**
- ✅ **Certificados por nivel**
- ✅ **Práctica de vocabulario**
- ✅ **Shadowing con audio nativo**
- ✅ **Ejercicios interactivos**

### Para Profesores
- ✅ **Dashboard de alumnos**
- ✅ **Métricas de progreso**
- ✅ **Gestión de estudiantes**

### Para Administradores
- ✅ **Gestión total de usuarios**
- ✅ **Control de membresías**
- ✅ **Estadísticas globales**
- ✅ **Panel de pagos**

---

## 🏗️ ESTRUCTURA DEL PROYECTO

```
nexus-fluent/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── WelcomeScreen.tsx      # 🔐 Login/Registro (anti-duplicados)
│   │   ├── Dashboard.tsx          # 📊 Panel principal
│   │   ├── LessonView.tsx         # 📖 Vista de lecciones
│   │   └── ...
│   ├── 📁 lib/
│   │   ├── types.ts               # 📝 Tipos TypeScript
│   │   ├── curriculum.ts          # 📚 270+ lecciones
│   │   ├── stripe-config.ts       # 💳 Stripe (variables env)
│   │   └── ...
│   ├── 📁 hooks/
│   └── App.tsx
├── 📄 nixpacks.toml               # ⚙️ Config Easy Panel
├── 📄 package.json                # 📦 Deps (puerto 80)
└── 📄 .env.example                # 🔐 Template variables
```

---

## 🔐 SEGURIDAD

### ✅ Implementado
- **Contraseñas hasheadas** (no texto plano)
- **Validación anti-duplicados** (username y email)
- **Normalización** de datos (lowercase)
- **Variables de entorno** para claves sensibles
- **Doble verificación** antes de guardar

### ⚠️ Variables de Entorno Requeridas (Producción)

```bash
# .env (NO COMMITEAR - ya está en .gitignore)
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_STRIPE_SECRET_KEY=sk_live_...
```

---

## 📋 DESPLIEGUE EN EASY PANEL

### Opción 1: Nixpacks (Recomendado) ✅

1. **Conecta tu repositorio**
2. **Configuración**:
   - Build Method: **Nixpacks**
   - Port: **80**
   - Variables: Ver [`.env.example`](./.env.example)
3. **Deploy** → Easy Panel usa automáticamente `nixpacks.toml`

### Verificación del Sistema

```bash
./verificar-sistema.sh
```

**Salida esperada:**
```
✅ nixpacks.toml encontrado
✅ Script 'start' configurado para puerto 80
✅ Validación de usuarios duplicados implementada
✅ Puerto 80 configurado en nixpacks.toml
```

---

## 🧪 PRUEBAS

### Validación Anti-Duplicados

```bash
# Prueba 1: Registrar usuario nuevo
✅ Username: juan
✅ Email: juan@test.com
Resultado: "¡Cuenta creada exitosamente!"

# Prueba 2: Intentar duplicar username
❌ Username: juan (o JUAN)
Resultado: "❌ Usuario ya registrado"

# Prueba 3: Intentar duplicar email
❌ Email: juan@test.com
Resultado: "❌ Correo ya registrado"
```

---

## 🛠️ TECNOLOGÍAS

| Categoría | Tecnología |
|-----------|-----------|
| Frontend | React 19 + TypeScript |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui |
| Animaciones | Framer Motion |
| Iconos | Phosphor Icons |
| Persistencia | Spark KV (IndexedDB) |
| Pagos | Stripe |
| Build | Vite |
| Deploy | Easy Panel + Nixpacks |

---

## 📚 DOCUMENTACIÓN COMPLETA

### 🎯 Esenciales
- [`INICIO_RAPIDO.md`](./INICIO_RAPIDO.md) - Guía de inicio rápido
- [`GUIA_EASYPANEL_USUARIOS.md`](./GUIA_EASYPANEL_USUARIOS.md) - Deploy en Easy Panel
- [`VERIFICACION_COMPLETA.md`](./VERIFICACION_COMPLETA.md) - Verificación del sistema
- [`README_PRINCIPAL.md`](./README_PRINCIPAL.md) - Índice completo

### 🔧 Técnicos
- [`PRD.md`](./PRD.md) - Product Requirements
- [`ARQUITECTURA_EASYPANEL.md`](./ARQUITECTURA_EASYPANEL.md) - Arquitectura
- [`PORT_80_CONFIG.md`](./PORT_80_CONFIG.md) - Config puerto 80

### 🔐 Seguridad y Pagos
- [`STRIPE_ENV_SETUP.md`](./STRIPE_ENV_SETUP.md) - Setup Stripe seguro
- [`SECURITY.md`](./SECURITY.md) - Prácticas de seguridad

---

## 🐛 SOLUCIÓN DE PROBLEMAS

| Problema | Solución |
|----------|----------|
| Usuario duplicado | Ver [`VERIFICACION_COMPLETA.md`](./VERIFICACION_COMPLETA.md) - Ya resuelto ✅ |
| Puerto no accesible | Ver [`PORT_80_CONFIG.md`](./PORT_80_CONFIG.md) |
| Build falla | `rm -rf node_modules && npm install && npm run build` |
| Stripe no funciona | Ver [`STRIPE_ENV_SETUP.md`](./STRIPE_ENV_SETUP.md) |
| Datos no se guardan | Ver [`CORRECCIONES_GUARDADO.md`](./CORRECCIONES_GUARDADO.md) |

---

## ✅ CHECKLIST DE PRODUCCIÓN

- [x] Sistema anti-duplicados de usuarios
- [x] Puerto 80 configurado
- [x] Nixpacks optimizado
- [x] Variables de entorno documentadas
- [x] Stripe con variables de entorno
- [x] Persistencia de datos verificada
- [x] Guías de despliegue completas
- [x] Sistema de pruebas documentado

---

## 📞 SOPORTE

1. **Verificar sistema**: `./verificar-sistema.sh`
2. **Leer documentación**: [`README_PRINCIPAL.md`](./README_PRINCIPAL.md)
3. **Revisar logs**: En Easy Panel → Settings → Logs

---

## 📄 LICENCIA

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

---

**✨ Sistema completo y listo para producción**

**🔒 Sin usuarios duplicados**
**🚀 Easy Panel + Nixpacks + Puerto 80**
**💳 Stripe integrado de forma segura**
**📱 Optimizado para móvil con 270+ lecciones**
