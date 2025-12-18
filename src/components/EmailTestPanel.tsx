import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { EnvelopeSimple, PaperPlaneTilt, Gear, CheckCircle, XCircle, Warning, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  sendEmailWithDetails, 
  generateExpiryEmail,
  testEmailConfiguration,
  getEmailConfig,
  saveEmailConfig,
  getEmailProviderInfo,
  EmailConfig,
  EmailResult
} from '@/lib/email-service'
import { getDaysRemaining } from '@/lib/membership'

interface EmailTestPanelProps {
  users: User[]
}

export default function EmailTestPanel({ users }: EmailTestPanelProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [testEmailType, setTestEmailType] = useState<'7' | '3' | '1' | '0'>('7')
  const [isSending, setIsSending] = useState(false)
  const [testResult, setTestResult] = useState<EmailResult | null>(null)
  
  const [emailConfig, setEmailConfig] = useKV<EmailConfig>('email-config', {
    provider: 'simulation',
    fromEmail: 'notificaciones@nexusfluent.app',
    fromName: 'Nexus Fluent',
  })
  
  const [customTestEmail, setCustomTestEmail] = useState('')
  const [isSavingConfig, setIsSavingConfig] = useState(false)

  const studentUsers = users.filter(u => u.role === 'student' && u.email)
  
  const currentProviderInfo = getEmailProviderInfo(emailConfig?.provider || 'simulation')

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
    setTestResult(null)
    
    try {
      const days = parseInt(testEmailType)
      const emailTemplate = generateExpiryEmail(user, days)
      const result = await sendEmailWithDetails(user.email, emailTemplate.subject, emailTemplate.body)
      
      setTestResult(result)

      if (result.success) {
        if (result.status === 'simulated') {
          toast.info(`Email simulado para ${user.email} - Revisa la consola del navegador`)
        } else {
          toast.success(`Email enviado exitosamente a ${user.email}`)
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error enviando email de prueba:', error)
      toast.error('Error al enviar el email de prueba')
      setTestResult({
        success: false,
        status: 'failed',
        message: 'Error inesperado',
        details: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleTestConfiguration = async () => {
    const emailToTest = customTestEmail || 'test@example.com'
    
    setIsSending(true)
    setTestResult(null)
    
    try {
      const result = await testEmailConfiguration(emailToTest)
      setTestResult(result)
      
      if (result.success) {
        if (result.status === 'simulated') {
          toast.info('Configuración en modo simulación - Revisa la consola')
        } else {
          toast.success('¡Configuración verificada! Email de prueba enviado')
        }
      } else {
        toast.error(`Error: ${result.message}`)
      }
    } catch (error) {
      toast.error('Error al probar la configuración')
    } finally {
      setIsSending(false)
    }
  }

  const handleSaveConfig = async () => {
    if (!emailConfig) return
    
    setIsSavingConfig(true)
    try {
      await saveEmailConfig(emailConfig)
      toast.success('Configuración guardada')
    } catch (error) {
      toast.error('Error al guardar la configuración')
    } finally {
      setIsSavingConfig(false)
    }
  }

  const updateConfig = (updates: Partial<EmailConfig>) => {
    setEmailConfig((current) => current ? { ...current, ...updates } : { 
      provider: 'simulation', 
      fromEmail: 'notificaciones@nexusfluent.app',
      fromName: 'Nexus Fluent',
      ...updates 
    })
  }

  const selectedUser = studentUsers.find(u => u.id === selectedUserId)
  const daysRemaining = selectedUser ? getDaysRemaining(selectedUser.membership) : null

  return (
    <div className="space-y-4">
      <Tabs defaultValue="test" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="test" className="text-xs sm:text-sm">
            <PaperPlaneTilt className="w-4 h-4 mr-1" />
            Probar Email
          </TabsTrigger>
          <TabsTrigger value="config" className="text-xs sm:text-sm">
            <Gear className="w-4 h-4 mr-1" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="mt-4">
          <Card className="border-accent/50">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <PaperPlaneTilt className="w-4 h-4 sm:w-5 sm:h-5" />
                Enviar Email de Prueba
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Verifica que los emails lleguen correctamente
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <div className="text-xs sm:text-sm">
                  <strong>Proveedor actual:</strong> {currentProviderInfo.name}
                  <p className="text-muted-foreground mt-1">{currentProviderInfo.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-user" className="text-sm">Usuario de Prueba</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger id="test-user" className="text-sm">
                    <SelectValue placeholder="Selecciona un usuario..." />
                  </SelectTrigger>
                  <SelectContent>
                    {studentUsers.length === 0 ? (
                      <SelectItem value="none" disabled>No hay usuarios con email</SelectItem>
                    ) : (
                      studentUsers.map(user => (
                        <SelectItem key={user.id} value={user.id} className="text-sm">
                          {user.fullName || user.username} - {user.email}
                        </SelectItem>
                      ))
                    )}
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
                <Select value={testEmailType} onValueChange={(v) => setTestEmailType(v as '7' | '3' | '1' | '0')}>
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

              {testResult && (
                <div className={`p-3 rounded-lg border ${
                  testResult.success 
                    ? testResult.status === 'simulated' 
                      ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                      : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {testResult.success ? (
                      testResult.status === 'simulated' ? (
                        <Warning className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium text-sm">
                      {testResult.success 
                        ? testResult.status === 'simulated' ? 'Simulado' : 'Éxito'
                        : 'Error'}
                    </span>
                    <Badge variant={testResult.success ? 'default' : 'destructive'} className="text-xs">
                      {testResult.status}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm">{testResult.message}</p>
                  {testResult.details && (
                    <p className="text-xs text-muted-foreground mt-1">{testResult.details}</p>
                  )}
                </div>
              )}

              {selectedUser && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    Ver vista previa del email
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded-md text-xs sm:text-sm space-y-2">
                    <div>
                      <strong>Para:</strong> <span className="break-all">{selectedUser.email}</span>
                    </div>
                    <div>
                      <strong>Asunto:</strong> {generateExpiryEmail(selectedUser, parseInt(testEmailType)).subject}
                    </div>
                    <div>
                      <strong>Mensaje:</strong>
                      <pre className="mt-2 whitespace-pre-wrap text-xs bg-background p-2 rounded overflow-x-auto max-h-48">
                        {generateExpiryEmail(selectedUser, parseInt(testEmailType)).body}
                      </pre>
                    </div>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Gear className="w-4 h-4 sm:w-5 sm:h-5" />
                Configuración de Email
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Configura cómo se envían los correos electrónicos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 space-y-4">
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <Warning className="w-4 h-4 mt-0.5 text-destructive flex-shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <strong>Importante:</strong> Para enviar emails reales, necesitas configurar un servicio de email. 
                    Actualmente está en modo <strong>{currentProviderInfo.name}</strong>.
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Proveedor de Email</Label>
                <Select 
                  value={emailConfig?.provider || 'simulation'} 
                  onValueChange={(v) => updateConfig({ provider: v as EmailConfig['provider'] })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simulation">
                      🧪 Simulación (Solo consola)
                    </SelectItem>
                    <SelectItem value="emailjs">
                      📧 EmailJS (Gratuito)
                    </SelectItem>
                    <SelectItem value="webhook">
                      🔗 Webhook Personalizado
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{currentProviderInfo.description}</p>
              </div>

              {emailConfig?.provider === 'emailjs' && (
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Regístrate gratis en <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">emailjs.com</a> y crea un servicio y plantilla.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-xs">Service ID</Label>
                    <Input
                      placeholder="service_xxxxxxx"
                      value={emailConfig.emailjsServiceId || ''}
                      onChange={(e) => updateConfig({ emailjsServiceId: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Template ID</Label>
                    <Input
                      placeholder="template_xxxxxxx"
                      value={emailConfig.emailjsTemplateId || ''}
                      onChange={(e) => updateConfig({ emailjsTemplateId: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Public Key</Label>
                    <Input
                      placeholder="Tu public key de EmailJS"
                      value={emailConfig.emailjsPublicKey || ''}
                      onChange={(e) => updateConfig({ emailjsPublicKey: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              {emailConfig?.provider === 'webhook' && (
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Ingresa la URL de tu servidor de email (SendGrid, Mailgun, tu propio backend, etc.)
                  </p>
                  <div className="space-y-2">
                    <Label className="text-xs">URL del Webhook</Label>
                    <Input
                      placeholder="https://tu-servidor.com/api/send-email"
                      value={emailConfig.webhookUrl || ''}
                      onChange={(e) => updateConfig({ webhookUrl: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Email Remitente</Label>
                  <Input
                    placeholder="notificaciones@tudominio.com"
                    value={emailConfig?.fromEmail || ''}
                    onChange={(e) => updateConfig({ fromEmail: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Nombre Remitente</Label>
                  <Input
                    placeholder="Nexus Fluent"
                    value={emailConfig?.fromName || ''}
                    onChange={(e) => updateConfig({ fromName: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="flex-1"
                  size="sm"
                >
                  {isSavingConfig ? 'Guardando...' : 'Guardar Configuración'}
                </Button>
              </div>

              <div className="border-t pt-4 space-y-3">
                <Label className="text-sm font-medium">Probar Configuración</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="tu@email.com"
                    value={customTestEmail}
                    onChange={(e) => setCustomTestEmail(e.target.value)}
                    className="text-sm flex-1"
                  />
                  <Button
                    onClick={handleTestConfiguration}
                    disabled={isSending}
                    size="sm"
                    variant="outline"
                  >
                    {isSending ? '...' : 'Probar'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Envía un email de prueba para verificar que la configuración funciona
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
