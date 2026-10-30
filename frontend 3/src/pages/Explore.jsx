import { useEffect, useMemo, useState } from 'react'
import { Globe, Search } from 'lucide-react'
import { blogApi } from '../services/api'
import BlogCard from '../components/BlogCard'
import LoadingIndicator from '../components/LoadingIndicator'
import { Alert, EmptyState } from '../components/ui'
import { errMsg } from '../utils/format'

// GET /blogs/public_blog -> all blogs where is_public = true
export default function Explore() {
  const [blogs, setBlogs] = useState(null)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')

  const load = () => { setErr(''); blogApi.listPublic().then(setBlogs).catch((e) => setErr(errMsg(e))) }
  useEffect(load, [])

  const list = useMemo(() => (blogs || [])
    .filter((b) => (b.title + b.content).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), [blogs, q])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Public blogs</h1>
        <p className="mt-1 text-sm text-zinc-500">Blogs that authors have chosen to publish.</p>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-2.5 text-zinc-400" />
        <input className="input pl-9" placeholder="Search public blogs…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {err && <Alert action={<button className="font-medium underline" onClick={load}>Retry</button>}>{err}</Alert>}
      {!blogs && !err ? <LoadingIndicator className="py-16" /> : blogs && (
        list.length
          ? <div className="grid gap-4 sm:grid-cols-2">{list.map((b) => <BlogCard key={b.id} blog={b} to={`/explore/${b.id}`} />)}</div>
          : <EmptyState icon={Globe} title={blogs.length ? 'No matches' : 'Nothing published yet'}
              text={blogs.length ? 'Try a different search.' : 'Publish one of your blogs to see it here.'} />
      )}
    </div>
  )
}
