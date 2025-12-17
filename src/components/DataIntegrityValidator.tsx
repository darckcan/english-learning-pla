import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, UserProgress } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { CheckCircle, XCircle, Warning } from '@phosphor-icons/react'
import { Button } from './ui/button'

interface ValidationResult {
  category: string
  test: string
  status: 'pass' | 'fail' | 'warning'
  message: string
}

export default function DataIntegrityValidator() {
  const [currentUser] = useKV<User | null>('current-user', null)
  const [userProgress] = useKV<UserProgress | null>('user-progress', null)
  const [allUsers] = useKV<User[]>('all-users', [])
  const [allProgress] = useKV<Record<string, UserProgress>>('all-user-progress', {})
  
  const [results, setResults] = useState<ValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)

  const runValidation = () => {
    setIsValidating(true)
    const validationResults: ValidationResult[] = []

    validationResults.push({
      category: 'Usuario Actual',
      test: 'current-user existe',
      status: currentUser ? 'pass' : 'warning',
      message: currentUser 
        ? `Usuario: ${currentUser.username} (${currentUser.id})` 
        : 'No hay usuario logueado (esperado si no hay sesión activa)'
    })

    if (currentUser) {
      const userInAllUsers = (allUsers || []).find(u => u.id === currentUser.id)
      validationResults.push({
        category: 'Sincronización',
        test: 'current-user está en all-users',
        status: userInAllUsers ? 'pass' : 'fail',
        message: userInAllUsers 
          ? 'Usuario actual está correctamente registrado en all-users' 
          : '❌ CRÍTICO: Usuario actual NO está en all-users'
      })

      if (userInAllUsers) {
        const themesMatch = userInAllUsers.selectedTheme === currentUser.selectedTheme
        validationResults.push({
          category: 'Sincronización',
          test: 'Tema sincronizado',
          status: themesMatch ? 'pass' : 'fail',
          message: themesMatch 
            ? `Tema: ${currentUser.selectedTheme}` 
            : `❌ Tema en current-user (${currentUser.selectedTheme}) ≠ all-users (${userInAllUsers.selectedTheme})`
        })

        const levelsMatch = JSON.stringify(userInAllUsers.unlockedLevels) === JSON.stringify(currentUser.unlockedLevels)
        validationResults.push({
          category: 'Sincronización',
          test: 'Niveles desbloqueados sincronizados',
          status: levelsMatch ? 'pass' : 'fail',
          message: levelsMatch 
            ? `Niveles: ${currentUser.unlockedLevels.join(', ')}` 
            : `❌ Niveles no coinciden entre current-user y all-users`
        })
      }
    }

    validationResults.push({
      category: 'Progreso Actual',
      test: 'user-progress existe',
      status: userProgress ? 'pass' : 'warning',
      message: userProgress 
        ? `${userProgress.completedLessons.length} lecciones completadas, ${userProgress.points} puntos` 
        : 'No hay progreso (esperado para usuarios nuevos)'
    })

    if (currentUser && userProgress) {
      const progressInAllProgress = allProgress?.[currentUser.id]
      validationResults.push({
        category: 'Sincronización',
        test: 'user-progress está en all-user-progress',
        status: progressInAllProgress ? 'pass' : 'fail',
        message: progressInAllProgress 
          ? 'Progreso actual está en all-user-progress' 
          : '❌ CRÍTICO: Progreso NO está en all-user-progress (profesores/admins no verán datos)'
      })

      if (progressInAllProgress) {
        const pointsMatch = progressInAllProgress.points === userProgress.points
        validationResults.push({
          category: 'Sincronización',
          test: 'Puntos sincronizados',
          status: pointsMatch ? 'pass' : 'fail',
          message: pointsMatch 
            ? `Puntos: ${userProgress.points}` 
            : `❌ Puntos en user-progress (${userProgress.points}) ≠ all-user-progress (${progressInAllProgress.points})`
        })

        const lessonsMatch = progressInAllProgress.completedLessons.length === userProgress.completedLessons.length
        validationResults.push({
          category: 'Sincronización',
          test: 'Lecciones completadas sincronizadas',
          status: lessonsMatch ? 'pass' : 'fail',
          message: lessonsMatch 
            ? `Lecciones: ${userProgress.completedLessons.length}` 
            : `❌ Lecciones completadas no coinciden`
        })

        const streakMatch = progressInAllProgress.streak === userProgress.streak
        validationResults.push({
          category: 'Sincronización',
          test: 'Racha sincronizada',
          status: streakMatch ? 'pass' : 'fail',
          message: streakMatch 
            ? `Racha: ${userProgress.streak} días` 
            : `❌ Racha en user-progress (${userProgress.streak}) ≠ all-user-progress (${progressInAllProgress.streak})`
        })
      }
    }

    validationResults.push({
      category: 'Base de Datos',
      test: 'Total de usuarios registrados',
      status: (allUsers || []).length > 0 ? 'pass' : 'warning',
      message: `${(allUsers || []).length} usuarios en el sistema`
    })

    const totalProgress = Object.keys(allProgress || {}).length
    validationResults.push({
      category: 'Base de Datos',
      test: 'Total de registros de progreso',
      status: totalProgress > 0 ? 'pass' : 'warning',
      message: `${totalProgress} registros de progreso en all-user-progress`
    })

    const orphanedProgress = Object.keys(allProgress || {}).filter(userId => {
      return !(allUsers || []).some(u => u.id === userId)
    })
    validationResults.push({
      category: 'Integridad',
      test: 'Progreso huérfano (sin usuario)',
      status: orphanedProgress.length === 0 ? 'pass' : 'warning',
      message: orphanedProgress.length === 0 
        ? 'No hay progreso huérfano' 
        : `⚠️ ${orphanedProgress.length} registros de progreso sin usuario asociado`
    })

    const usersWithoutProgress = (allUsers || []).filter(u => {
      return u.role === 'student' && !(allProgress || {})[u.id]
    })
    validationResults.push({
      category: 'Integridad',
      test: 'Estudiantes sin progreso',
      status: usersWithoutProgress.length === 0 ? 'pass' : 'warning',
      message: usersWithoutProgress.length === 0 
        ? 'Todos los estudiantes tienen progreso' 
        : `⚠️ ${usersWithoutProgress.length} estudiantes sin registro de progreso (normal para nuevos usuarios)`
    })

    setResults(validationResults)
    setIsValidating(false)
  }

  useEffect(() => {
    runValidation()
  }, [])

  const passCount = results.filter(r => r.status === 'pass').length
  const failCount = results.filter(r => r.status === 'fail').length
  const warningCount = results.filter(r => r.status === 'warning').length

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Validador de Integridad de Datos</CardTitle>
          <CardDescription>
            Verifica que todos los datos se estén guardando correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Badge variant={failCount > 0 ? 'destructive' : 'default'} className="text-lg px-4 py-2">
              ✓ {passCount} Pasadas
            </Badge>
            {failCount > 0 && (
              <Badge variant="destructive" className="text-lg px-4 py-2">
                ✗ {failCount} Fallas
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                ⚠ {warningCount} Advertencias
              </Badge>
            )}
            <Button onClick={runValidation} disabled={isValidating} size="sm" className="ml-auto">
              {isValidating ? 'Validando...' : 'Re-validar'}
            </Button>
          </div>

          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.status === 'pass' 
                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                    : result.status === 'fail'
                    ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                    : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {result.status === 'pass' && <CheckCircle size={20} weight="fill" className="text-green-600" />}
                    {result.status === 'fail' && <XCircle size={20} weight="fill" className="text-red-600" />}
                    {result.status === 'warning' && <Warning size={20} weight="fill" className="text-yellow-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                      <span className="text-sm font-semibold">{result.test}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
