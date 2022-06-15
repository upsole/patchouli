import { useSafeLocalStorage} from "./useLocalStorage"
import { usePrefersDarkMode } from "./usePrefersDarkMode"
import { useEffect } from "react"

export function useDarkMode() {
  const prefersDarkMode = usePrefersDarkMode()
  const [
    isEnabled, 
    setIsEnabled] = useSafeLocalStorage('dark-mode', undefined)

  const enabled = 
    isEnabled === undefined ? prefersDarkMode : isEnabled

  useEffect(() => {
    if (window === undefined) return
    const root = window.document.documentElement
    root.classList.remove(enabled ? 'light' : 'dark')
    root.classList.add(enabled ? 'dark' : 'light')
  }, [enabled])

  return [enabled, setIsEnabled]
}
