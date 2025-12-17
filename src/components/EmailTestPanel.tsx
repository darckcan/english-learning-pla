import { useState } from 'react'
import { User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { EnvelopeSimple, PaperPlaneTilt } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { sendEmail, generateExpiryEmail } from '@/lib/email-service'
import { getDaysRemaining } from '@/lib/membership'

interface EmailTestPanelProps {
  users: User[]
}

export default function EmailTestPanel({ users }: EmailTestPanelProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [testEmailType, setTestEmailType] = useState<'7' | '3' | '1' | '0'>('7')
  const [isSending, setIsSending] = useState(false)

  const studentUsers = users.filter(u => u.role === 'student' && u.email)

  const handleSendTestEmail = async () => {
    if (!selectedUserId) {
      toast.error('Por favor selecciona un usuario')
      return
    }

    const user = studentUsers.find(u => u.id === selectedUserId)
    if (!user || !user.email) {
      toast.error('Usuario no válido o sin email')
      return
    }

    setIsSending(true)
    try {
      const days = parseInt(testEmailType)
      const emailTemplate = generateExpiryEmail(user, days)

      const success = await sendEmail(user.email, emailTemplate.subject, emailTemplate.body)

      if (success) {
        toast.success(`Email de prueba enviado a ${user.email}`)
      } else {
        toast.error('Error al enviar el email de prueba')
      }
    } catch (error) {
      console.error('Error enviando email de prueba:', error)
      toast.error('Error al enviar el email de prueba')
    } finally {
      setIsSending(false)
    }
  }

  const selectedUser = studentUsers.find(u => u.id === selectedUserId)
  const daysRemaining = selectedUser ? getDaysRemaining(selectedUser.membership) : null

  return (
    <Card className="border-accent/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <PaperPlaneTilt className="w-4 h-4 sm:w-5 sm:h-5" />
          Panel de Prueba de Emails
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Enviar emails de prueba para verificar el sistema de notificaciones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-user" className="text-sm">Usuario de Prueba</Label>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger id="test-user" className="text-sm">
              <SelectValue placeholder="Selecciona un usuario..." />
            </SelectTrigger>
            <SelectContent>
              {studentUsers.map(user => (
                <SelectItem key={user.id} value={user.id} className="text-sm">
                  {user.fullName || user.username} - {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedUser && (
            <div className="text-xs sm:text-sm text-muted-foreground">
              Membresía: {selectedUser.membership?.type || 'ninguna'} 
              {daysRemaining !== null && ` - ${daysRemaining} días restantes`}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="test-type" className="text-sm">Tipo de Notificación</Label>
          <Select value={testEmailType} onValueChange={(v) => setTestEmailType(v as any)}>
            <SelectTrigger id="test-type" className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Vence en 7 días</SelectItem>
              <SelectItem value="3">Vence en 3 días</SelectItem>
              <SelectItem value="1">Vence en 1 día</SelectItem>
              <SelectItem value="0">Membresía expirada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSendTestEmail}
          disabled={!selectedUserId || isSending}
          className="w-full"
          size="sm"
        >
          <EnvelopeSimple className="w-4 h-4 mr-2" />
          {isSending ? 'Enviando...' : 'Enviar Email de Prueba'}
        </Button>

        {selectedUser && (
          <div className="p-3 sm:p-4 bg-muted rounded-md text-xs sm:text-sm space-y-2">
            <div className="font-semibold">Vista Previa del Email:</div>
            <div>
              <strong>Para:</strong> <span className="break-all">{selectedUser.email}</span>
            </div>
            <div>
              <strong>Asunto:</strong> {generateExpiryEmail(selectedUser, parseInt(testEmailType)).subject}
            </div>
            <div>
              <strong>Mensaje:</strong>
              <pre className="mt-2 whitespace-pre-wrap text-xs bg-background p-2 rounded overflow-x-auto">
                {generateExpiryEmail(selectedUser, parseInt(testEmailType)).body}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
