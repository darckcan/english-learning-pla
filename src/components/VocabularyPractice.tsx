import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { ArrowLeft, Check, X } from '@phosphor-icons/react'
import { LESSONS } from '@/lib/curriculum'
import { Level, VocabularyItem } from '@/lib/types'
import PronunciationButton from './PronunciationButton'
import { Input } from './ui/input'
import { toast } from 'sonner'

interface VocabularyPracticeProps {
  unlockedLevels: Level[]
  onBack: () => void
}

export default function VocabularyPractice({ unlockedLevels, onBack }: VocabularyPracticeProps) {
  const [allVocabulary, setAllVocabulary] = useState<(VocabularyItem & { level: Level; lessonTitle: string })[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [practiceMode, setPracticeMode] = useState<'review' | 'quiz'>('review')
  const [quizAnswer, setQuizAnswer] = useState('')
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)

  useEffect(() => {
    const vocab: (VocabularyItem & { level: Level; lessonTitle: string })[] = []
    
    unlockedLevels.forEach((level) => {
      const lessons = LESSONS[level] || []
      lessons.forEach((lesson) => {
        lesson.vocabulary.forEach((item) => {
          vocab.push({
            ...item,
            level,
            lessonTitle: lesson.title,
          })
        })
      })
    })

    setAllVocabulary(vocab)
  }, [unlockedLevels])

  const currentWord = allVocabulary[currentIndex]

  const handleNext = () => {
    if (currentIndex < allVocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowTranslation(false)
      setQuizAnswer('')
      setShowQuizResult(false)
    } else {
      setCurrentIndex(0)
      if (practiceMode === 'quiz') {
        toast.success('Quiz Completado!', {
          description: `Acertaste ${correctCount} de ${totalAttempts} palabras (${Math.round((correctCount / totalAttempts) * 100)}%)`,
        })
        setCorrectCount(0)
        setTotalAttempts(0)
      }
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowTranslation(false)
      setQuizAnswer('')
      setShowQuizResult(false)
    }
  }

  const handleQuizSubmit = () => {
    const isCorrect = quizAnswer.trim().toLowerCase() === currentWord.word.toLowerCase()
    setShowQuizResult(true)
    setTotalAttempts(totalAttempts + 1)
    if (isCorrect) {
      setCorrectCount(correctCount + 1)
    }
  }

  const toggleMode = () => {
    setPracticeMode(practiceMode === 'review' ? 'quiz' : 'review')
    setCurrentIndex(0)
    setShowTranslation(false)
    setQuizAnswer('')
    setShowQuizResult(false)
    setCorrectCount(0)
    setTotalAttempts(0)
  }

  if (allVocabulary.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No vocabulary available yet. Complete some lessons first!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Button>
        <Button variant="outline" onClick={toggleMode}>
          {practiceMode === 'review' ? 'Switch to Quiz' : 'Switch to Review'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {practiceMode === 'review' ? 'Vocabulary Review' : 'Vocabulary Quiz'}
              </CardTitle>
              <CardDescription>
                {practiceMode === 'review'
                  ? 'Review words from all your unlocked lessons'
                  : 'Test your vocabulary knowledge'}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {currentIndex + 1} / {allVocabulary.length}
              </div>
              {practiceMode === 'quiz' && totalAttempts > 0 && (
                <div className="text-sm font-semibold text-primary">
                  Score: {Math.round((correctCount / totalAttempts) * 100)}%
                </div>
              )}
            </div>
          </div>
          <Progress value={((currentIndex + 1) / allVocabulary.length) * 100} className="mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/30 rounded-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">{currentWord.level}</Badge>
              <Badge variant="outline">{currentWord.type}</Badge>
            </div>

            {practiceMode === 'review' ? (
              <>
                <div className="text-center space-y-4 mb-6">
                  <h2 className="text-4xl font-bold">{currentWord.word}</h2>
                  <div className="flex gap-2 justify-center">
                    <PronunciationButton text={currentWord.word} variant="default" size="default" showLabel />
                    <PronunciationButton text={currentWord.word} slow variant="outline" size="default" showLabel />
                  </div>
                </div>

                {showTranslation ? (
                  <div className="space-y-4 bg-card p-6 rounded-lg border border-border">
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">Translation</h3>
                      <p className="text-xl">{currentWord.translation}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-1">Example</h3>
                      <div className="flex items-start justify-between gap-3">
                        <p className="italic flex-1">"{currentWord.example}"</p>
                        <PronunciationButton text={currentWord.example} />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      From: {currentWord.lessonTitle}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Button onClick={() => setShowTranslation(true)}>Show Translation</Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Translation:</h3>
                    <p className="text-2xl">{currentWord.translation}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Example:</h3>
                    <p className="italic">"{currentWord.example}"</p>
                    <PronunciationButton text={currentWord.example} className="mt-2" showLabel />
                  </div>
                </div>

                {!showQuizResult ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Write the English word:</h3>
                      <Input
                        value={quizAnswer}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        className="text-lg"
                        onKeyDown={(e) => e.key === 'Enter' && quizAnswer && handleQuizSubmit()}
                      />
                    </div>
                    <Button onClick={handleQuizSubmit} disabled={!quizAnswer} className="w-full">
                      Check Answer
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`p-6 rounded-lg ${
                      quizAnswer.trim().toLowerCase() === currentWord.word.toLowerCase()
                        ? 'bg-success/10'
                        : 'bg-destructive/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {quizAnswer.trim().toLowerCase() === currentWord.word.toLowerCase() ? (
                        <>
                          <Check size={32} weight="bold" className="text-success" />
                          <span className="text-xl font-semibold text-success">Correct!</span>
                        </>
                      ) : (
                        <>
                          <X size={32} weight="bold" className="text-destructive" />
                          <span className="text-xl font-semibold text-destructive">Incorrect</span>
                        </>
                      )}
                    </div>
                    {quizAnswer.trim().toLowerCase() !== currentWord.word.toLowerCase() && (
                      <div className="space-y-2">
                        <p>
                          <strong>Your answer:</strong> {quizAnswer}
                        </p>
                        <p>
                          <strong>Correct answer:</strong> {currentWord.word}
                        </p>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <PronunciationButton text={currentWord.word} variant="default" showLabel />
                      <PronunciationButton text={currentWord.word} slow variant="outline" showLabel />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0} className="flex-1">
              Previous
            </Button>
            <Button onClick={handleNext} className="flex-1">
              {currentIndex === allVocabulary.length - 1 ? 'Start Over' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
