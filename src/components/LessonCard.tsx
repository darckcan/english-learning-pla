import { memo } from 'react'
import { Lesson, UserProgress, LessonScore } from '@/lib/types'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { CheckCircle, BookOpen, Lock } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface LessonCardProps {
  lesson: Lesson
  isCompleted: boolean
  isUnlocked: boolean
  score?: LessonScore
  onStartLesson: (lessonId: string) => void
}

function LessonCardComponent({
  lesson,
  isCompleted,
  isUnlocked,
  score,
  onStartLesson,
}: LessonCardProps) {
  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        !isUnlocked && 'opacity-50'
      )}
    >
      <CardContent className="flex items-center justify-between p-2.5 sm:p-3 md:p-4 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
          <div
            className={cn(
              'w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0',
              isCompleted
                ? 'bg-green-500/20'
                : isUnlocked
                  ? 'bg-primary/10'
                  : 'bg-muted'
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle size={18} weight="fill" className="text-green-500 sm:hidden" />
                <CheckCircle size={20} weight="fill" className="text-green-500 hidden sm:block md:hidden" />
                <CheckCircle size={24} weight="fill" className="text-green-500 hidden md:block" />
              </>
            ) : isUnlocked ? (
              <>
                <BookOpen size={18} className="text-primary sm:hidden" />
                <BookOpen size={20} className="text-primary hidden sm:block md:hidden" />
                <BookOpen size={24} className="text-primary hidden md:block" />
              </>
            ) : (
              <>
                <Lock size={18} className="text-muted-foreground sm:hidden" />
                <Lock size={20} className="text-muted-foreground hidden sm:block md:hidden" />
                <Lock size={24} className="text-muted-foreground hidden md:block" />
              </>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-xs sm:text-sm md:text-base truncate">
              {lesson.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
              {lesson.objective}
            </p>
            {score && (
              <p className="text-[10px] sm:text-xs text-green-500 font-medium mt-0.5 sm:mt-1">
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
          size="sm"
          className="text-xs sm:text-sm flex-shrink-0"
        >
          {isCompleted ? 'Repasar' : 'Comenzar'}
        </Button>
      </CardContent>
    </Card>
  )
}

export const LessonCard = memo(LessonCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.lesson.id === nextProps.lesson.id &&
    prevProps.isCompleted === nextProps.isCompleted &&
    prevProps.isUnlocked === nextProps.isUnlocked &&
    prevProps.score?.score === nextProps.score?.score
  )
})
