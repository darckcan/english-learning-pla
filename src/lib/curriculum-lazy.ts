import { Lesson, Level } from './types'
import { LESSONS } from './curriculum'

const lessonCache = new Map<Level, Lesson[]>()

export function getLessonsForLevel(level: Level): Lesson[] {
  if (lessonCache.has(level)) {
    return lessonCache.get(level)!
  }
  
  const lessons = LESSONS[level]
  lessonCache.set(level, lessons)
  return lessons
}

export function getLessonById(lessonId: string): Lesson | undefined {
  const level = lessonId.split('-')[0]
  const levelMap: Record<string, Level> = {
    'beginner': 'Beginner',
    'a1': 'A1',
    'a2': 'A2',
    'b1': 'B1',
    'b2': 'B2',
    'c1': 'C1',
    'c2': 'C2',
  }
  
  const mappedLevel = levelMap[level]
  if (!mappedLevel) return undefined
  
  const lessons = getLessonsForLevel(mappedLevel)
  return lessons.find(l => l.id === lessonId)
}

export function preloadLevel(level: Level): void {
  if (!lessonCache.has(level)) {
    requestAnimationFrame(() => {
      getLessonsForLevel(level)
    })
  }
}

export function clearLessonCache(): void {
  lessonCache.clear()
}

export function getLessonCount(level: Level): number {
  const counts: Record<Level, number> = {
    Beginner: 5,
    A1: 30,
    A2: 40,
    B1: 50,
    B2: 60,
    C1: 50,
    C2: 40,
  }
  return counts[level]
}
