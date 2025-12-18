import { Lesson, Level } from './types'

const lessonCache = new Map<Level, Lesson[]>()
const loadingPromises = new Map<Level, Promise<Lesson[]>>()

async function loadLessonsModule(): Promise<Record<Level, Lesson[]>> {
  const { LESSONS } = await import('./curriculum')
  return LESSONS
}

let lessonsModulePromise: Promise<Record<Level, Lesson[]>> | null = null
let lessonsModule: Record<Level, Lesson[]> | null = null

async function getLessonsModule(): Promise<Record<Level, Lesson[]>> {
  if (lessonsModule) {
    return lessonsModule
  }
  
  if (!lessonsModulePromise) {
    lessonsModulePromise = loadLessonsModule().then(mod => {
      lessonsModule = mod
      return mod
    })
  }
  
  return lessonsModulePromise
}

export async function loadLessonsForLevel(level: Level): Promise<Lesson[]> {
  if (lessonCache.has(level)) {
    return lessonCache.get(level)!
  }
  
  if (loadingPromises.has(level)) {
    return loadingPromises.get(level)!
  }
  
  const loadPromise = getLessonsModule().then(allLessons => {
    const lessons = allLessons[level] || []
    lessonCache.set(level, lessons)
    loadingPromises.delete(level)
    return lessons
  })
  
  loadingPromises.set(level, loadPromise)
  return loadPromise
}

export function getLessonsForLevel(level: Level): Lesson[] {
  if (lessonCache.has(level)) {
    return lessonCache.get(level)!
  }
  
  if (lessonsModule) {
    const lessons = lessonsModule[level] || []
    lessonCache.set(level, lessons)
    return lessons
  }
  
  loadLessonsForLevel(level)
  return []
}

export function isLevelLoaded(level: Level): boolean {
  return lessonCache.has(level)
}

export function isLevelLoading(level: Level): boolean {
  return loadingPromises.has(level)
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

export async function getLessonByIdAsync(lessonId: string): Promise<Lesson | undefined> {
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
  
  const lessons = await loadLessonsForLevel(mappedLevel)
  return lessons.find(l => l.id === lessonId)
}

export function preloadLevel(level: Level): void {
  if (!lessonCache.has(level) && !loadingPromises.has(level)) {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => loadLessonsForLevel(level))
    } else {
      setTimeout(() => loadLessonsForLevel(level), 0)
    }
  }
}

export function preloadAdjacentLevels(currentLevel: Level): void {
  const levels: Level[] = ['Beginner', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const currentIndex = levels.indexOf(currentLevel)
  
  if (currentIndex > 0) {
    preloadLevel(levels[currentIndex - 1])
  }
  if (currentIndex < levels.length - 1) {
    preloadLevel(levels[currentIndex + 1])
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
