import { useKV } from '@github/spark/hooks'
import { User } from '@/lib/types'
import { useCallback, useRef, useEffect } from 'react'

export function useSyncUser() {
  const [currentUser, setCurrentUserRaw] = useKV<User | null>('current-user', null)
  const [allUsers, setAllUsers] = useKV<User[]>('all-users', [])
  
  const allUsersRef = useRef(allUsers)
  allUsersRef.current = allUsers

  useEffect(() => {
    if (currentUser && allUsers) {
      const userInList = allUsers.find(u => u.id === currentUser.id)
      if (!userInList) {
        setAllUsers((users) => [...(users || []), currentUser])
      }
    }
  }, [currentUser, allUsers, setAllUsers])
  
  const setCurrentUser = useCallback((updater: (prev: User | null) => User | null) => {
    setCurrentUserRaw((prev) => {
      const updated = updater(prev ?? null)
      
      if (updated) {
        const currentUsers = allUsersRef.current || []
        const exists = currentUsers.some(u => u.id === updated.id)
        
        if (exists) {
          setAllUsers((users) => {
            const userList = users || []
            return userList.map(u => u.id === updated.id ? updated : u)
          })
        } else {
          setAllUsers((users) => {
            const userList = users || []
            const alreadyExists = userList.some(u => u.id === updated.id)
            if (alreadyExists) {
              return userList.map(u => u.id === updated.id ? updated : u)
            }
            return [...userList, updated]
          })
        }
      }
      
      return updated
    })
  }, [setCurrentUserRaw, setAllUsers])
  
  return [currentUser, setCurrentUser] as const
}
