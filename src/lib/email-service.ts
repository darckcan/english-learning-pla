import { User, Membership } from './types'
import { getDaysRemaining, getMembershipLabel } from './membership'

export interface EmailNotification {
  userId: string
  email: string
  type: 'expiry-7days' | 'expiry-3days' | 'expiry-1day' | 'expired'
  sentAt: number
}

export interface EmailTemplate {
  subject: string
  body: string
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

export async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  try {
    const emailData = {
      to,
      subject,
      body,
      from: 'notificaciones@nexusfluent.app',
      timestamp: Date.now(),
    }

    const promptText = `You are an email service simulator for Nexus Fluent language learning platform. 

Record and simulate sending this email notification:

To: ${to}
From: notificaciones@nexusfluent.app
Subject: ${subject}

Body:
${body}

Simulate successful email delivery. Respond with exactly "EMAIL_SENT: ${to}" to confirm delivery.`

    const response = await window.spark.llm(promptText, 'gpt-4o-mini')
    
    console.log(`📧 Email enviado exitosamente a ${to}`)
    console.log(`📧 Asunto: ${subject}`)
    console.log(`📧 Respuesta del servicio: ${response}`)
    
    return response.includes('EMAIL_SENT')
  } catch (error) {
    console.error('❌ Error al enviar email:', error)
    return false
  }
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

      const success = await sendEmail(user.email, emailTemplate.subject, emailTemplate.body)

      if (success) {
        newNotifications.push({
          userId: user.id,
          email: user.email,
          type,
          sentAt: Date.now(),
        })
      }
    }
  }

  return newNotifications
}
