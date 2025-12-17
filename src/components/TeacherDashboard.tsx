import { User, UserProgress, Level } from '@/lib/types'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Badge } from './ui/badge'
import { SignOut, Users, ChartBar, Flame, BookOpen } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import NexusFluentLogo from './NexusFluentLogo'

interface TeacherDashboardProps {
  user: User
  onLogout: () => void
}

export default function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const [allUsers] = useKV<User[]>('all-users', [])
  const [allProgress] = useKV<Record<string, UserProgress>>('all-user-progress', {})

  const studentUsers = (allUsers || []).filter((u) => u.role === 'student')
  const students = studentUsers.map((u) => ({
    user: u,
    progress: (allProgress || {})[u.id] || {
      userId: u.id,
      completedLessons: [],
      levelProgress: {
        Beginner: 0,
        A1: 0,
        A2: 0,
        B1: 0,
        B2: 0,
        C1: 0,
        C2: 0,
      },
      currentLesson: null,
      points: 0,
      streak: 0,
      lastActivityDate: '',
      achievements: [],
      lessonScores: {},
    },
  }))

  const totalStudents = students.length
  const activeToday = students.filter((s) => {
    const today = new Date().toDateString()
    return s.progress.lastActivityDate
      ? new Date(s.progress.lastActivityDate).toDateString() === today
      : false
  }).length

  const totalLessonsCompleted = students.reduce(
    (sum, s) => sum + (s.progress.completedLessons || []).length,
    0
  )

  const averageStreak =
    students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + s.progress.streak, 0) / students.length)
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <NexusFluentLogo size={180} />
              <div className="border-l border-border h-10" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{user.username}</h2>
                  <p className="text-sm text-muted-foreground">Panel del Profesor</p>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onLogout}>
              <SignOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Panel del Profesor</h1>
          <p className="text-muted-foreground">Monitorea el progreso y actividad de los estudiantes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Total Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Users size={32} weight="fill" className="text-primary" />
                <span className="text-4xl font-bold">{totalStudents}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Activos Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <ChartBar size={32} weight="fill" className="text-success" />
                <span className="text-4xl font-bold">{activeToday}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Lecciones Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <BookOpen size={32} weight="fill" className="text-secondary" />
                <span className="text-4xl font-bold">{totalLessonsCompleted}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Racha Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Flame size={32} weight="fill" className="text-accent" />
                <span className="text-4xl font-bold">{averageStreak}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progreso de Estudiantes</CardTitle>
            <CardDescription>Vista general de la actividad y desempeño de todos los estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay datos de estudiantes disponibles todavía</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Los estudiantes aparecerán aquí una vez que comiencen a aprender
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Lecciones</TableHead>
                      <TableHead>Racha</TableHead>
                      <TableHead>Puntos</TableHead>
                      <TableHead>Logros</TableHead>
                      <TableHead>Última Actividad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const lastActive = student.progress.lastActivityDate
                        ? new Date(student.progress.lastActivityDate).toLocaleDateString()
                        : 'Nunca'
                      const completedLessons = student.progress.completedLessons || []
                      const achievements = student.progress.achievements || []
                      return (
                        <TableRow key={student.user.id}>
                          <TableCell className="font-medium">{student.user.fullName || student.user.username}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {completedLessons.length}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Flame size={16} weight="fill" className="text-accent" />
                              <span>{student.progress.streak}</span>
                            </div>
                          </TableCell>
                          <TableCell>{student.progress.points}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{achievements.length}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {lastActive}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}