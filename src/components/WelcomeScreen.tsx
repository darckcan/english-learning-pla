import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { User, ThemeType } from '@/lib/types'
import { GraduationCap, Eye, EyeSlash } from '@phosphor-icons/react'
import { simpleHash, validateSuperAdmin, createSuperAdmin } from '@/lib/helpers'
import { toast } from 'sonner'
import NexusFluentLogo from './NexusFluentLogo'
import ThemeSelector from './ThemeSelector'
import { applyTheme } from '@/lib/themes'
import { createTrialMembership } from '@/lib/membership'
import { haptics } from '@/lib/haptics'

interface WelcomeScreenProps {
  onLogin: (user: User) => void
}

export default function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  const [allUsers, setAllUsers] = useKV<User[]>('all-users', [])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('default')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const superAdmin = createSuperAdmin()
    setAllUsers((current) => {
      const users = current || []
      const hasSuperAdmin = users.some(u => u.username === 'darckcan')
      if (!hasSuperAdmin) {
        return [superAdmin, ...users]
      }
      return users
    })
  }, [setAllUsers])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      haptics.error()
      toast.error('Por favor ingresa usuario y contraseña')
      return
    }

    if (validateSuperAdmin(username, password)) {
      haptics.success()
      const superAdmin = createSuperAdmin()
      superAdmin.lastActive = Date.now()
      setAllUsers((current) => {
        const users = current || []
        return users.map(u => u.username === 'darckcan' ? superAdmin : u)
      })
      
      if (superAdmin.selectedTheme) {
        applyTheme(superAdmin.selectedTheme)
      }
      
      onLogin(superAdmin)
      toast.success('¡Bienvenido Super Administrador!')
      return
    }

    const users = allUsers || []
    const user = users.find(u => u.username === username.trim())
    if (!user) {
      haptics.error()
      toast.error('Usuario no encontrado')
      return
    }

    if (user.password !== simpleHash(password)) {
      haptics.error()
      toast.error('Contraseña incorrecta')
      return
    }

    haptics.success()
    user.lastActive = Date.now()
    setAllUsers((current) => {
      const users = current || []
      return users.map(u => u.id === user.id ? user : u)
    })
    
    if (user.selectedTheme) {
      applyTheme(user.selectedTheme)
    }
    
    onLogin(user)
    toast.success(`¡Bienvenido ${user.fullName || user.username}!`)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim() || !fullName.trim()) {
      haptics.error()
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    if (!email.trim()) {
      haptics.error()
      toast.error('Por favor ingresa tu correo electrónico para recibir la confirmación')
      return
    }

    if (username.toLowerCase() === 'darckcan') {
      haptics.error()
      toast.error('Este nombre de usuario no está disponible')
      return
    }

    const users = allUsers || []
    const existingUser = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase())
    if (existingUser) {
      haptics.error()
      toast.error('Este nombre de usuario ya existe')
      return
    }

    const existingEmail = users.find(u => u.email?.toLowerCase() === email.trim().toLowerCase())
    if (existingEmail) {
      haptics.error()
      toast.error('Este correo electrónico ya está registrado')
      return
    }

    haptics.success()
    const trialMembership = createTrialMembership()

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username: username.trim(),
      password: simpleHash(password),
      role: 'student',
      currentLevel: 'Beginner',
      unlockedLevels: ['Beginner'],
      createdAt: Date.now(),
      lastActive: Date.now(),
      fullName: fullName.trim(),
      email: email.trim(),
      membership: trialMembership,
      selectedTheme: selectedTheme,
    }

    setAllUsers((current) => {
      const users = current || []
      return [...users, newUser]
    })

    if (newUser.email) {
      try {
        const { sendEmail, generateWelcomeEmail } = await import('@/lib/email-service')
        const welcomeEmail = generateWelcomeEmail(newUser)
        const emailSent = await sendEmail(newUser.email, welcomeEmail.subject, welcomeEmail.body)
        
        if (emailSent) {
          toast.success(
            <div className="space-y-2">
              <p className="font-semibold">¡Cuenta creada exitosamente!</p>
              <p className="text-sm">✅ Correo de confirmación enviado a {newUser.email}</p>
              <p className="text-sm text-accent font-medium">🎉 Tienes 15 días de prueba gratuita</p>
            </div>,
            { duration: 6000 }
          )
        } else {
          throw new Error('Failed to send email')
        }
        
      } catch (error) {
        console.error('Error al enviar el correo de bienvenida:', error)
        toast.success(
          <div className="space-y-2">
            <p className="font-semibold">¡Cuenta creada exitosamente!</p>
            <p className="text-sm text-muted-foreground">⚠️ Hubo un problema enviando el correo de confirmación</p>
            <p className="text-sm text-accent font-medium">🎉 Tienes 15 días de prueba gratuita</p>
          </div>,
          { duration: 5000 }
        )
      }
    } else {
      toast.success(
        <div className="space-y-2">
          <p className="font-semibold">¡Cuenta creada exitosamente!</p>
          <p className="text-sm text-accent font-medium">🎉 Tienes 15 días de prueba gratuita</p>
        </div>,
        { duration: 5000 }
      )
    }

    setUsername('')
    setPassword('')
    setFullName('')
    setEmail('')
    setSelectedTheme('default')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-secondary/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(120,119,198,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,_rgba(255,122,122,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
          <NexusFluentLogo size={220} className="mb-2 scale-90 sm:scale-100" />
          <p className="text-muted-foreground text-base sm:text-lg px-4">Tu camino hacia la fluidez comienza aquí</p>
        </div>

        <Card className="shadow-2xl border-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="px-4 sm:px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="text-sm sm:text-base">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register" className="text-sm sm:text-base">Registrarse</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="px-4 sm:px-6">
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Usuario</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Ingresa tu usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Entrar
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-fullname">Nombre Completo *</Label>
                    <Input
                      id="register-fullname"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Correo Electrónico *</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-username">Usuario *</Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="Elige un nombre de usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña *</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Crea una contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <ThemeSelector 
                    selectedTheme={selectedTheme}
                    onThemeChange={setSelectedTheme}
                  />

                  <div className="pt-2">
                    <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md space-y-1">
                      <p className="font-semibold text-foreground">🎉 Incluye:</p>
                      <p>• 15 días de prueba gratuita</p>
                      <p>• Acceso completo a 270+ lecciones</p>
                      <p>• Examen de ubicación personalizado</p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Crear Cuenta Gratis
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}