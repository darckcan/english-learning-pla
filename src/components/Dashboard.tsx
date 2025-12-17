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
} from '@phosphor-icons/react'
import { LEVELS, LEVEL_INFO, LESSONS } from '@/lib/curriculum'
import { calculateLevelProgress, isLessonUnlocked, isStreakAtRisk } from '@/lib/helpers'
import { cn } from '@/lib/utils'

interface DashboardProps {
  user: User
  progress: UserProgress
  onStartLesson: (lessonId: string) => void
  onLogout: () => void
  setUserProgress: (updater: (prev: UserProgress | null) => UserProgress | null) => void
}

export default function Dashboard({
  user,
  progress,
  onStartLesson,
  onLogout,
}: DashboardProps) {
  const [selectedLevel, setSelectedLevel] = useState<Level>(user.currentLevel)
  const [activeTab, setActiveTab] = useState<string>('lessons')

  const currentLevelProgress = calculateLevelProgress(progress, selectedLevel)
  const levelLessons = LESSONS[selectedLevel]
  const totalLessons = progress.completedLessons.length
  const streakAtRisk = isStreakAtRisk(progress.lastActivityDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{user.username}</h2>
                <p className="text-sm text-muted-foreground">{user.currentLevel}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10',
                    streakAtRisk && 'animate-streak-pulse'
                  )}
                >
                  <Flame size={20} weight="fill" className="text-accent" />
                  <span className="font-semibold text-foreground">{progress.streak}</span>
                </div>
                {streakAtRisk && (
                  <span className="text-xs text-destructive font-medium">At risk!</span>
                )}
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20">
                <Trophy size={20} weight="fill" className="text-secondary" />
                <span className="font-semibold text-foreground">{progress.points}</span>
              </div>

              <Button variant="ghost" size="icon" onClick={onLogout}>
                <SignOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <House size={18} />
              <span>Lessons</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <ChartBar size={18} />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy size={18} />
              <span>Achievements</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={24} />
                  Select Your Level
                </CardTitle>
                <CardDescription>
                  Choose a level to view and complete its lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {LEVELS.map((level) => {
                    const levelProgress = calculateLevelProgress(progress, level)
                    return (
                      <Button
                        key={level}
                        variant={selectedLevel === level ? 'default' : 'outline'}
                        onClick={() => setSelectedLevel(level)}
                        className="h-auto flex-col gap-2 py-4"
                      >
                        <span className="font-semibold">{level}</span>
                        <Progress value={levelProgress} className="h-1.5 w-full" />
                        <span className="text-xs opacity-80">{levelProgress}%</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{LEVEL_INFO[selectedLevel].title}</CardTitle>
                    <CardDescription>{LEVEL_INFO[selectedLevel].description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {currentLevelProgress}% Complete
                  </Badge>
                </div>
                <Progress value={currentLevelProgress} className="mt-4" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {levelLessons.map((lesson) => {
                    const isCompleted = progress.completedLessons.includes(lesson.id)
                    const isUnlocked = isLessonUnlocked(progress, lesson.id, selectedLevel)
                    const score = progress.lessonScores[lesson.id]

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
                            {isCompleted ? 'Review' : 'Start'}
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
                  <CardTitle className="text-base">Total Lessons</CardTitle>
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
                  <CardTitle className="text-base">Current Streak</CardTitle>
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
                  <CardTitle className="text-base">Total Points</CardTitle>
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
                  Level Progress
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
                  <Trophy size={24} />
                  Your Achievements
                </CardTitle>
                <CardDescription>
                  {progress.achievements.length} unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                {progress.achievements.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Complete lessons to unlock achievements!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {progress.achievements.map((achievement) => (
                      <Card key={achievement.id} className="bg-gradient-to-br from-accent/5 to-primary/5">
                        <CardContent className="p-6 text-center space-y-3">
                          <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center animate-achievement-unlock">
                            <Trophy size={32} weight="fill" className="text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                          <Separator />
                          <p className="text-xs text-muted-foreground">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}