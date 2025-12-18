import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { ArrowLeft, Check, X } from '@phosphor-icons/react'
import { loadLessonsForLevel } from '@/lib/curriculum-lazy'
import { Level, VocabularyItem } from '@/lib/types'
import PronunciationButton from './PronunciationButton'
import { Input } from './ui/input'
import { toast } from 'sonner'
import { haptics } from '@/lib/haptics'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadVocabulary = async () => {
      setIsLoading(true)
      const vocab: (VocabularyItem & { level: Level; lessonTitle: string })[] = []
      
      await Promise.all(unlockedLevels.map(async (level) => {
        const lessons = await loadLessonsForLevel(level)
        lessons.forEach((lesson) => {
          lesson.vocabulary.forEach((item) => {
            vocab.push({
              ...item,
              level,
              lessonTitle: lesson.title,
            })
          })
        })
      }))

      setAllVocabulary(vocab)
      setIsLoading(false)
    }
    
    loadVocabulary()
  }, [unlockedLevels])

  const currentWord = allVocabulary[currentIndex]

  const cardVariants = {
    enter: { opacity: 0 },
    center: {
      opacity: 1,
      transition: { duration: 0.15 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.1 }
    }
  }

  const [direction, setDirection] = useState(0)

  const handleNext = () => {
    setDirection(1)
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
    setDirection(-1)
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
      haptics.success()
      setCorrectCount(correctCount + 1)
    } else {
      haptics.error()
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <Button variant="ghost" onClick={onBack} className="mb-3 sm:mb-4 h-9 sm:h-10">
          <ArrowLeft size={16} className="mr-1.5 sm:mr-2 sm:hidden" />
          <ArrowLeft size={20} className="mr-2 hidden sm:inline" />
          <span className="text-xs sm:text-sm md:text-base">Volver al Dashboard</span>
        </Button>
        <Card>
          <CardContent className="p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm sm:text-base">Cargando vocabulario...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (allVocabulary.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <Button variant="ghost" onClick={onBack} className="mb-3 sm:mb-4 h-9 sm:h-10">
          <ArrowLeft size={16} className="mr-1.5 sm:mr-2 sm:hidden" />
          <ArrowLeft size={20} className="mr-2 hidden sm:inline" />
          <span className="text-xs sm:text-sm md:text-base">Volver al Dashboard</span>
        </Button>
        <Card>
          <CardContent className="p-6 sm:p-8 md:p-12 text-center">
            <p className="text-muted-foreground text-sm sm:text-base">No hay vocabulario disponible aún. ¡Completa algunas lecciones primero!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <Button variant="ghost" onClick={onBack} className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm">
          <ArrowLeft size={16} className="mr-1 sm:mr-1.5 sm:hidden" />
          <ArrowLeft size={18} className="mr-1.5 hidden sm:inline md:hidden" />
          <ArrowLeft size={20} className="mr-2 hidden md:inline" />
          <span className="hidden xs:inline">Back</span>
        </Button>
        <Button variant="outline" onClick={toggleMode} className="h-8 sm:h-9 md:h-10 text-xs sm:text-sm px-2 sm:px-3 md:px-4">
          {practiceMode === 'review' ? (
            <>
              <span className="hidden sm:inline">Switch to Quiz</span>
              <span className="sm:hidden">Quiz</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Switch to Review</span>
              <span className="sm:hidden">Review</span>
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg md:text-xl">
                {practiceMode === 'review' ? 'Vocabulary Review' : 'Vocabulary Quiz'}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {practiceMode === 'review'
                  ? 'Review words from all your unlocked lessons'
                  : 'Test your vocabulary knowledge'}
              </CardDescription>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs sm:text-sm text-muted-foreground">
                {currentIndex + 1} / {allVocabulary.length}
              </div>
              {practiceMode === 'quiz' && totalAttempts > 0 && (
                <div className="text-xs sm:text-sm font-semibold text-primary">
                  Score: {Math.round((correctCount / totalAttempts) * 100)}%
                </div>
              )}
            </div>
          </div>
          <Progress value={((currentIndex + 1) / allVocabulary.length) * 100} className="mt-3 sm:mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-muted/30 rounded-lg p-4 sm:p-6 md:p-8"
            >
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
            </motion.div>
          </AnimatePresence>

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
