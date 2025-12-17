import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, UserProgress } from './lib/types'
import { Toaster } from './components/ui/sonner'
import WelcomeScreen from './components/WelcomeScreen'
import PlacementTest from './components/PlacementTest'
import Dashboard from './components/Dashboard'
import LessonView from './components/LessonView'
import TeacherDashboard from './components/TeacherDashboard'
import { LEVELS } from './lib/curriculum'

type AppView = 'welcome' | 'placement' | 'dashboard' | 'lesson' | 'teacher'

function App() {
  const [currentUser, setCurrentUser] = useKV<User | null>('current-user', null)
  const [userProgress, setUserProgress] = useKV<UserProgress | null>('user-progress', null)
  const [view, setView] = useState<AppView>('welcome')
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'teacher') {
        setView('teacher')
      } else if (!userProgress) {
        setView('placement')
      } else {
        setView('dashboard')
      }
    } else {
      setView('welcome')
    }
  }, [currentUser, userProgress])

  const handleLogin = (user: User) => {
    setCurrentUser(() => user)
  }

  const handlePlacementComplete = (assignedLevel: typeof LEVELS[number]) => {
    const newProgress: UserProgress = {
      userId: currentUser!.id,
      completedLessons: [],
      levelProgress: {
        Beginner: 0,
        A1: 0,
        A2: 0,
        B1: 0,
        B2: 0,
        C1: 0,
        C2: 0,
      },
      currentLesson: null,
      points: 0,
      streak: 0,
      lastActivityDate: new Date().toISOString(),
      achievements: [],
      lessonScores: {},
    }
    setUserProgress(() => newProgress)
    setCurrentUser((prev) => (prev ? { ...prev, currentLevel: assignedLevel } : null))
    setView('dashboard')
  }

  const handleStartLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId)
    setView('lesson')
  }

  const handleLessonComplete = () => {
    setSelectedLessonId(null)
    setView('dashboard')
  }

  const handleBackToDashboard = () => {
    setView('dashboard')
  }

  const handleLogout = () => {
    setCurrentUser(() => null)
    setUserProgress(() => null)
    setView('welcome')
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {view === 'welcome' && <WelcomeScreen onLogin={handleLogin} />}
        {view === 'placement' && currentUser && (
          <PlacementTest onComplete={handlePlacementComplete} />
        )}
        {view === 'dashboard' && currentUser && userProgress && (
          <Dashboard
            user={currentUser}
            progress={userProgress}
            onStartLesson={handleStartLesson}
            onLogout={handleLogout}
            setUserProgress={setUserProgress}
          />
        )}
        {view === 'lesson' && currentUser && userProgress && selectedLessonId && (
          <LessonView
            user={currentUser}
            progress={userProgress}
            lessonId={selectedLessonId}
            onComplete={handleLessonComplete}
            onBack={handleBackToDashboard}
            setUserProgress={setUserProgress}
          />
        )}
        {view === 'teacher' && currentUser && (
          <TeacherDashboard user={currentUser} onLogout={handleLogout} />
        )}
      </div>
      <Toaster />
    </>
  )
}

export default App