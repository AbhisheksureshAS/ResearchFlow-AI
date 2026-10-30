import { Loader2 } from 'lucide-react'

export default function LoadingIndicator({ label = 'Loading…', size = 20, className = '' }) {
  return (
    <div role="status" className={`flex items-center justify-center gap-2.5 text-sm text-zinc-500 dark:text-zinc-400 ${className}`}>
      <Loader2 size={size} className="animate-spin text-indigo-600" />
      {label}
    </div>
  )
}
