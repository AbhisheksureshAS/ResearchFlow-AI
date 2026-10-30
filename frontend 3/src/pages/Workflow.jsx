import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Save, Workflow as WorkflowIcon } from 'lucide-react'
import { useWorkflow } from '../context/WorkflowContext'
import { blogApi } from '../services/api'
import WorkflowProgress from '../components/WorkflowProgress'
import AgentOutput from '../components/AgentOutput'
import ReviewPanel from '../components/ReviewPanel'
import LoadingIndicator from '../components/LoadingIndicator'
import { Alert, Badge, EmptyState } from '../components/ui'
import { errMsg } from '../utils/format'

const BASE = { research: 0, writer: 2, editor: 4 }
const META = {
  research: { title: 'Research report', sub: 'Researcher agent' },
  writer: { title: 'Blog draft', sub: 'Writer agent' },
  editor: { title: 'Final edited blog', sub: 'Editor agent' },
}
const WORKING = {
  'approve:research': 'Writer agent is drafting your blog…',
  'approve:writer': 'Editor agent is polishing the draft…',
  'approve:editor': 'Finalizing…',
  'revise:research': 'Researcher agent is revising the research…',
  'revise:writer': 'Writer agent is revising the draft…',
  'revise:editor': 'Editor agent is revising the blog…',
}

export default function Workflow() {
  const { session, busy, error, respond, reset } = useWorkflow()
  const nav = useNavigate()
  const [tab, setTab] = useState(null)
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  useEffect(() => { setTab(null) }, [session?.stage, session?.phase])
  useEffect(() => { if (session) setTitle((t) => t || session.topic) }, [session])

  if (!session)
    return <EmptyState icon={WorkflowIcon} title="No active workflow" text="Start a new blog to run the Researcher, Writer and Editor agents."
      action={<Link to="/create" className="btn-primary">Create blog</Link>} />

  const { stage, phase, outputs, revisions, topic, blogType, threadId } = session
  const base = BASE[stage]
  const active = phase === 'completed' ? 7 : busy === 'approve' ? base + 2 : busy === 'revise' ? base : base + 1
  const shown = tab || (phase === 'review' ? stage : outputs.editor ? 'editor' : outputs.writer ? 'writer' : 'research')
  const tabs = ['research', 'writer', 'editor'].filter((k) => outputs[k])
  const final = outputs.editor || outputs.writer || outputs.research

  const save = async () => {
    if (!title.trim()) return setSaveErr('Give the blog a title.')
    setSaving(true); setSaveErr('')
    try {
      const blog = await blogApi.create({ title: title.trim(), content: phase === 'completed' ? outputs.editor : final })
      reset()
      nav(`/blogs/${blog.id}`)
    } catch (e) { setSaveErr(errMsg(e)); setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold">{topic}</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <Badge tone="indigo">{blogType.replace('_', '-')}</Badge>
            <span>Thread {threadId.slice(0, 8)}</span>
          </div>
        </div>
        <button className="btn-secondary" onClick={reset} disabled={!!busy}>Discard workflow</button>
      </div>

      <div className="card p-5"><WorkflowProgress active={active} working={!!busy} /></div>

      {error && <Alert>{error}</Alert>}

      {tabs.length > 1 && (
        <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
          {tabs.map((k) => (
            <button key={k} onClick={() => setTab(k)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm ${k === shown ? 'border-indigo-600 font-medium text-indigo-600' : 'border-transparent text-zinc-500'}`}>
              {META[k].sub.replace(' agent', '')}
            </button>
          ))}
        </div>
      )}

      <AgentOutput title={META[shown].title} subtitle={META[shown].sub} content={outputs[shown]} />

      {busy && <div className="card p-6"><LoadingIndicator label={WORKING[`${busy}:${stage}`]} /></div>}

      {phase === 'review' && (
        <ReviewPanel key={`${stage}-${revisions}`} stage={stage} revisions={revisions} busy={busy}
          onApprove={(fb) => respond(true, fb)} onRevise={(fb) => respond(false, fb)} />
      )}

      {phase === 'limit' && (
        <Alert kind="warning">The revision limit was reached, so the workflow stopped. You can still save the latest output below or start over.</Alert>
      )}

      {(phase === 'completed' || phase === 'limit') && (
        <section className="card space-y-4 p-5">
          <h2 className="font-medium">{phase === 'completed' ? 'Save your blog' : 'Save latest output'}</h2>
          {saveErr && <Alert>{saveErr}</Alert>}
          <div>
            <label className="label" htmlFor="title">Title</label>
            <input id="title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={save} disabled={saving}>
              {saving ? <LoadingIndicator label="Saving…" size={16} className="!text-white" /> : <><Save size={16} />Save to my blogs</>}
            </button>
            <Link to="/create" className="btn-secondary" onClick={reset}>Start new</Link>
          </div>
        </section>
      )}
    </div>
  )
}
