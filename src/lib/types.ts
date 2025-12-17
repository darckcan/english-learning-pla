export type Level = 'Beginner' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type UserRole = 'student' | 'teacher' | 'superadmin'

export type MembershipType = 'trial' | 'monthly' | 'lifetime'

export type ThemeType = 'default' | 'colorful' | 'cheerful' | 'warm' | 'dark'

export interface Membership {
  type: MembershipType
  startDate: number
  endDate?: number
  isActive: boolean
}

export interface User {
  id: string
  username: string
  password: string
  role: UserRole
  currentLevel: Level
  unlockedLevels: Level[]
  createdAt: number
  lastActive: number
  email?: string
  fullName?: string
  membership?: Membership
  selectedTheme?: ThemeType
}

export interface ShadowingPhrase {
  text: string
  translation: string
}

export interface Lesson {
  id: string
  level: Level
  order: number
  title: string
  objective: string
  vocabulary: VocabularyItem[]
  grammar: GrammarSection
  exercises: Exercise[]
  shadowingText: string
  shadowingPhrases?: ShadowingPhrase[]
}

export interface VocabularyItem {
  word: string
  translation: string
  example: string
  type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase'
}

export interface GrammarSection {
  title: string
  explanation: string
  examples: string[]
  rules: string[]
}

export interface Exercise {
  id: string
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'sentence-construction'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
}

export interface UserProgress {
  userId: string
  completedLessons: string[]
  levelProgress: Record<Level, number>
  currentLesson: string | null
  points: number
  streak: number
  lastActivityDate: string
  achievements: Achievement[]
  lessonScores: Record<string, LessonScore>
  completedLevels?: CompletedLevel[]
}

export interface CompletedLevel {
  level: Level
  completedAt: number
  totalLessons: number
  averageScore: number
}

export interface LessonScore {
  lessonId: string
  score: number
  maxScore: number
  completedAt: number
  attempts: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: number
}

export interface PlacementTestQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  level: Level
  difficultyScore: number
}

export interface PlacementTestResult {
  totalQuestions: number
  correctAnswers: number
  assignedLevel: Level
  completedAt: number
}