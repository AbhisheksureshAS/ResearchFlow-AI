import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Globe, Lock, PenLine, PlusCircle } from 'lucide-react'
import { blogApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useWorkflow } from '../context/WorkflowContext'
import BlogCard from '../components/BlogCard'
import LoadingIndicator from '../components/LoadingIndicator'
import { Alert, EmptyState } from '../components/ui'
import { errMsg } from '../utils/format'

const Stat = ({ icon: Icon, label, value }) => (
  <div className="card flex items-center gap-4 p-5">
    <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/50"><Icon size={18} /></div>
    <div><div className="text-2xl font-semibold leading-none">{value}</div><div className="mt-1 text-sm text-zinc-500">{label}</div></div>
  </div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const { session } = useWorkflow()
  const [blogs, setBlogs] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { blogApi.list().then(setBlogs).catch((e) => setErr(errMsg(e))) }, [])
  const sorted = useMemo(() => [...(blogs || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), [blogs])
  const pub = sorted.filter((b) => b.is_public).length

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {user?.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">Research a topic, review each agent's work, and publish polished blogs.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/blogs/new" className="btn-secondary"><PenLine size={16} />Write manually</Link>
          <Link to="/create" className="btn-primary"><PlusCircle size={16} />Create with AI</Link>
        </div>
      </div>

      {session && session.phase !== 'limit' && (
        <Alert kind="info" action={<Link to="/workflow" className="whitespace-nowrap font-medium underline">Resume</Link>}>
          Workflow in progress: <b>{session.topic}</b>
        </Alert>
      )}
      {err && <Alert>{err}</Alert>}

      {!blogs && !err ? <LoadingIndicator className="py-16" /> : blogs && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat icon={FileText} label="Total blogs" value={sorted.length} />
            <Stat icon={Globe} label="Public" value={pub} />
            <Stat icon={Lock} label="Private" value={sorted.length - pub} />
          </div>
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-medium">Recent blogs</h2>
              <Link to="/blogs" className="flex items-center gap-1 text-sm text-indigo-600 hover:underline">All blogs <ArrowRight size={14} /></Link>
            </div>
            {sorted.length ? (
              <div className="grid gap-4 sm:grid-cols-2">{sorted.slice(0, 4).map((b) => <BlogCard key={b.id} blog={b} />)}</div>
            ) : (
              <EmptyState icon={FileText} title="No blogs yet" text="Create your first AI-researched blog in a few minutes."
                action={<Link to="/create" className="btn-primary">Create blog</Link>} />
            )}
          </section>
        </>
      )}
    </div>
  )
}
