# Plataforma de Aprendizaje de Inglés

Una plataforma progresiva de aprendizaje de inglés que guía a los estudiantes desde nivel Principiante hasta C2 con lecciones estructuradas, ejercicios interactivos y seguimiento de logros. Todas las instrucciones y explicaciones están en español para facilitar el aprendizaje del inglés.

**Experience Qualities**:
1. **Alentadora** - Crea un ambiente de apoyo que celebra pequeñas victorias y mantiene la motivación a través de rachas y logros
2. **Estructurada** - Proporciona rutas de aprendizaje claras con lecciones secuenciales que se construyen lógicamente
3. **Interactiva** - Involucra a los estudiantes con diversos tipos de ejercicios y retroalimentación inmediata para reforzar la comprensión

**Complexity Level**: Complex Application (funcionalidad avanzada, probablemente con múltiples vistas)
Esta plataforma requiere gestión sofisticada de estado para el progreso del usuario, flujos de lecciones de múltiples pasos, pruebas adaptativas, sistemas de logros y acceso basado en roles. Orquesta múltiples características interconectadas incluyendo progresión de lecciones, evaluación de ejercicios, seguimiento de rachas y avance de nivel. Incluye un super administrador que controla todos los registros y usuarios.

## Essential Features

### Landing Page Principal
- **Functionality**: Página de inicio atractiva y profesional que presenta la plataforma antes del login/registro
- **Purpose**: Causar una primera impresión impactante, motivar el registro y mostrar el valor de la plataforma
- **Trigger**: Inicio de la aplicación cuando no hay usuario logueado
- **Progression**: Landing page → Explorar características → Ver niveles disponibles → Click en "Comenzar Gratis" o "Iniciar Sesión" → Pantalla de login/registro
- **Success criteria**: Diseño moderno y atractivo, animaciones suaves, información clara de características y niveles, call-to-action destacado, responsive en todos los dispositivos

### Super Administrador
- **Functionality**: Usuario maestro con control total sobre el sistema, gestión de usuarios, y configuración
- **Purpose**: Permite administración centralizada y control completo de la plataforma
- **Trigger**: Login con credenciales de super admin (usuario: darckcan, contraseña: M.ario123)
- **Progression**: Login → Panel de super admin → Gestión de usuarios → Crear/Editar/Eliminar usuarios → Desbloquear niveles → Ver estadísticas globales
- **Success criteria**: Super admin puede ver todos los usuarios, crear nuevas cuentas, eliminar usuarios, desbloquear/bloquear niveles para cualquier usuario

## Essential Features

### User Authentication & Onboarding
- **Functionality**: Registro e inicio de sesión con contraseñas, asignación de roles (estudiante/profesor/superadmin), perfil único por usuario, **selección de tema visual durante el registro**, confirmación por correo electrónico
- **Purpose**: Personaliza la experiencia de aprendizaje y rastrea el progreso individual con seguridad, permite personalización visual desde el inicio
- **Trigger**: Lanzamiento de la app o cierre de sesión
- **Progression**: Página de inicio → Registro (nombre completo, email, usuario, contraseña, **selección de tema**) o Login → **Correo de confirmación enviado** → Prueba de ubicación (usuarios nuevos) → Dashboard con **tema personalizado aplicado**
- **Success criteria**: Usuario puede crear cuenta con contraseña, seleccionar tema visual, recibir correo de confirmación, login persiste, información de perfil se guarda, progreso individual se mantiene por usuario, tema se aplica correctamente

### Sistema de Membresías (Nuevo)
- **Functionality**: Sistema completo de membresías con prueba gratuita de 15 días, suscripción mensual ($9.99/mes) y membresía vitalicia ($24.99 pago único). Super admin puede modificar precios. **Incluye sistema automático de notificaciones por email para recordatorios de vencimiento**
- **Purpose**: Monetizar la plataforma mientras se ofrece un período de prueba generoso para que los usuarios exploren antes de comprometerse. Las notificaciones automáticas aseguran que los usuarios no pierdan acceso inesperadamente
- **Trigger**: Registro de nuevo usuario (membresía de prueba automática), vencimiento de membresía, actualización manual, **procesamiento automático de notificaciones cada hora**
- **Progression**: Registro → 15 días de prueba gratuita → **Email enviado automáticamente cuando faltan 7 días** → **Email cuando faltan 3 días** → **Email cuando falta 1 día** → Dashboard muestra opciones de actualización → **Email al expirar la membresía** → Usuario selecciona plan → Membresía actualizada
- **Success criteria**: Nuevos usuarios reciben 15 días de prueba, contador de días restantes visible, **emails automáticos enviados en 7, 3, 1 días y al expirar**, notificaciones cuando faltan 7, 3 y 0 días en el dashboard, acceso bloqueado después de expiración, opciones de compra claramente mostradas ($9.99/mes o $24.99 vitalicio), **sistema de notificaciones puede activarse/desactivarse desde super admin**, **historial completo de emails enviados**

### Sistema de Notificaciones por Email (Nuevo)
- **Functionality**: Sistema automático que envía emails de recordatorio a usuarios cuando su membresía está próxima a vencer o ha expirado. Procesa notificaciones cada hora y envía emails en momentos clave: 7, 3, 1 días antes del vencimiento y al expirar
- **Purpose**: Mantener informados a los usuarios sobre el estado de su membresía, reducir cancelaciones involuntarias y motivar renovaciones oportunas
- **Trigger**: Proceso automático cada hora cuando está activado, o ejecución manual desde el dashboard de super admin
- **Progression**: Sistema verifica membresías → Identifica usuarios que necesitan notificación → Genera email personalizado según días restantes → Envía email → Registra en historial → Evita duplicados en mismo día → Super admin puede ver métricas y historial
- **Success criteria**: Emails se envían automáticamente sin intervención, cada usuario recibe máximo un email por tipo por día, contenido del email es claro y personalizado, incluye información de renovación, super admin puede ver usuarios pendientes de notificación, historial muestra todos los emails enviados con fechas y tipos, sistema puede activarse/desactivarse globalmente, proceso no afecta rendimiento de la aplicación

### Configuración de Precios de Membresías (Super Admin)
- **Functionality**: Panel de super administrador para modificar días de prueba gratuita, precio mensual y precio vitalicio en cualquier momento. **Incluye gestión completa del sistema de notificaciones por email**
- **Purpose**: Permite flexibilidad en la estrategia de precios sin necesidad de modificar código y control total sobre las notificaciones automáticas
- **Trigger**: Super admin accede al panel de administración
- **Progression**: Dashboard super admin → Configuración de membresías → Modificar valores → Vista previa de cambios → Guardar → **Sistema de Notificaciones por Email** → Activar/Desactivar notificaciones automáticas → Ver usuarios pendientes de notificación → Procesar notificaciones manualmente → Ver historial de emails enviados → Nuevos precios aplicados a futuros registros
- **Success criteria**: Super admin puede modificar los 3 valores (días prueba, precio mensual, precio vitalicio), cambios se guardan correctamente, valores se validan (rangos razonables), vista previa muestra configuración actual, **puede activar/desactivar notificaciones automáticas**, **puede ver lista de usuarios que necesitan notificación**, **puede ejecutar proceso de notificaciones manualmente**, **puede ver historial completo de emails enviados con fechas y tipos**, **sistema procesa automáticamente cada hora cuando está activado**

### Sistema de Temas Personalizables (Nuevo)
- **Functionality**: 5 temas visuales disponibles (Morado Vibrante, Colorido Arcoíris, Alegre y Optimista, Tonos Cálidos, Modo Oscuro). Selección durante registro y cambio desde configuración
- **Purpose**: Permite personalización visual según preferencias del usuario, mejora experiencia y accesibilidad
- **Trigger**: Durante registro o desde pestaña de Configuración en dashboard
- **Progression**: Registro → Selector de tema con vista previa de colores → Selección → Tema aplicado → Dashboard (pestaña Configuración) → Cambiar tema → Aplicación instantánea con mensaje de confirmación
- **Success criteria**: 5 temas distintos disponibles, cada tema tiene paleta de colores única y coherente, cambios se aplican instantáneamente, selección se guarda en perfil de usuario, tema persiste entre sesiones

### Sistema de Niveles Bloqueados
- **Functionality**: Los niveles superiores al asignado permanecen bloqueados hasta completar niveles previos
- **Purpose**: Asegura progresión ordenada y evita que estudiantes salten contenido esencial
- **Trigger**: Después de completar el examen de ubicación o al terminar un nivel
- **Progression**: Examen → Nivel asignado (ej: A2) → Beginner y A1 desbloqueados completamente → A2 desbloqueado → B1, B2, C1, C2 bloqueados → Completar A2 → Desbloquear B1
- **Success criteria**: Solo niveles hasta el nivel actual son accesibles, niveles bloqueados muestran icono de candado, niveles se desbloquean progresivamente al completar el anterior

### Placement Test
- **Functionality**: Adaptive assessment that determines starting level based on vocabulary and grammar knowledge
- **Purpose**: Places students at the appropriate difficulty level to maximize learning efficiency
- **Trigger**: First-time user after registration
- **Progression**: Welcome screen → Multiple choice questions (increasing difficulty) → Score calculation → Level assignment → Dashboard
- **Success criteria**: Test adapts to user responses, accurately assigns level, results persist

### Level-Based Curriculum
- **Functionality**: Seven levels (Beginner, A1, A2, B1, B2, C1, C2) each with sequential lessons. **A2 now has 40 complete lessons, B1 has 50 lessons, and B2 has 60 lessons** following the detailed syllabus.
- **Purpose**: Structures learning journey from basic to advanced proficiency with comprehensive coverage of grammar patterns and topics
- **Trigger**: User selects current level from dashboard
- **Progression**: Dashboard → Level overview → Lesson list → Individual lesson → Completion → Next lesson unlocked
- **Success criteria**: Lessons unlock sequentially, completion tracked, level advancement requires finishing all lessons

### Expanded Lesson Structure (New)
- **Functionality**: Each lesson now follows a structured format with 15 vocabulary words, complete grammar explanations, 3-5 exercises, and shadowing text aligned with the official curriculum
- **Purpose**: Provides comprehensive, consistent learning experience across all levels
- **Trigger**: User opens any lesson
- **Progression**: Vocabulary introduction → Grammar explanation → Practice exercises → Shadowing practice → Quiz
- **Success criteria**: All A2 (40), B1 (50), and B2 (60) lessons are complete and accessible, lessons follow curriculum topics (C31-C180)

### Interactive Lessons
- **Functionality**: Lecciones de múltiples secciones cubriendo vocabulario (con audio de pronunciación), gramática, comprensión y producción (instrucciones en español)
- **Purpose**: Enseña habilidades del idioma a través de contenido variado y tipos de ejercicios con apoyo de audio
- **Trigger**: Usuario hace clic en una lección disponible (desbloqueada)
- **Progression**: Intro de lección (objetivo en español) → Sección de vocabulario con botones de audio → Explicación gramatical (en español) con ejemplos hablados → Ejercicios de práctica → Ejercicio de shadowing con reproducción de audio normal y lenta → Quiz → Resultados y actualización de progreso
- **Success criteria**: Contenido se muestra correctamente, ejercicios aceptan entrada, puntuación funciona, progreso se guarda, explicaciones en español son claras, audio funciona en todos los navegadores compatibles

### Audio Pronunciation System
- **Functionality**: Text-to-speech audio playback for vocabulary words, grammar examples, and shadowing exercises with normal and slow speed options
- **Purpose**: Helps students learn correct pronunciation and improve listening comprehension
- **Trigger**: User clicks audio/speaker buttons throughout lessons or in vocabulary practice
- **Progression**: Click audio button → Audio plays with visual feedback (pulsing icon) → Option to replay or use slow speed → Audio stops automatically
- **Success criteria**: Audio pronounces English text correctly with natural accent, slow speed is noticeably slower but still natural, buttons show playing state, works across modern browsers

### Vocabulary Practice Mode
- **Functionality**: Standalone vocabulary review and quiz mode using all words from unlocked lessons with audio support
- **Purpose**: Provides targeted vocabulary reinforcement outside of full lessons
- **Trigger**: User clicks "Vocabulario" button from dashboard
- **Progression**: Dashboard → Vocabulary Practice → Choose Review or Quiz mode → Navigate through vocabulary cards → Listen to pronunciations → Test recall (quiz mode) → Track progress → Return to dashboard
- **Success criteria**: Shows all vocabulary from unlocked levels, audio works for each word, quiz validates answers, progress bar updates, can switch between review and quiz modes

### Exercise Types
- **Functionality**: Multiple choice, fill-in-the-blank, matching, sentence construction, pronunciation practice
- **Purpose**: Reinforces learning through active practice and immediate feedback
- **Trigger**: During lesson flow or practice mode
- **Progression**: Exercise prompt → User input → Validation → Feedback (correct/incorrect with explanation) → Next exercise or summary
- **Success criteria**: All exercise types function, validation accurate, feedback helpful

### Progress Tracking
- **Functionality**: Displays lessons completed, current level, percentage progress, daily streak, total points
- **Purpose**: Motivates continued learning by visualizing advancement and consistency
- **Trigger**: Accessible from dashboard at any time
- **Progression**: Dashboard overview → Detailed stats → Achievement gallery → Level history
- **Success criteria**: Metrics update in real-time, streak increments daily, visual progress indicators accurate

### Achievement System
- **Functionality**: Unlocks badges for milestones (first lesson, 7-day streak, level completion, perfect scores). **NEW: Includes level completion certificates for A2, B1, and B2 with downloadable PDFs.**
- **Purpose**: Gamifies learning to increase engagement and celebrate accomplishments. Certificates provide tangible proof of achievement.
- **Trigger**: Automatically when criteria met (completing all lessons in a certificate-eligible level)
- **Progression**: Achievement unlocked notification → Badge added to profile → Display in achievement gallery → View/download certificate
- **Success criteria**: Achievements trigger correctly, notifications appear, badges persist, certificates are generated with user details and can be downloaded

### Level Completion Certificates (New)
- **Functionality**: Professional certificates awarded for completing all lessons in A2, B1, or B2 levels, featuring completion date, total lessons, average score, and unique certificate ID
- **Purpose**: Provides tangible recognition of achievement and milestone completion
- **Trigger**: Completing the final lesson of A2, B1, or B2 level
- **Progression**: Complete final lesson → Level completion check → Certificate notification → Available in Achievements tab → View certificate → Download as PNG
- **Success criteria**: Certificate awarded only once per level, displays accurate statistics, certificate can be viewed and downloaded, includes unique ID and branding

### Achievement Badges (Enhanced)
- **Functionality**: Visual badges with animated effects for level completions (A2, B1, B2), perfect scores, streaks, and other milestones
- **Purpose**: Creates engaging visual rewards and motivates continued learning
- **Trigger**: Various achievement criteria (level completion, streaks, perfect scores)
- **Progression**: Achievement unlocked → Animated badge appears → Displayed in achievements gallery with unlock date
- **Success criteria**: Badges have unique colors per level, animations work smoothly, unlock dates are tracked

### Daily Streak
- **Functionality**: Counts consecutive days with at least one completed lesson
- **Purpose**: Builds consistent learning habit
- **Trigger**: Completes any lesson
- **Progression**: Lesson completion → Streak check → Increment or reset → Dashboard update → Milestone notification (if 7, 30, 100 days)
- **Success criteria**: Streak increments only once per calendar day, resets after 24hr gap, survives page refresh

### Teacher Dashboard (Simplified)
- **Functionality**: View all student progress, completion rates, and activity
- **Purpose**: Enables monitoring and support
- **Trigger**: Teacher role login
- **Progression**: Login → Teacher dashboard → Student list → Individual student detail → Progress charts
- **Success criteria**: Displays aggregated data, shows recent activity, filters by level

## Edge Case Handling

- **Incomplete Lessons** - Save progress mid-lesson, allow resume from last completed section
- **Streak Breaks** - Show "streak at risk" warning if no activity in 20+ hours, display broken streak with recovery encouragement
- **Level Misplacement** - Allow manual level change by teacher or retake placement test option
- **No Internet During Exercise** - Queue answers locally, sync when reconnected with visual indicator
- **Rapid Clicking** - Debounce submission buttons, disable during processing
- **Empty States** - Show motivational messages when no lessons completed yet, achievement gallery empty, or student list empty
- **Exercise Timeouts** - Auto-save partial progress if user navigates away
- **Concurrent Sessions** - Use KV store as single source of truth, latest write wins

## Design Direction

The design should feel like a personal language tutor - encouraging, organized, and accessible. It should balance professionalism with warmth, using color to indicate progress and success while maintaining clarity. The interface should reduce anxiety around language learning by feeling spacious and uncluttered, with clear visual hierarchies that guide attention to the current learning task. Subtle celebratory moments (achievement unlocks, streak milestones) should feel rewarding without being distracting.

## Color Selection

Una paleta moderna y vibrante que usa morado/violeta para representar el aprendizaje y creatividad, con acentos cálidos para celebración.

- **Primary Color**: Morado Vibrante `oklch(0.58 0.22 270)` - Comunica creatividad, aprendizaje y progreso; usado para CTAs principales e indicadores de progreso
- **Secondary Colors**: 
  - Rosa Suave `oklch(0.72 0.15 310)` - Fondo de apoyo para tarjetas de lecciones e información secundaria
  - Verde Éxito `oklch(0.70 0.15 150)` - Estados de éxito, lecciones completadas, indicadores de racha
- **Accent Color**: Naranja Coral `oklch(0.68 0.20 35)` - Celebraciones de logros, notificaciones de hitos y CTAs importantes
- **Foreground/Background Pairings**: 
  - Primary Purple `oklch(0.58 0.22 270)`: White text `oklch(1 0 0)` - Ratio 5.8:1 ✓
  - Accent Orange `oklch(0.68 0.20 35)`: White text `oklch(1 0 0)` - Ratio 5.2:1 ✓
  - Background `oklch(0.99 0.005 270)`: Dark text `oklch(0.20 0.015 270)` - Ratio 15.1:1 ✓
  - Card `oklch(1 0 0)`: Dark text `oklch(0.20 0.015 270)` - Ratio 16.2:1 ✓

## Font Selection

Typography should feel modern, approachable, and highly legible for extended reading - crucial for language learning content.

- **Primary**: Outfit (headings, UI elements) - A friendly geometric sans with excellent clarity
- **Secondary**: Inter (body text, lesson content) - Optimized for screen reading with clear letterforms

- **Typographic Hierarchy**:
  - H1 (Page Titles): Outfit Bold / 36px / -0.02em letter spacing / 1.1 line height
  - H2 (Section Headers): Outfit Semibold / 28px / -0.01em letter spacing / 1.2 line height
  - H3 (Lesson Titles): Outfit Medium / 20px / 0em letter spacing / 1.3 line height
  - Body (Lesson Content): Inter Regular / 16px / 0em letter spacing / 1.6 line height
  - Caption (Metadata): Inter Medium / 14px / 0.01em letter spacing / 1.4 line height
  - Button: Outfit Semibold / 15px / 0.02em letter spacing / 1

## Animations

Animations should reinforce learning moments and guide attention without creating distraction. Use motion to celebrate achievements (bouncy scales, confetti), smooth transitions between lesson sections (gentle slides), and subtle feedback on interactions (button presses, correct/incorrect indicators). Progress bars should animate fills to make advancement feel tangible. Keep durations quick (200-300ms) except for celebrations (500ms). Reduce motion for accessibility preferences.

## Component Selection

- **Components**: 
  - Navigation: Tabs for level selection, Breadcrumb for lesson navigation
  - Content: Card for lesson containers, Accordion for collapsible grammar explanations, Progress for lesson/level completion
  - Forms: Input for text exercises, RadioGroup for multiple choice, Button for submissions and navigation
  - Feedback: Alert for instructions, Badge for achievements, Sonner toast for success/error notifications
  - Layout: Sheet for mobile menu, Dialog for achievement celebrations and level-up moments
  - Data: Table for teacher dashboard student lists
  
- **Customizations**:
  - LessonCard: Card with progress bar footer, locked/unlocked states, level difficulty indicator
  - ExerciseContainer: Custom component with question counter, timer, skip/hint buttons
  - StreakDisplay: Flame icon with count, pulsing animation, "at risk" warning state
  - AchievementBadge: Custom SVG badges with metallic gradient fills, unlock animation

- **States**:
  - Buttons: Default teal, hover with slight scale and brightness increase, active with pressed shadow, disabled at 40% opacity
  - Inputs: Default with subtle border, focus with primary ring and slight elevation, error with red border and shake animation, success with green border
  - Cards: Default flat, hover with subtle lift shadow, active with border highlight, locked with grayscale filter and lock icon overlay

- **Icon Selection**:
  - Lessons: Book, BookOpen for active lesson
  - Progress: ChartBar, Target for goals
  - Achievements: Trophy, Medal, Star for different badge types
  - Streak: Flame, Fire
  - Levels: TrendingUp, GraduationCap
  - Navigation: House, User, Gear
  - Exercise actions: Check, X, ArrowRight, Lightbulb for hints
  - Social: Chat, Users for teacher view

- **Spacing**:
  - Page padding: p-6 (24px) on mobile, p-8 (32px) on desktop
  - Card internal padding: p-4 (16px) standard, p-6 (24px) for lesson content
  - Section gaps: gap-4 (16px) for related items, gap-6 (24px) between sections, gap-8 (32px) between major page areas
  - Form spacing: space-y-4 for form fields, gap-2 for inline labels
  - Grid spacing: grid with gap-4 for lesson cards

- **Mobile**:
  - Navigation becomes bottom tab bar on mobile with icons only
  - Lesson cards stack vertically in single column
  - Exercise layouts simplify to full-width single-column
  - Teacher dashboard table becomes accordion list with expandable rows
  - Sheet component for settings and profile on mobile vs sidebar on desktop
  - Font sizes reduce slightly (H1: 28px, body: 15px) below 640px
  - Reduce padding to p-4 on mobile for more content space
