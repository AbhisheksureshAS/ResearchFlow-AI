import { LogOut, Monitor, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Row = ({ k, v }) => (
  <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-zinc-500">{k}</dt><dd className="truncate font-medium">{v}</dd></div>
)

export default function Profile() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const themes = [['light', Sun], ['dark', Moon], ['system', Monitor]]
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Profile & settings</h1>
      <section className="card p-5">
        <div className="mb-2 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-medium uppercase text-white">{user.name[0]}</span>
          <div className="min-w-0"><div className="font-medium">{user.name}</div><div className="truncate text-sm text-zinc-500">{user.email}</div></div>
        </div>
        <dl className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {user.username && <Row k="Username" v={user.username} />}
          <Row k="Email" v={user.email} />
          {user.exp && <Row k="Session expires" v={new Date(user.exp * 1000).toLocaleString()} />}
        </dl>
      </section>
      <section className="card p-5">
        <h2 className="mb-3 font-medium">Theme</h2>
        <div className="grid grid-cols-3 gap-2">
          {themes.map(([k, Icon]) => (
            <button key={k} onClick={() => setTheme(k)}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm capitalize transition ${theme === k ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300' : 'border-zinc-300 dark:border-zinc-700'}`}>
              <Icon size={15} />{k}
            </button>
          ))}
        </div>
      </section>
      <button className="btn-secondary w-full !text-red-600" onClick={() => logout(false)}><LogOut size={16} />Log out</button>
    </div>
  )
}
