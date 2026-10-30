import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useWorkflow } from '../context/WorkflowContext'
import { Alert } from '../components/ui'
import LoadingIndicator from '../components/LoadingIndicator'
import { errMsg } from '../utils/format'

// Must match the backend enum exactly: [value sent to API, label shown]
const TYPES = [['tutorial', 'Tutorial'], ['research', 'Research'], ['comparison', 'Comparison'], ['listicle', 'Listicle'], ['opinion', 'Opinion'], ['how_to', 'How-to']]

export default function CreateBlog() {
  const { session, start } = useWorkflow()
  const nav = useNavigate()
  const [topic, setTopic] = useState('')
  const [type, setType] = useState(TYPES[0][0])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (topic.trim().length < 5) return setErr('Please describe the topic in at least 5 characters.')
    if (topic.length > 300) return setErr('Topic must be 300 characters or fewer.')
    setLoading(true)
    try {
      await start(topic.trim(), type) // one new workflow -> one thread_id
      nav('/workflow')
    } catch (e2) {
      setErr(errMsg(e2))
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create a blog</h1>
        <p className="mt-1 text-sm text-zinc-500">The Researcher agent starts first, then you review its findings.</p>
      </div>
      {session && !loading && (
        <Alert kind="warning" action={<Link to="/workflow" className="whitespace-nowrap font-medium underline">Resume</Link>}>
          A workflow for “{session.topic}” is already in progress. Starting a new one will replace it.
        </Alert>
      )}
      <p className="text-sm text-zinc-500">Prefer to write it yourself? <Link to="/blogs/new" className="font-medium text-indigo-600 hover:underline">Create a blog manually</Link>.</p>
      <form onSubmit={submit} className="card space-y-5 p-6" noValidate>
        {err && <Alert>{err}</Alert>}
        <div>
          <label className="label" htmlFor="topic">Topic</label>
          <textarea id="topic" rows={3} className="input resize-none" disabled={loading} value={topic} onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. How retrieval-augmented generation reduces LLM hallucinations" />
          <div className="mt-1 text-right text-xs text-zinc-400">{topic.length}/300</div>
        </div>
        <div>
          <label className="label">Blog type</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map(([v, l]) => (
              <button type="button" key={v} disabled={loading} onClick={() => setType(v)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${v === type ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300' : 'border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-950">
            <LoadingIndicator label="Researcher agent is gathering evidence… this can take a minute or two." />
          </div>
        ) : (
          <button className="btn-primary w-full">
            <Sparkles size={16} />Generate
          </button>
        )}
      </form>
    </div>
  )
}
