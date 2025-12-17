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
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <Shield size={24} weight="bold" className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Panel Super Administrador</h1>
              <p className="text-sm text-muted-foreground">{user.fullName || user.username}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <SignOut size={20} className="mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={24} className="text-primary" />
                Total Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{(allUsers || []).length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{students.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profesores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-secondary">{teachers.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Crear, editar y eliminar usuarios del sistema</CardDescription>
              </div>
              <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus size={20} className="mr-2" />
                    Agregar Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                      Completa los datos para crear un nuevo usuario en el sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Nombre Completo *</Label>
                      <Input
                        id="fullname"
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        placeholder="Nombre del usuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Usuario *</Label>
                      <Input
                        id="username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="nombreusuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol</Label>
                      <Select value={newRole} onValueChange={(v) => setNewRole(v as 'student' | 'teacher')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Estudiante</SelectItem>
                          <SelectItem value="teacher">Profesor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddUser} className="w-full">
                      Crear Usuario
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Niveles Desbloqueados</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(allUsers || [])
                  .filter((u) => u.role !== 'superadmin')
                  .map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.username}</TableCell>
                      <TableCell>{u.fullName || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === 'teacher' ? 'default' : 'secondary'}>
                          {u.role === 'teacher' ? 'Profesor' : 'Estudiante'}
                        </Badge>
                      </TableCell>
                      <TableCell>{u.currentLevel}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {(u.unlockedLevels || ['Beginner']).length} de {LEVELS.length}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(u.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleAccess(u.id, u.unlockedLevels)}
                          >
                            {(u.unlockedLevels || ['Beginner']).length === LEVELS.length ? (
                              <Lock size={16} />
                            ) : (
                              <LockOpen size={16} />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(u.id, u.username)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
