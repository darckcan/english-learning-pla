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
  const [userProgress] = useKV<UserProgress | null>('user-progress', null)
  const [allUsers] = useKV<User[]>('all-users', [])
  const [allProgress] = useKV<Record<string, UserProgress>>('all-user-progress', {})
  
  const [results, setResults] = useState<ValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)

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
      test: 'user-progress existe',
      status: userProgress ? 'pass' : 'warning',
      message: userProgress 
        ? `${userProgress.completedLessons.length} lecciones, ${userProgress.points} pts` 
        : 'Sin progreso'
    })

    if (currentUser && userProgress) {
      const progressInAllProgress = allProgress?.[currentUser.id]
      validationResults.push({
        category: 'Sync',
        test: 'Progreso en all-progress',
        status: progressInAllProgress ? 'pass' : 'fail',
        message: progressInAllProgress 
          ? 'OK' 
          : '❌ Progreso NO sincronizado'
      })

      if (progressInAllProgress) {
        const pointsMatch = progressInAllProgress.points === userProgress.points
        validationResults.push({
          category: 'Sync',
          test: 'Puntos sincronizados',
          status: pointsMatch ? 'pass' : 'fail',
          message: pointsMatch 
            ? `${userProgress.points} pts` 
            : `❌ Puntos no coinciden`
        })
    })
    validationResults.push({
      category: 'Integridad',
      test: 'Progreso huérfano',
      category: 'DB',: 'warning',
      test: 'Usuarios registrados',
        ? 'Sin huérfanos' 
      message: `${(allUsers || []).length} usuarios`
    })

    setResults(validationResults)
    setIsValidating(false)
      category: 'DB',
      test: 'Registros de progreso',
  useEffect(() => {
      message: `${totalProgress} registros`
  }, [])

  const passCount = results.filter(r => r.status === 'pass').length
  const failCount = results.filter(r => r.status === 'fail').length
  const warningCount = results.filter(r => r.status === 'warning').length

  return (
      test: 'Progreso huérfano',
      <CardHeader className="p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        ? 'Sin huérfanos' 
        : `⚠️ ${orphanedProgress.length} huérfanos`
              <Database size={16} className="sm:w-5 sm:h-5" />
              Validador de Datos
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
          </div>0 border-yellow-200 dark:border-yellow-800'
          <Button onClick={runValidation} disabled={isValidating} size="sm" className="h-8 text-xs">
            {isValidating ? 'Validando...' : 'Re-validar'}
          </Button>
        </div>.5">
      </CardHeader>s' && <CheckCircle size={14} weight="fill" className="text-green-600 sm:w-5 sm:h-5" />}
      <CardContent className="p-2 sm:p-6 pt-0 space-y-3">t="fill" className="text-red-600 sm:w-5 sm:h-5" />}
        <div className="flex flex-wrap gap-1.5 sm:gap-3">e="text-yellow-600 sm:w-5 sm:h-5" />}
          <Badge variant={failCount > 0 ? 'destructive' : 'default'} className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
            ✓ {passCount}
          </Badge>tems-center gap-1 sm:gap-2 flex-wrap">
          {failCount > 0 && (" className="text-[9px] sm:text-xs px-1 sm:px-1.5">
            <Badge variant="destructive" className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
              ✗ {failCount}
            </Badge>-[11px] sm:text-sm font-medium truncate">{result.test}</span>
          )}
          {warningCount > 0 && (text-[10px] sm:text-sm text-muted-foreground mt-0.5 truncate">{result.message}</p>
            <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
              ⚠ {warningCount}
            </Badge>
          )}
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          {results.map((result, index) => (
            <div
              key={index}              className={`p-2 sm:p-3 rounded-lg border ${                result.status === 'pass'                   ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'                   : result.status === 'fail'                  ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'                  : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'              }`}            >              <div className="flex items-start gap-2">                <div className="flex-shrink-0 mt-0.5">                  {result.status === 'pass' && <CheckCircle size={14} weight="fill" className="text-green-600 sm:w-5 sm:h-5" />}                  {result.status === 'fail' && <XCircle size={14} weight="fill" className="text-red-600 sm:w-5 sm:h-5" />}                  {result.status === 'warning' && <Warning size={14} weight="fill" className="text-yellow-600 sm:w-5 sm:h-5" />}                </div>                <div className="flex-1 min-w-0">                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">                    <Badge variant="outline" className="text-[9px] sm:text-xs px-1 sm:px-1.5">
                      {result.category}
                    </Badge>
                    <span className="text-[11px] sm:text-sm font-medium truncate">{result.test}</span>
                  <p className="text-[10px] sm:text-sm text-muted-foreground mt-0.5 truncate">{result.message}</p>
            </div>          ))}        </div>      </CardContent>    </Card>