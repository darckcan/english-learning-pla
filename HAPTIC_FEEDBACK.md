# Vibración Háptica en Nexus Fluent

## 📱 Descripción

La aplicación ahora cuenta con feedback háptico (vibración) en dispositivos móviles compatibles. Esta funcionalidad mejora la experiencia del usuario proporcionando retroalimentación táctil en todas las interacciones importantes.

## ✨ Características Implementadas

### Vibración Automática en Componentes UI

Todos los componentes de interfaz principales ahora incluyen vibración háptica automática:

- ✅ **Botones**: Vibración ligera al presionar (destructivos tienen vibración de advertencia)
- ✅ **Inputs**: Vibración sutil al enfocar campos de texto
- ✅ **Switches**: Vibración de selección al cambiar estado
- ✅ **Checkboxes**: Vibración de selección al marcar/desmarcar
- ✅ **Radio Buttons**: Vibración de selección al elegir opciones

### Vibración en Interacciones de Aprendizaje

#### En las Lecciones:
- ✅ **Respuesta Correcta**: Patrón de vibración de éxito (corto-pausa-corto)
- ✅ **Respuesta Incorrecta**: Patrón de vibración de error (múltiples vibraciones)
- ✅ **Logro Desbloqueado**: Patrón especial de celebración
- ✅ **Certificado Obtenido**: Vibración de logro importante
- ✅ **Lección Completada**: Vibración de éxito

#### En el Examen de Colocación:
- ✅ **Respuesta Correcta**: Vibración de éxito
- ✅ **Respuesta Incorrecta**: Vibración de error
- ✅ **Examen Completado**: Vibración de notificación
- ✅ **Iniciar Curso**: Vibración de logro

#### En Práctica de Vocabulario:
- ✅ **Respuesta Correcta en Quiz**: Vibración de éxito
- ✅ **Respuesta Incorrecta en Quiz**: Vibración de error

#### En Login/Registro:
- ✅ **Login Exitoso**: Vibración de éxito
- ✅ **Error de Login**: Vibración de error
- ✅ **Registro Exitoso**: Vibración de éxito
- ✅ **Error de Validación**: Vibración de error

## 🔧 API de Vibración Háptica

### Uso Básico

```typescript
import { haptics } from '@/lib/haptics'

// Vibraciones básicas
haptics.light()      // 10ms - Toque ligero
haptics.medium()     // 20ms - Toque medio
haptics.heavy()      // 40ms - Toque fuerte

// Vibraciones de feedback
haptics.success()    // Patrón de éxito: [10, 50, 10]
haptics.error()      // Patrón de error: [20, 100, 20, 100, 20]
haptics.warning()    // Patrón de advertencia: [30, 100, 30]

// Vibraciones de interacción
haptics.selection()  // 5ms - Selección de elemento
haptics.impact()     // 15ms - Impacto
haptics.notification() // Patrón de notificación: [10, 50, 10, 50, 10]
haptics.achievement() // Patrón de logro: [50, 100, 50, 100, 100]

// Vibraciones específicas
haptics.longPress()  // 50ms - Presión larga
haptics.swipe()      // 8ms - Deslizamiento
haptics.rigid()      // 3ms - Muy sutil
haptics.soft()       // 7ms - Suave

// Patrón personalizado
haptics.pattern([100, 50, 100, 50, 200])

// Cancelar vibración
haptics.cancel()
```

### Uso con React Hook

```typescript
import { useHaptic } from '@/hooks/use-haptic'

function MyComponent() {
  const haptic = useHaptic()

  const handleClick = () => {
    if (haptic.isSupported) {
      haptic.success()
    }
    // ... resto del código
  }

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  )
}
```

## 📋 Patrones de Vibración

| Tipo | Duración/Patrón | Uso |
|------|----------------|-----|
| `light()` | 10ms | Interacciones ligeras, botones normales |
| `medium()` | 20ms | Interacciones moderadas |
| `heavy()` | 40ms | Interacciones importantes |
| `selection()` | 5ms | Selección en listas, switches, checkboxes |
| `success()` | [10, 50, 10] | Respuesta correcta, acción exitosa |
| `error()` | [20, 100, 20, 100, 20] | Respuesta incorrecta, error de validación |
| `warning()` | [30, 100, 30] | Advertencias, botones destructivos |
| `notification()` | [10, 50, 10, 50, 10] | Notificaciones importantes |
| `achievement()` | [50, 100, 50, 100, 100] | Logros, certificados, nivel completado |
| `impact()` | 15ms | Impactos visuales |
| `longPress()` | 50ms | Detección de presión larga |

## 🌐 Compatibilidad

La vibración háptica funciona en:
- ✅ Android (Chrome, Firefox, Edge, Samsung Internet)
- ✅ Chrome para Android
- ✅ Firefox para Android
- ❌ iOS Safari (no soportado por limitaciones de iOS)
- ❌ Navegadores de escritorio (no aplicable)

La aplicación detecta automáticamente si el dispositivo soporta vibración y solo activa la funcionalidad en dispositivos compatibles.

## 🎯 Beneficios

1. **Mejor Feedback**: Los usuarios reciben confirmación inmediata de sus acciones
2. **Gamificación**: Los patrones especiales en logros crean momentos de celebración
3. **Accesibilidad**: Feedback adicional para usuarios con limitaciones visuales
4. **Profesionalismo**: Sensación pulida y moderna de la aplicación
5. **Engagement**: Aumenta la satisfacción y conexión con la plataforma

## ⚙️ Configuración

La vibración háptica está activada por defecto. Los usuarios pueden desactivarla en la configuración de su navegador o sistema operativo si lo desean.

## 🔍 Detección de Soporte

```typescript
const isSupported = 'vibrate' in navigator
```

Todos los componentes y funciones verifican automáticamente si la vibración está soportada antes de intentar usarla.

## 📱 Mejores Prácticas

1. **Usa con moderación**: No vibrar en cada interacción
2. **Sé consistente**: Usa los mismos patrones para las mismas acciones
3. **Respeta las preferencias**: Los usuarios deben poder desactivarlo
4. **Prueba en dispositivos reales**: Los emuladores pueden no simular correctamente
5. **Considera el contexto**: Vibraciones apropiadas según la importancia de la acción

## 🚀 Ejemplos de Uso

### En un Formulario
```typescript
const handleSubmit = async () => {
  try {
    await submitForm()
    haptics.success()
    toast.success('Formulario enviado')
  } catch (error) {
    haptics.error()
    toast.error('Error al enviar')
  }
}
```

### En un Juego/Quiz
```typescript
const checkAnswer = (answer: string) => {
  if (answer === correctAnswer) {
    haptics.success()
    setScore(score + 1)
  } else {
    haptics.error()
    showCorrectAnswer()
  }
}
```

### En Navegación
```typescript
const navigateToLevel = (level: Level) => {
  haptics.light()
  router.push(`/level/${level}`)
}
```

## 🎨 Personalización

Para agregar vibración a tus propios componentes:

```typescript
import { haptics } from '@/lib/haptics'

const MyCustomButton = () => {
  const handleClick = () => {
    haptics.medium()
    // Tu lógica aquí
  }

  return <button onClick={handleClick}>Mi Botón</button>
}
```

## 🐛 Troubleshooting

**Problema**: La vibración no funciona en mi dispositivo
- **Solución**: Verifica que el dispositivo no esté en modo silencio/no molestar
- **Solución**: Verifica que las vibraciones estén habilitadas en la configuración del navegador
- **Solución**: Algunos navegadores requieren interacción del usuario antes de permitir vibración

**Problema**: La vibración es demasiado fuerte/débil
- **Solución**: Los patrones pueden sentirse diferente en cada dispositivo
- **Solución**: Ajusta los valores en `/src/lib/haptics.ts` según tus preferencias

## 📚 Referencias

- [MDN - Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)
- [W3C - Vibration API Specification](https://www.w3.org/TR/vibration/)
