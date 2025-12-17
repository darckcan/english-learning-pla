import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { PLACEMENT_TEST_QUESTIONS } from '@/lib/curriculum'
import { determineLevelFromPlacementScore } from '@/lib/helpers'
import { Level } from '@/lib/types'
import { CheckCircle, XCircle } from '@phosphor-icons/react'

interface PlacementTestProps {
  onComplete: (assignedLevel: Level) => void
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
      setCorrectAnswers((prev) => prev + 1)
    }

    if (currentQuestionIndex === PLACEMENT_TEST_QUESTIONS.length - 1) {
      setShowResult(true)
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer('')
    }
  }

  const handleComplete = () => {
    const assignedLevel = determineLevelFromPlacementScore(
      correctAnswers,
      PLACEMENT_TEST_QUESTIONS.length
    )
    onComplete(assignedLevel)
  }

  if (showResult) {
    const assignedLevel = determineLevelFromPlacementScore(
      correctAnswers,
      PLACEMENT_TEST_QUESTIONS.length
    )
    const percentage = Math.round((correctAnswers / PLACEMENT_TEST_QUESTIONS.length) * 100)

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-success/5">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mx-auto mb-4">
              <CheckCircle size={48} weight="fill" className="text-success" />
            </div>
            <CardTitle className="text-3xl">Placement Test Complete!</CardTitle>
            <CardDescription className="text-lg">
              Here are your results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Score</span>
                <span className="text-2xl font-bold text-foreground">
                  {correctAnswers}/{PLACEMENT_TEST_QUESTIONS.length} ({percentage}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Assigned Level</span>
                <span className="text-2xl font-bold text-primary">{assignedLevel}</span>
              </div>
            </div>

            <div className="text-center text-muted-foreground">
              <p>
                Based on your performance, we've placed you at the <strong>{assignedLevel}</strong> level.
                You can always adjust this later or retake the test.
              </p>
            </div>

            <Button onClick={handleComplete} className="w-full" size="lg">
              Start Learning
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle>Placement Test</CardTitle>
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestionIndex + 1} of {PLACEMENT_TEST_QUESTIONS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <CardDescription className="mt-4">
            Answer the following questions to help us determine your level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              {currentQuestion.question}
            </h3>

            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer font-normal text-base"
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
            className="w-full"
            size="lg"
          >
            {currentQuestionIndex === PLACEMENT_TEST_QUESTIONS.length - 1
              ? 'Finish Test'
              : 'Next Question'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}