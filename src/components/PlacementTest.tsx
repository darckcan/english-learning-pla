import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { PLACEMENT_TEST_QUESTIONS } from '@/lib/curriculum'
import { determineLevelFromPlacementScore, getLevelsThroughCurrent } from '@/lib/helpers'
import { Level } from '@/lib/types'
import { CheckCircle } from '@phosphor-icons/react'
import { haptics } from '@/lib/haptics'

interface PlacementTestProps {
  onComplete: (assignedLevel: Level, unlockedLevels: Level[]) => void
}

export default function PlacementTest({ onComplete }: PlacementTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const currentQuestion = PLACEMENT_TEST_QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / PLACEMENT_TEST_QUESTIONS.length) * 100

  const handleNext = () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    if (isCorrect) {
      haptics.success()
      setCorrectAnswers((prev) => prev + 1)
    } else {
      haptics.error()
    }

    if (currentQuestionIndex === PLACEMENT_TEST_QUESTIONS.length - 1) {
      haptics.notification()
      setShowResult(true)
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer('')
    }
  }

  const handleComplete = () => {
    haptics.achievement()
    const assignedLevel = determineLevelFromPlacementScore(
      correctAnswers,
      PLACEMENT_TEST_QUESTIONS.length
    )
    const unlockedLevels = getLevelsThroughCurrent(assignedLevel)
    onComplete(assignedLevel, unlockedLevels)
  }

  if (showResult) {
    const assignedLevel = determineLevelFromPlacementScore(
      correctAnswers,
      PLACEMENT_TEST_QUESTIONS.length
    )
    const percentage = Math.round((correctAnswers / PLACEMENT_TEST_QUESTIONS.length) * 100)

    return (
      <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-success/20 via-background to-primary/10">
        <Card className="w-full max-w-2xl shadow-2xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader className="text-center px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-success to-primary shadow-lg mx-auto mb-3 sm:mb-4">
              <CheckCircle size={32} weight="fill" className="text-white sm:hidden" />
              <CheckCircle size={40} weight="fill" className="text-white hidden sm:inline md:hidden" />
              <CheckCircle size={48} weight="fill" className="text-white hidden md:inline" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl">¡Examen Completado!</CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Estos son tus resultados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
            <div className="bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 border-2">
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Puntuación</span>
                <span className="text-xl sm:text-2xl font-bold text-foreground">
                  {correctAnswers}/{PLACEMENT_TEST_QUESTIONS.length} ({percentage}%)
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Nivel Asignado</span>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{assignedLevel}</span>
              </div>
            </div>

            <div className="text-center text-xs sm:text-sm md:text-base text-muted-foreground bg-accent/5 p-3 sm:p-4 rounded-lg">
              <p>
                Basado en tu desempeño, te hemos ubicado en el nivel <strong className="text-primary">{assignedLevel}</strong>.
                <br />
                Los niveles hasta <strong>{assignedLevel}</strong> están desbloqueados. Completa las lecciones para avanzar.
              </p>
            </div>

            <Button onClick={handleComplete} className="w-full shadow-lg text-sm sm:text-base h-10 sm:h-11 md:h-12" size="lg">
              Comenzar a Aprender
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-secondary/10">
      <Card className="w-full max-w-2xl shadow-2xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
          <div className="flex items-center justify-between mb-2 gap-2">
            <CardTitle className="text-base sm:text-lg md:text-xl">Examen de Ubicación</CardTitle>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground flex-shrink-0">
              {currentQuestionIndex + 1}/{PLACEMENT_TEST_QUESTIONS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 sm:h-2.5" />
          <CardDescription className="mt-3 sm:mt-4 text-xs sm:text-sm">
            Responde las siguientes preguntas para ayudarnos a determinar tu nivel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-5 md:space-y-6 px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
          <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl p-3 sm:p-4 md:p-6 border">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-3 sm:mb-4">
              {currentQuestion.question}
            </h3>

            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              <div className="space-y-2 sm:space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 md:p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      selectedAnswer === option
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:bg-muted/50 hover:border-primary/30'
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} className="flex-shrink-0" />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer font-normal text-xs sm:text-sm md:text-base"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="w-full shadow-lg text-sm sm:text-base h-10 sm:h-11 md:h-12"
            size="lg"
          >
            {currentQuestionIndex === PLACEMENT_TEST_QUESTIONS.length - 1
              ? 'Finalizar Examen'
              : 'Siguiente Pregunta'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}