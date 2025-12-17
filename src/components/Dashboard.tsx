import { useState } from 'react'
import { User, UserProgress, Level } from '@/lib/types'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import {
  House,
  ChartBar,
  Trophy,
  SignOut,
  Flame,
  Lock,
  CheckCircle,
  BookOpen,
  TrendUp,
  Certificate,
} from '@phosphor-icons/react'
import { LEVELS, LEVEL_INFO, LESSONS } from '@/lib/curriculum'
import { 
  calculateLevelProgress, 
  isLessonUnlocked, 
  isStreakAtRisk, 
  isLevelLocked,
  checkLevelCompletion,
  getLevelCompletionBadges
} from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import LearningStrategyModal from './LearningStrategyModal'
import LevelCertificate from './LevelCertificate'
import AchievementBadge from './AchievementBadge'
import NexusFluentLogo from './NexusFluentLogo'

interface DashboardProps {
  user: User
  progress: UserProgress
  onStartLesson: (lessonId: string) => void
  onLogout: () => void
  setUserProgress: (updater: (prev: UserProgress | null) => UserProgress | null) => void
  onVocabularyPractice: () => void
}

export default function Dashboard({
  user,
  progress,
  onStartLesson,
  onLogout,
  onVocabularyPractice,
}: DashboardProps) {
  const [selectedLevel, setSelectedLevel] = useState<Level>(user.currentLevel)
  const [activeTab, setActiveTab] = useState<string>('lessons')
  const [certificateOpen, setCertificateOpen] = useState(false)
  const [selectedCertificateLevel, setSelectedCertificateLevel] = useState<Level | null>(null)

  const unlockedLevels = user.unlockedLevels || ['Beginner']
  const currentLevelProgress = calculateLevelProgress(progress, selectedLevel)
  const levelLessons = LESSONS[selectedLevel]
  const completedLessons = progress.completedLessons || []
  const totalLessons = completedLessons.length
  const streakAtRisk = isStreakAtRisk(progress.lastActivityDate)
  
  const completedLevelsData = progress.completedLevels || []
  const levelCompletionBadges = getLevelCompletionBadges(progress)

  const handleViewCertificate = (level: Level) => {
    const completed = completedLevelsData.find(cl => cl.level === level)
    if (completed) {
      setSelectedCertificateLevel(level)
      setCertificateOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
              <NexusFluentLogo size={140} className="scale-75 sm:scale-100 flex-shrink-0" />
              <Separator orientation="vertical" className="h-8 hidden sm:block" />
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-base sm:text-lg font-bold text-primary">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 hidden sm:block">
                  <h2 className="font-semibold text-foreground truncate text-sm sm:text-base">{user.fullName || user.username}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">{user.currentLevel}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <div
                  className={cn(
                    'flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-accent/10',
                    streakAtRisk && 'animate-streak-pulse'
                  )}
                >
                  <Flame size={16} weight="fill" className="text-accent sm:hidden" />
                  <Flame size={20} weight="fill" className="text-accent hidden sm:inline" />
                  <span className="font-semibold text-foreground text-sm sm:text-base">{progress.streak}</span>
                </div>
                {streakAtRisk && (
                  <span className="text-xs text-destructive font-medium hidden sm:inline">¡En riesgo!</span>
                )}
              </div>

              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-secondary/20">
                <Trophy size={16} weight="fill" className="text-secondary sm:hidden" />
                <Trophy size={20} weight="fill" className="text-secondary hidden sm:inline" />
                <span className="font-semibold text-foreground text-sm sm:text-base">{progress.points}</span>
              </div>

              <Button variant="ghost" size="icon" onClick={onLogout} className="h-8 w-8 sm:h-10 sm:w-10">
                <SignOut size={16} className="sm:hidden" />
                <SignOut size={20} className="hidden sm:inline" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6 sm:mb-8">
            <TabsTrigger value="lessons" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <House size={16} className="sm:hidden" />
              <House size={18} className="hidden sm:inline" />
              <span className="hidden sm:inline">Lecciones</span>
              <span className="sm:hidden">Clases</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <ChartBar size={16} className="sm:hidden" />
              <ChartBar size={18} className="hidden sm:inline" />
              <span>Progreso</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Trophy size={16} className="sm:hidden" />
              <Trophy size={18} className="hidden sm:inline" />
              <span>Logros</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-6">
            <div className="grid md:grid-cols-[1fr_auto] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={24} />
                    Selecciona tu Nivel
                  </CardTitle>
                  <CardDescription>
                    Elige un nivel para ver y completar sus lecciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {LEVELS.map((level) => {
                      const levelProgress = calculateLevelProgress(progress, level)
                      const locked = isLevelLocked(unlockedLevels, level)
                      return (
                        <Button
                          key={level}
                          variant={selectedLevel === level ? 'default' : 'outline'}
                          onClick={() => {
                            if (locked) {
                              toast.error(`El nivel ${level} está bloqueado. Completa los niveles anteriores para desbloquearlo.`)
                            } else {
                              setSelectedLevel(level)
                            }
                          }}
                          className={cn(
                            'h-auto flex-col gap-2 py-4 relative',
                            locked && 'opacity-50 cursor-not-allowed'
                          )}
                          disabled={locked}
                        >
                          {locked && (
                            <Lock size={16} className="absolute top-2 right-2 text-muted-foreground" />
                          )}
                          <span className="font-semibold">{level}</span>
                          <Progress value={locked ? 0 : levelProgress} className="h-1.5 w-full" />
                          <span className="text-xs opacity-80">{locked ? 'Bloqueado' : `${levelProgress}%`}</span>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:w-64">
                <CardHeader>
                  <CardTitle className="text-lg">Práctica</CardTitle>
                  <CardDescription className="text-xs">
                    Herramientas adicionales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={onVocabularyPractice} 
                    variant="secondary" 
                    className="w-full justify-start"
                    size="lg"
                  >
                    <BookOpen size={20} className="mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Vocabulario</div>
                      <div className="text-xs opacity-80">Repasa palabras</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{LEVEL_INFO[selectedLevel].title}</CardTitle>
                    <CardDescription>{LEVEL_INFO[selectedLevel].description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {currentLevelProgress}% Completado
                  </Badge>
                </div>
                <Progress value={currentLevelProgress} className="mt-4" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {levelLessons.map((lesson) => {
                    const completedLessons = progress.completedLessons || []
                    const isCompleted = completedLessons.includes(lesson.id)
                    const isUnlocked = isLessonUnlocked(progress, lesson.id, selectedLevel)
                    const lessonScores = progress.lessonScores || {}
                    const score = lessonScores[lesson.id]

                    return (
                      <Card
                        key={lesson.id}
                        className={cn(
                          'transition-all hover:shadow-md',
                          !isUnlocked && 'opacity-50'
                        )}
                      >
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div
                              className={cn(
                                'w-12 h-12 rounded-full flex items-center justify-center',
                                isCompleted
                                  ? 'bg-success/20'
                                  : isUnlocked
                                    ? 'bg-primary/10'
                                    : 'bg-muted'
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle size={24} weight="fill" className="text-success" />
                              ) : isUnlocked ? (
                                <BookOpen size={24} className="text-primary" />
                              ) : (
                                <Lock size={24} className="text-muted-foreground" />
                              )}
                            </div>

                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                              <p className="text-sm text-muted-foreground">{lesson.objective}</p>
                              {score && (
                                <p className="text-xs text-success font-medium mt-1">
                                  Score: {score.score}/{score.maxScore} (
                                  {Math.round((score.score / score.maxScore) * 100)}%)
                                </p>
                              )}
                            </div>
                          </div>

                          <Button
                            onClick={() => onStartLesson(lesson.id)}
                            disabled={!isUnlocked}
                            variant={isCompleted ? 'outline' : 'default'}
                          >
                            {isCompleted ? 'Repasar' : 'Comenzar'}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Total de Lecciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <BookOpen size={32} weight="fill" className="text-primary" />
                    <span className="text-4xl font-bold">{totalLessons}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Racha Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Flame size={32} weight="fill" className="text-accent" />
                    <span className="text-4xl font-bold">{progress.streak}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Puntos Totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Trophy size={32} weight="fill" className="text-secondary" />
                    <span className="text-4xl font-bold">{progress.points}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendUp size={24} />
                  Progreso por Nivel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {LEVELS.map((level) => {
                  const levelProgress = calculateLevelProgress(progress, level)
                  return (
                    <div key={level} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{level}</span>
                        <span className="text-sm text-muted-foreground">{levelProgress}%</span>
                      </div>
                      <Progress value={levelProgress} />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Certificate size={24} weight="fill" />
                  Certificados de Nivel
                </CardTitle>
                <CardDescription>
                  Descarga tus certificados por completar niveles A2, B1 y B2
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedLevelsData.filter(cl => ['A2', 'B1', 'B2'].includes(cl.level)).length === 0 ? (
                  <div className="text-center py-12">
                    <Certificate size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      ¡Completa los niveles A2, B1 o B2 para obtener tu certificado!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(['A2', 'B1', 'B2'] as Level[]).map((level) => {
                      const completed = completedLevelsData.find(cl => cl.level === level)
                      const isLocked = !completed
                      
                      return (
                        <Card
                          key={level}
                          className={cn(
                            'relative overflow-hidden transition-all hover:shadow-lg',
                            !isLocked && 'cursor-pointer hover:scale-105'
                          )}
                          onClick={() => !isLocked && handleViewCertificate(level)}
                        >
                          <CardContent className="p-6">
                            <div className="text-center space-y-4">
                              <div className={cn(
                                'w-20 h-20 mx-auto rounded-full flex items-center justify-center',
                                isLocked ? 'bg-muted' : 'bg-gradient-to-br from-primary to-secondary'
                              )}>
                                {isLocked ? (
                                  <Lock size={32} className="text-muted-foreground" />
                                ) : (
                                  <Certificate size={32} weight="fill" className="text-white" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-foreground">{level}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {isLocked ? 'Bloqueado' : 'Certificado Disponible'}
                                </p>
                                {!isLocked && completed && (
                                  <>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {completed.totalLessons} lecciones
                                    </p>
                                    <p className="text-xs text-success font-medium">
                                      Promedio: {completed.averageScore}%
                                    </p>
                                  </>
                                )}
                              </div>
                              {!isLocked && (
                                <Button variant="outline" size="sm" className="w-full">
                                  Ver Certificado
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy size={24} />
                  Insignias de Logros
                </CardTitle>
                <CardDescription>
                  {levelCompletionBadges.length + (progress.achievements || []).length} desbloqueados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {levelCompletionBadges.length === 0 && (progress.achievements || []).length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      ¡Completa lecciones para desbloquear insignias!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {levelCompletionBadges.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Certificaciones de Nivel</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {levelCompletionBadges.map((badge, index) => (
                            <AchievementBadge
                              key={badge.id}
                              type="level-complete"
                              level={badge.id.includes('a2') ? 'A2' : badge.id.includes('b1') ? 'B1' : 'B2'}
                              title={badge.title}
                              description={badge.description}
                              unlockedAt={badge.unlockedAt}
                              index={index}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {(progress.achievements || []).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Logros Generales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {(progress.achievements || []).map((achievement, index) => {
                            let type: 'level-complete' | 'perfect-score' | 'streak' | 'all-lessons' | 'fast-learner' = 'all-lessons'
                            
                            if (achievement.id.includes('perfect')) type = 'perfect-score'
                            else if (achievement.id.includes('streak')) type = 'streak'
                            else if (achievement.id.includes('lesson')) type = 'all-lessons'
                            
                            return (
                              <AchievementBadge
                                key={achievement.id}
                                type={type}
                                title={achievement.title}
                                description={achievement.description}
                                unlockedAt={achievement.unlockedAt}
                                index={index + levelCompletionBadges.length}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <LearningStrategyModal onClose={() => {}} />
      
      {selectedCertificateLevel && (
        <LevelCertificate
          level={selectedCertificateLevel}
          user={user}
          completedDate={completedLevelsData.find(cl => cl.level === selectedCertificateLevel)?.completedAt || Date.now()}
          totalLessons={completedLevelsData.find(cl => cl.level === selectedCertificateLevel)?.totalLessons || 0}
          averageScore={completedLevelsData.find(cl => cl.level === selectedCertificateLevel)?.averageScore || 0}
          isOpen={certificateOpen}
          onClose={() => {
            setCertificateOpen(false)
            setSelectedCertificateLevel(null)
          }}
        />
      )}
    </div>
  )
}