import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, PenLine, PlusCircle, Search } from 'lucide-react'
import { blogApi } from '../services/api'
import BlogCard from '../components/BlogCard'
import LoadingIndicator from '../components/LoadingIndicator'
import { Alert, ConfirmModal, EmptyState } from '../components/ui'
import { errMsg } from '../utils/format'

export default function Blogs() {
  const [blogs, setBlogs] = useState(null)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const [vis, setVis] = useState('all')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => { setErr(''); blogApi.list().then(setBlogs).catch((e) => setErr(errMsg(e))) }
  useEffect(load, [])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await blogApi.remove(toDelete.id)
      setBlogs((bs) => bs.filter((b) => b.id !== toDelete.id))
      setToDelete(null)
    } catch (e) { setErr(errMsg(e)); setToDelete(null) } finally { setDeleting(false) }
  }

  const list = useMemo(() => (blogs || [])
    .filter((b) => (vis === 'all' || (vis === 'public') === b.is_public) && (b.title + b.content).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), [blogs, q, vis])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My blogs</h1>
        <div className="flex gap-2">
          <Link to="/blogs/new" className="btn-secondary"><PenLine size={16} />Write manually</Link>
          <Link to="/create" className="btn-primary"><PlusCircle size={16} />AI blog</Link>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-2.5 text-zinc-400" />
          <input className="input pl-9" placeholder="Search blogs…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input sm:w-40" value={vis} onChange={(e) => setVis(e.target.value)}>
          <option value="all">All</option><option value="public">Public</option><option value="private">Private</option>
        </select>
      </div>
      {err && <Alert action={<button className="font-medium underline" onClick={load}>Retry</button>}>{err}</Alert>}
      {!blogs && !err ? <LoadingIndicator className="py-16" /> : blogs && (
        list.length ? <div className="grid gap-4 sm:grid-cols-2">{list.map((b) => <BlogCard key={b.id} blog={b} onDelete={setToDelete} />)}</div>
        : <EmptyState icon={FileText} title={blogs.length ? 'No matches' : 'No saved blogs'} text={blogs.length ? 'Try a different search or filter.' : 'Finish a workflow and save the result to see it here.'} />
      )}
      <ConfirmModal open={!!toDelete} loading={deleting} title="Delete this blog?"
        body={toDelete ? `“${toDelete.title}” will be permanently removed.` : ''}
        confirmLabel="Delete" onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </div>
  )
}
