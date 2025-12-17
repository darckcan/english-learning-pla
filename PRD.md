# Planning Guide

Una plataforma completa de aprendizaje de inglés en línea con currículo estructurado desde Beginner hasta C2, sistema de membresías, certificados, y herramientas de administración para profesores y superadmins.

**Experience Qualities**:
1. **Professional** - Interfaz limpia y organizada que transmite seriedad educativa y confiabilidad
2. **Engaging** - Experiencia interactiva con feedback inmediato, animaciones suaves y sistema de logros que motiva
3. **Accessible** - Diseño mobile-first responsive que funciona perfectamente en todos los dispositivos

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
Esta es una plataforma educativa completa con múltiples roles de usuario, sistema de progreso, integración de pagos, generación de certificados, práctica de audio, y dashboards administrativos.

## Essential Features

### Sistema de Lecciones Completo
- **Functionality**: Currículo progresivo de 275 lecciones desde Beginner hasta C2
- **Purpose**: Proporcionar educación estructurada siguiendo el Marco Común Europeo de Referencia
- **Trigger**: Usuario selecciona una lección desde el dashboard
- **Progression**: Seleccionar lección → Introducción → Vocabulario (con audio) → Gramática → Ejercicios → Shadowing → Completar
- **Success criteria**: El usuario completa lecciones, obtiene puntos, y progresa a través de los niveles

### Sistema de Audio Interactivo
- **Functionality**: Pronunciación de palabras, ejemplos y frases completas usando Web Speech API
- **Purpose**: Mejorar pronunciación y comprensión auditiva del inglés
- **Trigger**: Usuario hace clic en botones de audio en vocabulario, gramática o shadowing
- **Progression**: Click botón → Audio reproduce texto → Usuario puede repetir
- **Success criteria**: Audio se reproduce correctamente para palabras individuales, ejemplos completos y frases de shadowing

### Práctica de Shadowing
- **Functionality**: Cada lección incluye 5 frases completas con traducción y audio en velocidad normal/lenta
- **Purpose**: Desarrollar fluidez y pronunciación natural
- **Trigger**: Usuario llega a la sección de shadowing en una lección
- **Progression**: Escuchar frase → Repetir en voz alta → Practicar varias veces → Cambiar velocidad si necesario
- **Success criteria**: Usuario puede escuchar, entender y practicar frases completas en todos los niveles

### Sistema de Membresías con Stripe
- **Functionality**: Trial (15 días gratuitos), Monthly ($9.99/mes), Lifetime ($24.99 pago único) con integración completa de Stripe Checkout
- **Purpose**: Monetizar la plataforma mientras se ofrece acceso de prueba generoso
- **Trigger**: Usuario se registra (trial automático) o hace clic en "Suscribirse"/"Comprar" desde Dashboard
- **Progression**: Registro → Trial automático (15 días) → Dashboard Config tab → Modal de selección → Stripe Checkout → Pago exitoso → Redirección → Verificación automática → Membresía activada → Toast de confirmación
- **Success criteria**: 
  - ✅ Trial se crea automáticamente al registrarse
  - ✅ Modal de pago muestra ambos planes con precios correctos
  - ✅ Usuario es redirigido a Stripe Checkout
  - ✅ Pago se procesa correctamente en Stripe
  - ✅ Usuario regresa a la app con parámetros de éxito
  - ✅ Sistema verifica el pago con Stripe API
  - ✅ Membresía se actualiza en el perfil del usuario
  - ✅ Transacción se registra en el historial
  - ✅ Usuario recibe notificación de activación
  - ✅ Dashboard de admin muestra estadísticas correctas

### Sistema de Logros y Certificados
- **Functionality**: Badges por rachas, completar niveles, obtener puntuaciones altas + Certificados PDF para A2, B1, B2
- **Purpose**: Motivar continuidad y reconocer logros académicos
- **Trigger**: Usuario completa lecciones, mantiene rachas, o completa un nivel
- **Progression**: Lograr hito → Sistema detecta → Badge/Certificado otorgado → Notificación → Ver en perfil
- **Success criteria**: Logros se otorgan correctamente, certificados se generan con nombre/fecha/nivel, pueden descargarse

### Dashboard de Profesor
- **Functionality**: Vista de todos los estudiantes, progreso individual, gestión de usuarios
- **Purpose**: Permitir a profesores monitorear y ayudar a sus estudiantes
- **Trigger**: Profesor inicia sesión con rol "teacher"
- **Progression**: Login → Ver lista estudiantes → Seleccionar estudiante → Ver progreso detallado
- **Success criteria**: Profesores pueden ver métricas de progreso, lecciones completadas, y puntuaciones

### Dashboard de Superadmin
- **Functionality**: Control total - gestión de usuarios, configuración de membresías, pagos, notificaciones
- **Purpose**: Administración completa de la plataforma
- **Trigger**: Superadmin inicia sesión con rol "superadmin"
- **Progression**: Login → Acceso a panel completo → Gestionar usuarios/membresías/configuración
- **Success criteria**: Superadmin puede crear/editar/eliminar usuarios, configurar el sistema, ver estadísticas

### Práctica de Vocabulario
- **Functionality**: Modo de revisión y quiz de todo el vocabulario desbloqueado
- **Purpose**: Reforzar retención de vocabulario aprendido
- **Trigger**: Usuario selecciona "Vocabulary Practice" desde el dashboard
- **Progression**: Acceder práctica → Elegir modo (review/quiz) → Ver palabra/ejemplo → Audio → Siguiente
- **Success criteria**: Usuario puede repasar y probar su conocimiento de vocabulario de todos los niveles desbloqueados

## Edge Case Handling
- **No membresía activa**: Usuario puede acceder solo a trial, se muestra alerta de expiración
- **Audio no disponible**: Sistema detecta si navegador no soporta Web Speech API y muestra mensaje
- **Lecciones no desbloqueadas**: Usuario solo ve niveles desbloqueados según placement test o progreso
- **Errores de pago Stripe**: Sistema captura errores y permite reintentar
- **Certificado sin completar nivel**: Solo se genera si 100% de lecciones están completas
- **Rachas rotas**: Sistema calcula diferencia de días y resetea racha si pasa > 1 día
- **Datos de progreso corruptos**: Sistema usa valores por defecto y registra error
- **Navegador sin localStorage**: useKV maneja persistencia, fallback a estado temporal
- **Respuestas de ejercicios con espacios/mayúsculas**: Sistema normaliza respuestas (trim, toLowerCase)
- **Usuario sin email**: Sistema permite pero desactiva notificaciones por email

## Design Direction
Profesional pero accesible, evocando confianza educativa con toques de gamificación. El diseño debe sentirse como una plataforma de aprendizaje seria pero motivadora, con colores suaves que no cansan, animaciones que deleitan sin distraer, y una jerarquía visual clara que guía al estudiante.

## Color Selection

Una paleta morada/púrpura suave que comunica creatividad y conocimiento.

- **Primary Color**: oklch(0.50 0.08 270) - Púrpura medio para acciones principales, transmite profesionalismo educativo
- **Secondary Colors**: 
  - oklch(0.65 0.05 270) - Púrpura claro para elementos secundarios
  - oklch(0.96 0.008 270) - Casi blanco con tinte púrpura para fondos suaves
- **Accent Color**: oklch(0.55 0.15 270) - Púrpura vibrante para CTAs, logros y elementos interactivos importantes
- **Destructive**: oklch(0.55 0.20 25) - Rojo cálido para acciones destructivas
- **Foreground/Background Pairings**: 
  - Background (Light Purple oklch(0.98 0.005 270)): Dark text oklch(0.25 0.01 270) - Ratio 14.8:1 ✓
  - Card (White oklch(1 0 0)): Primary text oklch(0.50 0.08 270) - Ratio 7.8:1 ✓
  - Accent (Purple oklch(0.55 0.15 270)): White text oklch(1 0 0) - Ratio 5.4:1 ✓
  - Primary (Purple oklch(0.50 0.08 270)): White text oklch(1 0 0) - Ratio 7.8:1 ✓

## Font Selection

Tipografía moderna y legible - Inter para contenido general (excelente legibilidad en pantallas) y JetBrains Mono para elementos técnicos o código.

- **Typographic Hierarchy**:
  - H1 (Títulos principales): Inter Bold/32px/tight spacing
  - H2 (Subtítulos): Inter SemiBold/24px/normal spacing
  - H3 (Secciones): Inter SemiBold/20px/normal spacing
  - Body (Texto general): Inter Regular/16px/relaxed leading (1.6)
  - Small (Texto secundario): Inter Regular/14px/relaxed leading
  - Lesson Content: Inter Regular/16px/leading-relaxed para facilitar lectura
  - Buttons: Inter Medium/16px/normal spacing
  - Labels: Inter Medium/14px/tight spacing

## Animations

Animaciones suaves y funcionales usando Framer Motion - transiciones entre páginas que dan contexto espacial, feedback micro-interactivo en botones y cards, y celebraciones visuales para logros sin interrumpir el flujo de aprendizaje.

- Transiciones de página con AnimatePresence (300-350ms con easing suave)
- Hover states en cards y botones (150-200ms)
- Feedback háptico en interacciones importantes (usando vibration API cuando disponible)
- Animaciones de logro con bounce y scale (600ms)
- Progress bars con transiciones animadas (400ms)
- Skeleton loaders para estados de carga
- Toast notifications con slide-in desde arriba
- Modal dialogs con fade + scale para entrada/salida

## Component Selection

- **Components**: 
  - Card (shadcn) para lecciones, vocabulario, estadísticas
  - Button (shadcn) con variantes primary, secondary, outline, ghost
  - Input, Textarea (shadcn) para formularios de registro/login
  - RadioGroup (shadcn) para ejercicios de múltiple opción
  - Progress (shadcn) para mostrar avance en lecciones y niveles
  - Badge (shadcn) para niveles, tipos de vocabulario, estados
  - Dialog/Modal (shadcn) para placement test, configuración, certificados
  - Tabs (shadcn) para organizar secciones en dashboards
  - Avatar (shadcn) para perfiles de usuario
  - Sonner (toast library) para notificaciones
  - Custom: PronunciationButton (audio playback con iconos de speaker)
  - Custom: AchievementBadge (muestra logros con animación)
  - Custom: LevelCertificate (genera y descarga certificados PDF)
  - Custom: MembershipStatus (muestra estado de membresía)

- **Customizations**: 
  - PronunciationButton con prop `type` (word/example/sentence) para diferentes velocidades
  - Cards de vocabulario con audio buttons integrados
  - Progress bars con colores personalizados según nivel
  - Certificate generator usando html-to-image
  - Theme system con múltiples paletas seleccionables

- **States**: 
  - Buttons: default, hover (lift + shadow), active (pressed), loading (spinner), disabled (opacity 50%)
  - Cards: default, hover (shadow increase), selected (border accent)
  - Audio buttons: idle (speaker icon), playing (animated pulse), disabled
  - Progress: animado cuando cambia valor
  - Badges: diferentes colores por nivel (Beginner=green, A1/A2=blue, B1/B2=purple, C1/C2=orange)

- **Icon Selection**: 
  - @phosphor-icons/react library
  - SpeakerHigh/SpeakerSimpleHigh para audio
  - CheckCircle/XCircle para feedback de ejercicios
  - Trophy/Medal para logros
  - Book/BookOpen para lecciones
  - ArrowLeft/ArrowRight para navegación
  - Lightbulb para hints
  - Fire para rachas
  - Certificate para certificados

- **Spacing**: 
  - Card padding: p-6 (desktop), p-4 (tablet), p-3 (mobile)
  - Section gaps: space-y-6 (desktop), space-y-4 (mobile)
  - Button padding: px-6 py-3 (lg), px-4 py-2 (default), px-3 py-1.5 (sm)
  - Container max-width: max-w-4xl para contenido, max-w-7xl para dashboards

- **Mobile**: 
  - Stack vertically con full-width en mobile
  - Touch targets mínimo 44x44px
  - Font sizes aumentados en inputs (16px) para prevenir zoom en iOS
  - Cards con padding reducido (p-3 vs p-6)
  - Navegación bottom-sheet style en móvil
  - Audio buttons más grandes en móvil
  - Sticky headers para contexto en scroll
  - Gestures: swipe para cambiar entre vocabulary items
