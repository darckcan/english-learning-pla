import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, UserProgress, Level } from './lib/types'
import { Toaster } from './components/ui/sonner'
import LandingPage from './components/LandingPage'
import WelcomeScreen from './components/WelcomeScreen'
import PlacementTest from './components/PlacementTest'
import Dashboard from './components/Dashboard'
import LessonView from './components/LessonView'
import TeacherDashboard from './components/TeacherDashboard'
import SuperAdminDashboard from './components/SuperAdminDashboard'
import VocabularyPractice from './components/VocabularyPractice'
import { LEVELS } from './lib/curriculum'
import { applyTheme } from './lib/themes'
import { useEmailNotifications } from './hooks/use-email-notifications'
import { useStripePaymentVerification } from './hooks/use-stripe-payment'
import { useSyncUser } from './hooks/use-sync-user'
import { useSyncProgress } from './hooks/use-sync-progress'
import { AnimatePresence, motion } from 'framer-motion'

type AppView = 'landing' | 'welcome' | 'placement' | 'dashboard' | 'lesson' | 'teacher' | 'superadmin' | 'vocabulary'

function App() {
  const [currentUser, setCurrentUser] = useSyncUser()
  const [userProgress, setUserProgress] = useSyncProgress(currentUser?.id || '')
  const [allUsers] = useKV<User[]>('all-users', [])
  const [view, setView] = useState<AppView>('landing')
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)

  useEmailNotifications(allUsers || [], true)
  useStripePaymentVerification()

  useEffect(() => {
    if (currentUser) {
      if (currentUser.selectedTheme) {
        applyTheme(currentUser.selectedTheme)
      }
      
      if (currentUser.role === 'superadmin') {
        setView('superadmin')
      } else if (currentUser.role === 'teacher') {
        setView('teacher')
      } else if (!userProgress) {
        setView('placement')
      } else {
        setView('dashboard')
      }
    } else {
    }
  }, [currentUser, userProgress])

  const handleLogin = (user: User) => {
    setCurrentUser(() => user)
  }

  const handlePlacementComplete = (assignedLevel: Level, unlockedLevels: Level[]) => {
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
      completedLevels: [],
    }
    setUserProgress(() => newProgress)
    setCurrentUser((prev) => (prev ? { ...prev, currentLevel: assignedLevel, unlockedLevels } : null))
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

  const handleVocabularyPractice = () => {
    setView('vocabulary')
  }

  const handleLogout = () => {
    setCurrentUser(() => null)
    setUserProgress(() => null)
    setView('landing')
  }

  const handleGetStarted = () => {
    setView('welcome')
  }

  const pageVariants = {
    initial: { 
      opacity: 0, 
      x: 20,
      scale: 0.98
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      scale: 0.98,
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
      }
    }
  }

  const mobilePageVariants = {
    initial: { 
      opacity: 0, 
      y: 15,
      scale: 0.97
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number]
      }
    },
    exit: { 
      opacity: 0, 
      y: -15,
      scale: 0.97,
      transition: {
        duration: 0.3,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number]
      }
    }
  }

  const isMobile = window.innerWidth < 768
  const variants = isMobile ? mobilePageVariants : pageVariants

  return (
    <>
      <div className="min-h-screen bg-background overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <LandingPage onGetStarted={handleGetStarted} />
            </motion.div>
          )}
          {view === 'welcome' && (
            <motion.div
              key="welcome"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <WelcomeScreen onLogin={handleLogin} />
            </motion.div>
          )}
          {view === 'placement' && currentUser && (
            <motion.div
              key="placement"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <PlacementTest onComplete={handlePlacementComplete} />
            </motion.div>
          )}
          {view === 'dashboard' && currentUser && userProgress && (
            <motion.div
              key="dashboard"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Dashboard
                user={currentUser}
                progress={userProgress}
                onStartLesson={handleStartLesson}
                onLogout={handleLogout}
                setUserProgress={setUserProgress}
                setUser={setCurrentUser}
                onVocabularyPractice={handleVocabularyPractice}
              />
            </motion.div>
          )}
          {view === 'vocabulary' && currentUser && userProgress && (
            <motion.div
              key="vocabulary"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <VocabularyPractice
                unlockedLevels={currentUser.unlockedLevels}
                onBack={handleBackToDashboard}
              />
            </motion.div>
          )}
          {view === 'lesson' && currentUser && userProgress && selectedLessonId && (
            <motion.div
              key="lesson"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <LessonView
                user={currentUser}
                progress={userProgress}
                lessonId={selectedLessonId}
                onComplete={handleLessonComplete}
                onBack={handleBackToDashboard}
                setUserProgress={setUserProgress}
              />
            </motion.div>
          )}
          {view === 'teacher' && currentUser && (
            <motion.div
              key="teacher"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <TeacherDashboard user={currentUser} onLogout={handleLogout} />
            </motion.div>
          )}
          {view === 'superadmin' && currentUser && (
            <motion.div
              key="superadmin"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SuperAdminDashboard user={currentUser} onLogout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </>
  )
}

export default App