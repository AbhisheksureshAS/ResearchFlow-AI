import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Markdown } from './ui'

export default function AgentOutput({ title, subtitle, content }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(content || ''); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* clipboard unavailable */ }
  }
  return (
    <section className="card fade-in">
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
        <div>
          <h2 className="font-medium">{title}</h2>
          {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
        </div>
        <button className="btn-secondary !px-2.5 !py-1.5 text-xs" onClick={copy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
        {content ? <Markdown>{content}</Markdown> : <p className="text-sm text-zinc-500">The agent returned no content.</p>}
      </div>
    </section>
  )
}
