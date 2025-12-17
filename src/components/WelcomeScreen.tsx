import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { User } from '@/lib/types'
import { GraduationCap, Eye, EyeSlash } from '@phosphor-icons/react'
import { simpleHash, validateSuperAdmin, createSuperAdmin } from '@/lib/helpers'
import { toast } from 'sonner'
import NexusFluentLogo from './NexusFluentLogo'

interface WelcomeScreenProps {
  onLogin: (user: User) => void
}

export default function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  const [allUsers, setAllUsers] = useKV<User[]>('all-users', [])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
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
      toast.error('Por favor ingresa usuario y contraseña')
      return
    }

    if (validateSuperAdmin(username, password)) {
      const superAdmin = createSuperAdmin()
      superAdmin.lastActive = Date.now()
      setAllUsers((current) => {
        const users = current || []
        return users.map(u => u.username === 'darckcan' ? superAdmin : u)
      })
      onLogin(superAdmin)
      toast.success('¡Bienvenido Super Administrador!')
      return
    }

    const users = allUsers || []
    const user = users.find(u => u.username === username.trim())
    if (!user) {
      toast.error('Usuario no encontrado')
      return
    }

    if (user.password !== simpleHash(password)) {
      toast.error('Contraseña incorrecta')
      return
    }

    user.lastActive = Date.now()
    setAllUsers((current) => {
      const users = current || []
      return users.map(u => u.id === user.id ? user : u)
    })
    onLogin(user)
    toast.success(`¡Bienvenido ${user.fullName || user.username}!`)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim() || !fullName.trim()) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    if (username.toLowerCase() === 'darckcan') {
      toast.error('Este nombre de usuario no está disponible')
      return
    }

    const users = allUsers || []
    const existingUser = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase())
    if (existingUser) {
      toast.error('Este nombre de usuario ya existe')
      return
    }

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
      email: email.trim() || undefined,
    }

    setAllUsers((current) => {
      const users = current || []
      return [...users, newUser]
    })
    toast.success('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión')
    setUsername('')
    setPassword('')
    setFullName('')
    setEmail('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-secondary/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(120,119,198,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,_rgba(255,122,122,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
          <NexusFluentLogo size={260} className="mb-2" />
          <p className="text-muted-foreground text-lg">Tu camino hacia la fluidez comienza aquí</p>
        </div>

        <Card className="shadow-2xl border-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
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
                    <Label htmlFor="register-email">Correo Electrónico</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                  <Button type="submit" className="w-full" size="lg">
                    Crear Cuenta
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