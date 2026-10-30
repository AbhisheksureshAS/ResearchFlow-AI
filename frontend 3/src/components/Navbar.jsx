import { Link } from 'react-router-dom'
import { Menu, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar({ onMenu }) {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const dark = document.documentElement.classList.contains('dark')
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 sm:px-6">
      <button className="lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <div className="flex-1" />
      <button className="btn-secondary !p-2" aria-label="Toggle theme" onClick={() => setTheme(dark ? 'light' : 'dark')}>
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <Link to="/profile" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium uppercase text-white">{user?.name?.[0]}</span>
        <span className="hidden text-sm font-medium sm:block">{user?.name}</span>
      </Link>
    </header>
  )
}
