# Certificados y Insignias de Nivel

## Resumen de Características

Este documento describe el nuevo sistema de certificados y insignias de logros implementado para los niveles A2, B1 y B2.

## Certificados de Nivel

### Niveles Elegibles
Los estudiantes pueden obtener certificados profesionales al completar **todos** los lessons de los siguientes niveles:
- **A2** (40 lecciones completas)
- **B1** (50 lecciones completas) 
- **B2** (60 lecciones completas)

### Características del Certificado
Cada certificado incluye:
- Nombre completo del estudiante
- Nivel completado con título descriptivo
- Número total de lecciones completadas
- Puntuación promedio del nivel
- Fecha de finalización
- ID único del certificado (formato: `NIVEL-USERID`)
- Diseño profesional con colores únicos por nivel
- Sello oficial de LearnEnglish Platform

### Cómo Funciona
1. **Detección Automática**: Al completar la última lección de un nivel elegible (A2, B1 o B2), el sistema automáticamente:
   - Calcula el promedio de puntuación del nivel
   - Genera los datos del certificado
   - Guarda el certificado en el perfil del usuario
   - Muestra una notificación de felicitación

2. **Visualización**: Los estudiantes pueden ver sus certificados en:
   - Dashboard → Pestaña "Logros" → Sección "Certificados de Nivel"
   
3. **Descarga**: Los certificados se pueden descargar como imágenes PNG de alta calidad para compartir o imprimir.

## Sistema de Insignias

### Tipos de Insignias

#### Insignias de Certificación de Nivel
- **Diseño**: Icono de gorro de graduación con color específico del nivel
- **Niveles**: A2 (naranja), B1 (morado), B2 (azul)
- **Animación**: Efecto de desbloqueo con rotación y escalado
- **Badge del nivel**: Muestra el código del nivel en una insignia pequeña

#### Insignias de Logros Generales
- **Puntuación Perfecta**: Estrella dorada - obtener 100% en una lección
- **Racha**: Llama - mantener días consecutivos de estudio
- **Todas las Lecciones**: Libro abierto - completar múltiples lecciones
- **Aprendiz Rápido**: Rayo - completar lecciones rápidamente

### Visualización de Insignias
Las insignias se muestran en la sección de Logros con:
- Animación de entrada escalonada
- Efectos de hover y escala
- Fecha de desbloqueo
- Descripción del logro
- Gradientes y colores únicos por tipo

## Paleta de Colores por Nivel

### A2 - Naranja Coral
- Primary: `oklch(0.68 0.20 35)`
- Secondary: `oklch(0.78 0.15 45)`
- Representa energía y entusiasmo inicial

### B1 - Morado Vibrante  
- Primary: `oklch(0.58 0.22 270)`
- Secondary: `oklch(0.72 0.15 310)`
- Representa creatividad y progreso

### B2 - Azul Profundo
- Primary: `oklch(0.55 0.25 210)`
- Secondary: `oklch(0.65 0.20 240)`
- Representa profundidad y confianza

## Implementación Técnica

### Nuevos Tipos TypeScript

```typescript
interface CompletedLevel {
  level: Level
  completedAt: number
  totalLessons: number
  averageScore: number
}

interface UserProgress {
  // ... campos existentes
  completedLevels?: CompletedLevel[]
}
```

### Funciones Helper Nuevas

- `checkLevelCompletion(progress, level)`: Verifica si un nivel está completo y calcula estadísticas
- `hasLevelCertificate(progress, level)`: Revisa si el usuario ya tiene un certificado para un nivel
- `getLevelCompletionBadges(progress)`: Obtiene todas las insignias de certificación desbloqueadas

### Componentes Nuevos

1. **LevelCertificate**: Modal de certificado con descarga
   - Ubicación: `/src/components/LevelCertificate.tsx`
   - Props: level, user, completedDate, totalLessons, averageScore, isOpen, onClose

2. **AchievementBadge**: Insignia animada de logro
   - Ubicación: `/src/components/AchievementBadge.tsx`
   - Props: type, level, title, description, unlockedAt, isLocked, index

## Flujo de Usuario

### Completar un Nivel Certificable

```
Usuario completa última lección
    ↓
Sistema verifica completado de todas las lecciones del nivel
    ↓
Calcula estadísticas (promedio de puntuación)
    ↓
Crea registro CompletedLevel
    ↓
Guarda en UserProgress.completedLevels
    ↓
Muestra toast de felicitación con emoji 🎓
    ↓
Certificado disponible en pestaña Logros
    ↓
Usuario puede visualizar y descargar
```

### Ver Certificado

```
Dashboard → Pestaña Logros → Sección Certificados
    ↓
Click en tarjeta de certificado desbloqueado
    ↓
Modal se abre con certificado completo
    ↓
Opción de descargar como PNG
    ↓
Se genera imagen de alta calidad (2x resolución)
```

## Dependencias Agregadas

- `html-to-image`: Para generar imágenes PNG de los certificados para descarga

## Mejoras Futuras Sugeridas

1. **Compartir en Redes Sociales**: Botones para compartir certificados directamente en LinkedIn, Twitter, etc.
2. **Verificación de Certificados**: Portal público para verificar la autenticidad usando el ID del certificado
3. **Certificados PDF**: Opción de descargar en formato PDF además de PNG
4. **Galería de Certificados**: Vista dedicada mostrando todos los certificados en un muro de logros
5. **Insignias Adicionales**: Más tipos de insignias para C1 y C2, o para logros específicos (vocabulario maestro, gramática experto, etc.)
6. **Estadísticas en Certificado**: Agregar tiempo total de estudio, racha máxima, etc.
7. **Personalización**: Permitir a los usuarios elegir entre diferentes estilos de certificado

## Testing

Para probar la funcionalidad:

1. Crea un usuario y completa la prueba de ubicación
2. Completa todas las lecciones de un nivel (A2, B1 o B2)
3. Al terminar la última lección, deberías ver:
   - Toast de felicitación por el certificado
   - El certificado disponible en Logros
4. Haz click en el certificado para verlo
5. Usa el botón de descarga para obtener la imagen PNG

## Soporte

Para preguntas o problemas relacionados con certificados e insignias, contacta al equipo de desarrollo.
