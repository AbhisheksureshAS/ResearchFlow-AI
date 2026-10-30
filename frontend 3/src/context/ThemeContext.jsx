import { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)
export const useTheme = () => useContext(Ctx)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('rf_theme') || 'system')
  useEffect(() => {
    const m = matchMedia('(prefers-color-scheme: dark)')
    const apply = () =>
      document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && m.matches))
    apply()
    localStorage.setItem('rf_theme', theme)
    m.addEventListener('change', apply)
    return () => m.removeEventListener('change', apply)
  }, [theme])
  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>
}
