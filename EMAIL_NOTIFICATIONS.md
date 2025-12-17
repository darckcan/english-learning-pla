# Sistema de Notificaciones por Email - Nexus Fluent

## Descripción General

El sistema de notificaciones por email de Nexus Fluent es una solución automatizada que envía recordatorios a los usuarios cuando su membresía está próxima a vencer o ha expirado. Este sistema ayuda a mantener a los usuarios informados y reduce las cancelaciones involuntarias.

## Características Principales

### 1. Notificaciones Automáticas
- **Procesamiento cada hora**: El sistema revisa automáticamente las membresías cada hora
- **Cuatro tipos de notificaciones**:
  - 7 días antes del vencimiento
  - 3 días antes del vencimiento
  - 1 día antes del vencimiento
  - Al momento de expirar

### 2. Prevención de Duplicados
- Cada usuario recibe máximo un email de cada tipo por día
- El sistema mantiene un historial de notificaciones enviadas
- Verifica que no se hayan enviado notificaciones similares en las últimas 24 horas

### 3. Emails Personalizados
Cada email incluye:
- Nombre del usuario (nombre completo o usuario)
- Tipo de membresía actual
- Días restantes específicos
- Información de precios de renovación
- Llamado a la acción claro
- Tono apropiado según urgencia

### 4. Panel de Control para Super Admin

El dashboard de super administrador incluye:

#### Métricas en Tiempo Real
- Usuarios pendientes de notificación
- Total de emails enviados
- Última revisión del sistema
- Próxima ejecución programada

#### Controles del Sistema
- Activar/Desactivar notificaciones automáticas
- Procesar notificaciones manualmente
- Ver usuarios que necesitan notificación
- Historial completo de emails enviados

#### Panel de Pruebas
- Enviar emails de prueba a usuarios específicos
- Simular diferentes tipos de notificaciones
- Vista previa del contenido del email
- Verificación del sistema sin afectar usuarios reales

## Estructura Técnica

### Componentes Principales

1. **email-service.ts** - Servicio principal de emails
   - `sendEmail()` - Envía emails usando la API de spark.llm
   - `generateExpiryEmail()` - Genera contenido personalizado
   - `shouldSendNotification()` - Determina si enviar notificación
   - `processEmailNotifications()` - Procesa todos los usuarios

2. **EmailNotificationManager.tsx** - Componente de gestión
   - Panel de control con métricas
   - Activar/desactivar sistema
   - Procesamiento manual
   - Historial de notificaciones

3. **EmailTestPanel.tsx** - Panel de pruebas
   - Seleccionar usuario de prueba
   - Elegir tipo de notificación
   - Vista previa del email
   - Envío de prueba

4. **use-email-notifications.ts** - Hook de React
   - Integración automática en la aplicación
   - Procesamiento cada hora
   - Gestión de estado

### Almacenamiento de Datos

Utiliza el sistema de persistencia `useKV`:
- `email-notification-history` - Historial de notificaciones
- `auto-notifications-enabled` - Estado de activación
- `last-notification-check` - Última revisión

## Flujo de Notificaciones

```
Cada Hora
  ↓
¿Notificaciones Activadas?
  ↓ Sí
Obtener Todos los Usuarios
  ↓
Filtrar Estudiantes con Email
  ↓
Para Cada Usuario:
  ↓
¿Tiene Membresía Activa no Vitalicia?
  ↓ Sí
Calcular Días Restantes
  ↓
¿Es 7, 3, 1 o 0 días?
  ↓ Sí
¿Ya se envió notificación hoy?
  ↓ No
Generar Email Personalizado
  ↓
Enviar Email
  ↓
Registrar en Historial
  ↓
Continuar con Siguiente Usuario
```

## Tipos de Email

### Email de 7 Días
**Tono**: Informativo y amigable
**Objetivo**: Alertar con tiempo suficiente
**Acción**: Mostrar opciones de renovación

### Email de 3 Días
**Tono**: Más urgente pero constructivo
**Objetivo**: Recordar la cercanía del vencimiento
**Acción**: Enfatizar la importancia de renovar

### Email de 1 Día
**Tono**: Urgente y directo
**Objetivo**: Última oportunidad antes de expirar
**Acción**: Crear sentido de urgencia

### Email de Expiración
**Tono**: Informativo sobre consecuencias
**Objetivo**: Informar sobre pérdida de acceso
**Acción**: Ofrecer recuperación fácil

## Contenido de los Emails

Cada email incluye:

1. **Saludo Personalizado**: Usa el nombre del usuario
2. **Información del Estado**: Días restantes y tipo de membresía
3. **Consecuencias Claras**: Qué pasará si no renueva
4. **Opciones de Renovación**:
   - Membresía Mensual: $9.99/mes
   - Membresía Vitalicia: $24.99 (pago único)
5. **Llamado a la Acción**: Link directo a la plataforma
6. **Firma**: Equipo Nexus Fluent

## Administración del Sistema

### Para Activar Notificaciones Automáticas
1. Iniciar sesión como super administrador
2. Ir a "Sistema de Notificaciones por Email"
3. Activar el switch "Notificaciones Automáticas"
4. El sistema comenzará a procesar cada hora

### Para Desactivar Notificaciones
1. Desactivar el switch en el panel de control
2. Las notificaciones se pausarán inmediatamente
3. El historial se mantiene intacto

### Para Procesar Manualmente
1. Click en "Procesar Notificaciones Ahora"
2. El sistema revisará todos los usuarios inmediatamente
3. Se mostrarán los resultados en el historial

### Para Enviar Email de Prueba
1. Ir a "Panel de Prueba de Emails"
2. Seleccionar un usuario con email
3. Elegir tipo de notificación
4. Revisar vista previa
5. Click en "Enviar Email de Prueba"

## Integración con Dashboard de Usuario

Los usuarios ven alertas visuales en su dashboard:

- **7 días o menos**: Alerta amarilla informativa
- **3 días o menos**: Alerta naranja urgente
- **1 día o menos**: Alerta roja crítica
- **Expirado**: Alerta roja con bloqueo de acceso

Las alertas incluyen botones para renovar directamente.

## Mejores Prácticas

### Para Administradores
- Mantener notificaciones activadas siempre
- Revisar historial semanalmente
- Usar panel de pruebas antes de cambios
- Monitorear métricas de usuarios pendientes

### Para Usuarios
- Mantener email actualizado en perfil
- Revisar carpeta de spam si no recibe emails
- Actuar en cuanto reciba notificación de 7 días
- Considerar membresía vitalicia para evitar renovaciones

## Consideraciones de Seguridad

- Los emails nunca incluyen contraseñas
- No se comparte información sensible
- Solo se envía a emails verificados del perfil
- Sistema respeta límites de frecuencia

## Futuras Mejoras Posibles

1. Templates HTML con diseño visual
2. Integración con servicio de email real (SendGrid, AWS SES)
3. Estadísticas de apertura de emails
4. Personalización de contenido por idioma
5. Notificaciones por SMS adicionales
6. Recordatorios de rachas en riesgo
7. Emails de celebración de logros

## Soporte Técnico

Si los emails no se están enviando:
1. Verificar que notificaciones estén activadas
2. Revisar que usuarios tengan email registrado
3. Verificar historial de notificaciones
4. Probar con panel de pruebas
5. Revisar consola del navegador por errores

---

**Última actualización**: Diciembre 2024
**Versión del Sistema**: 1.0.0
