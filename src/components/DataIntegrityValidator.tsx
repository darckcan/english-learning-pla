import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, UserProgress } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { CheckCircle, XCircle, Warning, Database } from '@phosphor-icons/react'
import { Button } from './ui/button'

interface ValidationResult {
  category: string
  test: string
  status: 'pass' | 'fail' | 'warning'
  message: string
}

export default function DataIntegrityValidator() {
  const [currentUser] = useKV<User | null>('current-user', null)
  const [allUsers] = useKV<User[]>('all-users', [])
  const [allProgress] = useKV<Record<string, UserProgress>>('all-user-progress', {})
  
  const [results, setResults] = useState<ValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)

  const userProgress = currentUser ? allProgress?.[currentUser.id] : null

  const runValidation = () => {
    setIsValidating(true)
    const validationResults: ValidationResult[] = []

    validationResults.push({
      category: 'Usuario',
      test: 'current-user existe',
      status: currentUser ? 'pass' : 'warning',
      message: currentUser 
        ? `Usuario: ${currentUser.username}` 
        : 'No hay usuario logueado'
    })

    if (currentUser) {
      const userInAllUsers = (allUsers || []).find(u => u.id === currentUser.id)
      validationResults.push({
        category: 'Sync',
        test: 'Usuario en all-users',
        status: userInAllUsers ? 'pass' : 'fail',
        message: userInAllUsers 
          ? 'OK' 
          : '❌ Usuario NO está en all-users'
      })

      if (userInAllUsers) {
        const themesMatch = userInAllUsers.selectedTheme === currentUser.selectedTheme
        validationResults.push({
          category: 'Sync',
          test: 'Tema sincronizado',
          status: themesMatch ? 'pass' : 'fail',
          message: themesMatch 
            ? `Tema: ${currentUser.selectedTheme}` 
            : `❌ Temas no coinciden`
        })

        const levelsMatch = JSON.stringify(userInAllUsers.unlockedLevels) === JSON.stringify(currentUser.unlockedLevels)
        validationResults.push({
          category: 'Sync',
          test: 'Niveles sincronizados',
          status: levelsMatch ? 'pass' : 'fail',
          message: levelsMatch 
            ? `${currentUser.unlockedLevels.length} niveles` 
            : `❌ Niveles no coinciden`
        })
      }
    }

    validationResults.push({
      category: 'Progreso',
      test: 'Progreso del usuario',
      status: userProgress ? 'pass' : 'warning',
      message: userProgress 
        ? `${userProgress.completedLessons.length} lecciones, ${userProgress.points} pts` 
        : 'Sin progreso registrado'
    })

    if (currentUser && userProgress) {
      validationResults.push({
        category: 'Sync',
        test: 'Progreso en all-progress',
        status: 'pass',
        message: 'OK - Datos desde all-user-progress'
      })

      validationResults.push({
        category: 'Sync',
        test: 'Puntos del usuario',
        status: 'pass',
        message: `${userProgress.points} pts`
      })
    }

    const totalProgress = Object.keys(allProgress || {}).length
    const orphanedProgress = Object.keys(allProgress || {}).filter(
      id => !(allUsers || []).find(u => u.id === id)
    )

    validationResults.push({
      category: 'DB',
      test: 'Usuarios registrados',
      status: 'pass',
      message: `${(allUsers || []).length} usuarios`
    })

    validationResults.push({
      category: 'DB',
      test: 'Registros de progreso',
      status: 'pass',
      message: `${totalProgress} registros`
    })

    validationResults.push({
      category: 'Integridad',
      test: 'Progreso huérfano',
      status: orphanedProgress.length > 0 ? 'warning' : 'pass',
      message: orphanedProgress.length === 0
        ? 'Sin huérfanos' 
        : `⚠️ ${orphanedProgress.length} huérfanos`
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
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
              <Database size={16} className="sm:w-5 sm:h-5" />
              Validador de Datos
            </CardTitle>
            <CardDescription className="text-[10px] sm:text-sm">
              Verifica integridad de datos
            </CardDescription>
          </div>
          <Button onClick={runValidation} disabled={isValidating} size="sm" className="h-8 text-xs">
            {isValidating ? 'Validando...' : 'Re-validar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6 pt-0 space-y-3">
        <div className="flex flex-wrap gap-1.5 sm:gap-3">
          <Badge variant={failCount > 0 ? 'destructive' : 'default'} className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
            ✓ {passCount}
          </Badge>
          {failCount > 0 && (
            <Badge variant="destructive" className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
              ✗ {failCount}
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
              ⚠ {warningCount}
            </Badge>
          )}
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-2 sm:p-3 rounded-lg border ${
                result.status === 'pass' 
                  ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                  : result.status === 'fail'
                  ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                  : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  {result.status === 'pass' && <CheckCircle size={14} weight="fill" className="text-green-600 sm:w-5 sm:h-5" />}
                  {result.status === 'fail' && <XCircle size={14} weight="fill" className="text-red-600 sm:w-5 sm:h-5" />}
                  {result.status === 'warning' && <Warning size={14} weight="fill" className="text-yellow-600 sm:w-5 sm:h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[9px] sm:text-xs px-1 sm:px-1.5">
                      {result.category}
                    </Badge>
                    <span className="text-[11px] sm:text-sm font-medium truncate">{result.test}</span>
                  </div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground mt-0.5 truncate">{result.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
