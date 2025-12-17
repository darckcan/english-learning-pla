import { UserProgress, Level, Achievement, LessonScore } from './types'
import { LEVELS, LEVEL_INFO, LESSONS, ACHIEVEMENT_DEFINITIONS } from './curriculum'

export function calculateLevelProgress(progress: UserProgress, level: Level): number {
  const totalLessons = LEVEL_INFO[level].lessons
  const completedInLevel = progress.completedLessons.filter((id) =>
    id.startsWith(level.toLowerCase().replace(/\s/g, '-'))
  ).length
  return Math.floor((completedInLevel / totalLessons) * 100)
}

export function getNextLesson(progress: UserProgress, level: Level): string | null {
  const levelLessons = LESSONS[level]
  const completed = new Set(progress.completedLessons)

  for (const lesson of levelLessons) {
    if (!completed.has(lesson.id)) {
      return lesson.id
    }
  }
  return null
}

export function isLessonUnlocked(progress: UserProgress, lessonId: string, level: Level): boolean {
  const levelLessons = LESSONS[level]
  const lessonIndex = levelLessons.findIndex((l) => l.id === lessonId)

  if (lessonIndex === 0) return true

  const previousLesson = levelLessons[lessonIndex - 1]
  return progress.completedLessons.includes(previousLesson.id)
}

export function checkAndAwardAchievements(
  progress: UserProgress,
  newScore?: LessonScore
): Achievement[] {
  const newAchievements: Achievement[] = []
  const existingIds = new Set(progress.achievements.map((a) => a.id))

  if (progress.completedLessons.length === 1 && !existingIds.has('first-lesson')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.find((a) => a.id === 'first-lesson')!,
      unlockedAt: Date.now(),
    })
  }

  if (progress.streak >= 7 && !existingIds.has('week-streak')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.find((a) => a.id === 'week-streak')!,
      unlockedAt: Date.now(),
    })
  }

  if (progress.streak >= 30 && !existingIds.has('month-streak')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.find((a) => a.id === 'month-streak')!,
      unlockedAt: Date.now(),
    })
  }

  if (progress.completedLessons.length === 10 && !existingIds.has('ten-lessons')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.find((a) => a.id === 'ten-lessons')!,
      unlockedAt: Date.now(),
    })
  }

  if (progress.completedLessons.length === 50 && !existingIds.has('fifty-lessons')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.find((a) => a.id === 'fifty-lessons')!,
      unlockedAt: Date.now(),
    })
  }

  if (newScore && newScore.score === newScore.maxScore && !existingIds.has('perfect-score')) {
    newAchievements.push({
      ...ACHIEVEMENT_DEFINITIONS.find((a) => a.id === 'perfect-score')!,
      unlockedAt: Date.now(),
    })
  }

  const currentLevel = progress.currentLesson
    ? LESSONS[progress.levelProgress as any]?.find((l) => l.id === progress.currentLesson)?.level
    : null
  if (currentLevel) {
    const levelProgress = calculateLevelProgress(progress, currentLevel)
    if (levelProgress === 100 && !existingIds.has('level-complete')) {
      newAchievements.push({
        ...ACHIEVEMENT_DEFINITIONS.find((a) => a.id === 'level-complete')!,
        unlockedAt: Date.now(),
      })
    }
  }

  return newAchievements
}

export function updateStreak(progress: UserProgress): number {
  const today = new Date().toDateString()
  const lastActivity = progress.lastActivityDate
    ? new Date(progress.lastActivityDate).toDateString()
    : null

  if (!lastActivity || lastActivity === today) {
    return progress.streak
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  if (lastActivity === yesterdayStr) {
    return progress.streak + 1
  }

  return 1
}

export function shouldAdvanceLevel(progress: UserProgress, currentLevel: Level): boolean {
  const levelProgress = calculateLevelProgress(progress, currentLevel)
  return levelProgress === 100
}

export function getNextLevel(currentLevel: Level): Level | null {
  const currentIndex = LEVELS.indexOf(currentLevel)
  if (currentIndex === -1 || currentIndex === LEVELS.length - 1) return null
  return LEVELS[currentIndex + 1]
}

export function determineLevelFromPlacementScore(correctAnswers: number, totalQuestions: number): Level {
  const percentage = (correctAnswers / totalQuestions) * 100

  if (percentage < 20) return 'Beginner'
  if (percentage < 40) return 'A1'
  if (percentage < 55) return 'A2'
  if (percentage < 70) return 'B1'
  if (percentage < 85) return 'B2'
  if (percentage < 95) return 'C1'
  return 'C2'
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function isStreakAtRisk(lastActivityDate: string): boolean {
  if (!lastActivityDate) return false
  
  const now = Date.now()
  const lastActivity = new Date(lastActivityDate).getTime()
  const hoursSince = (now - lastActivity) / (1000 * 60 * 60)
  
  return hoursSince >= 20 && hoursSince < 24
}