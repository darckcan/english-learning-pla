import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, UserProgress, Level } from '@/lib/types'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Shield, SignOut, UserPlus, Trash, Lock, LockOpen, Users } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { LEVELS } from '@/lib/curriculum'
import { formatDate, simpleHash } from '@/lib/helpers'
import NexusFluentLogo from './NexusFluentLogo'
import MembershipPricingSettings from './MembershipPricingSettings'
import PaymentsDashboard from './PaymentsDashboard'
import EmailNotificationManager from './EmailNotificationManager'
import EmailTestPanel from './EmailTestPanel'
import { createTrialMembership } from '@/lib/membership'

interface SuperAdminDashboardProps {
  user: User
  onLogout: () => void
}

export default function SuperAdminDashboard({ user, onLogout }: SuperAdminDashboardProps) {
  const [allUsers, setAllUsers] = useKV<User[]>('all-users', [])
  const [allProgress, setAllProgress] = useKV<Record<string, UserProgress>>('all-progress', {})
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newFullName, setNewFullName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<'student' | 'teacher'>('student')

  const students = (allUsers || []).filter((u) => u.role === 'student')
  const teachers = (allUsers || []).filter((u) => u.role === 'teacher')

  const handleAddUser = () => {
    if (!newUsername.trim() || !newPassword.trim() || !newFullName.trim()) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    const users = allUsers || []
    const existingUser = users.find((u) => u.username.toLowerCase() === newUsername.trim().toLowerCase())
    if (existingUser) {
      toast.error('Este nombre de usuario ya existe')
      return
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username: newUsername.trim(),
      password: simpleHash(newPassword),
      role: newRole,
      currentLevel: 'Beginner',
      unlockedLevels: ['Beginner'],
      createdAt: Date.now(),
      lastActive: Date.now(),
      fullName: newFullName.trim(),
      email: newEmail.trim() || undefined,
      membership: createTrialMembership(),
      selectedTheme: 'default',
    }

    setAllUsers((current) => {
      const users = current || []
      return [...users, newUser]
    })

    toast.success(`Usuario ${newUsername} creado exitosamente`)
    setNewUsername('')
    setNewPassword('')
    setNewFullName('')
    setNewEmail('')
    setShowAddUser(false)
  }

  const handleDeleteUser = (userId: string, username: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al usuario ${username}?`)) {
      return
    }

    setAllUsers((current) => {
      const users = current || []
      return users.filter((u) => u.id !== userId)
    })

    setAllProgress((current) => {
      const progress = current || {}
      const newProgress = { ...progress }
      delete newProgress[userId]
      return newProgress
    })

    toast.success(`Usuario ${username} eliminado`)
  }

  const handleToggleAccess = (userId: string, currentLevels: Level[]) => {
    const unlockedLevels = currentLevels || ['Beginner']
    const allLocked = unlockedLevels.length === 1 && unlockedLevels[0] === 'Beginner'
    const newLevels: Level[] = allLocked ? [...LEVELS] : ['Beginner']

    setAllUsers((current) => {
      const users = current || []
      return users.map((u) =>
        u.id === userId ? { ...u, unlockedLevels: newLevels } : u
      )
    })

    toast.success(allLocked ? 'Todos los niveles desbloqueados' : 'Solo Beginner desbloqueado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="hidden sm:block">
                <NexusFluentLogo size={180} />
              </div>
              <div className="sm:hidden">
                <NexusFluentLogo size={120} />
              </div>
              <div className="hidden sm:block border-l border-border h-10" />
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary to-secondary rounded-lg flex-shrink-0">
                  <Shield size={20} weight="bold" className="text-white sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-xl font-bold truncate">Super Admin</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.fullName || user.username}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} size="sm" className="flex-shrink-0">
              <SignOut size={18} className="sm:mr-2" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users size={20} className="text-primary sm:w-6 sm:h-6" />
                Total Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold">{(allUsers || []).length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold text-primary">{students.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Profesores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold text-secondary">{teachers.length}</p>
            </CardContent>
          </Card>
        </div>

        <MembershipPricingSettings />

        <PaymentsDashboard />

        <EmailNotificationManager users={allUsers || []} />

        <EmailTestPanel users={allUsers || []} />

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base sm:text-lg">Gestión de Usuarios</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Crear, editar y eliminar usuarios del sistema</CardDescription>
              </div>
              <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full sm:w-auto">
                    <UserPlus size={18} className="mr-2" />
                    Agregar Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                      Completa los datos para crear un nuevo usuario en el sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 sm:space-y-4 pt-4 max-h-[60vh] overflow-y-auto px-1">
                    <div className="space-y-2">
                      <Label htmlFor="fullname" className="text-sm">Nombre Completo *</Label>
                      <Input
                        id="fullname"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        placeholder="Nombre del usuario"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm">Usuario *</Label>
                      <Input
                        id="username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="nombreusuario"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm">Rol</Label>
                      <Select value={newRole} onValueChange={(v) => setNewRole(v as 'student' | 'teacher')}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Estudiante</SelectItem>
                          <SelectItem value="teacher">Profesor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddUser} className="w-full" size="sm">
                      Crear Usuario
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[800px] sm:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Usuario</TableHead>
                    <TableHead className="text-xs sm:text-sm">Nombre</TableHead>
                    <TableHead className="text-xs sm:text-sm">Rol</TableHead>
                    <TableHead className="text-xs sm:text-sm">Nivel</TableHead>
                    <TableHead className="text-xs sm:text-sm">Niveles Desbloqueados</TableHead>
                    <TableHead className="text-xs sm:text-sm">Fecha Creación</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(allUsers || [])
                    .filter((u) => u.role !== 'superadmin')
                    .map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">{u.username}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{u.fullName || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === 'teacher' ? 'default' : 'secondary'} className="text-xs">
                            {u.role === 'teacher' ? 'Profesor' : 'Estudiante'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">{u.currentLevel}</TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {(u.unlockedLevels || ['Beginner']).length} de {LEVELS.length}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(u.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 sm:gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleAccess(u.id, u.unlockedLevels)}
                              className="h-7 w-7 p-0"
                            >
                              {(u.unlockedLevels || ['Beginner']).length === LEVELS.length ? (
                                <Lock size={14} />
                              ) : (
                                <LockOpen size={14} />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(u.id, u.username)}
                              className="h-7 w-7 p-0"
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
