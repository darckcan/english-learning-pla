import { User } from './types'
import { getDaysRemaining, getMembershipLabel } from './membership'

export interface EmailNotification {
  userId: string
  email: string
  type: 'expiry-7days' | 'expiry-3days' | 'expiry-1day' | 'expired' | 'payment-confirmation'
  sentAt: number
  status: 'sent' | 'failed' | 'simulated'
  errorMessage?: string
}

export interface EmailTemplate {
  subject: string
  body: string
}

export interface EmailConfig {
  provider: 'simulation' | 'emailjs' | 'webhook'
  emailjsServiceId?: string
  emailjsTemplateId?: string
  emailjsPublicKey?: string
  webhookUrl?: string
  fromEmail: string
  fromName: string
}

const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  provider: 'simulation',
  fromEmail: 'notificaciones@nexusfluent.app',
  fromName: 'Nexus Fluent',
}

export function generateWelcomeEmail(user: User): EmailTemplate {
  const userName = user.fullName || user.username
  
  return {
    subject: '🎉 ¡Bienvenido a Nexus Fluent! Tu viaje hacia la fluidez comienza ahora',
    body: `
Hola ${userName},

¡Bienvenido a Nexus Fluent! Estamos emocionados de acompañarte en tu viaje hacia la fluidez en inglés.

✨ Tu Cuenta ha sido Creada Exitosamente

Usuario: ${user.username}
Email: ${user.email}
Membresía: Prueba gratuita de 15 días

🎯 Primeros Pasos

1. Completa tu examen de colocación para determinar tu nivel inicial
2. Explora nuestras 270+ lecciones estructuradas desde Beginner hasta C2
3. Practica con ejercicios interactivos, vocabulario y shadowing
4. Sigue tu progreso con estadísticas detalladas y logros

💡 Consejos para tu Éxito

• Estudia 25-45 minutos diarios (la constancia es clave)
• Practica antes de dormir para mejor retención
• Usa la técnica de shadowing para mejorar pronunciación
• Toma notas a mano para mejor aprendizaje

💎 Después de tu Prueba

• Membresía Mensual: $9.99/mes - Acceso completo
• Membresía Vitalicia: $24.99 - ¡Pago único, acceso de por vida!

¿Listo para comenzar? Inicia sesión y comienza tu examen de colocación.

¡Te deseamos mucho éxito en tu aprendizaje!

Con entusiasmo,
Equipo Nexus Fluent

---
Si tienes alguna pregunta, no dudes en contactarnos.
    `.trim(),
  }
}

export interface PaymentConfirmationDetails {
  userName: string
  userEmail: string
  membershipType: 'monthly' | 'lifetime'
  amount: number
  transactionId: string
  purchaseDate: Date
}

export function generatePaymentConfirmationEmail(details: PaymentConfirmationDetails): EmailTemplate {
  const isLifetime = details.membershipType === 'lifetime'
  const membershipName = isLifetime ? 'Membresía Vitalicia' : 'Membresía Mensual'
  const formattedDate = details.purchaseDate.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const renewalInfo = isLifetime 
    ? '♾️ Tu membresía es de por vida - ¡nunca expira!'
    : `📅 Tu membresía se renovará automáticamente el ${new Date(details.purchaseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}`

  return {
    subject: `✅ Confirmación de Pago - ${membershipName} de Nexus Fluent`,
    body: `
Hola ${details.userName},

¡Gracias por tu compra! Tu pago ha sido procesado exitosamente.

═══════════════════════════════════════════
📋 DETALLES DE TU COMPRA
═══════════════════════════════════════════

🏷️ Producto: ${membershipName}
💰 Monto: $${details.amount.toFixed(2)} USD
📧 Email: ${details.userEmail}
🔖 ID de Transacción: ${details.transactionId}
📅 Fecha de Compra: ${formattedDate}

═══════════════════════════════════════════
✨ TU MEMBRESÍA ESTÁ ACTIVA
═══════════════════════════════════════════

${renewalInfo}

🎯 Ahora tienes acceso completo a:

✓ Más de 270 lecciones estructuradas (Beginner a C2)
✓ Ejercicios ilimitados de gramática y vocabulario
✓ Audio de pronunciación con hablantes nativos
✓ Práctica de shadowing para fluidez
✓ Certificados oficiales al completar niveles
✓ Sistema de logros y seguimiento de progreso
${isLifetime ? '✓ Todas las actualizaciones futuras incluidas\n✓ Contenido exclusivo premium' : ''}

═══════════════════════════════════════════
🚀 PRÓXIMOS PASOS
═══════════════════════════════════════════

1. Inicia sesión en tu cuenta: https://nexusfluent.app
2. Continúa desde donde lo dejaste
3. Explora nuevos niveles y lecciones avanzadas
4. ¡Practica todos los días para mejores resultados!

═══════════════════════════════════════════

Si tienes alguna pregunta sobre tu compra o necesitas ayuda, 
no dudes en contactarnos.

¡Gracias por confiar en Nexus Fluent para tu aprendizaje de inglés!

Con gratitud,
Equipo Nexus Fluent

---
Este es un recibo de tu transacción. Guarda este email para tus registros.
    `.trim(),
  }
}

export async function sendPaymentConfirmationEmail(
  details: PaymentConfirmationDetails
): Promise<EmailResult> {
  const template = generatePaymentConfirmationEmail(details)
  return sendEmailWithDetails(details.userEmail, template.subject, template.body)
}

export function generateExpiryEmail(
  user: User,
  daysRemaining: number
): EmailTemplate {
  const userName = user.fullName || user.username
  const membershipType = getMembershipLabel(user.membership?.type || 'trial')

  if (daysRemaining === 7) {
    return {
      subject: '⏰ Tu membresía de Nexus Fluent vence en 7 días',
      body: `
Hola ${userName},

Tu membresía de ${membershipType} en Nexus Fluent está por vencer en 7 días.

No pierdas acceso a todas nuestras lecciones y contenido premium. Renueva ahora y continúa tu camino hacia la fluidez en inglés.

Opciones de renovación:
• Membresía Mensual: $9.99/mes - Acceso completo por 30 días
• Membresía Vitalicia: $24.99 - Acceso de por vida (¡mejor valor!)

Inicia sesión para renovar: https://nexusfluent.app

¡Gracias por aprender con nosotros!
Equipo Nexus Fluent
      `.trim(),
    }
  }

  if (daysRemaining === 3) {
    return {
      subject: '⚠️ ¡Solo quedan 3 días! - Renueva tu membresía de Nexus Fluent',
      body: `
Hola ${userName},

Este es un recordatorio importante: tu membresía de ${membershipType} vence en solo 3 días.

No interrumpas tu progreso de aprendizaje. Has llegado tan lejos, ¡no dejes que expire!

Opciones de renovación:
• Membresía Mensual: $9.99/mes
• Membresía Vitalicia: $24.99 (¡nunca te preocupes por renovar!)

Renueva ahora: https://nexusfluent.app

Tu progreso te espera,
Equipo Nexus Fluent
      `.trim(),
    }
  }

  if (daysRemaining === 1) {
    return {
      subject: '🚨 ¡ÚLTIMO DÍA! - Tu membresía de Nexus Fluent expira mañana',
      body: `
Hola ${userName},

¡Esta es tu última oportunidad! Tu membresía de ${membershipType} expira mañana.

Después de mañana, perderás acceso a:
✗ Todas las lecciones avanzadas
✗ Ejercicios de práctica
✗ Tu progreso y estadísticas
✗ Certificados de nivel

¡No dejes que esto suceda!

Renueva AHORA:
• Membresía Mensual: $9.99/mes
• Membresía Vitalicia: $24.99 - ¡El mejor valor!

Actúa ahora: https://nexusfluent.app

Urgentemente,
Equipo Nexus Fluent
      `.trim(),
    }
  }

  return {
    subject: '❌ Tu membresía de Nexus Fluent ha expirado',
    body: `
Hola ${userName},

Tu membresía de ${membershipType} en Nexus Fluent ha expirado.

Tu cuenta está ahora en modo de solo lectura. Para continuar aprendiendo y acceder a todas las lecciones, necesitas renovar tu membresía.

Recupera tu acceso completo:
• Membresía Mensual: $9.99/mes
• Membresía Vitalicia: $24.99 - ¡Pago único!

Renovar ahora: https://nexusfluent.app

Te extrañamos,
Equipo Nexus Fluent
    `.trim(),
  }
}

export interface EmailResult {
  success: boolean
  status: 'sent' | 'failed' | 'simulated'
  message: string
  details?: string
}

async function sendViaEmailJS(
  to: string,
  subject: string,
  body: string,
  config: EmailConfig
): Promise<EmailResult> {
  if (!config.emailjsServiceId || !config.emailjsTemplateId || !config.emailjsPublicKey) {
    const missing: string[] = []
    if (!config.emailjsServiceId) missing.push('Service ID')
    if (!config.emailjsTemplateId) missing.push('Template ID')
    if (!config.emailjsPublicKey) missing.push('Public Key')
    return {
      success: false,
      status: 'failed',
      message: 'EmailJS no está configurado correctamente',
      details: `Faltan: ${missing.join(', ')}`
    }
  }

  const templateParams = {
    to_name: to.split('@')[0],
    to_email: to,
    email: to,
    user_email: to,
    from_name: config.fromName || 'Nexus Fluent',
    from_email: config.fromEmail || 'notificaciones@nexusfluent.app',
    reply_to: config.fromEmail || 'notificaciones@nexusfluent.app',
    subject: subject,
    title: subject,
    message: body,
    message_html: body.replace(/\n/g, '<br>'),
    content: body,
    body: body,
  }

  console.log('📧 EmailJS - Enviando con parámetros:', {
    service_id: config.emailjsServiceId,
    template_id: config.emailjsTemplateId,
    to: to,
    subject: subject,
  })

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: config.emailjsServiceId,
        template_id: config.emailjsTemplateId,
        user_id: config.emailjsPublicKey,
        template_params: templateParams,
      }),
    })

    const responseText = await response.text()

    if (response.ok || responseText === 'OK') {
      return {
        success: true,
        status: 'sent',
        message: `Email enviado exitosamente a ${to}`,
      }
    } else {
      console.error('❌ EmailJS Error:', {
        status: response.status,
        statusText: response.statusText,
        response: responseText
      })
      
      let errorMessage = `Error de EmailJS: ${response.status}`
      let errorDetails = responseText
      
      if (response.status === 422) {
        errorMessage = 'Error 422: Parámetros de plantilla incorrectos'
        errorDetails = `La plantilla de EmailJS espera parámetros diferentes. Verifica que tu plantilla use estos nombres: to_email, subject, message, from_name. Respuesta: ${responseText}`
      } else if (response.status === 401) {
        errorMessage = 'Error 401: Public Key inválida'
        errorDetails = 'Verifica que tu Public Key de EmailJS sea correcta'
      } else if (response.status === 403) {
        errorMessage = 'Error 403: Service ID o Template ID inválido'
        errorDetails = 'Verifica que tu Service ID y Template ID sean correctos'
      } else if (response.status === 400) {
        errorMessage = 'Error 400: Solicitud inválida'
        errorDetails = `Revisa la configuración de EmailJS. Respuesta: ${responseText}`
      }
      
      return {
        success: false,
        status: 'failed',
        message: errorMessage,
        details: errorDetails,
      }
    }
  } catch (error) {
    console.error('❌ EmailJS Connection Error:', error)
    return {
      success: false,
      status: 'failed',
      message: 'Error de conexión con EmailJS',
      details: error instanceof Error ? error.message : String(error),
    }
  }
}

async function sendViaWebhook(
  to: string,
  subject: string,
  body: string,
  config: EmailConfig
): Promise<EmailResult> {
  if (!config.webhookUrl) {
    return {
      success: false,
      status: 'failed',
      message: 'URL del webhook no configurada',
    }
  }

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        body,
        from: config.fromEmail,
        fromName: config.fromName,
        timestamp: Date.now(),
      }),
    })

    if (response.ok) {
      const data = await response.json().catch(() => ({}))
      return {
        success: true,
        status: 'sent',
        message: `Email enviado via webhook a ${to}`,
        details: data.message || 'OK',
      }
    } else {
      const errorText = await response.text()
      return {
        success: false,
        status: 'failed',
        message: `Error del webhook: ${response.status}`,
        details: errorText,
      }
    }
  } catch (error) {
    return {
      success: false,
      status: 'failed',
      message: 'Error de conexión con el webhook',
      details: error instanceof Error ? error.message : String(error),
    }
  }
}

async function sendViaSimulation(
  to: string,
  subject: string,
  body: string
): Promise<EmailResult> {
  console.log('═══════════════════════════════════════════════════════════')
  console.log('📧 EMAIL SIMULADO (No se envía realmente)')
  console.log('═══════════════════════════════════════════════════════════')
  console.log(`📬 Para: ${to}`)
  console.log(`📋 Asunto: ${subject}`)
  console.log('───────────────────────────────────────────────────────────')
  console.log(body)
  console.log('═══════════════════════════════════════════════════════════')
  
  return {
    success: true,
    status: 'simulated',
    message: `Email SIMULADO para ${to} - No se envió realmente`,
    details: 'Para enviar emails reales, configure EmailJS o un webhook de email',
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  config?: EmailConfig
): Promise<boolean> {
  const emailConfig = config || await getEmailConfig()
  const result = await sendEmailWithDetails(to, subject, body, emailConfig)
  return result.success
}

export async function sendEmailWithDetails(
  to: string,
  subject: string,
  body: string,
  config?: EmailConfig
): Promise<EmailResult> {
  const emailConfig = config || await getEmailConfig()

  switch (emailConfig.provider) {
    case 'emailjs':
      return sendViaEmailJS(to, subject, body, emailConfig)
    case 'webhook':
      return sendViaWebhook(to, subject, body, emailConfig)
    case 'simulation':
    default:
      return sendViaSimulation(to, subject, body)
  }
}

export async function getEmailConfig(): Promise<EmailConfig> {
  try {
    const savedConfig = await window.spark.kv.get<EmailConfig>('email-config')
    if (savedConfig) {
      return { ...DEFAULT_EMAIL_CONFIG, ...savedConfig }
    }
  } catch (error) {
    console.warn('Error al cargar configuración de email:', error)
  }
  return DEFAULT_EMAIL_CONFIG
}

export async function saveEmailConfig(config: Partial<EmailConfig>): Promise<void> {
  const currentConfig = await getEmailConfig()
  const newConfig = { ...currentConfig, ...config }
  await window.spark.kv.set('email-config', newConfig)
}

export async function testEmailConfiguration(testEmail: string): Promise<EmailResult> {
  const config = await getEmailConfig()
  
  const testTemplate: EmailTemplate = {
    subject: '🧪 Prueba de Configuración de Email - Nexus Fluent',
    body: `
¡Hola!

Este es un email de prueba para verificar que la configuración de notificaciones de Nexus Fluent está funcionando correctamente.

Configuración actual:
• Proveedor: ${config.provider}
• Email remitente: ${config.fromEmail}
• Nombre remitente: ${config.fromName}

Si recibiste este email, ¡la configuración está funcionando! ✅

Fecha y hora de la prueba: ${new Date().toLocaleString('es-MX')}

Saludos,
Equipo Nexus Fluent
    `.trim(),
  }

  return sendEmailWithDetails(testEmail, testTemplate.subject, testTemplate.body, config)
}

export function shouldSendNotification(
  user: User,
  notificationHistory: EmailNotification[]
): { shouldSend: boolean; type?: EmailNotification['type'] } {
  if (!user.membership || !user.email) {
    return { shouldSend: false }
  }

  if (user.membership.type === 'lifetime' || !user.membership.isActive) {
    return { shouldSend: false }
  }

  const daysRemaining = getDaysRemaining(user.membership)
  if (daysRemaining === null) {
    return { shouldSend: false }
  }

  const userNotifications = notificationHistory.filter(n => n.userId === user.id)
  const now = Date.now()
  const oneDayMs = 24 * 60 * 60 * 1000

  if (daysRemaining <= 0) {
    const alreadySentExpired = userNotifications.some(
      n => n.type === 'expired' && (now - n.sentAt) < oneDayMs
    )
    if (!alreadySentExpired) {
      return { shouldSend: true, type: 'expired' }
    }
  } else if (daysRemaining === 1) {
    const alreadySent = userNotifications.some(
      n => n.type === 'expiry-1day' && (now - n.sentAt) < oneDayMs
    )
    if (!alreadySent) {
      return { shouldSend: true, type: 'expiry-1day' }
    }
  } else if (daysRemaining === 3) {
    const alreadySent = userNotifications.some(
      n => n.type === 'expiry-3days' && (now - n.sentAt) < oneDayMs
    )
    if (!alreadySent) {
      return { shouldSend: true, type: 'expiry-3days' }
    }
  } else if (daysRemaining === 7) {
    const alreadySent = userNotifications.some(
      n => n.type === 'expiry-7days' && (now - n.sentAt) < oneDayMs
    )
    if (!alreadySent) {
      return { shouldSend: true, type: 'expiry-7days' }
    }
  }

  return { shouldSend: false }
}

export async function processEmailNotifications(
  users: User[],
  notificationHistory: EmailNotification[]
): Promise<EmailNotification[]> {
  const newNotifications: EmailNotification[] = []

  for (const user of users) {
    const { shouldSend, type } = shouldSendNotification(user, notificationHistory)

    if (shouldSend && type && user.email) {
      const daysRemaining = getDaysRemaining(user.membership)
      const days = daysRemaining === null ? 0 : daysRemaining
      const emailTemplate = generateExpiryEmail(user, days)

      const result = await sendEmailWithDetails(user.email, emailTemplate.subject, emailTemplate.body)

      newNotifications.push({
        userId: user.id,
        email: user.email,
        type,
        sentAt: Date.now(),
        status: result.status,
        errorMessage: result.success ? undefined : result.message,
      })
    }
  }

  return newNotifications
}

export function getEmailProviderInfo(provider: EmailConfig['provider']): {
  name: string
  description: string
  configRequired: string[]
} {
  switch (provider) {
    case 'emailjs':
      return {
        name: 'EmailJS',
        description: 'Servicio de email gratuito que funciona desde el navegador. Requiere cuenta en emailjs.com',
        configRequired: ['Service ID', 'Template ID', 'Public Key'],
      }
    case 'webhook':
      return {
        name: 'Webhook Personalizado',
        description: 'Envía emails a través de tu propio servidor o servicio de email (SendGrid, Mailgun, etc.)',
        configRequired: ['URL del Webhook'],
      }
    case 'simulation':
    default:
      return {
        name: 'Simulación (Solo consola)',
        description: 'Los emails se registran en la consola del navegador pero NO se envían realmente. Útil para pruebas.',
        configRequired: [],
      }
  }
}
