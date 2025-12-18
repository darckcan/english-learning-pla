import { useKV } from '@github/spark/hooks'
import { UserProgress } from '@/lib/types'
import { useEffect, useCallback, useRef } from 'react'

export function useSyncProgress(userId: string) {
  const userProgressKey = userId ? `user-progress-${userId}` : 'user-progress-temp'
  const [userProgress, setUserProgressRaw] = useKV<UserProgress | null>(userProgressKey, null)
  const [allProgress, setAllProgress] = useKV<Record<string, UserProgress>>('all-user-progress', {})
  
  const userIdRef = useRef(userId)
  userIdRef.current = userId

  useEffect(() => {
    if (userId && allProgress && allProgress[userId] && !userProgress) {
      setUserProgressRaw(() => allProgress[userId])
    }
  }, [userId, allProgress, userProgress, setUserProgressRaw])

  const setUserProgress = useCallback((updater: (prev: UserProgress | null) => UserProgress | null) => {
    setUserProgressRaw((prev) => {
      const updated = updater(prev ?? null)
      
      if (updated && userIdRef.current) {
        setAllProgress((all) => ({
          ...(all || {}),
          [userIdRef.current]: updated
        }))
      }
      
      return updated
    })
  }, [setUserProgressRaw, setAllProgress])
  
  return [userProgress, setUserProgress] as const
}
