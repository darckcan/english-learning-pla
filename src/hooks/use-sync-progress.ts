import { useKV } from '@github/spark/hooks'
import { UserProgress } from '@/lib/types'

export function useSyncProgress(userId: string) {
  const [userProgress, setUserProgressRaw] = useKV<UserProgress | null>('user-progress', null)
  const [, setAllProgress] = useKV<Record<string, UserProgress>>('all-user-progress', {})
  
  const setUserProgress = (updater: (prev: UserProgress | null) => UserProgress | null) => {
    setUserProgressRaw((prev) => {
      const updated = updater(prev ?? null)
      
      if (updated && userId) {
        setAllProgress((all) => ({
          ...(all || {}),
          [userId]: updated
        }))
      }
      
      return updated
    })
  }
  
  return [userProgress, setUserProgress] as const
}
