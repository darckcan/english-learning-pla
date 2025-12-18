import { useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { Lesson, UserProgress, Level } from '@/lib/types'
import { LessonCard } from './LessonCard'
import { isLessonUnlocked } from '@/lib/helpers'

interface VirtualizedLessonListProps {
  lessons: Lesson[]
  progress: UserProgress
  selectedLevel: Level
  onStartLesson: (lessonId: string) => void
}

const ITEMS_PER_PAGE = 10
const SCROLL_THRESHOLD = 100

export function VirtualizedLessonList({
  lessons,
  progress,
  selectedLevel,
  onStartLesson,
}: VirtualizedLessonListProps) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [selectedLevel])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < lessons.length) {
          setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, lessons.length))
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [visibleCount, lessons.length])

  const completedLessons = useMemo(() => {
    return new Set(progress.completedLessons || [])
  }, [progress.completedLessons])

  const lessonScores = useMemo(() => {
    return progress.lessonScores || {}
  }, [progress.lessonScores])

  const visibleLessons = useMemo(() => {
    return lessons.slice(0, visibleCount)
  }, [lessons, visibleCount])

  const handleStartLesson = useCallback((lessonId: string) => {
    onStartLesson(lessonId)
  }, [onStartLesson])

  const isUnlockedMemo = useMemo(() => {
    const unlockMap = new Map<string, boolean>()
    lessons.forEach(lesson => {
      unlockMap.set(lesson.id, isLessonUnlocked(progress, lesson.id, selectedLevel))
    })
    return unlockMap
  }, [lessons, progress, selectedLevel])

  return (
    <div ref={containerRef} className="grid gap-3 sm:gap-4">
      {visibleLessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          isCompleted={completedLessons.has(lesson.id)}
          isUnlocked={isUnlockedMemo.get(lesson.id) ?? false}
          score={lessonScores[lesson.id]}
          onStartLesson={handleStartLesson}
        />
      ))}
      
      {visibleCount < lessons.length && (
        <div 
          ref={loadMoreRef} 
          className="h-20 flex items-center justify-center text-muted-foreground text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            Cargando más lecciones...
          </div>
        </div>
      )}
    </div>
  )
}
