import { useState } from 'react'
import { User, UserProgress, Exercise, LessonScore } from '@/lib/types'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Input } from './ui/input'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, SpeakerHigh } from '@phosphor-icons/react'
import { LESSONS } from '@/lib/curriculum'
import { checkAndAwardAchievements, updateStreak } from '@/lib/helpers'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface LessonViewProps {
  user: User
  progress: UserProgress
  lessonId: string
  onComplete: () => void
  onBack: () => void
  setUserProgress: (updater: (prev: UserProgress | null) => UserProgress | null) => void
}

type LessonSection = 'intro' | 'vocabulary' | 'grammar' | 'exercises' | 'shadowing' | 'complete'

export default function LessonView({
  progress,
  lessonId,
  onComplete,
  onBack,
  setUserProgress,
}: LessonViewProps) {
  const lesson = Object.values(LESSONS)
    .flat()
    .find((l) => l.id === lessonId)

  const [section, setSection] = useState<LessonSection>('intro')
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseAnswer, setExerciseAnswer] = useState('')
  const [exerciseResults, setExerciseResults] = useState<boolean[]>([])
  const [showExerciseFeedback, setShowExerciseFeedback] = useState(false)
  const [showHint, setShowHint] = useState(false)

  if (!lesson) {
    return <div>Lesson not found</div>
  }

  const totalSections = 5
  const sectionIndex = {
    intro: 0,
    vocabulary: 1,
    grammar: 2,
    exercises: 3,
    shadowing: 4,
    complete: 5,
  }[section]
  const sectionProgress = (sectionIndex / totalSections) * 100

  const currentExercise = lesson.exercises[currentExerciseIndex]

  const handleNext = () => {
    if (section === 'intro') setSection('vocabulary')
    else if (section === 'vocabulary') setSection('grammar')
    else if (section === 'grammar') setSection('exercises')
    else if (section === 'exercises') {
      if (currentExerciseIndex < lesson.exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1)
        setExerciseAnswer('')
        setShowExerciseFeedback(false)
        setShowHint(false)
      } else {
        setSection('shadowing')
      }
    } else if (section === 'shadowing') {
      completeLesson()
    }
  }

  const handleExerciseSubmit = () => {
    if (!exerciseAnswer.trim()) return

    const isCorrect =
      typeof currentExercise.correctAnswer === 'string'
        ? exerciseAnswer.trim().toLowerCase() ===
          currentExercise.correctAnswer.trim().toLowerCase()
        : (currentExercise.correctAnswer as string[]).some(
            (ans) => exerciseAnswer.trim().toLowerCase() === ans.trim().toLowerCase()
          )

    setExerciseResults((prev) => [...prev, isCorrect])
    setShowExerciseFeedback(true)
  }

  const completeLesson = () => {
    const correctCount = exerciseResults.filter(Boolean).length
    const totalExercises = lesson.exercises.length
    const score = (correctCount / totalExercises) * 100
    const points = Math.round(score)

    const lessonScore: LessonScore = {
      lessonId: lesson.id,
      score: correctCount,
      maxScore: totalExercises,
      completedAt: Date.now(),
      attempts: 1,
    }

    setUserProgress((prev) => {
      if (!prev) return null

      const isNewCompletion = !prev.completedLessons.includes(lesson.id)
      const newCompletedLessons = isNewCompletion
        ? [...prev.completedLessons, lesson.id]
        : prev.completedLessons

      const newStreak = updateStreak(prev)
      const newPoints = prev.points + (isNewCompletion ? points : 0)

      const updated: UserProgress = {
        ...prev,
        completedLessons: newCompletedLessons,
        currentLesson: lesson.id,
        points: newPoints,
        streak: newStreak,
        lastActivityDate: new Date().toISOString(),
        lessonScores: {
          ...prev.lessonScores,
          [lesson.id]: lessonScore,
        },
      }

      const newAchievements = checkAndAwardAchievements(updated, lessonScore)
      if (newAchievements.length > 0) {
        updated.achievements = [...updated.achievements, ...newAchievements]
        newAchievements.forEach((achievement) => {
          toast.success(`Achievement Unlocked: ${achievement.title}`, {
            description: achievement.description,
          })
        })
      }

      if (isNewCompletion) {
        toast.success('Lesson Completed!', {
          description: `You earned ${points} points!`,
        })
      }

      return updated
    })

    setSection('complete')
  }

  const renderIntro = () => (
    <Card>
      <CardHeader>
        <Badge className="w-fit mb-2">{lesson.level}</Badge>
        <CardTitle className="text-3xl">{lesson.title}</CardTitle>
        <CardDescription className="text-lg">{lesson.objective}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-primary/5 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">What you'll learn:</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• {lesson.vocabulary.length} vocabulary words</li>
            <li>• {lesson.grammar.title}</li>
            <li>• {lesson.exercises.length} practice exercises</li>
            <li>• Pronunciation practice with shadowing</li>
          </ul>
        </div>
        <Button onClick={handleNext} className="w-full" size="lg">
          Start Lesson
        </Button>
      </CardContent>
    </Card>
  )

  const renderVocabulary = () => (
    <Card>
      <CardHeader>
        <CardTitle>Vocabulary</CardTitle>
        <CardDescription>Learn these key words and phrases</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {lesson.vocabulary.map((item, index) => (
            <Card key={index} className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">{item.word}</h4>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.translation}</p>
                    <p className="text-sm italic">"{item.example}"</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <SpeakerHigh size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={handleNext} className="w-full" size="lg">
          Continue to Grammar
        </Button>
      </CardContent>
    </Card>
  )

  const renderGrammar = () => (
    <Card>
      <CardHeader>
        <CardTitle>{lesson.grammar.title}</CardTitle>
        <CardDescription>Grammar rules and patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-secondary/10 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Explanation</h3>
            <p className="text-muted-foreground">{lesson.grammar.explanation}</p>
          </div>

          {lesson.grammar.rules.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Rules</h3>
              <ul className="space-y-1">
                {lesson.grammar.rules.map((rule, index) => (
                  <li key={index} className="text-muted-foreground">
                    • {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lesson.grammar.examples.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Examples</h3>
              <div className="space-y-2">
                {lesson.grammar.examples.map((example, index) => (
                  <div key={index} className="bg-card p-3 rounded border border-border">
                    <p className="italic">"{example}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button onClick={handleNext} className="w-full" size="lg">
          Start Exercises
        </Button>
      </CardContent>
    </Card>
  )

  const renderExercises = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Exercise {currentExerciseIndex + 1}</CardTitle>
          <Badge variant="secondary">
            {currentExerciseIndex + 1} of {lesson.exercises.length}
          </Badge>
        </div>
        <Progress
          value={((currentExerciseIndex + 1) / lesson.exercises.length) * 100}
          className="mt-2"
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold">{currentExercise.question}</h3>

          {currentExercise.type === 'multiple-choice' && currentExercise.options && (
            <RadioGroup
              value={exerciseAnswer}
              onValueChange={setExerciseAnswer}
              disabled={showExerciseFeedback}
            >
              <div className="space-y-3">
                {currentExercise.options.map((option, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center space-x-3 p-3 rounded-lg border border-border transition-colors',
                      !showExerciseFeedback && 'hover:bg-muted/50',
                      showExerciseFeedback &&
                        option === currentExercise.correctAnswer &&
                        'bg-success/10 border-success',
                      showExerciseFeedback &&
                        option === exerciseAnswer &&
                        option !== currentExercise.correctAnswer &&
                        'bg-destructive/10 border-destructive'
                    )}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      {option}
                    </Label>
                    {showExerciseFeedback && option === currentExercise.correctAnswer && (
                      <CheckCircle size={20} weight="fill" className="text-success" />
                    )}
                    {showExerciseFeedback &&
                      option === exerciseAnswer &&
                      option !== currentExercise.correctAnswer && (
                        <XCircle size={20} weight="fill" className="text-destructive" />
                      )}
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {currentExercise.type === 'fill-blank' && (
            <div>
              <Input
                placeholder="Type your answer..."
                value={exerciseAnswer}
                onChange={(e) => setExerciseAnswer(e.target.value)}
                disabled={showExerciseFeedback}
                className={cn(
                  showExerciseFeedback &&
                    exerciseResults[exerciseResults.length - 1] &&
                    'border-success',
                  showExerciseFeedback &&
                    !exerciseResults[exerciseResults.length - 1] &&
                    'border-destructive'
                )}
              />
            </div>
          )}

          {showExerciseFeedback && (
            <div
              className={cn(
                'rounded-lg p-4 space-y-2',
                exerciseResults[exerciseResults.length - 1]
                  ? 'bg-success/10'
                  : 'bg-destructive/10'
              )}
            >
              <div className="flex items-center gap-2">
                {exerciseResults[exerciseResults.length - 1] ? (
                  <>
                    <CheckCircle size={24} weight="fill" className="text-success" />
                    <span className="font-semibold text-success">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle size={24} weight="fill" className="text-destructive" />
                    <span className="font-semibold text-destructive">Incorrect</span>
                  </>
                )}
              </div>
              {!exerciseResults[exerciseResults.length - 1] && (
                <p className="text-sm">
                  <strong>Correct answer:</strong> {currentExercise.correctAnswer}
                </p>
              )}
              <p className="text-sm">{currentExercise.explanation}</p>
            </div>
          )}

          {showHint && !showExerciseFeedback && (
            <div className="bg-accent/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={20} weight="fill" className="text-accent" />
                <span className="font-semibold">Hint</span>
              </div>
              <p className="text-sm">{currentExercise.explanation}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!showExerciseFeedback && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                className="flex-1"
              >
                <Lightbulb size={18} className="mr-2" />
                {showHint ? 'Hide' : 'Show'} Hint
              </Button>
              <Button
                onClick={handleExerciseSubmit}
                disabled={!exerciseAnswer}
                className="flex-1"
              >
                Submit Answer
              </Button>
            </>
          )}
          {showExerciseFeedback && (
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentExerciseIndex === lesson.exercises.length - 1
                ? 'Continue to Shadowing'
                : 'Next Exercise'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderShadowing = () => (
    <Card>
      <CardHeader>
        <CardTitle>Shadowing Practice</CardTitle>
        <CardDescription>
          Listen and repeat to improve your pronunciation and fluency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-primary/5 rounded-lg p-8 text-center space-y-4">
          <SpeakerHigh size={48} weight="fill" className="mx-auto text-primary" />
          <p className="text-lg leading-relaxed">{lesson.shadowingText}</p>
        </div>

        <div className="bg-secondary/10 rounded-lg p-6">
          <h3 className="font-semibold mb-3">How to shadow:</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>1. Listen to the text carefully</li>
            <li>2. Repeat it out loud, trying to match the rhythm and intonation</li>
            <li>3. Practice multiple times until it feels natural</li>
          </ol>
        </div>

        <Button onClick={handleNext} className="w-full" size="lg">
          Complete Lesson
        </Button>
      </CardContent>
    </Card>
  )

  const renderComplete = () => {
    const correctCount = exerciseResults.filter(Boolean).length
    const totalExercises = lesson.exercises.length
    const percentage = Math.round((correctCount / totalExercises) * 100)

    return (
      <Card className="text-center">
        <CardHeader>
          <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4">
            <CheckCircle size={48} weight="fill" className="text-success" />
          </div>
          <CardTitle className="text-3xl">Lesson Complete!</CardTitle>
          <CardDescription className="text-lg">Great work on completing this lesson</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Exercise Score</span>
              <span className="text-2xl font-bold">
                {correctCount}/{totalExercises} ({percentage}%)
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Points Earned</span>
              <span className="text-2xl font-bold text-primary">+{percentage}</span>
            </div>
          </div>

          <Button onClick={onComplete} className="w-full" size="lg">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 mx-6">
              <Progress value={sectionProgress} className="h-2" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {sectionIndex}/{totalSections}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {section === 'intro' && renderIntro()}
        {section === 'vocabulary' && renderVocabulary()}
        {section === 'grammar' && renderGrammar()}
        {section === 'exercises' && renderExercises()}
        {section === 'shadowing' && renderShadowing()}
        {section === 'complete' && renderComplete()}
      </main>
    </div>
  )
}