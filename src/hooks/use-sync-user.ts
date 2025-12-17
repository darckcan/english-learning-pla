import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'

export function useSyncUser() {
  const [currentUser, setCurrentUserRaw] = useKV<User | null>('current-user', null)
  const [, setAllUsers] = useKV<User[]>('all-users', [])
  
  const setCurrentUser = (updater: (prev: User | null) => User | null) => {
    setCurrentUserRaw((prev) => {
      const updated = updater(prev ?? null)
      
      if (updated) {
        setAllUsers((users) => {
          const userList = users || []
          const exists = userList.some(u => u.id === updated.id)
          
          if (exists) {
            return userList.map(u => u.id === updated.id ? updated : u)
          } else {
            return [...userList, updated]
          }
        })
      }
      
      return updated
    })
  }
  
  return [currentUser, setCurrentUser] as const
}
