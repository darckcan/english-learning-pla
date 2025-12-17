import { useCallback, useEffect, useState } from 'react'
import { haptics } from '@/lib/haptics'

export function useHaptic() {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported('vibrate' in navigator)
  }, [])

  const light = useCallback(() => haptics.light(), [])
  const medium = useCallback(() => haptics.medium(), [])
  const heavy = useCallback(() => haptics.heavy(), [])
  const success = useCallback(() => haptics.success(), [])
  const error = useCallback(() => haptics.error(), [])
  const warning = useCallback(() => haptics.warning(), [])
  const selection = useCallback(() => haptics.selection(), [])
  const impact = useCallback(() => haptics.impact(), [])
  const notification = useCallback(() => haptics.notification(), [])
  const achievement = useCallback(() => haptics.achievement(), [])
  const longPress = useCallback(() => haptics.longPress(), [])
  const swipe = useCallback(() => haptics.swipe(), [])
  const rigid = useCallback(() => haptics.rigid(), [])
  const soft = useCallback(() => haptics.soft(), [])
  const pattern = useCallback((p: number[]) => haptics.pattern(p), [])
  const cancel = useCallback(() => haptics.cancel(), [])

  return {
    isSupported,
    light,
    medium,
    heavy,
    success,
    error,
    warning,
    selection,
    impact,
    notification,
    achievement,
    longPress,
    swipe,
    rigid,
    soft,
    pattern,
    cancel,
  }
}
