# 🚀 Nexus Fluent - Guía de Inicio Rápido

## ✅ CAMBIOS RECIENTES IMPLEMENTADOS

### 1. Sistema Anti-Duplicados de Usuarios
- ✅ No se pueden registrar usuarios con el mismo nombre (case-insensitive)
- ✅ No se pueden registrar usuarios con el mismo email
- ✅ Usernames reservados bloqueados: `darckcan`, `admin`, `superadmin`
- ✅ Validación de longitud mínima (usuario: 3, contraseña: 6)
- ✅ Mensajes de error claros y descriptivos

### 2. Configuración para Easy Panel
- ✅ Puerto 80 configurado
- ✅ Nixpacks listo para usar
- ✅ Variables de entorno documentadas
- ✅ Scripts de build optimizados

## 🏃‍♂️ Inicio Rápido

### Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar archivo de variables de entorno (opcional para desarrollo)
cp .env.example .env

# 3. Iniciar en modo desarrollo
npm run dev

# La app estará en http://localhost:5173
```

### Despliegue en Easy Panel

```bash
# 1. Verificar que todo esté listo
chmod +x verificar-sistema.sh
./verificar-sistema.sh

# 2. Seguir la guía completa
cat GUIA_EASYPANEL_USUARIOS.md
```

## 📋 Configuración Rápida en Easy Panel

### Paso 1: Crear Servicio
1. Ve a Easy Panel
2. Click en "Create Service"
3. Selecciona "Git Repository"
4. Conecta tu repo

### Paso 2: Configuración de Build
- **Build Method**: Nixpacks ✅
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run start`
- **Port**: 80

### Paso 3: Variables de Entorno (Opcional - Solo si usas Stripe)
```bash
NODE_ENV=production
PORT=80
HOST=0.0.0.0
VITE_STRIPE_PUBLIC_KEY=pk_live_tu_clave_publica
VITE_STRIPE_SECRET_KEY=sk_live_tu_clave_secreta
```

### Paso 4: Deploy
Click en "Deploy" y espera a que complete.

## 🧪 Probar el Sistema

### Prueba 1: Registro Normal
```
✅ Nombre: Juan Pérez
✅ Email: juan@example.com
✅ Usuario: juanperez
✅ Contraseña: 123456
Resultado: "¡Cuenta creada exitosamente!"
```

### Prueba 2: Usuario Duplicado
```
❌ Usuario: juanperez (ya existe)
Resultado: "❌ Usuario ya registrado"
```

### Prueba 3: Email Duplicado
```
❌ Email: juan@example.com (ya existe)
Resultado: "❌ Correo ya registrado"
```

## 📁 Estructura del Proyecto

```
nexus-fluent/
├── src/
│   ├── components/          # Componentes React
│   │   ├── WelcomeScreen.tsx   # Login/Registro (anti-duplicados ✅)
│   │   ├── Dashboard.tsx       # Panel principal
│   │   └── ...
│   ├── lib/                 # Lógica de negocio
│   │   ├── types.ts           # Tipos TypeScript
│   │   ├── curriculum.ts      # Lecciones y niveles
│   │   ├── stripe-config.ts   # Config de Stripe (env vars ✅)
│   │   └── ...
│   ├── hooks/               # React hooks personalizados
│   └── App.tsx             # Componente principal
├── nixpacks.toml           # Config Easy Panel ✅
├── package.json            # Dependencias (puerto 80 ✅)
└── .env.example            # Template de variables
```

## 🎯 Funcionalidades Principales

### Para Estudiantes
- ✅ Registro con validación anti-duplicados
- ✅ 15 días de prueba gratuita
- ✅ 270+ lecciones (Beginner → C2)
- ✅ Examen de ubicación
- ✅ Sistema de logros y puntos
- ✅ Práctica de vocabulario
- ✅ Certificados por nivel

### Para Profesores
- ✅ Dashboard de alumnos
- ✅ Métricas de progreso
- ✅ Gestión de estudiantes

### Para Super Admin
- ✅ Gestión total de usuarios
- ✅ Control de membresías
- ✅ Estadísticas globales

## 🔐 Seguridad

### Datos Protegidos
- ✅ Contraseñas hasheadas (no se guardan en texto plano)
- ✅ Usernames normalizados (lowercase)
- ✅ Emails normalizados (lowercase)
- ✅ Validación doble antes de guardar

### Variables de Entorno
- ⚠️ Las claves de Stripe deben estar en variables de entorno
- ⚠️ NUNCA commitees archivos .env al repositorio
- ✅ Usa .env.example como template

## 📚 Documentación Completa

- **Guía Easy Panel**: `GUIA_EASYPANEL_USUARIOS.md`
- **Verificación Sistema**: `VERIFICACION_COMPLETA.md`
- **PRD (Product Requirements)**: `PRD.md`

## 🐛 Solución de Problemas

### Problema: Usuario duplicado
**Solución**: La validación ya está implementada. Si ocurre, reporta el caso.

### Problema: Puerto no accesible
**Solución**: Easy Panel maneja el routing automáticamente del puerto 80 interno al dominio público.

### Problema: Variables de entorno no funcionan
**Solución**: 
1. Verifica que empiecen con `VITE_`
2. Reconstruye la app después de cambiarlas
3. Verifica los logs en Easy Panel

### Problema: Build falla
**Solución**:
```bash
# Limpia y reinstala
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🚀 Scripts Disponibles

```bash
npm run dev      # Desarrollo local (puerto 5173)
npm run build    # Build para producción
npm run start    # Inicia servidor producción (puerto 80)
npm run serve    # Alias de start
npm run preview  # Vista previa del build
```

## 🎨 Tecnologías

- **Frontend**: React 19 + TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes**: shadcn/ui
- **Animaciones**: Framer Motion
- **Iconos**: Phosphor Icons
- **Persistencia**: Spark KV (IndexedDB)
- **Pagos**: Stripe
- **Build**: Vite
- **Deploy**: Easy Panel + Nixpacks

## 📞 Soporte

Si tienes problemas:

1. **Verifica el sistema**:
   ```bash
   ./verificar-sistema.sh
   ```

2. **Lee la documentación**:
   - `GUIA_EASYPANEL_USUARIOS.md`
   - `VERIFICACION_COMPLETA.md`

3. **Revisa los logs**:
   - En desarrollo: Consola del navegador
   - En producción: Logs de Easy Panel

## ✨ Próximos Pasos

Después del despliegue:

1. ✅ Verifica que la app esté accesible
2. ✅ Prueba registrar un usuario
3. ✅ Verifica la validación anti-duplicados
4. ✅ Configura Stripe (si aplica)
5. ✅ Revisa logs en busca de errores

---

**✅ Sistema listo para producción**
**🔒 Validación anti-duplicados implementada**
**🚀 Easy Panel + Nixpacks + Puerto 80 configurado**

Para más detalles, consulta `GUIA_EASYPANEL_USUARIOS.md`
