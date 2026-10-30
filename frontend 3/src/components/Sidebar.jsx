import { NavLink } from 'react-router-dom'
import { FileText, Globe, LayoutDashboard, PlusCircle, Sparkles, User, Workflow as WorkflowIcon, X } from 'lucide-react'
import { useWorkflow } from '../context/WorkflowContext'

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/create', label: 'Create Blog', icon: PlusCircle },
  { to: '/workflow', label: 'Workflow', icon: WorkflowIcon, live: true },
  { to: '/blogs', label: 'My Blogs', icon: FileText },
  { to: '/explore', label: 'Public Blogs', icon: Globe },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar({ open, onClose }) {
  const { session } = useWorkflow()
  const active = session && session.phase === 'review'
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform dark:border-zinc-800 dark:bg-zinc-900 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-14 items-center justify-between px-5">
          <div className="flex items-center gap-2 font-semibold">
            <span className="rounded-lg bg-indigo-600 p-1.5 text-white"><Sparkles size={16} /></span>
            ResearchFlow AI
          </div>
          <button className="lg:hidden" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map(({ to, label, icon: Icon, end, live }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}>
              <Icon size={18} />
              {label}
              {live && active && <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-indigo-500" />}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
