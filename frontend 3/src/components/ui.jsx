import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import LoadingIndicator from './LoadingIndicator'

const tones = {
  error: ['border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300', AlertCircle],
  warning: ['border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300', AlertCircle],
  success: ['border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300', CheckCircle2],
  info: ['border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300', Info],
}

export function Alert({ kind = 'error', children, action }) {
  const [cls, Icon] = tones[kind]
  return (
    <div role="alert" className={`fade-in flex items-start gap-3 rounded-lg border p-3 text-sm ${cls}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1">{children}</div>
      {action}
    </div>
  )
}

const badge = {
  gray: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
}
export const Badge = ({ tone = 'gray', children }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badge[tone]}`}>{children}</span>
)

export const EmptyState = ({ icon: Icon, title, text, action }) => (
  <div className="card flex flex-col items-center px-6 py-14 text-center">
    <div className="mb-4 rounded-full bg-zinc-100 p-3 dark:bg-zinc-800"><Icon size={22} className="text-zinc-500" /></div>
    <h3 className="font-medium">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-zinc-500">{text}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
)

export const Markdown = ({ children }) => (
  <div className="prose prose-zinc max-w-none dark:prose-invert prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{ a: (p) => <a {...p} target="_blank" rel="noreferrer" /> }}
    >
      {children || ''}
    </ReactMarkdown>
  </div>
)

export function ConfirmModal({ open, title, body, confirmLabel = 'Confirm', onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div className="card fade-in w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-zinc-500">{body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <LoadingIndicator label="" size={16} /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
